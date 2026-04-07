"use client";
import Link from "next/link";
import { FileText, Mail, ScanLine, FileSignature, FileCheck, Users, FileStack, ArrowRightLeft, Home, Settings } from "lucide-react";
import { Button } from "./button";

interface HeaderProps {
  title: string;
  subtitle: string;
  active?: string;
  showNav?: boolean;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, active, showNav = true, action }: HeaderProps) {
  return (
    <div className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/logo-dark.png" alt="Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {title}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">{subtitle}</p>
            </div>
          </Link>
          
          {showNav && (
            <div className="flex items-center gap-1 p-1 bg-[var(--background)] rounded-lg border border-[var(--border)]">
              <Link
                href="/invoice"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active === 'invoice'
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <FileText className="w-4 h-4" />
                Invoice
              </Link>
              <Link
                href="/email"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active === 'email'
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </Link>
              <Link
                href="/parse"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active === 'parse'
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <ScanLine className="w-4 h-4" />
                Parse
              </Link>
              <Link
                href="/contracts"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active === 'contracts'
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <FileSignature className="w-4 h-4" />
                <span className="text-xs">Contracts</span>
              </Link>
              <Link
                href="/proposals"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active === 'proposals'
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span className="text-xs">Proposals</span>
              </Link>
              <Link
                href="/clients"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active === 'clients'
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-xs">CRM</span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3">
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
