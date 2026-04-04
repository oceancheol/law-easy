"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface RelatedLawItem {
  id: string;
  lawName: string;
  lawType: string;
  ministry: string;
  lawId: string;
}

interface LawRelationMapProps {
  lawName: string;
  lawId: string;
}

export default function LawRelationMap({ lawName, lawId }: LawRelationMapProps) {
  const [relatedLaws, setRelatedLaws] = useState<RelatedLawItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseName = lawName
      .replace(/ 시행령$/, "")
      .replace(/ 시행규칙$/, "");

    Promise.all([
      fetch(`/api/search?q=${encodeURIComponent(baseName)}&size=20`).then((r) => r.json()),
    ])
      .then(([searchData]) => {
        const laws = (searchData.data || []) as RelatedLawItem[];
        const filtered = laws.filter(
          (l) =>
            l.lawName.includes(baseName) || baseName.includes(l.lawName.replace(/ 시행령$/, "").replace(/ 시행규칙$/, ""))
        );
        setRelatedLaws(filtered);
      })
      .catch(() => setRelatedLaws([]))
      .finally(() => setLoading(false));
  }, [lawName, lawId]);

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-[var(--text-muted)] text-center py-4">
          관련 법령 관계도 로딩 중...
        </p>
      </Card>
    );
  }

  if (relatedLaws.length <= 1) return null;

  const lawGroup = relatedLaws.filter((l) => l.lawType === "법률");
  const decreeGroup = relatedLaws.filter((l) => l.lawType === "시행령");
  const ruleGroup = relatedLaws.filter((l) => l.lawType === "시행규칙");
  const otherGroup = relatedLaws.filter(
    (l) => !["법률", "시행령", "시행규칙"].includes(l.lawType)
  );

  return (
    <Card>
      <h2
        className="text-lg font-semibold text-[var(--foreground)] mb-4"
        style={{ fontFamily: "'Noto Serif KR', serif" }}
      >
        🗺️ 법령 관계도
      </h2>
      <div className="relative">
        {/* 법률 레벨 */}
        {lawGroup.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">법률</p>
            <div className="flex flex-wrap gap-2">
              {lawGroup.map((l) => (
                <a
                  key={l.id}
                  href={`/law/${l.lawId || l.id}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    l.id === lawId
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--card-bg)] border-[var(--border)] hover:border-[var(--primary)] text-[var(--foreground)]"
                  }`}
                >
                  <Badge label="법률" />
                  <span className="font-medium">{l.lawName}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 연결선 */}
        {lawGroup.length > 0 && (decreeGroup.length > 0 || ruleGroup.length > 0) && (
          <div className="flex items-center ml-6 my-1">
            <div className="w-0.5 h-6 bg-[var(--border)]" />
          </div>
        )}

        {/* 시행령 레벨 */}
        {decreeGroup.length > 0 && (
          <div className="ml-8 mb-2">
            <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">시행령 (대통령령)</p>
            <div className="flex flex-wrap gap-2">
              {decreeGroup.map((l) => (
                <a
                  key={l.id}
                  href={`/law/${l.lawId || l.id}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    l.id === lawId
                      ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)]"
                      : "bg-[var(--card-bg)] border-[var(--border)] hover:border-[var(--accent-green)] text-[var(--foreground)]"
                  }`}
                >
                  <Badge label="시행령" />
                  <span className="font-medium">{l.lawName}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 연결선 */}
        {decreeGroup.length > 0 && ruleGroup.length > 0 && (
          <div className="flex items-center ml-14 my-1">
            <div className="w-0.5 h-6 bg-[var(--border)]" />
          </div>
        )}

        {/* 시행규칙 레벨 */}
        {ruleGroup.length > 0 && (
          <div className="ml-16 mb-2">
            <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">시행규칙</p>
            <div className="flex flex-wrap gap-2">
              {ruleGroup.map((l) => (
                <a
                  key={l.id}
                  href={`/law/${l.lawId || l.id}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    l.id === lawId
                      ? "bg-[var(--accent-yellow)] text-white border-[var(--accent-yellow)]"
                      : "bg-[var(--card-bg)] border-[var(--border)] hover:border-[var(--accent-yellow)] text-[var(--foreground)]"
                  }`}
                >
                  <Badge label="시행규칙" />
                  <span className="font-medium">{l.lawName}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 기타 */}
        {otherGroup.length > 0 && (
          <div className="ml-8 mt-3 pt-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">관련 법령</p>
            <div className="flex flex-wrap gap-2">
              {otherGroup.map((l) => (
                <a
                  key={l.id}
                  href={`/law/${l.lawId || l.id}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] text-sm text-[var(--foreground)] transition-colors"
                >
                  <Badge label={l.lawType} />
                  <span>{l.lawName}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
