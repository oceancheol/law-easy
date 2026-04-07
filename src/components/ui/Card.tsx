import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: "default" | "law";
}

export default function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
  variant = "default",
}: CardProps) {
  const base = "card";
  const hoverClass = hoverable ? "card-hoverable cursor-pointer" : "";
  const variantClass = variant === "law" ? "law-card" : "";

  return (
    <div
      onClick={onClick}
      className={`${base} ${hoverClass} ${variantClass} ${className}`}
    >
      {children}
    </div>
  );
}
