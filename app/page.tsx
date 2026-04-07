"use client";
import Link from "next/link";
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
  ArrowRight
} from "lucide-react";

const services = [
  {
    category: "Client Acquisition",
    items: [
      { name: "Outreach", description: "Email templates for cold outreach", icon: Mail, href: "/docs/outreach" },
      { name: "Proposals", description: "Generate professional proposals", icon: FileCheck, href: "/proposals" },
    ]
  },
  {
    category: "Sales Documents",
    items: [
      { name: "Contracts", description: "Freelance & international contracts", icon: FileSignature, href: "/contracts" },
      { name: "Scope of Work", description: "Detailed SoW generator", icon: FileStack, href: "/scope-of-work" },
      { name: "Change Requests", description: "Scope change forms", icon: ArrowRightLeft, href: "/change-request" },
    ]
  },
  {
    category: "E-Signatures",
    items: [
      { name: "Sign Links", description: "Generate signing links", icon: Link2, href: "/sign-links" },
    ]
  },
  {
    category: "Operations",
    items: [
      { name: "Invoice", description: "Create and send invoices", icon: FileText, href: "/invoice" },
      { name: "Email", description: "Send emails to clients", icon: Mail, href: "/email" },
      { name: "Parse", description: "OCR invoice parser", icon: ScanLine, href: "/parse" },
    ]
  },
  {
    category: "Client Management",
    items: [
      { name: "CRM", description: "Track clients and pipeline", icon: Users, href: "/clients" },
    ]
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img src="/logo-dark.png" alt="NerDev" width={64} height={64} className="object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
            NerDev Tools
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Everything you need to run your dev studio — from proposals to payments.
          </p>
        </div>

        <div className="grid gap-10">
          {services.map((category) => (
            <div key={category.category}>
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
                {category.category}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="group bg-[var(--card)] border-[var(--border)] rounded-xl p-5 hover:border-[var(--muted-foreground)] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--background)] flex items-center justify-center group-hover:bg-[var(--muted-foreground)] transition-colors">
                        <service.icon className="w-5 h-5 text-[var(--foreground)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--foreground)]">
                          {service.name}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">
                          {service.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-4 justify-center text-sm text-[var(--muted-foreground)]">
            <Link href="/docs/contracts/freelance-contract-template.md" className="hover:text-[var(--foreground)]">Contract Template</Link>
            <span>•</span>
            <Link href="/docs/proposals/proposal-template-inr.md" className="hover:text-[var(--foreground)]">Proposal Template</Link>
            <span>•</span>
            <Link href="/docs/pricing-reference.md" className="hover:text-[var(--foreground)]">Pricing Guide</Link>
            <span>•</span>
            <Link href="/docs/discovery-call-questions.md" className="hover:text-[var(--foreground)]">Discovery Questions</Link>
            <span>•</span>
            <Link href="/docs/client-onboarding-flow.md" className="hover:text-[var(--foreground)]">Onboarding Flow</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
