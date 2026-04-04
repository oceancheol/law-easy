interface BadgeProps {
  label: string;
  variant?: "law" | "decree" | "rule" | "default" | "court";
}

const VARIANTS: Record<string, string> = {
  law: "bg-[var(--primary)] text-white",
  decree: "bg-[var(--accent-green)] text-white",
  rule: "bg-[var(--accent-yellow)] text-white",
  court: "bg-[var(--foreground)] text-white",
  default: "bg-[var(--text-muted)] text-white",
};

function getVariantFromLabel(label: string): string {
  if (label === "법률") return "law";
  if (label === "시행령" || label === "대통령령") return "decree";
  if (label === "시행규칙" || label.includes("부령")) return "rule";
  if (label.includes("법원") || label.includes("헌법")) return "court";
  return "default";
}

export default function Badge({ label, variant }: BadgeProps) {
  const v = variant || getVariantFromLabel(label);
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${VARIANTS[v] || VARIANTS.default}`}
    >
      {label}
    </span>
  );
}
