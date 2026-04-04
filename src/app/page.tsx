"use client";

import { useRouter } from "next/navigation";
import Autocomplete from "@/components/ui/Autocomplete";
import { useSearchHistory, useRecentLaws } from "@/hooks/useSearchHistory";
import { formatDate } from "@/lib/utils/format";

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
    icon: "🗺️",
    title: "법령 관계도",
    description: "법률→시행령→시행규칙 계층 구조를 한눈에 파악",
    href: "/search",
  },
  {
    icon: "📖",
    title: "법률 용어 사전",
    description: "어려운 법률 용어를 쉬운 말로 풀어서 설명",
    href: "/glossary",
  },
];

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
      <section className="relative bg-gradient-to-b from-[var(--card-bg)] to-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4 leading-tight"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            대한민국 법령,
            <br />
            이제 쉽게 찾으세요
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-10">
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
                className="px-3 py-1.5 text-sm bg-[var(--card-bg)] border border-[var(--border)] rounded-full text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Laws */}
      {recentLaws.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2
            className="text-lg font-bold text-[var(--foreground)] mb-4"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            🕐 최근 본 법령
          </h2>
          <div className="flex flex-wrap gap-3">
            {recentLaws.map((law) => (
              <a
                key={law.id}
                href={`/law/${law.id}`}
                className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
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

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2
          className="text-2xl font-bold text-[var(--foreground)] text-center mb-10"
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          주요 서비스
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <a
              key={feature.title}
              href={feature.href}
              className="group bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-8 shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3
                className="text-xl font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)]"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {feature.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-[var(--card-bg)] border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2
            className="text-xl font-bold text-[var(--foreground)] mb-4"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            법제처 Open API 기반 공공서비스
          </h2>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
            법령이지는 대한민국 법제처에서 제공하는 공식 Open API 데이터를
            활용하여 법령, 판례, 행정규칙 등의 법률 정보를 제공합니다. 모든
            데이터는 국가법령정보센터의 최신 정보를 기반으로 합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
