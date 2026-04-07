interface BadgeProps {
  label: string;
  variant?: "law" | "decree" | "rule" | "supreme" | "constitutional" | "default";
}

/* DESIGN.md: Badge Variants — soft background + colored text */
const VARIANTS: Record<string, string> = {
  law: "badge-law",
  decree: "badge-decree",
  rule: "badge-rule",
  supreme: "badge-supreme",
  constitutional: "badge-constitutional",
  default: "bg-[var(--muted-bg)] text-[var(--text-muted)]",
};

function getVariantFromLabel(label: string): string {
  if (label === "법률") return "law";
  if (label === "시행령" || label === "대통령령") return "decree";
  if (label === "시행규칙" || label.includes("부령")) return "rule";
  if (label.includes("대법원") || label.includes("고등법원") || label.includes("지방법원")) return "supreme";
  if (label.includes("헌법재판소") || label === "헌재") return "constitutional";
  return "default";
}

export default function Badge({ label, variant }: BadgeProps) {
  const v = variant || getVariantFromLabel(label);
  return (
    <span className={`badge ${VARIANTS[v] || VARIANTS.default}`}>
      {label}
    </span>
  );
}
