"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/lib/utils/format";
import type { PrecedentDetail } from "@/types/precedent";

export default function PrecedentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [prec, setPrec] = useState<PrecedentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    fetch(`/api/precedent/detail?id=${id}`)
      .then((res) => res.json())
      .then((data: { data: PrecedentDetail }) => setPrec(data.data || null))
      .catch(() => setPrec(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading text="판례 정보 로딩 중..." />;

  if (!prec) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-[var(--text-muted)]">판례 정보를 불러올 수 없습니다.</p>
        <Link href="/precedent" className="text-[var(--primary)] text-sm mt-4 inline-block">
          ← 판례 검색으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/precedent" className="text-sm text-[var(--primary)] mb-6 inline-block">
        ← 판례 검색으로 돌아가기
      </Link>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge label={prec.court} />
          <span className="text-sm text-[var(--text-muted)]">{prec.caseNumber}</span>
        </div>
        <h1
          className="text-2xl font-bold text-[var(--foreground)] mb-3"
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          {prec.caseName}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
          {prec.judgmentDate && <span>선고일: {formatDate(prec.judgmentDate)}</span>}
          {prec.caseType && <span>사건종류: {prec.caseType}</span>}
        </div>
      </Card>

      {prec.summary && (
        <Card className="mb-6">
          <h2
            className="text-lg font-semibold text-[var(--foreground)] mb-3"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            판시사항 / 요지
          </h2>
          <div className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
            {prec.summary}
          </div>
        </Card>
      )}

      {prec.fullText && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-lg font-semibold text-[var(--foreground)]"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              판례 전문
            </h2>
            <button
              onClick={() => setShowFull(!showFull)}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              {showFull ? "접기" : "펼치기"}
            </button>
          </div>
          {showFull && (
            <div className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
              {prec.fullText}
            </div>
          )}
          {!showFull && (
            <p className="text-sm text-[var(--text-muted)]">
              전문을 보려면 &quot;펼치기&quot;를 클릭하세요.
            </p>
          )}
        </Card>
      )}

      {prec.relatedLaws.length > 0 && (
        <Card>
          <h2
            className="text-lg font-semibold text-[var(--foreground)] mb-3"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            관련 법령
          </h2>
          <div className="space-y-2">
            {prec.relatedLaws.map((law, i) => (
              <a
                key={i}
                href={law.lawId ? `/law/${law.lawId}` : "#"}
                className="block text-sm text-[var(--primary)] hover:underline"
              >
                {law.lawName} {law.articleNumber}
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
