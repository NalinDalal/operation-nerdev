# NerDev Operations

A Next.js app for NerDev — a software development studio. Handles invoicing, contracts, proposals, and client management.

## Features

### Invoice Creator (`/`)
- Build invoices with a form-based interface
- Fields: From/To (name, email, tax ID, address), Invoice #/date/due date/title, currency
- Dynamic line items with name, description, price, quantity, discount %
- Invoice-level discount % and advance paid
- Bank details (account name, number, SWIFT/IFSC)
- Notes
- Live preview panel with real-time rendering
- Print/Save as PDF button (uses `@media print` CSS)

### Invoice Parser (`/parse`)
- Upload PDF or image
- Extracts text using pdf-parse (PDF) or Tesseract.js (OCR for images)
- Rule-based parsing with regex/heuristics (no LLM)
- Maps common invoice fields to structured data
- "Edit in Creator" button to pre-fill the form

### Contract Generator (`/contracts`)
- Generate freelance development contracts
- Supports both INR (domestic) and USD (international) clients
- PDF export with @react-pdf/renderer

### Proposal Generator (`/proposals`)
- Create professional project proposals
- Supports both INR and USD currencies
- PDF export

## Project Structure

```
├── app/
│   ├── page.tsx              — Invoice Creator
│   ├── parse/page.tsx        — Invoice Parser
│   ├── contracts/page.tsx   — Contract Generator
│   └── proposals/page.tsx   — Proposal Generator
├── docs/
│   ├── contracts/            — Contract templates (Markdown)
│   └── proposals/            — Proposal templates (Markdown)
├── lib/
│   ├── contracts/            — Contract PDF generator
│   └── proposals/            — Proposal PDF generator
├── utils/
│   ├── extract.ts            — PDF parsing + OCR utilities
│   └── types.ts              — TypeScript types
└── public/
```

## Templates

Markdown templates for contracts and proposals are in `docs/`:
- `docs/contracts/freelance-contract-template.md` — Domestic (INR)
- `docs/contracts/international-contract-template.md` — International (USD)
- `docs/proposals/proposal-template-inr.md` — Proposal INR
- `docs/proposals/proposal-template-usd.md` — Proposal USD
- `docs/pricing-reference.md` — Internal pricing guide

## Install and Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Build for Production

```bash
npm run build
npm start
```

## Dependencies

- `next`, `react`, `react-dom` — Next.js framework
- `@react-pdf/renderer` — PDF generation
- `formidable` — parse multipart uploads
- `pdf-parse` — extract text from PDFs
- `tesseract.js` — OCR for images
- `zod` — schema validation

No external API keys required - works offline!
