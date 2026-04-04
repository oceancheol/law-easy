"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import SearchBar from "@/components/ui/SearchBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import Pagination from "@/components/ui/Pagination";
import TabBar from "@/components/ui/TabBar";
import { formatDate, truncate } from "@/lib/utils/format";
import type { PrecedentSearchResult } from "@/types/precedent";

interface PrecedentData {
  data: PrecedentSearchResult[];
  meta: { total: number; page: number; size: number };
}

const COURT_TABS = [
  { key: "전체", label: "전체", icon: "⚖️" },
  { key: "대법원", label: "대법원", icon: "🏛️" },
  { key: "하급심", label: "하급심", icon: "🏢" },
  { key: "헌법재판소", label: "헌법재판소", icon: "📜" },
];

function PrecedentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");
  const court = searchParams.get("court") || "전체";

  const [results, setResults] = useState<PrecedentSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const courtParam = court !== "전체" ? `&court=${encodeURIComponent(court)}` : "";
    fetch(`/api/precedent?q=${encodeURIComponent(query)}&page=${page}${courtParam}`)
      .then((res) => res.json())
      .then((data: PrecedentData) => {
        setResults(data.data || []);
        setTotal(data.meta?.total || 0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query, page, court]);

  function handleSearch(newQuery: string) {
    router.push(`/precedent?q=${encodeURIComponent(newQuery)}`);
  }

  function handleCourtChange(newCourt: string) {
    router.push(
      `/precedent?q=${encodeURIComponent(query)}&court=${encodeURIComponent(newCourt)}`
    );
  }

  function handlePageChange(newPage: number) {
    router.push(
      `/precedent?q=${encodeURIComponent(query)}&page=${newPage}&court=${encodeURIComponent(court)}`
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-2xl font-bold text-[var(--foreground)] mb-6"
        style={{ fontFamily: "'Noto Serif KR', serif" }}
      >
        ⚖️ 판례 검색
      </h1>

      <div className="mb-4">
        <SearchBar
          onSearch={handleSearch}
          defaultValue={query}
          placeholder="판례명, 사건번호, 키워드로 검색..."
        />
      </div>

      {query && (
        <div className="mb-4">
          <TabBar tabs={COURT_TABS} activeTab={court} onTabChange={handleCourtChange} />
        </div>
      )}

      {query && (
        <p className="text-sm text-[var(--text-muted)] mb-4">
          &quot;{query}&quot; 판례 검색 결과 {total.toLocaleString()}건
        </p>
      )}

      {loading && <Loading text="판례 검색 중..." />}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-[var(--text-muted)]">
            판례 검색 결과가 없습니다.
          </p>
        </div>
      )}

      {!loading && !query && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">⚖️</p>
          <p className="text-[var(--text-muted)]">
            검색어를 입력하여 판례를 검색하세요.
          </p>
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {results.map((prec) => (
            <Card
              key={prec.id}
              hoverable
              onClick={() => router.push(`/precedent/${prec.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge label={prec.court} variant="court" />
                    <span className="text-xs text-[var(--text-muted)]">
                      {prec.caseNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                    {prec.caseName}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-[var(--text-muted)] mb-2">
                    {prec.judgmentDate && (
                      <span>선고일: {formatDate(prec.judgmentDate)}</span>
                    )}
                    {prec.caseType && <span>{prec.caseType}</span>}
                  </div>
                  {prec.summary && (
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {truncate(prec.summary, 200)}
                    </p>
                  )}
                </div>
                <span className="text-[var(--primary)] text-sm shrink-0">
                  상세보기 →
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / 20)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default function PrecedentPage() {
  return (
    <Suspense fallback={<Loading text="로딩 중..." />}>
      <PrecedentContent />
    </Suspense>
  );
}
