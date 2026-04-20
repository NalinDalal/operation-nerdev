"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    Mail,
    FileSignature,
    FileCheck,
    ScanLine,
    Users,
    FileStack,
    ArrowRightLeft,
    Home,
    Link2,
    ChevronDown,
    X,
    Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const primaryNav = [
    { name: "Home", href: "/", icon: Home },
    { name: "Invoice", href: "/invoice", icon: FileText },
    { name: "Email", href: "/email", icon: Mail },
    { name: "Contracts", href: "/contracts", icon: FileSignature },
];

const secondaryNav = [
    { name: "Proposals", href: "/proposals", icon: FileCheck },
    { name: "Scope of Work", href: "/scope-of-work", icon: FileStack },
    { name: "Change Requests", href: "/change-request", icon: ArrowRightLeft },
    { name: "Parse", href: "/parse", icon: ScanLine },
    { name: "Sign Links", href: "/sign-links", icon: Link2 },
];

function NavLink({ item, isActive }: { item: { name: string; href: string; icon: React.ElementType }; isActive: boolean }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50"
            )}
        >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
        </Link>
    );
}

export function Nav({ title, subtitle, action }: { active?: string; title?: string; subtitle?: string; action?: React.ReactNode }) {
    const pathname = usePathname();
    const [moreOpen, setMoreOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isSecondary = (href: string) => !primaryNav.some(p => p.href === href);
    const currentPath = pathname || "/";

    return (
        <>
            <nav className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-2.5">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-[var(--lavender-deep)]">
                                <img src="/logo-dark.png" alt="Logo" width={20} height={20} className="object-contain brightness-0 invert" />
                            </div>
                            {title ? (
                                <div className="hidden sm:block">
                                    <h1 className="text-base font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
                                        {title}
                                    </h1>
                                    {subtitle && <p className="text-xs text-[var(--muted-foreground)] hidden lg:block">{subtitle}</p>}
                                </div>
                            ) : (
                                <span className="font-semibold text-base text-[var(--foreground)] hidden sm:block" style={{ fontFamily: "var(--font-display)" }}>
                                    NerDev
                                </span>
                            )}
                        </Link>

                        <div className="hidden xl:flex items-center gap-1 p-1 bg-[var(--muted)] rounded-xl">
                            {primaryNav.map((item) => (
                                <NavLink key={item.href} item={item} isActive={currentPath === item.href} />
                            ))}
                            <div className="relative">
                                <button
                                    onClick={() => setMoreOpen(!moreOpen)}
                                    className={cn(
                                        "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                                        moreOpen || isSecondary(currentPath)
                                            ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                                            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50"
                                    )}
                                >
                                    <span className="truncate">More</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {moreOpen && (
                                    <div className="absolute top-full right-0 mt-1 w-56 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg p-1.5 animate-scale-in origin-top-right">
                                        {secondaryNav.map((item) => (
                                            <NavLink key={item.href} item={item} isActive={currentPath === item.href} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            {action}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="xl:hidden p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] xl:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    <div className="fixed right-0 top-0 bottom-0 w-72 bg-[var(--card)] border-l border-[var(--border)] shadow-xl p-4 animate-slide-in-left overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-[var(--lavender-deep)]">
                                    <img src="/logo-dark.png" alt="Logo" width={20} height={20} className="object-contain brightness-0 invert" />
                                </div>
                                <span className="font-semibold text-base" style={{ fontFamily: "var(--font-display)" }}>NerDev</span>
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-1 mb-4">
                            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2">Primary</p>
                            {primaryNav.map((item) => (
                                <NavLink key={item.href} item={item} isActive={currentPath === item.href} />
                            ))}
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2">More Tools</p>
                            {secondaryNav.map((item) => (
                                <NavLink key={item.href} item={item} isActive={currentPath === item.href} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
