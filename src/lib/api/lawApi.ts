import type { SearchResponse, LawSearchResult, LawDetail, SearchParams } from "@/types/law";
import type { PrecedentSearchResult, PrecedentDetail, PrecedentSearchParams } from "@/types/precedent";
import type { AmendmentHistory, CompareResult, ArticleChange } from "@/types/compare";

const LAW_API_BASE = "https://www.law.go.kr/DRF";
const API_KEY = process.env.LAW_API_KEY || "";

interface LawApiParams {
  [key: string]: string | number | undefined;
}

function buildUrl(path: string, params: LawApiParams): string {
  const url = new URL(`${LAW_API_BASE}/${path}`);
  url.searchParams.set("OC", API_KEY);
  url.searchParams.set("type", "JSON");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function searchLaws(params: SearchParams): Promise<SearchResponse<LawSearchResult>> {
  try {
    const url = buildUrl("lawSearch.do", {
      target: "law",
      query: params.query,
      display: params.size || 20,
      page: params.page || 1,
    });
    const data = await fetchApi<Record<string, unknown>>(url);
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
    const data = await fetchApi<Record<string, unknown>>(url);
    return extractLawDetail(data);
  } catch {
    return null;
  }
}

export async function searchPrecedents(
  params: PrecedentSearchParams
): Promise<SearchResponse<PrecedentSearchResult>> {
  try {
    const url = buildUrl("precSearch.do", {
      target: "prec",
      query: params.query,
      display: params.size || 20,
      page: params.page || 1,
    });
    const data = await fetchApi<Record<string, unknown>>(url);
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
    const url = buildUrl("precService.do", { target: "prec", ID: precId });
    const data = await fetchApi<Record<string, unknown>>(url);
    return extractPrecedentDetail(data);
  } catch {
    return null;
  }
}

export async function getAmendmentHistory(lawId: string): Promise<AmendmentHistory | null> {
  try {
    // lawService.do에서 부칙 정보로 개정 이력 추출
    const url = buildUrl("lawService.do", { target: "law", MST: lawId });
    const data = await fetchApi<Record<string, unknown>>(url);
    return extractAmendmentHistory(data);
  } catch {
    return null;
  }
}

export async function compareLawVersions(
  lawId: string,
  _date: string
): Promise<CompareResult | null> {
  try {
    const url = buildUrl("lawService.do", { target: "law", MST: lawId });
    const data = await fetchApi<Record<string, unknown>>(url);
    return extractCompareResult(data);
  } catch {
    return null;
  }
}

// --- Data extractors ---

function extractTotal(data: Record<string, unknown>): number {
  const totalCnt = (data as Record<string, Record<string, unknown>>)?.PrecSearch?.totalCnt
    || (data as Record<string, Record<string, unknown>>)?.LawSearch?.totalCnt
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
  return toArray(items as Record<string, string>[]).map((item, index) => ({
    id: item.법령일련번호 || String(index),
    lawName: item.법령명한글 || "",
    lawType: mapLawType(item.법령구분명 || ""),
    ministry: item.소관부처명 || "",
    lawId: item.법령일련번호 || "",
    promulgationDate: item.공포일자 || "",
    enforcementDate: item.시행일자 || "",
    summary: item.법령약칭명 || "",
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
    number: String(a.조문번호 || ""),
    title: String(a.조문제목 || ""),
    content: String(a.조문내용 || ""),
    paragraphs: toArray(a.항 as Record<string, string>[]).map((p) => ({
      number: String(p.항번호 || ""),
      content: String(p.항내용 || ""),
    })),
  }));

  return {
    id: String(law.법령키 || ""),
    lawName: String(basic.법령명_한글 || ""),
    lawType: mapLawType(String(lawType?.content || "")),
    ministry: String(ministry?.content || ""),
    lawId: String(law.법령키 || ""),
    promulgationDate: String(basic.공포일자 || ""),
    enforcementDate: String(basic.시행일자 || ""),
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
  return toArray(items as Record<string, string>[]).map((item, index) => ({
    id: item.판례일련번호 || String(index),
    caseNumber: item.사건번호 || "",
    caseName: item.사건명 || "",
    court: (item.법원명 as PrecedentSearchResult["court"]) || "대법원",
    judgmentDate: item.선고일자 || "",
    caseType: item.사건종류명 || "",
    summary: item.판례내용 || item.요지 || "",
  }));
}

function extractPrecedentDetail(data: Record<string, unknown>): PrecedentDetail {
  const root = data as Record<string, Record<string, unknown>>;
  const info = root?.prec || root?.Prec || {};
  return {
    id: String(info.판례일련번호 || ""),
    caseNumber: String(info.사건번호 || ""),
    caseName: String(info.사건명 || ""),
    court: (String(info.법원명 || "대법원")) as PrecedentDetail["court"],
    judgmentDate: String(info.선고일자 || ""),
    caseType: String(info.사건종류명 || ""),
    summary: String(info.요지 || ""),
    fullText: String(info.판례내용 || ""),
    relatedLaws: [],
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractAmendmentHistory(data: Record<string, unknown>): AmendmentHistory {
  const law = (data as any)?.법령 || {};
  const basic = law?.기본정보 || {};
  const appendix = law?.부칙?.부칙단위 || [];

  return {
    lawName: String(basic.법령명_한글 || ""),
    lawId: String(law.법령키 || ""),
    amendments: toArray(appendix as Record<string, any>[]).map((item) => ({
      date: String(item.부칙공포일자 || ""),
      lawNumber: String(item.부칙공포번호 || ""),
      type: "개정",
      description: `${basic.법령명_한글 || ""} (${item.부칙공포일자 || ""})`,
    })),
  };
}

function extractCompareResult(data: Record<string, unknown>): CompareResult {
  const law = (data as any)?.법령 || {};
  const basic = law?.기본정보 || {};
  const articles = law?.조문?.조문단위 || [];

  const changes: ArticleChange[] = toArray(articles as Record<string, any>[])
    .filter((a: any) => a.조문변경여부 === "변경")
    .map((a: any) => ({
      articleNumber: String(a.조문번호 || ""),
      articleTitle: String(a.조문제목 || ""),
      changeType: "modified" as const,
      oldContent: "",
      newContent: String(a.조문내용 || ""),
    }));

  return {
    lawName: String(basic.법령명_한글 || ""),
    lawId: String(law.법령키 || ""),
    oldVersion: { date: "", lawNumber: "" },
    newVersion: {
      date: String(basic.공포일자 || ""),
      lawNumber: String(basic.공포번호 || ""),
    },
    changes,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
