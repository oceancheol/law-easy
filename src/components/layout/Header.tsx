"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/search", label: "법령 검색" },
  { href: "/precedent", label: "판례 검색" },
  { href: "/compare", label: "신구대조" },
  { href: "/glossary", label: "용어사전" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[var(--card-bg)] border-b border-[var(--border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span
              className="text-xl font-bold text-[var(--foreground)]"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              법령이지
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <nav className="md:hidden flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
