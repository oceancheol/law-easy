"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { getAllAbbreviations } from "@/lib/utils/abbreviation";

interface AutocompleteProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  searchHistory?: string[];
  size?: "large" | "normal";
}

const abbreviations = getAllAbbreviations();
const allSuggestions = [
  ...Object.entries(abbreviations).map(([abbr, full]) => ({
    label: `${abbr} → ${full}`,
    value: full,
  })),
  { label: "근로기준법", value: "근로기준법" },
  { label: "민법", value: "민법" },
  { label: "상법", value: "상법" },
  { label: "형법", value: "형법" },
  { label: "형사소송법", value: "형사소송법" },
  { label: "민사소송법", value: "민사소송법" },
  { label: "헌법", value: "헌법" },
  { label: "개인정보 보호법", value: "개인정보 보호법" },
  { label: "도로교통법", value: "도로교통법" },
  { label: "주택임대차보호법", value: "주택임대차보호법" },
  { label: "국토의 계획 및 이용에 관한 법률", value: "국토의 계획 및 이용에 관한 법률" },
];

export default function Autocomplete({
  placeholder = "법령명, 조문 내용, 약칭으로 검색...",
  defaultValue = "",
  onSearch,
  searchHistory = [],
  size = "normal",
}: AutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<{ label: string; value: string }[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    if (value.length > 0) {
      const filtered = allSuggestions.filter(
        (s) =>
          s.label.toLowerCase().includes(value.toLowerCase()) ||
          s.value.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowDropdown(filtered.length > 0);
    } else {
      const historySuggestions = searchHistory.map((h) => ({
        label: `🕐 ${h}`,
        value: h,
      }));
      setSuggestions(historySuggestions.slice(0, 5));
      setShowDropdown(historySuggestions.length > 0);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      onSearch(query.trim());
    }
  }

  function handleSelect(value: string) {
    setQuery(value);
    setShowDropdown(false);
    onSearch(value);
  }

  const inputClass =
    size === "large"
      ? "w-full pl-5 pr-14 py-4 text-lg rounded-xl"
      : "w-full pl-4 pr-12 py-3 text-base rounded-lg";

  const buttonClass =
    size === "large"
      ? "absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-lg"
      : "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => handleInputChange(query)}
          placeholder={placeholder}
          className={`${inputClass} bg-[var(--card-bg)] border-2 border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors`}
        />
        <button
          type="submit"
          className={`${buttonClass} bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </button>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(s.value)}
                className="w-full text-left px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
