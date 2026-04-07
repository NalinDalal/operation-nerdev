import fs from "fs";
import Tesseract from "tesseract.js";

export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(filePath);
  } else if (mimeType.startsWith("image/")) {
    return extractTextFromImage(filePath);
  } else {
    throw new Error("Unsupported file type");
  }
}

async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const buffer = await fs.promises.readFile(filePath);
    const pdfModule = await import("pdf-parse");

    // Resolve possible export shapes from `pdf-parse` (CJS/ESM interop differences)
    const candidate = (pdfModule as any).default ?? pdfModule;

    // Newer pdf-parse versions export a `PDFParse` class.
    if ((pdfModule as any).PDFParse) {
      const PDFParse = (pdfModule as any).PDFParse as any;
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      return result?.text ?? (result as any) ?? "";
    }

    // Fallback: if module itself is callable (older versions)
    let parseFn: ((buf: Buffer) => Promise<any>) | undefined;
    const candidateFn = (pdfModule as any).default ?? pdfModule;
    if (typeof candidateFn === "function") {
      parseFn = candidateFn as any;
    } else if (candidateFn && typeof candidateFn.parse === "function") {
      parseFn = candidateFn.parse.bind(candidateFn);
    }

    if (!parseFn) {
      const keys = Object.keys(pdfModule).join(", ");
      throw new Error(
        `pdf-parse import did not expose a callable parser. Exports: ${keys}`,
      );
    }

    const data = await parseFn(buffer);
    return (data && (data.text ?? data)) as string;
  } catch (err: any) {
    throw new Error(`Error parsing PDF: ${err?.message ?? err}`);
  }
}

async function extractTextFromImage(filePath: string): Promise<string> {
  const {
    data: { text },
  } = await Tesseract.recognize(filePath);
  return text;
}
