"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
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

interface LawGroup {
  baseName: string;
  laws: LawSearchResult[];
}

function groupRelatedLaws(results: LawSearchResult[]): { groups: LawGroup[]; ungrouped: LawSearchResult[] } {
  const used = new Set<string>();
  const groups: LawGroup[] = [];

  for (const law of results) {
    if (used.has(law.id)) continue;
    if (law.lawType !== "법률") continue;

    const baseName = law.lawName;
    const related = results.filter(
      (r) =>
        !used.has(r.id) &&
        r.id !== law.id &&
        (r.lawName === `${baseName} 시행령` || r.lawName === `${baseName} 시행규칙`)
    );

    if (related.length > 0) {
      const group = [law, ...related];
      group.forEach((g) => used.add(g.id));
      groups.push({ baseName, laws: group });
    }
  }

  const ungrouped = results.filter((r) => !used.has(r.id));
  return { groups, ungrouped };
}

function LawRelationBadge({ law, router }: { law: LawSearchResult; router: ReturnType<typeof useRouter> }) {
  const colorMap: Record<string, string> = {
    "법률": "bg-[var(--primary)] text-white border-[var(--primary)]",
    "시행령": "bg-[var(--accent-green)] text-white border-[var(--accent-green)]",
    "시행규칙": "bg-[var(--accent-yellow)] text-white border-[var(--accent-yellow)]",
  };
  return (
    <button
      onClick={() => router.push(`/law/${law.lawId || law.id}`)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors hover:opacity-80 ${
        colorMap[law.lawType] || "bg-[var(--card-bg)] border-[var(--border)] text-[var(--foreground)]"
      }`}
    >
      <Badge label={law.lawType} />
      <span className="font-medium">{law.lawName}</span>
    </button>
  );
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
  const [showRelationMap, setShowRelationMap] = useState(true);

  const { groups, ungrouped } = useMemo(() => groupRelatedLaws(results), [results]);

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

      {/* 법령 관계도 */}
      {!loading && groups.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowRelationMap(!showRelationMap)}
            className="flex items-center gap-2 text-sm text-[var(--primary)] mb-3 hover:underline"
          >
            🗺️ 법령 관계도 ({groups.length}개 그룹)
            <span>{showRelationMap ? "▲ 접기" : "▼ 펼치기"}</span>
          </button>
          {showRelationMap && (
            <div className="space-y-3">
              {groups.map((group) => (
                <Card key={group.baseName}>
                  <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">
                    📋 {group.baseName} 체계
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.laws
                      .sort((a, b) => {
                        const order = ["법률", "시행령", "시행규칙"];
                        return order.indexOf(a.lawType) - order.indexOf(b.lawType);
                      })
                      .map((law) => (
                        <LawRelationBadge key={law.id} law={law} router={router} />
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 검색 결과 목록 */}
      {!loading && (
        <div className="space-y-4">
          {(groups.length > 0 ? ungrouped : results).map((law) => (
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
