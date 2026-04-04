export interface PrecedentSearchResult {
  id: string;
  caseNumber: string;
  caseName: string;
  court: CourtType;
  judgmentDate: string;
  caseType: string;
  summary: string;
}

export interface PrecedentDetail {
  id: string;
  caseNumber: string;
  caseName: string;
  court: CourtType;
  judgmentDate: string;
  caseType: string;
  summary: string;
  fullText: string;
  relatedLaws: RelatedLaw[];
}

export interface RelatedLaw {
  lawName: string;
  articleNumber: string;
  lawId?: string;
}

export type CourtType = "대법원" | "하급심" | "헌법재판소" | "전체";

export interface PrecedentSearchParams {
  query: string;
  court?: CourtType;
  page?: number;
  size?: number;
}
