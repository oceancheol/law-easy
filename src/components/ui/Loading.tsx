"use client";

import { useState, useEffect } from "react";

const FUN_MESSAGES: Record<string, string[]> = {
  법령: [
    "📚 법전 뒤지는 중...",
    "⚖️ 판사님이 서류 찾는 중...",
    "🔍 법률 도서관 탐색 중...",
    "📖 수만 개 법령 훑어보는 중...",
    "🏛️ 국회 법률 서고를 뒤지는 중...",
    "✍️ 법조문 꼼꼼히 읽는 중...",
  ],
  판례: [
    "⚖️ 판사님이 판결문 찾는 중...",
    "🔨 법정 기록 뒤지는 중...",
    "📋 수십만 판례 중 찾는 중...",
    "👨‍⚖️ 대법원 판례집 열람 중...",
    "🏛️ 법원 도서관에서 검색 중...",
  ],
  비교: [
    "📋 신구대조표 만드는 중...",
    "🔄 개정 전후를 비교하는 중...",
    "📝 빨간펜 선생님이 체크 중...",
    "🧐 조문 하나하나 대조 중...",
  ],
  기본: [
    "🔍 열심히 찾는 중...",
    "⏳ 잠시만 기다려 주세요...",
    "📡 법제처 서버와 대화 중...",
    "🤓 법률 AI가 분석 중...",
  ],
};

interface LoadingProps {
  text?: string;
  category?: "법령" | "판례" | "비교" | "기본";
}

export default function Loading({ text, category = "기본" }: LoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = FUN_MESSAGES[category] || FUN_MESSAGES["기본"];

  useEffect(() => {
    if (text) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [text, messages.length]);

  const displayText = text || messages[messageIndex];

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin mb-4" />
      <p className="text-[var(--text-muted)] text-sm transition-opacity duration-300">
        {displayText}
      </p>
    </div>
  );
}
