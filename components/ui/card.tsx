"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-[var(--card)] border border-[var(--border)] rounded-xl p-6",
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("mb-4 pb-3 border-b border-[var(--border)]", className)}>
      <h2 
        className="text-lg font-medium text-[var(--foreground)]"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {children}
      </h2>
    </div>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={className}>{children}</div>;
}