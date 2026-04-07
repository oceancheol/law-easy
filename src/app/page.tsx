"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Autocomplete from "@/components/ui/Autocomplete";
import KeywordMap from "@/components/ui/KeywordMap";
import { useSearchHistory, useRecentLaws } from "@/hooks/useSearchHistory";
import { formatDate } from "@/lib/utils/format";
import { SURPRISING_LAWS } from "@/lib/funData";

const POPULAR_KEYWORDS = [
  "근로기준법",
  "민법",
  "상법",
  "형법",
  "개인정보 보호법",
  "주택임대차보호법",
  "도로교통법",
  "중대재해처벌법",
];

const FEATURES = [
  {
    icon: "📘",
    title: "법령 검색",
    description: "법률·시행령·시행규칙을 키워드와 약칭으로 빠르게 검색",
    href: "/search",
  },
  {
    icon: "⚖️",
    title: "판례 검색",
    description: "대법원·하급심·헌법재판소 판례를 한곳에서 검색",
    href: "/precedent",
  },
  {
    icon: "🔍",
    title: "신구대조 비교",
    description: "법령 개정 전후를 나란히 비교하고 변경점을 확인",
    href: "/compare",
  },
  {
    icon: "📖",
    title: "법률 용어사전",
    description: "어려운 법률 용어를 쉬운 말로 풀어서 설명",
    href: "/glossary",
  },
];

const STATS = [
  { value: "6,000+", label: "수록 법령" },
  { value: "200,000+", label: "판례 데이터" },
  { value: "실시간", label: "법제처 연동" },
];

function getRandomLawIndex() {
  return typeof window !== "undefined" ? Math.floor(Math.random() * SURPRISING_LAWS.length) : 0;
}

function SurprisingLawCard() {
  const [current, setCurrent] = useState(getRandomLawIndex);
  const [fade, setFade] = useState(true);
  const router = useRouter();

  function handleNext() {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SURPRISING_LAWS.length);
      setFade(true);
    }, 200);
  }

  const law = SURPRISING_LAWS[current];

  return (
    <div
      className={`card transition-opacity duration-200 ${fade ? "opacity-100" : "opacity-0"}`}
      style={{ minHeight: 160 }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{law.emoji}</span>
        <button
          onClick={handleNext}
          className="text-xs text-[var(--primary)] hover:underline"
        >
          다른 법 보기 →
        </button>
      </div>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
        {law.title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
        {law.description}
      </p>
      <button
        onClick={() => router.push(`/search?q=${encodeURIComponent(law.lawName)}`)}
        className="text-sm text-[var(--primary)] font-medium hover:underline"
      >
        {law.lawName} 검색하기 →
      </button>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { history, addHistory } = useSearchHistory();
  const { recentLaws } = useRecentLaws();

  function handleSearch(query: string) {
    addHistory(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleKeywordClick(keyword: string) {
    addHistory(keyword);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative" style={{ background: "linear-gradient(to bottom, #FFFFFF, #F5F0EB)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--foreground)] mb-4 sm:mb-5 leading-tight tracking-tight">
            대한민국 법령,
            <br />
            이제 쉽게 찾으세요
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] mb-8 sm:mb-10 leading-relaxed">
            법제처 공식 데이터 기반 법령·판례·신구대조 통합 검색 서비스
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <Autocomplete
              onSearch={handleSearch}
              searchHistory={history}
              size="large"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordClick(keyword)}
                className="keyword-pill"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[var(--border-light)] bg-[var(--card-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl sm:text-2xl font-bold text-[var(--primary)]">{stat.value}</p>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Laws */}
      {recentLaws.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
            최근 본 법령
          </h2>
          <div className="flex flex-wrap gap-3">
            {recentLaws.map((law) => (
              <a
                key={law.id}
                href={`/law/${law.id}`}
                className="keyword-pill"
              >
                <span className="font-medium text-[var(--foreground)]">{law.name}</span>
                <span className="text-xs text-[var(--text-muted)] ml-2">
                  {formatDate(law.visitedAt.split("T")[0].replace(/-/g, ""))}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* "이런 법도 있어?" + 법률 키워드 맵 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이런 법도 있어? */}
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
              이런 법도 있어? 😮
            </h2>
            <SurprisingLawCard />
          </div>

          {/* 법률 키워드 맵 */}
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
              법률 키워드 맵 🗺️
            </h2>
            <KeywordMap onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[var(--muted-bg)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-3">
            주요 서비스
          </h2>
          <p className="text-center text-[var(--text-muted)] mb-10">
            LawEasy에서 제공하는 핵심 기능을 확인하세요
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <a
                key={feature.title}
                href={feature.href}
                className="group card card-hoverable text-center"
                style={{ padding: "32px 24px" }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-[var(--card-bg)] border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
            법제처 Open API 기반 공공서비스
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            LawEasy는 대한민국 법제처에서 제공하는 공식 Open API 데이터를
            활용하여 법령, 판례, 행정규칙 등의 법률 정보를 제공합니다.
            모든 데이터는 국가법령정보센터의 최신 정보를 기반으로 합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
