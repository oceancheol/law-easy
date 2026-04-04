"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Autocomplete from "@/components/ui/Autocomplete";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/lib/utils/format";
import type { AmendmentHistory, CompareResult, ArticleChange } from "@/types/compare";
import type { LawSearchResult } from "@/types/law";

interface SearchData {
  data: LawSearchResult[];
  meta: { total: number };
}

function DiffBlock({ change }: { change: ArticleChange }) {
  const typeClass =
    change.changeType === "added"
      ? "highlight-added"
      : change.changeType === "removed"
        ? "highlight-removed"
        : change.changeType === "modified"
          ? "highlight-modified"
          : "";

  const typeLabel =
    change.changeType === "added"
      ? "🟢 신설"
      : change.changeType === "removed"
        ? "🔴 삭제"
        : change.changeType === "modified"
          ? "🟡 수정"
          : "";

  return (
    <div className={`p-3 rounded-lg mb-3 ${typeClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs">{typeLabel}</span>
        <span className="font-semibold text-sm text-[var(--foreground)]">
          {change.articleNumber} {change.articleTitle}
        </span>
      </div>
      {change.changeType === "modified" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-[var(--accent-red)] font-medium mb-1">개정 전</p>
            <p className="text-[var(--foreground)] leading-relaxed">{change.oldContent}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--accent-green)] font-medium mb-1">개정 후</p>
            <p className="text-[var(--foreground)] leading-relaxed">{change.newContent}</p>
          </div>
        </div>
      )}
      {change.changeType === "added" && (
        <p className="text-sm text-[var(--foreground)] leading-relaxed">{change.newContent}</p>
      )}
      {change.changeType === "removed" && (
        <p className="text-sm text-[var(--foreground)] leading-relaxed">{change.oldContent}</p>
      )}
    </div>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lawId = searchParams.get("lawId") || "";

  const [searchResults, setSearchResults] = useState<LawSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [history, setHistory] = useState<AmendmentHistory | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (!lawId) return;
    setLoading(true);
    fetch(`/api/compare?lawId=${lawId}`)
      .then((res) => res.json())
      .then((data: { history: AmendmentHistory; compare: CompareResult }) => {
        setHistory(data.history || null);
        setCompareResult(data.compare || null);
      })
      .catch(() => {
        setHistory(null);
        setCompareResult(null);
      })
      .finally(() => setLoading(false));
  }, [lawId]);

  function handleSearch(query: string) {
    setSearchLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}&size=10`)
      .then((res) => res.json())
      .then((data: SearchData) => setSearchResults(data.data || []))
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }

  function handleSelectLaw(law: LawSearchResult) {
    router.push(`/compare?lawId=${law.lawId || law.id}`);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setLoading(true);
    fetch(`/api/compare?lawId=${lawId}&date=${date}`)
      .then((res) => res.json())
      .then((data: { compare: CompareResult }) => {
        setCompareResult(data.compare || null);
      })
      .catch(() => setCompareResult(null))
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-2xl font-bold text-[var(--foreground)] mb-6"
        style={{ fontFamily: "'Noto Serif KR', serif" }}
      >
        🔍 신구대조 비교
      </h1>

      {/* 검색 영역 - 항상 표시 */}
      <div className="mb-6">
        <Autocomplete
          onSearch={handleSearch}
          placeholder="비교할 법령을 검색하세요... (예: 근로기준법, 민법)"
        />
      </div>

      {/* 검색 결과 - 법령 선택 */}
      {searchLoading && <Loading text="법령 검색 중..." />}

      {!searchLoading && searchResults.length > 0 && !lawId && (
        <Card className="mb-6">
          <h2 className="text-sm font-semibold text-[var(--text-muted)] mb-3">
            법령을 선택하세요
          </h2>
          <div className="space-y-2">
            {searchResults.map((law) => (
              <button
                key={law.id}
                onClick={() => handleSelectLaw(law)}
                className="w-full text-left p-3 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Badge label={law.lawType} />
                  <span className="font-medium text-[var(--foreground)]">{law.lawName}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-auto">
                    {law.ministry} | 시행 {formatDate(law.enforcementDate)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* 안내 메시지 */}
      {!lawId && searchResults.length === 0 && !searchLoading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-[var(--text-muted)]">
            비교할 법령을 검색하세요.
          </p>
        </div>
      )}

      {loading && <Loading text="비교 데이터 로딩 중..." />}

      {/* 개정 이력 */}
      {lawId && !loading && history && (
        <Card className="mb-6">
          <h2
            className="text-lg font-semibold text-[var(--foreground)] mb-1"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            {history.lawName} 개정 이력
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            총 {history.amendments.length}회 개정 | 시점을 선택하면 해당 시점의 조문을 확인할 수 있습니다
          </p>
          {history.amendments.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {history.amendments.map((amendment, i) => (
                <button
                  key={i}
                  onClick={() => handleDateSelect(amendment.date)}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                    selectedDate === amendment.date
                      ? "border-[var(--primary)] bg-blue-50"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--foreground)]">
                      {formatDate(amendment.date)}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {amendment.type} | 법률 제{amendment.lawNumber}호
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">개정 이력이 없습니다.</p>
          )}
        </Card>
      )}

      {/* 비교 결과 */}
      {lawId && !loading && compareResult && (
        <Card>
          <h2
            className="text-lg font-semibold text-[var(--foreground)] mb-4"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            {compareResult.lawName} 신구대조
          </h2>
          <div className="flex gap-4 mb-4 text-xs text-[var(--text-muted)]">
            <span>🟢 신설</span>
            <span>🔴 삭제</span>
            <span>🟡 수정</span>
          </div>
          {compareResult.changes.length > 0 ? (
            compareResult.changes.map((change, i) => (
              <DiffBlock key={i} change={change} />
            ))
          ) : (
            <p className="text-sm text-[var(--text-muted)] text-center py-8">
              개정 이력에서 시점을 선택하면 해당 시점의 변경 조문을 확인할 수 있습니다.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<Loading text="로딩 중..." />}>
      <CompareContent />
    </Suspense>
  );
}
