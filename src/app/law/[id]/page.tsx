"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import PrintButton from "@/components/ui/PrintButton";
import LawRelationMap from "@/components/law/LawRelationMap";
import { useRecentLaws } from "@/hooks/useSearchHistory";
import { formatDate } from "@/lib/utils/format";
import type { LawDetail } from "@/types/law";

export default function LawDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addRecentLaw } = useRecentLaws();
  const [law, setLaw] = useState<LawDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/search/detail?id=${id}`)
      .then((res) => res.json())
      .then((data: { data: LawDetail }) => {
        setLaw(data.data || null);
        if (data.data) {
          addRecentLaw({
            id: data.data.lawId || data.data.id,
            name: data.data.lawName,
            type: data.data.lawType,
          });
        }
      })
      .catch(() => setLaw(null))
      .finally(() => setLoading(false));
  }, [id, addRecentLaw]);

  if (loading) return <Loading text="법령 정보 로딩 중..." />;

  if (!law) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-[var(--text-muted)]">법령 정보를 불러올 수 없습니다.</p>
        <a href="/search" className="text-[var(--primary)] text-sm mt-4 inline-block">
          ← 검색으로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a href="/search" className="text-sm text-[var(--primary)] mb-6 inline-block print-hide">
        ← 검색 결과로 돌아가기
      </a>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge label={law.lawType} />
          <h1
            className="text-2xl font-bold text-[var(--foreground)]"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            {law.lawName}
          </h1>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
          {law.ministry && <span>소관: {law.ministry}</span>}
          {law.lawId && <span>법령번호: {law.lawId}</span>}
          {law.enforcementDate && (
            <span>시행일: {formatDate(law.enforcementDate)}</span>
          )}
          {law.promulgationDate && (
            <span>공포일: {formatDate(law.promulgationDate)}</span>
          )}
        </div>
        <div className="mt-4 flex gap-2 print-hide">
          <a
            href={`/compare?lawId=${law.lawId || law.id}`}
            className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            🔍 신구대조 비교
          </a>
          <PrintButton />
        </div>
      </Card>

      <div className="print-hide">
        <LawRelationMap lawName={law.lawName} lawId={law.lawId || law.id} />
        <div className="mt-6" />
      </div>

      <div className="print-area">
        {law.chapters.length > 0 ? (
          <div className="space-y-4">
            {law.chapters.map((chapter, ci) => (
              <Card key={ci}>
                <h2
                  className="text-lg font-semibold text-[var(--foreground)] mb-3"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {chapter.title}
                </h2>
                <div className="space-y-3">
                  {chapter.articles.map((article, ai) => (
                    <details key={ai} className="group" open>
                      <summary className="cursor-pointer text-[var(--primary)] font-medium hover:underline">
                        {article.number} {article.title}
                      </summary>
                      <div className="mt-2 pl-4 border-l-2 border-[var(--border)] text-sm text-[var(--foreground)] leading-relaxed">
                        <p>{article.content}</p>
                        {article.paragraphs.map((p, pi) => (
                          <p key={pi} className="mt-1">
                            {p.number} {p.content}
                          </p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-[var(--text-muted)] text-center py-8">
              조문 상세 정보는 국가법령정보센터에서 확인하세요.
            </p>
            <div className="text-center">
              <a
                href={`https://www.law.go.kr/법령/${encodeURIComponent(law.lawName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] text-sm hover:underline"
              >
                국가법령정보센터에서 보기 →
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
