"use client";

import { useState } from "react";
import { KEYWORD_MAP } from "@/lib/funData";

interface KeywordMapProps {
  onSearch: (query: string) => void;
}

const categories = Object.keys(KEYWORD_MAP);

export default function KeywordMap({ onSearch }: KeywordMapProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="card" style={{ minHeight: 160 }}>
      {/* 카테고리 버블 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => {
          const isActive = selected === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelected(isActive ? null : cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: isActive ? KEYWORD_MAP[cat].color : "var(--muted-bg)",
                color: isActive ? "#fff" : "var(--text-muted)",
                border: `1.5px solid ${isActive ? KEYWORD_MAP[cat].color : "var(--border)"}`,
                transform: isActive ? "scale(1.05)" : "scale(1)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 연관 키워드 */}
      {selected && (
        <div className="animate-fadeIn">
          <p className="text-xs text-[var(--text-muted)] mb-2">
            &quot;{selected}&quot; 관련 검색어
          </p>
          <div className="flex flex-wrap gap-2">
            {KEYWORD_MAP[selected].related.map((keyword) => (
              <button
                key={keyword}
                onClick={() => onSearch(keyword)}
                className="px-3 py-1.5 rounded-lg text-sm transition-all hover:scale-105"
                style={{
                  background: `${KEYWORD_MAP[selected].color}15`,
                  color: KEYWORD_MAP[selected].color,
                  border: `1px solid ${KEYWORD_MAP[selected].color}30`,
                }}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {!selected && (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">
          관심 분야를 선택하면 연관 법률 키워드가 나타나요!
        </p>
      )}
    </div>
  );
}
