"use client";

import { useState, useEffect, useCallback } from "react";

const HISTORY_KEY = "law-easy-search-history";
const RECENT_LAWS_KEY = "law-easy-recent-laws";
const MAX_HISTORY = 10;
const MAX_RECENT_LAWS = 10;

interface RecentLaw {
  id: string;
  name: string;
  type: string;
  visitedAt: string;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const addHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((q) => q !== query);
      const updated = [query, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return { history, addHistory, clearHistory };
}

export function useRecentLaws() {
  const [recentLaws, setRecentLaws] = useState<RecentLaw[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_LAWS_KEY);
    if (stored) setRecentLaws(JSON.parse(stored));
  }, []);

  const addRecentLaw = useCallback((law: Omit<RecentLaw, "visitedAt">) => {
    setRecentLaws((prev) => {
      const filtered = prev.filter((l) => l.id !== law.id);
      const updated = [
        { ...law, visitedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_RECENT_LAWS);
      localStorage.setItem(RECENT_LAWS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { recentLaws, addRecentLaw };
}
