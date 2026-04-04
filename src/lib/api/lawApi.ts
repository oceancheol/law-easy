import type { SearchResponse, LawSearchResult, LawDetail, SearchParams } from "@/types/law";
import type { PrecedentSearchResult, PrecedentDetail, PrecedentSearchParams } from "@/types/precedent";
import type { AmendmentHistory, CompareResult } from "@/types/compare";

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
    const url = buildUrl("lawService.do", { ID: lawId });
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
    const url = buildUrl("precService.do", { ID: precId });
    const data = await fetchApi<Record<string, unknown>>(url);
    return extractPrecedentDetail(data);
  } catch {
    return null;
  }
}

export async function getAmendmentHistory(lawId: string): Promise<AmendmentHistory | null> {
  try {
    const url = buildUrl("lawHistSearch.do", { ID: lawId });
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
    const url = buildUrl("lawService.do", { ID: lawId });
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

function extractLawResults(data: Record<string, unknown>): LawSearchResult[] {
  const root = data as Record<string, Record<string, unknown>>;
  const items = root?.LawSearch?.law;
  return toArray(items as Record<string, string>[]).map((item, index) => ({
    id: item.법령일련번호 || item.lawId || String(index),
    lawName: item.법령명한글 || item.법령명 || "",
    lawType: (item.법령종류 as LawSearchResult["lawType"]) || "법률",
    ministry: item.소관부처명 || item.소관부처 || "",
    lawId: item.법령일련번호 || item.lawId || "",
    promulgationDate: item.공포일자 || "",
    enforcementDate: item.시행일자 || "",
    summary: item.법령약칭명 || "",
  }));
}

function extractLawDetail(data: Record<string, unknown>): LawDetail {
  const root = data as Record<string, Record<string, unknown>>;
  const info = root?.law || root?.Law || {};
  return {
    id: String(info.법령일련번호 || info.lawId || ""),
    lawName: String(info.법령명한글 || info.법령명 || ""),
    lawType: (String(info.법령종류 || "법률")) as LawDetail["lawType"],
    ministry: String(info.소관부처명 || info.소관부처 || ""),
    lawId: String(info.법령일련번호 || info.lawId || ""),
    promulgationDate: String(info.공포일자 || ""),
    enforcementDate: String(info.시행일자 || ""),
    chapters: [],
  };
}

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

function extractAmendmentHistory(data: Record<string, unknown>): AmendmentHistory {
  const root = data as Record<string, Record<string, unknown>>;
  const items = root?.LawHistSearch?.law;
  return {
    lawName: "",
    lawId: "",
    amendments: toArray(items as Record<string, string>[]).map((item) => ({
      date: item.공포일자 || "",
      lawNumber: item.법령번호 || "",
      type: item.제개정구분명 || "",
      description: item.법령명한글 || "",
    })),
  };
}

function extractCompareResult(data: Record<string, unknown>): CompareResult {
  const root = data as Record<string, Record<string, unknown>>;
  const info = root?.law || root?.Law || {};
  return {
    lawName: String(info.법령명한글 || info.법령명 || ""),
    lawId: String(info.법령일련번호 || ""),
    oldVersion: { date: "", lawNumber: "" },
    newVersion: { date: String(info.공포일자 || ""), lawNumber: String(info.법령번호 || "") },
    changes: [],
  };
}
