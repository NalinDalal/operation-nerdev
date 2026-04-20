"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Nav } from "@/components/nav";
import { 
  FileText, 
  Mail, 
  ScanLine, 
  FileSignature, 
  FileCheck, 
  FileStack, 
  ArrowRightLeft, 
  Users, 
  Link2,
  Clock,
  Send,
  FileDigit
} from "lucide-react";

interface Stats {
  invoicesSent: number;
  contractsDrafted: number;
  lastActive: string;
}

const primaryTools = [
  { name: "Invoice", description: "Create & send invoices", icon: FileText, href: "/invoice" },
  { name: "Email", description: "Send templated emails", icon: Mail, href: "/email" },
  { name: "Contracts", description: "Draft freelance contracts", icon: FileSignature, href: "/contracts" },
  { name: "Clients", description: "Track your pipeline", icon: Users, href: "/clients" },
];

const secondaryTools = [
  { name: "Proposals", description: "Generate proposals", icon: FileCheck, href: "/proposals" },
  { name: "Scope of Work", description: "Detailed SoW generator", icon: FileStack, href: "/scope-of-work" },
  { name: "Change Requests", description: "Scope change forms", icon: ArrowRightLeft, href: "/change-request" },
  { name: "Parse", description: "OCR invoice parser", icon: ScanLine, href: "/parse" },
  { name: "Sign Links", description: "E-signature links", icon: Link2, href: "/sign-links" },
];

const docsLinks = [
  { name: "Contract Template", href: "/docs/contracts/freelance-contract-template.md" },
  { name: "Proposal Template", href: "/docs/proposals/proposal-template-inr.md" },
  { name: "Pricing Guide", href: "/docs/pricing-reference.md" },
  { name: "Discovery Questions", href: "/docs/discovery-call-questions.md" },
  { name: "Onboarding Flow", href: "/docs/client-onboarding-flow.md" },
];

function getStats(): Stats {
  try {
    const stored = localStorage.getItem("nerdev_stats");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {}
  return { invoicesSent: 0, contractsDrafted: 0, lastActive: "" };
}

function formatLastActive(dateStr: string): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ invoicesSent: 0, contractsDrafted: 0, lastActive: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getStats());
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Nav />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 overflow-hidden bg-[var(--lavender-deep)] shadow-lg shadow-[var(--lavender-deep)]/20">
            <img src="/logo-dark.png" alt="NerDev" width={56} height={56} className="object-contain brightness-0 invert" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Your dev studio, organized.
          </h1>
          <p className="text-lg lg:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto">
            Invoices, contracts, proposals, emails — everything in one place.
          </p>
        </div>

        {mounted && (
          <div className="flex items-center justify-center gap-6 mb-10 text-sm flex-wrap">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <Send className="w-4 h-4" />
              <span>{stats.invoicesSent} invoice{stats.invoicesSent !== 1 ? 's' : ''} sent</span>
            </div>
            <span className="text-[var(--border)]">·</span>
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <FileDigit className="w-4 h-4" />
              <span>{stats.contractsDrafted} contract{stats.contractsDrafted !== 1 ? 's' : ''} drafted</span>
            </div>
            <span className="text-[var(--border)]">·</span>
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <Clock className="w-4 h-4" />
              <span>Last active {formatLastActive(stats.lastActive)}</span>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-5 text-center">
            Primary Tools
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {primaryTools.map((tool, index) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--lavender-deep)]/30 hover:shadow-lg hover:shadow-[var(--lavender-deep)]/10 transition-all duration-200 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[var(--lavender-deep)]/10 flex items-center justify-center group-hover:bg-[var(--lavender-deep)] transition-colors flex-shrink-0">
                    <tool.icon className="w-5 h-5 text-[var(--lavender-deep)] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--lavender-deep)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                      {tool.name}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-5 text-center">
            Additional Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {secondaryTools.map((tool, index) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--lavender-deep)]/20 hover:shadow-md transition-all duration-200 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${(index + 4) * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--secondary)] flex items-center justify-center group-hover:bg-[var(--lavender-deep)]/10 transition-colors flex-shrink-0">
                    <tool.icon className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--lavender-deep)] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-[var(--foreground)] group-hover:text-[var(--lavender-deep)] transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-4 justify-center text-sm text-[var(--muted-foreground)]">
            {docsLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link href={link.href} className="hover:text-[var(--lavender-deep)] transition-colors">
                  {link.name}
                </Link>
                {index < docsLinks.length - 1 && <span>·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}