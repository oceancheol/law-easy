export default function Loading({ text = "검색 중..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin mb-4" />
      <p className="text-[var(--text-muted)] text-sm">{text}</p>
    </div>
  );
}
