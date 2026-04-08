import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/nav";

interface DocPageProps {
  params: Promise<{ slug: string[] }>;
}

const DOCS_DIR = path.join(process.cwd(), "docs");

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const cleanSlug = slug?.map(s => s.replace(/\.md$/, "")) || ["outreach"];
  const docPath = path.join(DOCS_DIR, `${cleanSlug.join("/")}.md`);

  if (!fs.existsSync(docPath)) {
    notFound();
  }

  const content = fs.readFileSync(docPath, "utf-8");
  const fileName = cleanSlug[cleanSlug.length - 1];
  const title = fileName.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const lines = content.split("\n");
  let inList = false;
  const processedContent = lines.map((line) => {
    if (line.startsWith("# ")) {
      inList = false;
      return `<h1 class="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>${line.slice(2)}</h1>`;
    }
    if (line.startsWith("## ")) {
      inList = false;
      return `<h2 class="text-xl font-semibold mt-8 mb-4 pb-2 border-b border-[var(--border)]">${line.slice(3)}</h2>`;
    }
    if (line.startsWith("### ")) {
      inList = false;
      return `<h3 class="text-lg font-medium mt-6 mb-3 text-[var(--foreground)]">${line.slice(4)}</h3>`;
    }
    if (line.trim() === "---") {
      inList = false;
      return `<hr class="my-8 border-[var(--border)]" />`;
    }
    if (line.startsWith("**Subject:**")) {
      inList = false;
      return `<div class="mt-4 mb-2"><span class="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Subject:</span><p class="font-semibold text-[var(--foreground)]">${line.replace("**Subject:**", "").trim()}</p></div>`;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) { inList = true; return `<ul class="my-2 space-y-1">${`<li class="ml-4 list-disc">${line.slice(2)}</li>`}`; }
      return `<li class="ml-4 list-disc">${line.slice(2)}</li>`;
    }
    if (line.match(/^\d+\. /)) {
      if (!inList) { inList = true; return `<ol class="my-2 space-y-1">${`<li class="ml-4 list-decimal">${line.replace(/^\d+\. /, "")}</li>`}`; }
      return `<li class="ml-4 list-decimal">${line.replace(/^\d+\. /, "")}</li>`;
    }
    if (inList && line.trim() === "") {
      inList = false;
      return `</ul><p />`;
    }
    if (line.trim() === "") {
      inList = false;
      return "";
    }
    let text = line
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-[var(--foreground)]">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-[var(--background)] text-[var(--muted-foreground)] rounded text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
    return `<p class="my-3 leading-relaxed text-[var(--foreground)]">${text}</p>`;
  }).join("\n").replace(/<\/ul>\s*<p \/>/g, "</ul>").replace(/<\/ol>\s*<p \/>/g, "</ol>");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Nav title="Documentation" subtitle="Templates and guides" />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 lg:p-12 shadow-sm">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-[var(--border)]" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </h1>
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: processedContent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
