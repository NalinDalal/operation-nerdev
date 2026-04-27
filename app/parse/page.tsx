"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/card";
import { Loader2, Upload, ArrowRight, FileText, AlertCircle } from "lucide-react";
import { InvoiceData, InvoiceFormData } from "@/utils/types";
import { Nav } from "@/components/nav";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function parseInvoiceText(text: string): Partial<InvoiceData> {
  const result: Partial<InvoiceData> = {
    products: [],
    currency: "INR",
  };

  const namePatterns = [
    /(?:bill to|client|customer|to:|name)[\s:]*([^\n]+)/i,
    /^([A-Z][a-zA-Z\s]{2,})$/m,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.customerName = match[1].trim();
      break;
    }
  }

  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailPattern);
  if (emailMatch) {
    result.customerEmail = emailMatch[0];
  }

  const addressLines: string[] = [];
  const addressPattern = /(?:address|location)[\s:]*([^\n]+)/i;
  const addressMatch = text.match(addressPattern);
  if (addressMatch) {
    addressLines.push(addressMatch[1].trim());
  }
  const likelyAddress = text.match(/(\d+[\s,][A-Za-z\s,]+,\s*\d{5,})/);
  if (likelyAddress && !addressLines.includes(likelyAddress[0])) {
    addressLines.push(likelyAddress[0]);
  }
  if (addressLines.length > 0) {
    result.customerAddress = addressLines.join(", ");
  }

  const invoiceNumPatterns = [
    /(?:invoice|inv|no\.?|#)[\s#]*([A-Z0-9-]+)/i,
    /(?:invoice|inv)[^\d]*(\d+)/i,
  ];
  const invoiceNumMatch = text.match(invoiceNumPatterns[0]) || text.match(invoiceNumPatterns[1]);
  if (invoiceNumMatch) {
    result.invoiceNumber = invoiceNumMatch[1] || invoiceNumMatch[0];
  }

  const datePatterns = [
    /(?:date|dated)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
  ];
  const dateMatch = text.match(datePatterns[0]) || text.match(datePatterns[1]);
  if (dateMatch) {
    result.invoiceDate = dateMatch[1];
  }

  const dueDatePatterns = [
    /(?:due|payment due|pay by)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  ];
  const dueDateMatch = text.match(dueDatePatterns[0]);
  if (dueDateMatch) {
    result.dueDate = dueDateMatch[1];
  }

  if (/\$|USD/.test(text)) {
    result.currency = "USD";
  } else if (/€|EUR/.test(text)) {
    result.currency = "EUR";
  } else if (/£|GBP/.test(text)) {
    result.currency = "GBP";
  } else if (/₹|Rs\.?|INR/.test(text)) {
    result.currency = "INR";
  }

  const amountPatterns = [
    /(?:total|amount|grand total|balance due)[\s:]*[$€£₹]?\s*([\d,]+\.?\d*)/i,
    /(?:₹|Rs\.?)\s*([\d,]+\.?\d*)/,
    /\$([\d,]+\.?\d*)/,
    /€([\d,]+\.?\d*)/,
    /£([\d,]+\.?\d*)/,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(amount) && amount > 0) {
        result.totalAmount = amount;
        break;
      }
    }
  }

  const quantityPricePattern = /([A-Za-z\s]+?)\s+(\d+)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/g;
  let match;
  while ((match = quantityPricePattern.exec(text)) !== null && result.products!.length < 20) {
    const name = match[1].trim();
    const qty = parseInt(match[2]);
    const price = parseFloat(match[3].replace(/,/g, ""));
    if (name && qty && price) {
      result.products!.push({
        name,
        quantity: qty,
        price,
        discountPercent: 0,
      });
    }
  }

  if (result.products!.length === 0) {
    const itemLinePattern = /([A-Za-z][A-Za-z0-9\s\-&]{2,50})\s+(\d+)\s+([\d,]+\.?\d*)/g;
    while ((match = itemLinePattern.exec(text)) !== null && result.products!.length < 20) {
      const name = match[1].trim();
      const qty = parseInt(match[2]);
      const price = parseFloat(match[3].replace(/,/g, ""));
      if (name && qty && price && price < 100000) {
        result.products!.push({
          name,
          quantity: qty,
          price,
          discountPercent: 0,
        });
      }
    }
  }

  if (result.products!.length === 0) {
    const amountOnlyPattern = /([A-Za-z][A-Za-z0-9\s\-&]{2,50})\s+([\d,]+\.?\d*)/g;
    while ((match = amountOnlyPattern.exec(text)) !== null && result.products!.length < 15) {
      const name = match[1].trim();
      const price = parseFloat(match[2].replace(/,/g, ""));
      if (name && price && price < 100000) {
        result.products!.push({
          name,
          quantity: 1,
          price,
          discountPercent: 0,
        });
      }
    }
  }

  return result;
}

function convertToFormData(parsed: Partial<InvoiceData>): InvoiceFormData {
  const now = new Date();
  const due = new Date();
  due.setDate(due.getDate() + 30);

  return {
    from: {
      name: parsed.customerName || "",
      email: parsed.customerEmail || "",
      taxId: "",
      address: parsed.customerAddress || "",
    },
    billTo: {
      name: parsed.customerName || "",
      email: parsed.customerEmail || "",
      taxId: "",
      address: parsed.customerAddress || "",
    },
    invoiceNumber: parsed.invoiceNumber || "",
    invoiceDate: now.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    title: "INVOICE",
    currency: parsed.currency || "INR",
    lineItems: (parsed.products || []).map((p) => ({
      id: generateId(),
      name: p.name,
      description: "",
      price: p.price,
      quantity: p.quantity || 1,
      discountPercent: p.discountPercent || 0,
    })),
    discountPercent: 0,
    taxPercent: 0,
    advancePaid: 0,
    bankDetails: {
      accountName: "",
      accountNumber: "",
      swiftIfsc: "",
      utrNumber: "",
    },
    notes: "",
    signatureImage: "",
  };
}

export default function ParsePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<Partial<InvoiceData> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const formDataRef = useRef<InvoiceFormData | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type.startsWith("image/"))
    ) {
      setFile(selectedFile);
      setParsedData(null);
      setError(null);
      setExtractedText("");
    } else {
      setError("Please select a PDF or image file");
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    setLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract text from file");
      }

      const data = await response.json();
      const text = data.text || "";
      setExtractedText(text);

      if (!text || text.trim().length < 10) {
        throw new Error("Could not extract readable text from this file. The file may be scanned or have very low contrast.");
      }

      const parsed = parseInvoiceText(text);
      setParsedData(parsed);

      formDataRef.current = convertToFormData(parsed);
    } catch (err: any) {
      setError(err.message || "Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInCreator = () => {
    if (formDataRef.current) {
      const params = new URLSearchParams();
      params.set("data", btoa(JSON.stringify(formDataRef.current)));
      window.location.href = "/?" + params.toString();
    }
  };

  const CURRENCY_SYMBOLS: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
    CAD: "C$",
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Nav title="Invoice Parser" subtitle="Extract data from invoices" active="parse" />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        <Card className="border-[var(--border)] shadow-sm mb-6">
          <CardHeader className="pb-4">
            <CardTitle 
              className="text-lg font-medium" 
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Upload Invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-2 block">
                  Select PDF or Image
                </Label>
                <Input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="bg-[var(--background)]"
                />
              </div>
              {file && (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Selected: <span className="font-medium">{file.name}</span> 
                  {" "}({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleExtract} 
              disabled={!file || loading}
              className="gap-2 bg-[var(--ink)] hover:bg-[var(--ink)]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Extract Text
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {error && (
          <Card 
            className="mb-6 border-[var(--destructive)]/30 bg-red-50/50 dark:bg-red-950/20"
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--destructive)] mt-0.5" />
                <p className="text-sm text-[var(--destructive)]">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {extractedText && (
          <Card className="mb-6 border-[var(--border)] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle 
                className="text-lg font-medium" 
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Extracted Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs bg-[var(--muted)]/30 p-4 rounded-lg max-h-48 overflow-yati">
                {extractedText.slice(0, 2000)}
                {extractedText.length > 2000 && "\n... (truncated)"}
              </pre>
            </CardContent>
          </Card>
        )}

        {parsedData && (
          <Card className="mb-6 border-[var(--border)] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle 
                className="text-lg font-medium" 
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Parsed Invoice Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mb-6">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> This is rule-based extraction using regex patterns. 
                  Accuracy depends on the PDF format. Not all fields may be correctly detected.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-semibold mb-3">
                    Customer
                  </h3>
                  <div className="grid gap-2">
                    <p className="font-medium text-lg">{parsedData.customerName || "—"}</p>
                    {parsedData.customerEmail && (
                      <p className="text-[var(--muted-foreground)] text-sm">{parsedData.customerEmail}</p>
                    )}
                    {parsedData.customerAddress && (
                      <p className="text-[var(--muted-foreground)] text-sm whitespace-pre-line">
                        {parsedData.customerAddress}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-semibold mb-3">
                    Products / Items
                  </h3>
                  {parsedData.products && parsedData.products.length > 0 ? (
                    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-[var(--muted)]">
                          <tr>
                            <th className="text-left py-2 px-3 font-medium">Item</th>
                            <th className="text-center py-2 px-3 font-medium">Qty</th>
                            <th className="text-right py-2 px-3 font-medium">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.products.map((p, i) => (
                            <tr key={i} className="border-t border-[var(--border)]">
                              <td className="py-2 px-3">{p.name}</td>
                              <td className="text-center py-2 px-3">{p.quantity}</td>
                              <td className="text-right py-2 px-3">
                                {CURRENCY_SYMBOLS[parsedData.currency || "INR"]}
                                {p.price.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-[var(--muted-foreground)]">No items detected</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-semibold mb-3">
                    Total
                  </h3>
                  <p 
                    className="text-2xl font-bold" 
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {CURRENCY_SYMBOLS[parsedData.currency || "INR"]}
                    {parsedData.totalAmount?.toFixed(2) || "—"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleEditInCreator}
                className="gap-2"
              >
                Edit in Creator <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
