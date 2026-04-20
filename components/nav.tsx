"use client";
import React from "react";
import Link from "next/link";
import { FileText, Mail, FileSignature, FileCheck, ScanLine, Users, FileStack, ArrowRightLeft, Home } from "lucide-react";

export function Nav({ active, title, subtitle, action }: { active?: 'home' | 'invoice' | 'email' | 'parse' | 'contracts' | 'proposals' | 'scope-of-work' | 'change-request' | 'clients' | 'sign-links'; title?: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <nav className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {title ? (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden bg-[var(--lavender-deep)]">
                <img src="/logo-dark.png" alt="Logo" width={24} height={24} className="object-contain brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
                  {title}
                </h1>
                {subtitle && <p className="text-xs text-[var(--muted-foreground)]">{subtitle}</p>}
              </div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden bg-[var(--lavender-deep)]">
                <img src="/logo-dark.png" alt="Logo" width={24} height={24} className="object-contain brightness-0 invert" />
              </div>
              <span className="font-semibold text-lg text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
                NerDev Tools
              </span>
            </Link>
          )}
          <div className="flex items-center gap-1 p-1.5 bg-[var(--muted)] rounded-xl">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'home'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/invoice"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'invoice'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Invoice</span>
            </Link>
            <Link
              href="/email"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'email'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </Link>
            <Link
              href="/parse"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'parse'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              <span className="hidden sm:inline">OCR</span>
            </Link>
            <Link
              href="/contracts"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'contracts'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span className="hidden sm:inline">Contracts</span>
            </Link>
            <Link
              href="/proposals"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'proposals'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Proposals</span>
            </Link>
            <Link
              href="/scope-of-work"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'scope-of-work'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <FileStack className="w-4 h-4" />
              <span className="hidden sm:inline">SoW</span>
            </Link>
            <Link
              href="/change-request"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'change-request'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">CR</span>
            </Link>
            <Link
              href="/clients"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'clients'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">CRM</span>
            </Link>
            <Link
              href="/sign-links"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === 'sign-links'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span className="hidden sm:inline">Sign</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {action}
          </div>
        </div>
      </div>
    </nav>
  );
}
