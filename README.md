Invoice Site

A small Next.js app that extracts structured invoice data from uploaded PDF or image files and displays the parsed invoice information.

## What it does

- Accepts a PDF or image upload from the user.
- Extracts text from the file (PDF parsing + OCR for images).
- Sends the extracted text to an LLM (via `@instructor-ai/instructor` + OpenAI) to parse the invoice into a typed schema (customer, products, totals, currency).
- Returns and displays the structured invoice data in the browser.

## How it works (high level)

- Frontend: Next.js App Router (`app/`) provides the UI in `app/page.tsx`.
- API: `app/api/invoice-extract.ts` handles `POST` multipart uploads using `formidable`, extracts text using utilities in `utils/extract.ts`, then calls the Instructor/OpenAI client to parse the invoice fields using `zod` schemas.
- Storage: uploads are handled as temporary files and cleaned up after parsing.

## Key files

- `app/page.tsx` — upload form and UI components.
- `app/api/invoice-extract.ts` — API handler for processing file uploads.
- `utils/extract.ts` — helper that extracts text from PDFs and images (PDF parsing, Tesseract OCR, or Google Vision depending on availability).
- `utils/types.ts` — TypeScript types for the parsed invoice data.

## Environment

Set the following environment variables before running locally:

- `OPENAI_API_KEY` — required to call the OpenAI API.
- `OPENAI_MODEL` — (optional) preferred OpenAI model to use. Defaults to `gpt-4`.
- `OPENAI_FALLBACK_MODEL` — (optional) fallback model used if preferred model isn't available. Defaults to `gpt-4o-mini`.

Create a local `.env` file from `.env.example` and fill in values. Do NOT commit your `.env` file.

Optional / recommended:

- Credentials for Google Cloud Vision if you prefer Vision OCR over Tesseract.

## Install and run

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Visit http://localhost:3000 in your browser.

To build and run production:

```bash
npm run build
npm start
```

## Dependencies

Some notable packages used in this project:

- `next`, `react`, `react-dom` — Next.js framework
- `formidable` — parse multipart file uploads in API route
- `pdf-parse` — extract text from PDFs
- `tesseract.js` and/or `@google-cloud/vision` — OCR for images
- `@instructor-ai/instructor` and `openai` — call LLM to parse invoice into a schema
- `zod` — schema validation for parsed invoice data

## Notes & troubleshooting

- The project currently uses an API handler at `app/api/invoice-extract.ts`. In Next.js App Router, route segment config like `export const config = { api: { bodyParser: false }}` belongs in API route modules (or should be expressed via app-route `route.ts`). If you see a deprecation warning about `export const config` in pages/components, remove it from UI files and keep API-related config in the API route file.
- If uploads fail, check that `formidable` can write temporary files (permissions) and that `OPENAI_API_KEY` is set.
- For large files or longer parsing time, also check any platform-specific request timeout settings.

## License

This repository has no license set. Add one if you plan to publish or share the code.

---

Problem: OpenAI API is not authenticated, i don't have it