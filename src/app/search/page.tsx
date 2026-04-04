"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Autocomplete from "@/components/ui/Autocomplete";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import Pagination from "@/components/ui/Pagination";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { formatDate, truncate } from "@/lib/utils/format";
import type { LawSearchResult } from "@/types/law";

interface SearchData {
  data: LawSearchResult[];
  meta: { total: number; page: number; size: number };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");

  const { history, addHistory } = useSearchHistory();
  const [results, setResults] = useState<LawSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}`)
      .then((res) => res.json())
      .then((data: SearchData) => {
        setResults(data.data || []);
        setTotal(data.meta?.total || 0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query, page]);

  function handleSearch(newQuery: string) {
    addHistory(newQuery);
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  }

  function handlePageChange(newPage: number) {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Autocomplete onSearch={handleSearch} defaultValue={query} searchHistory={history} />
      </div>

      {query && (
        <p className="text-sm text-[var(--text-muted)] mb-4">
          &quot;{query}&quot; 검색 결과 {total.toLocaleString()}건
        </p>
      )}

      {loading && <Loading text="법령 검색 중..." />}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-[var(--text-muted)]">
            검색 결과가 없습니다. 다른 키워드로 시도해 보세요.
          </p>
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {results.map((law) => (
            <Card
              key={law.id}
              hoverable
              onClick={() => router.push(`/law/${law.lawId || law.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge label={law.lawType} />
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {law.lawName}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
                    {law.ministry && <span>소관: {law.ministry}</span>}
                    {law.enforcementDate && (
                      <span>시행: {formatDate(law.enforcementDate)}</span>
                    )}
                    {law.promulgationDate && (
                      <span>공포: {formatDate(law.promulgationDate)}</span>
                    )}
                  </div>
                  {law.summary && (
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      {truncate(law.summary, 150)}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading text="로딩 중..." />}>
      <SearchContent />
    </Suspense>
  );
}
