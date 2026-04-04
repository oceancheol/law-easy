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

interface ParsedParagraph {
  content: string;
  tag: "신설" | "개정" | "unchanged";
}

function parseParagraphs(text: string): ParsedParagraph[] {
  const lines = text.split("\n").filter((l) => l.trim());
  return lines.map((line) => {
    if (line.includes("<신설") || line.includes("〈신설")) {
      return { content: line.replace(/<신설[^>]*>/g, "").replace(/〈신설[^〉]*〉/g, "").trim(), tag: "신설" };
    }
    if (line.includes("<개정") || line.includes("〈개정")) {
      return { content: line.replace(/<개정[^>]*>/g, "").replace(/〈개정[^〉]*〉/g, "").trim(), tag: "개정" };
    }
    return { content: line.trim(), tag: "unchanged" };
  });
}

function DiffTable({ change }: { change: ArticleChange }) {
  const paragraphs = parseParagraphs(change.newContent);

  return (
    <div className="mb-6 border border-[var(--border)] rounded-lg overflow-hidden">
      {/* 조문 헤더 */}
      <div className="bg-[var(--background)] px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-yellow)] text-white font-medium">
            변경
          </span>
          <span className="font-semibold text-sm text-[var(--foreground)]">
            제{change.articleNumber}조 {change.articleTitle && `(${change.articleTitle})`}
          </span>
        </div>
      </div>

      {/* 좌우 비교 헤더 */}
      <div className="grid grid-cols-2 border-b border-[var(--border)]">
        <div className="px-4 py-2 bg-red-50 border-r border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--accent-red)]">구 (개정 전)</p>
        </div>
        <div className="px-4 py-2 bg-green-50">
          <p className="text-xs font-semibold text-[var(--accent-green)]">신 (개정 후)</p>
        </div>
      </div>

      {/* 항별 비교 */}
      {paragraphs.map((para, i) => (
        <div
          key={i}
          className={`grid grid-cols-2 border-b border-[var(--border)] last:border-b-0 ${
            para.tag === "신설"
              ? "bg-green-50/50"
              : para.tag === "개정"
                ? "bg-yellow-50/50"
                : ""
          }`}
        >
          {/* 구 (왼쪽) */}
          <div className="px-4 py-3 border-r border-[var(--border)] text-sm leading-relaxed">
            {para.tag === "신설" ? (
              <span className="text-[var(--text-muted)] italic text-xs">(해당 없음 - 신설 조항)</span>
            ) : para.tag === "개정" ? (
              <span className="text-[var(--text-muted)] italic text-xs line-through">{para.content}</span>
            ) : (
              <span className="text-[var(--foreground)]">{para.content}</span>
            )}
          </div>
          {/* 신 (오른쪽) */}
          <div className="px-4 py-3 text-sm leading-relaxed">
            <span className={`text-[var(--foreground)] ${para.tag === "신설" ? "font-medium" : ""}`}>
              {para.content}
            </span>
            {para.tag === "신설" && (
              <span className="ml-1 text-xs text-[var(--accent-green)] font-medium">[신설]</span>
            )}
            {para.tag === "개정" && (
              <span className="ml-1 text-xs text-[var(--accent-yellow)] font-medium">[개정]</span>
            )}
          </div>
        </div>
      ))}
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
  const [amendmentContent, setAmendmentContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (!lawId) return;
    setLoading(true);
    fetch(`/api/compare?lawId=${lawId}`)
      .then((res) => res.json())
      .then((data: { history: AmendmentHistory; compare: CompareResult; amendmentContent: string[] }) => {
        setHistory(data.history || null);
        setCompareResult(data.compare || null);
        setAmendmentContent(data.amendmentContent || []);
      })
      .catch(() => {
        setHistory(null);
        setCompareResult(null);
        setAmendmentContent([]);
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
      .then((data: { compare: CompareResult; amendmentContent: string[] }) => {
        setCompareResult(data.compare || null);
        setAmendmentContent(data.amendmentContent || []);
      })
      .catch(() => {
        setCompareResult(null);
        setAmendmentContent([]);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-2xl font-bold text-[var(--foreground)] mb-6"
        style={{ fontFamily: "'Noto Serif KR', serif" }}
      >
        📋 신구대조표
      </h1>

      {/* 검색 영역 */}
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
          <p className="text-4xl mb-4">📋</p>
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
            총 {history.amendments.length}회 개정 | 시점을 선택하면 해당 시점의 개정 내용을 확인할 수 있습니다
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

      {/* 부칙 내용 (선택한 시점) */}
      {lawId && !loading && selectedDate && amendmentContent.length > 0 && (
        <Card className="mb-6">
          <h2
            className="text-lg font-semibold text-[var(--foreground)] mb-3"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            📜 개정 부칙 내용
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            {formatDate(selectedDate)} 개정 시 부칙
          </p>
          <div className="space-y-1 text-sm text-[var(--foreground)] leading-relaxed bg-[var(--background)] rounded-lg p-4 max-h-80 overflow-y-auto">
            {amendmentContent.map((line, i) => (
              <p key={i} className={line.startsWith("부칙") || line.startsWith("제") ? "font-medium" : "pl-2"}>
                {line}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* 신구대조표 */}
      {lawId && !loading && compareResult && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold text-[var(--foreground)]"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              {compareResult.lawName} 신구대조표
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              변경 조문 {compareResult.changes.length}건
            </span>
          </div>

          {/* 범례 */}
          <div className="flex gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-100 border border-green-300 inline-block" />
              신설
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 inline-block" />
              개정
            </span>
            <span className="text-[var(--text-muted)]">
              좌: 구(개정 전) | 우: 신(개정 후)
            </span>
          </div>

          {compareResult.changes.length > 0 ? (
            compareResult.changes.map((change, i) => (
              <DiffTable key={i} change={change} />
            ))
          ) : (
            <Card>
              <p className="text-sm text-[var(--text-muted)] text-center py-8">
                변경된 조문이 없습니다.
              </p>
            </Card>
          )}
        </div>
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
