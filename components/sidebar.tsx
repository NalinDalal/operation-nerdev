"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    Mail,
    FileSignature,
    FileCheck,
    ScanLine,
    Link2,
    ArrowRightLeft,
    FileStack,
    LayoutDashboard,
    Settings,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const primaryNav = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Invoice", href: "/invoice", icon: FileText },
    { name: "Email", href: "/email", icon: Mail },
    { name: "Contracts", href: "/contracts", icon: FileSignature },
];

const secondaryNav = [
    { name: "Proposals", href: "/proposals", icon: FileCheck },
    { name: "Scope of Work", href: "/scope-of-work", icon: FileStack },
    { name: "Change Requests", href: "/change-request", icon: ArrowRightLeft },
    { name: "Parse Invoice", href: "/parse", icon: ScanLine },
    { name: "Sign Links", href: "/sign-links", icon: Link2 },
];

function SidebarLink({ item, isActive }: { item: { name: string; href: string; icon: React.ElementType }; isActive: boolean }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                isActive
                    ? "bg-white/[0.13] text-white font-medium shadow-[inset_2px_0_0_var(--accent-warm)] rounded-r-lg rounded-l-none"
                    : "text-white/70 hover:text-white hover:bg-white/10"
            )}
        >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
        </Link>
    );
}

export function SidebarLayout({ children, title, action }: { children: React.ReactNode; title?: string; subtitle?: string; action?: React.ReactNode }) {
    const pathname = usePathname() || "/";

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 flex-shrink-0 bg-[var(--charcoal)] text-white flex flex-col">
                <div className="p-5 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-3">
                        <Logo size={36} className="rounded-lg" />
                        <div>
                            <span className="font-semibold text-base" style={{ fontFamily: "var(--font-fraunces)" }}>
                                NerDev
                            </span>
                            <p className="text-[10px] text-white/50 font-mono uppercase tracking-wider">Operations</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1 mb-6">
                        {primaryNav.map((item) => (
                            <SidebarLink key={item.href} item={item} isActive={pathname === item.href} />
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-white/45">
                            More Tools
                        </p>
                        <div className="space-y-1">
                            {secondaryNav.map((item) => (
                                <SidebarLink key={item.href} item={item} isActive={pathname === item.href} />
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link
                        href="/docs/outreach"
                        className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors mb-3"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Documentation</span>
                    </Link>
                    <button className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors w-full">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                {title && (
                    <header className="bg-[var(--card)] border-b border-[var(--border)] px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-fraunces)" }}>
                                    {title}
                                </h1>
                                {action && <div className="mt-1">{action}</div>}
                            </div>
                            {action && <div className="ml-auto">{action}</div>}
                        </div>
                    </header>
                )}
                <div className="flex-1 p-6 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

export function useSidebarLayout() {
    return SidebarLayout;
}
