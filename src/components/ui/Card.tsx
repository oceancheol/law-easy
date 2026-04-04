import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-5 shadow-sm ${
        hoverable
          ? "cursor-pointer hover:shadow-md hover:border-[var(--primary)] transition-all"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
