"use client";

import { useState, type FormEvent } from "react";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  size?: "large" | "normal";
}

export default function SearchBar({
  placeholder = "법령명, 조문 내용, 약칭으로 검색...",
  defaultValue = "",
  onSearch,
  size = "normal",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
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
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} bg-[var(--card-bg)] border-2 border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors`}
      />
      <button
        type="submit"
        className={`${buttonClass} bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-colors`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
}
