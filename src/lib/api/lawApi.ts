import { XMLParser } from "fast-xml-parser";
import type { SearchResponse, LawSearchResult, LawDetail, SearchParams } from "@/types/law";
import type { PrecedentSearchResult, PrecedentDetail, PrecedentSearchParams } from "@/types/precedent";
import type { AmendmentHistory, CompareResult, ArticleChange } from "@/types/compare";

const LAW_API_BASE = "https://www.law.go.kr/DRF";
const API_KEY = process.env.LAW_API_KEY || "";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  isArray: (name) => ["law", "prec", "조문단위", "항", "부칙단위"].includes(name),
});

interface LawApiParams {
  [key: string]: string | number | undefined;
}

function buildUrl(path: string, params: LawApiParams): string {
  const url = new URL(`${LAW_API_BASE}/${path}`);
  url.searchParams.set("OC", API_KEY);
  url.searchParams.set("type", "XML");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function fetchXml(url: string): Promise<Record<string, unknown>> {
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  const text = await response.text();
  return xmlParser.parse(text) as Record<string, unknown>;
}

export async function searchLaws(params: SearchParams): Promise<SearchResponse<LawSearchResult>> {
  try {
    const url = buildUrl("lawSearch.do", {
      target: "law",
      query: params.query,
      display: params.size || 20,
      page: params.page || 1,
    });
    const data = await fetchXml(url);
    const items = extractLawResults(data);
    return {
      success: true,
      data: items,
      meta: {
        total: extractTotal(data),
        page: params.page || 1,
        size: params.size || 20,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "검색 중 오류 발생",
      meta: { total: 0, page: 1, size: 20 },
    };
  }
}

export async function getLawDetail(lawId: string): Promise<LawDetail | null> {
  try {
    const url = buildUrl("lawService.do", { target: "law", MST: lawId });
    const data = await fetchXml(url);
    return extractLawDetail(data);
  } catch {
    return null;
  }
}

export async function searchPrecedents(
  params: PrecedentSearchParams
): Promise<SearchResponse<PrecedentSearchResult>> {
  try {
    const url = buildUrl("lawSearch.do", {
      target: "prec",
      query: params.query,
      display: params.size || 20,
      page: params.page || 1,
    });
    const data = await fetchXml(url);
    const items = extractPrecedentResults(data);
    return {
      success: true,
      data: items,
      meta: {
        total: extractTotal(data),
        page: params.page || 1,
        size: params.size || 20,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "검색 중 오류 발생",
      meta: { total: 0, page: 1, size: 20 },
    };
  }
}

export async function getPrecedentDetail(precId: string): Promise<PrecedentDetail | null> {
  try {
    const url = buildUrl("lawService.do", { target: "prec", ID: precId });
    const data = await fetchXml(url);
    return extractPrecedentDetail(data);
  } catch {
    return null;
  }
}

export async function getAmendmentHistory(lawId: string): Promise<AmendmentHistory | null> {
  try {
    const url = buildUrl("lawService.do", { target: "law", MST: lawId });
    const data = await fetchXml(url);
    return extractAmendmentHistory(data);
  } catch {
    return null;
  }
}

export async function compareLawVersions(
  lawId: string,
  _date?: string
): Promise<CompareResult | null> {
  void _date; // 향후 날짜별 비교에 사용
  try {
    const url = buildUrl("lawService.do", { target: "law", MST: lawId });
    const data = await fetchXml(url);
    return extractCompareResult(data);
  } catch {
    return null;
  }
}

// --- Helpers ---

function stripHtml(text: string, keepAmendTags = false): string {
  if (typeof text !== "string") return String(text || "");
  let result = text.replace(/<br\s*\/?>/gi, "\n");
  if (keepAmendTags) {
    result = result.replace(/<(?!개정|신설|\/개정|\/신설)[^>]*>/g, "");
  } else {
    result = result.replace(/<[^>]*>/g, "");
  }
  return result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim();
}

function str(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "#text" in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)["#text"]);
  }
  return String(value);
}

// --- Data extractors ---

function extractTotal(data: Record<string, unknown>): number {
  const root = data as Record<string, Record<string, unknown>>;
  const totalCnt = root?.PrecSearch?.totalCnt
    || root?.LawSearch?.totalCnt
    || 0;
  return Number(totalCnt);
}

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function mapLawType(raw: string): LawSearchResult["lawType"] {
  if (raw === "법률") return "법률";
  if (raw === "대통령령" || raw.includes("시행령")) return "시행령";
  if (raw.includes("부령") || raw.includes("규칙")) return "시행규칙";
  return "기타";
}

function extractLawResults(data: Record<string, unknown>): LawSearchResult[] {
  const root = data as Record<string, Record<string, unknown>>;
  const items = root?.LawSearch?.law;
  return toArray(items as Record<string, unknown>[]).map((item, index) => ({
    id: str(item["법령일련번호"]) || String(index),
    lawName: str(item["법령명한글"]),
    lawType: mapLawType(str(item["법령구분명"])),
    ministry: str(item["소관부처명"]),
    lawId: str(item["법령일련번호"]),
    promulgationDate: str(item["공포일자"]),
    enforcementDate: str(item["시행일자"]),
    summary: str(item["법령약칭명"]),
  }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractLawDetail(data: Record<string, unknown>): LawDetail {
  const law = (data as any)?.법령 || {};
  const basic = law?.기본정보 || {};
  const ministry = basic?.소관부처 || {};
  const lawType = basic?.법종구분 || {};
  const articles = law?.조문?.조문단위 || [];

  const articleList = toArray(articles as Record<string, any>[]).map((a) => ({
    number: str(a.조문번호),
    title: str(a.조문제목),
    content: stripHtml(str(a.조문내용)),
    paragraphs: toArray(a.항 as Record<string, any>[]).map((p) => ({
      number: str(p.항번호),
      content: stripHtml(str(p.항내용)),
    })),
  }));

  return {
    id: str(law.법령키),
    lawName: str(basic.법령명_한글),
    lawType: mapLawType(str(lawType?.["#text"] || lawType)),
    ministry: str(ministry?.["#text"] || ministry),
    lawId: str(law.법령키),
    promulgationDate: str(basic.공포일자),
    enforcementDate: str(basic.시행일자),
    chapters: [{
      title: "조문",
      articles: articleList,
    }],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function extractPrecedentResults(data: Record<string, unknown>): PrecedentSearchResult[] {
  const root = data as Record<string, Record<string, unknown>>;
  const items = root?.PrecSearch?.prec;
  return toArray(items as Record<string, unknown>[]).map((item, index) => ({
    id: str(item["판례일련번호"]) || String(index),
    caseNumber: str(item["사건번호"]),
    caseName: str(item["사건명"]),
    court: (str(item["법원명"]) || "대법원") as PrecedentSearchResult["court"],
    judgmentDate: str(item["선고일자"]),
    caseType: str(item["사건종류명"]),
    summary: str(item["사건명"]),
  }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractPrecedentDetail(data: Record<string, unknown>): PrecedentDetail {
  const prec = (data as any)?.PrecService || (data as any)?.판례 || (data as any)?.prec || {};
  const basic = prec?.기본정보 || prec;
  return {
    id: str(basic.판례정보일련번호 || basic.판례일련번호),
    caseNumber: str(basic.사건번호),
    caseName: str(basic.사건명),
    court: (str(basic.법원명) || "대법원") as PrecedentDetail["court"],
    judgmentDate: str(basic.선고일자),
    caseType: str(basic.사건종류명),
    summary: stripHtml(str(basic.판결요지 || basic.판시사항 || basic.요지)),
    fullText: stripHtml(str(basic.판례내용)),
    relatedLaws: [],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractAmendmentHistory(data: Record<string, unknown>): AmendmentHistory {
  const law = (data as any)?.법령 || {};
  const basic = law?.기본정보 || {};
  const appendix = law?.부칙?.부칙단위 || [];

  return {
    lawName: str(basic.법령명_한글),
    lawId: str(law.법령키),
    amendments: toArray(appendix as Record<string, any>[]).map((item) => {
      const rawContent = item.부칙내용 || [];
      const contentLines: string[] = [];
      if (Array.isArray(rawContent)) {
        for (const group of rawContent) {
          if (Array.isArray(group)) {
            for (const line of group) {
              if (typeof line === "string" && line.trim()) {
                contentLines.push(line.trim());
              }
            }
          } else if (typeof group === "string" && group.trim()) {
            contentLines.push(group.trim());
          }
        }
      } else if (typeof rawContent === "string") {
        contentLines.push(stripHtml(rawContent));
      }
      return {
        date: str(item.부칙공포일자),
        lawNumber: str(item.부칙공포번호),
        type: "개정",
        description: `${str(basic.법령명_한글)} (${str(item.부칙공포일자)})`,
        content: contentLines,
      };
    }),
  };
}

function extractCompareResult(data: Record<string, unknown>): CompareResult {
  const law = (data as any)?.법령 || {};
  const basic = law?.기본정보 || {};
  const articles = law?.조문?.조문단위 || [];

  const changes: ArticleChange[] = toArray(articles as Record<string, any>[])
    .filter((a: any) => {
      const content = str(a.조문내용);
      return content.includes("<개정") || content.includes("<신설") ||
             content.includes("〈개정") || content.includes("〈신설");
    })
    .map((a: any) => {
      const paragraphs = toArray(a.항 as Record<string, any>[]);
      const fullContent = paragraphs.length > 0
        ? paragraphs.map((p: any) => str(p.항내용)).join("\n")
        : str(a.조문내용);
      return {
        articleNumber: str(a.조문번호),
        articleTitle: str(a.조문제목),
        changeType: "modified" as const,
        oldContent: "",
        newContent: stripHtml(fullContent, true),
      };
    });

  return {
    lawName: str(basic.법령명_한글),
    lawId: str(law.법령키),
    oldVersion: { date: "", lawNumber: "" },
    newVersion: {
      date: str(basic.공포일자),
      lawNumber: str(basic.공포번호),
    },
    changes,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
