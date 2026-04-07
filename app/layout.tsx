import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Link from "next/link";
import { FileText, Mail } from "lucide-react";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invoice Creator",
  description: "Create invoices and send emails effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}

export function Nav({ active }: { active: 'invoice' | 'email' | 'parse' }) {
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
          </div>
          <div className="w-[120px]" />
        </div>
      </div>
    </nav>
  );
}