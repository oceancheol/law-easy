import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "법령 검색",
  description: "대한민국 법률, 시행령, 시행규칙을 키워드와 약칭으로 빠르게 검색하세요. 근로기준법, 민법, 형법 등 6,000여개 법령을 실시간 검색.",
  keywords: ["법령검색", "법률검색", "법률조회", "시행령", "시행규칙", "법제처"],
  openGraph: {
    title: "법령 검색 | LawEasy",
    description: "6,000여개 대한민국 법령을 키워드로 빠르게 검색하세요.",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
