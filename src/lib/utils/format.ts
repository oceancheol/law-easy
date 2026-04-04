export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const cleaned = dateStr.replace(/[^0-9]/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 6)}.${cleaned.slice(6, 8)}`;
  }
  return dateStr;
}

export function highlightText(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, '<mark class="bg-accent-yellow/30 px-0.5 rounded">$1</mark>');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getLawTypeBadgeColor(type: string): string {
  switch (type) {
    case "법률":
      return "bg-primary text-white";
    case "시행령":
      return "bg-accent-green text-white";
    case "시행규칙":
      return "bg-accent-yellow text-white";
    default:
      return "bg-muted text-white";
  }
}
