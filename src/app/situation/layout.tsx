import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상황분석 - 내 상황에 맞는 법률 찾기",
  description: "겪고 있는 상황을 설명하면 관련 법령과 판례를 AI가 분석해서 그래프로 보여드립니다. 부당해고, 전세보증금, 교통사고 등 모든 법률 상황을 분석하세요.",
  keywords: ["법률상담", "상황분석", "법률찾기", "부당해고", "전세보증금", "교통사고", "법률AI"],
  openGraph: {
    title: "상황분석 - 내 상황에 맞는 법률 찾기 | LawEasy",
    description: "상황을 설명하면 관련 법령과 판례를 그래프로 분석해드립니다.",
  },
};

export default function SituationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
