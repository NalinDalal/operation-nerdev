"use client";
import Link from "next/link";
import { FileText, Mail, FileSignature, FileCheck, ScanLine, Users, FileStack, ArrowRightLeft, Home } from "lucide-react";

export function Nav({ active }: { active: 'home' | 'invoice' | 'email' | 'parse' | 'contracts' | 'proposals' | 'scope-of-work' | 'change-request' | 'clients' | 'sign-links' }) {
  return (
    <nav className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/logo-dark.png" alt="Logo" width={32} height={32} className="object-contain" />
              </div>
              <span className="font-semibold text-lg" style={{ fontFamily: "var(--font-display)" }}>
                NerDev Tools
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1 p-1 bg-[var(--background)] rounded-lg border border-[var(--border)]">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                active === 'home'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
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
              <span className="text-xs">OCR</span>
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
              href="/scope-of-work"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                active === 'scope-of-work'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <FileStack className="w-4 h-4" />
              <span className="text-xs">SoW</span>
            </Link>
            <Link
              href="/change-request"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                active === 'change-request'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="text-xs">CR</span>
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
            <Link
              href="/sign-links"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                active === 'sign-links'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span className="text-xs">Sign</span>
            </Link>
          </div>
          <div className="w-[120px]" />
        </div>
      </div>
    </nav>
  );
}
