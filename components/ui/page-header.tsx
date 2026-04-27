"use client";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 
          className="text-xl font-semibold text-[var(--foreground)]" 
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{subtitle}</p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}