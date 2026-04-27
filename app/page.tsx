"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SidebarLayout } from "@/components/sidebar";
import {
    FileText,
    Mail,
    ScanLine,
    FileSignature,
    FileCheck,
    FileStack,
    ArrowRightLeft,
    Link2,
    Send,
    FileDigit,
    Plus
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
];

const secondaryTools = [
    { name: "Proposals", description: "Generate proposals", icon: FileCheck, href: "/proposals" },
    { name: "Scope of Work", description: "Detailed SoW generator", icon: FileStack, href: "/scope-of-work" },
    { name: "Change Requests", description: "Scope change forms", icon: ArrowRightLeft, href: "/change-request" },
    { name: "Parse", description: "OCR invoice parser", icon: ScanLine, href: "/parse" },
    { name: "Sign Links", description: "E-signature links", icon: Link2, href: "/sign-links" },
];

function getStats(): Stats {
    try {
        const stored = localStorage.getItem("nerdev_stats");
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) { }
    return { invoicesSent: 0, contractsDrafted: 0, lastActive: "" };
}

export default function HomePage() {
    const [stats, setStats] = useState<Stats>({ invoicesSent: 0, contractsDrafted: 0, lastActive: "" });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setStats(getStats());
    }, []);

    return (
        <SidebarLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-semibold text-[var(--foreground)] mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
                        Your dev studio.
                    </h1>
                    <p className="text-[var(--muted-foreground)]">
                        Invoices, contracts, proposals, emails — organized.
                    </p>
                </div>

                {mounted && (
                    <div className="flex items-center gap-8 mb-10 text-sm">
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                            <Send className="w-4 h-4" />
                            <span className="mono text-xs">{stats.invoicesSent}</span>
                            <span className="text-xs text-[var(--muted-foreground)]">invoices</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                            <FileDigit className="w-4 h-4" />
                            <span className="mono text-xs">{stats.contractsDrafted}</span>
                            <span className="text-xs text-[var(--muted-foreground)]">contracts</span>
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <h2 className="fv-head">Primary Tools</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {primaryTools.map((tool) => (
                            <Link
                                key={tool.name}
                                href={tool.href}
                                className="group fv-panel hover:border-[var(--accent-warm)] transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--fog)] flex items-center justify-center group-hover:bg-[var(--accent-warm)] transition-colors">
                                        <tool.icon className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                                <h3 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "var(--font-fraunces)" }}>
                                    {tool.name}
                                </h3>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    {tool.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="fv-head">Additional Tools</h2>
                    <div className="grid grid-cols-5 gap-3">
                        {secondaryTools.map((tool) => (
                            <Link
                                key={tool.name}
                                href={tool.href}
                                className="group fv-panel p-4 hover:border-[var(--accent-warm)] transition-colors text-center"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[var(--fog)] flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--accent-warm)] transition-colors">
                                    <tool.icon className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-medium text-sm text-[var(--foreground)] group-hover:text-[var(--accent-warm)] transition-colors">
                                    {tool.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
