"use client";
import Link from "next/link";
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
      <Nav active="home" />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 overflow-hidden bg-[#4c3d6e] shadow-lg shadow-[#4c3d6e]/20">
            <img src="/logo-dark.png" alt="NerDev" width={56} height={56} className="object-contain brightness-0 invert" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
            NerDev Tools
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Everything you need to run your dev studio — from proposals to payments.
          </p>
        </div>

        <div className="grid gap-10">
          {services.map((category) => (
            <div key={category.category}>
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-5">
                {category.category}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.items.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="group bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 hover:border-[#4c3d6e]/30 hover:shadow-lg hover:shadow-[#4c3d6e]/10 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#4c3d6e]/10 flex items-center justify-center group-hover:bg-[#4c3d6e] transition-colors">
                        <service.icon className="w-5 h-5 text-[#4c3d6e] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[#4c3d6e] transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[#4c3d6e] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-4 justify-center text-sm text-[var(--muted-foreground)]">
            <Link href="/docs/contracts/freelance-contract-template.md" className="hover:text-[#4c3d6e] transition-colors">Contract Template</Link>
            <span>•</span>
            <Link href="/docs/proposals/proposal-template-inr.md" className="hover:text-[#4c3d6e] transition-colors">Proposal Template</Link>
            <span>•</span>
            <Link href="/docs/pricing-reference.md" className="hover:text-[#4c3d6e] transition-colors">Pricing Guide</Link>
            <span>•</span>
            <Link href="/docs/discovery-call-questions.md" className="hover:text-[#4c3d6e] transition-colors">Discovery Questions</Link>
            <span>•</span>
            <Link href="/docs/client-onboarding-flow.md" className="hover:text-[#4c3d6e] transition-colors">Onboarding Flow</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
