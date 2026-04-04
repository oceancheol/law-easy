"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { getAllLegalTerms } from "@/components/ui/LegalTermTooltip";

const terms = getAllLegalTerms();
const termEntries = Object.entries(terms).sort(([a], [b]) => a.localeCompare(b, "ko"));

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filtered = termEntries.filter(
    ([term, def]) =>
      term.includes(search) || def.includes(search)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-2xl font-bold text-[var(--foreground)] mb-2"
        style={{ fontFamily: "'Noto Serif KR', serif" }}
      >
        📖 법률 용어 사전
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        어려운 법률 용어를 쉬운 말로 풀어드립니다.
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="용어 검색..."
        className="w-full px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(([term, definition]) => (
          <Card key={term}>
            <h3 className="text-base font-semibold text-[var(--primary)] mb-1">
              {term}
            </h3>
            <p className="text-sm text-[var(--foreground)] leading-relaxed">
              {definition}
            </p>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-[var(--text-muted)]">
            검색 결과가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
