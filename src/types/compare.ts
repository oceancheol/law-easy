export interface CompareResult {
  lawName: string;
  lawId: string;
  oldVersion: VersionInfo;
  newVersion: VersionInfo;
  changes: ArticleChange[];
}

export interface VersionInfo {
  date: string;
  lawNumber: string;
}

export interface ArticleChange {
  articleNumber: string;
  articleTitle: string;
  changeType: ChangeType;
  oldContent: string;
  newContent: string;
}

export type ChangeType = "added" | "removed" | "modified" | "unchanged";

export interface AmendmentHistory {
  lawName: string;
  lawId: string;
  amendments: Amendment[];
}

export interface Amendment {
  date: string;
  lawNumber: string;
  type: string;
  description: string;
  content?: string[];
}
