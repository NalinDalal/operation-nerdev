"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline";
}

export function PrimaryButton({ 
  children, 
  variant = "default",
  className,
  ...props 
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        variant === "default" 
          ? "bg-[var(--accent-warm)] text-[var(--charcoal)] hover:opacity-90"
          : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}