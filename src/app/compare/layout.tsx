import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "신구대조 비교",
  description: "법령 개정 전후를 나란히 비교하고 변경점을 한눈에 확인하세요. 신설·개정 조항을 색상으로 구분해서 보여드립니다.",
  keywords: ["신구대조", "법령비교", "법령개정", "개정전후비교", "법률개정"],
  openGraph: {
    title: "신구대조 비교 | LawEasy",
    description: "법령 개정 전후를 나란히 비교하고 변경점을 확인하세요.",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
