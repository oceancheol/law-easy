"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--foreground)] transition-colors print:hidden"
    >
      🖨️ 인쇄 / PDF
    </button>
  );
}
