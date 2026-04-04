export interface LawSearchResult {
  id: string;
  lawName: string;
  lawType: LawType;
  ministry: string;
  lawId: string;
  promulgationDate: string;
  enforcementDate: string;
  summary?: string;
}

export interface LawDetail {
  id: string;
  lawName: string;
  lawType: LawType;
  ministry: string;
  lawId: string;
  promulgationDate: string;
  enforcementDate: string;
  chapters: Chapter[];
}

export interface Chapter {
  title: string;
  articles: Article[];
}

export interface Article {
  number: string;
  title: string;
  content: string;
  paragraphs: Paragraph[];
}

export interface Paragraph {
  number: string;
  content: string;
}

export type LawType = "법률" | "시행령" | "시행규칙" | "기타";

export interface SearchParams {
  query: string;
  type?: LawType;
  ministry?: string;
  page?: number;
  size?: number;
}

export interface SearchResponse<T> {
  success: boolean;
  data: T[];
  error?: string;
  meta: {
    total: number;
    page: number;
    size: number;
  };
}
