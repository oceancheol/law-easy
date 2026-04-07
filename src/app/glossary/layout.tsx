import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "법률 용어사전",
  description: "어려운 법률 용어를 쉬운 말로 풀어서 설명합니다. 법률 초보자도 이해할 수 있는 법률 용어 사전.",
  keywords: ["법률용어", "법률사전", "법률용어사전", "법률용어해설", "법률초보"],
  openGraph: {
    title: "법률 용어사전 | LawEasy",
    description: "어려운 법률 용어를 쉬운 말로 풀어서 설명합니다.",
  },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
