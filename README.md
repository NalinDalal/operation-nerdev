Invoice Site

A Next.js invoice app that works completely offline - no API keys required.

## What it does

### Mode 1: Invoice Creator (`/`)
- Build invoices with a form-based interface
- Fields: From/To (name, email, tax ID, address), Invoice #/date/due date/title, currency
- Dynamic line items with name, description, price, quantity, discount %
- Invoice-level discount % and advance paid
- Bank details (account name, number, SWIFT/IFSC)
- Notes
- Live preview panel with real-time rendering
- Print/Save as PDF button (uses `@media print` CSS)

### Mode 2: Invoice Parser (`/parse`)
- Upload PDF or image
- Extracts text using pdf-parse (PDF) or Tesseract.js (OCR for images)
- Rule-based parsing with regex/heuristics (no LLM)
- Maps common invoice fields to structured data
- "Edit in Creator" button to pre-fill the form

## Key files

- `app/page.tsx` — Invoice Creator form and live preview
- `app/parse/page.tsx` — Invoice Parser with regex extraction
- `app/api/extract-text/route.ts` — Text extraction API
- `utils/extract.ts` — PDF parsing + OCR utilities
- `utils/types.ts` — TypeScript types

## Install and run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Dependencies

- `next`, `react`, `react-dom` — Next.js framework
- `formidable` — parse multipart uploads
- `pdf-parse` — extract text from PDFs
- `tesseract.js` — OCR for images
- `zod` — schema validation

No API keys required - works completely offline!
