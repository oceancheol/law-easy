import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "판례 검색",
  description: "대법원, 하급심, 헌법재판소 판례를 한곳에서 검색하세요. 200,000여건의 판례 데이터를 실시간으로 검색할 수 있습니다.",
  keywords: ["판례검색", "대법원판례", "헌법재판소", "판례조회", "법원판결"],
  openGraph: {
    title: "판례 검색 | LawEasy",
    description: "대법원·하급심·헌법재판소 판례를 한곳에서 검색하세요.",
  },
};

export default function PrecedentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
