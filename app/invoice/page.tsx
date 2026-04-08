"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Plus, Trash2, Printer, FileText, ScanLine, ArrowRight, Download, Save, Send, Mail } from "lucide-react";
import { InvoiceFormData, LineItem } from "@/utils/types";
import { Nav } from "@/components/nav";

const CURRENCIES = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    return date.toISOString().split("T")[0];
};

const getNextInvoiceNumber = () => {
    if (typeof window === "undefined") return "001";
    const settings = localStorage.getItem("companySettings");
    if (settings) {
        const parsed = JSON.parse(settings);
        const num = parsed.nextInvoiceNumber || 1;
        return `${parsed.invoicePrefix || "INV"}-${num.toString().padStart(4, "0")}`;
    }
    return `INV-${new Date().getFullYear()}-001`;
};

const defaultFormData: InvoiceFormData = {
    from: { name: "", email: "", taxId: "", address: "" },
    billTo: { name: "", email: "", taxId: "", address: "" },
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: getDefaultDueDate(),
    title: "INVOICE",
    currency: "INR",
    lineItems: [{ id: "1", name: "", description: "", price: 0, quantity: 1, discountPercent: 0 }],
    discountPercent: 0,
    taxPercent: 0,
    advancePaid: 0,
    bankDetails: { accountName: "", accountNumber: "", swiftIfsc: "", utrNumber: "" },
    notes: "",
    signatureImage: "",
};

export default function InvoicePage() {
    const [formData, setFormData] = useState<InvoiceFormData>(defaultFormData);
    const printRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get("data");
        if (dataParam) {
            try {
                const parsed = JSON.parse(atob(dataParam)) as InvoiceFormData;
                setFormData(parsed);
            } catch (e) {
                console.error("Failed to parse data from URL", e);
            }
        } else {
            const settings = localStorage.getItem("companySettings");
            if (settings) {
                try {
                    const s = JSON.parse(settings);
                    setFormData(prev => ({
                        ...prev,
                        from: {
                            name: s.name || "",
                            email: s.email || "",
                            taxId: s.taxId || "",
                            address: s.address || ""
                        },
                        bankDetails: s.bankDetails || prev.bankDetails,
                        currency: s.defaultCurrency || prev.currency,
                        taxPercent: s.taxPercent || prev.taxPercent,
                        invoiceNumber: s.nextInvoiceNumber ? `${s.invoicePrefix || "INV"}-${s.nextInvoiceNumber.toString().padStart(4, "0")}` : prev.invoiceNumber
                    }));
                } catch (e) {
                    console.error("Failed to load company settings", e);
                }
            }
        }
    }, []);

    const updateField = (path: string, value: string | number) => {
        const keys = path.split(".");
        setFormData((prev) => {
            const updated = { ...prev };
            let current: any = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            lineItems: prev.lineItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    const addLineItem = () => {
        setFormData((prev) => ({
            ...prev,
            lineItems: [
                ...prev.lineItems,
                { id: Date.now().toString(), name: "", description: "", price: 0, quantity: 1, discountPercent: 0 },
            ],
        }));
    };

    const removeLineItem = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            lineItems: prev.lineItems.filter((item) => item.id !== id),
        }));
    };

    const calculateSubtotal = () => {
        return formData.lineItems.reduce((sum, item) => {
            const itemTotal = item.price * item.quantity;
            const discount = itemTotal * (item.discountPercent / 100);
            return sum + itemTotal - discount;
        }, 0);
    };

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        return subtotal * (formData.discountPercent / 100);
    };

    const calculateTax = () => {
        const afterDiscount = calculateSubtotal() - calculateDiscount();
        return afterDiscount * (formData.taxPercent / 100);
    };

    const calculateTotal = () => {
        const afterDiscount = calculateSubtotal() - calculateDiscount();
        const tax = calculateTax();
        return afterDiscount + tax - formData.advancePaid;
    };

    const getCurrencySymbol = () => {
        return CURRENCIES.find((c) => c.code === formData.currency)?.symbol || "₹";
    };

    const handlePrint = () => {
        window.print();
    };

    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!formData.billTo.email) {
            alert('Please enter client email address');
            return;
        }

        setSending(true);

        try {
            const currencySymbol = getCurrencySymbol();
            const subtotal = calculateSubtotal();
            const discount = calculateDiscount();
            const tax = calculateTax();
            const total = calculateTotal();
            const taxPercent = formData.taxPercent || 18;

            const data = {
                invoice_number: formData.invoiceNumber,
                client_name: formData.billTo.name,
                project_name: formData.title,
                delivery_date: new Date(formData.invoiceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                due_date: new Date(formData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                subtotal: subtotal.toFixed(2),
                discount: discount.toFixed(2),
                tax_percent: taxPercent.toString(),
                tax: tax.toFixed(2),
                total: total.toFixed(2),
                bank_name: formData.bankDetails.accountName,
                account_number: formData.bankDetails.accountNumber,
                ifsc_code: formData.bankDetails.swiftIfsc,
                payment_link: '#',
            };

            const response = await fetch('/api/send-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: formData.billTo.email,
                    data,
                    currencySymbol,
                    subtotal,
                    discount,
                    tax,
                    total,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Invoice sent successfully!');
            } else {
                alert('Failed to send invoice: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email');
        } finally {
            setSending(false);
        }
    };

    const handleDownload = async () => {
        if (!printRef.current) return;
        
        const printContent = printRef.current;
        const originalDisplay = printContent.style.display;
        printContent.style.display = 'block';
        
        const styles = Array.from(document.styleSheets)
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                } catch (e) { return ''; }
            })
            .join('\n');

        const invoiceNo = formData.invoiceNumber || 'invoice';
        const htmlContent = `<!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${invoiceNo}</title>
                <style>${styles}</style>
            </head>
            <body style="margin:0;padding:20px;">
                ${printContent.innerHTML}
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceNo}.html`;
        a.click();
        URL.revokeObjectURL(url);
        
        printContent.style.display = originalDisplay;
    };

    const saveCompanySettings = () => {
        const currentSettings = localStorage.getItem("companySettings");
        let parsed = currentSettings ? JSON.parse(currentSettings) : {};
        
        const newSettings = {
            ...parsed,
            name: formData.from.name,
            email: formData.from.email,
            taxId: formData.from.taxId,
            address: formData.from.address,
            bankDetails: formData.bankDetails,
            defaultCurrency: formData.currency,
            taxPercent: formData.taxPercent,
            invoicePrefix: (formData.invoiceNumber.split('-')[0] || "INV"),
            nextInvoiceNumber: (parseInt(formData.invoiceNumber.split('-').pop() || "0") || 0) + 1
        };
        
        localStorage.setItem("companySettings", JSON.stringify(newSettings));
        alert("Company settings saved!");
    };

    const loadCompanySettings = () => {
        const settings = localStorage.getItem("companySettings");
        if (settings) {
            const s = JSON.parse(settings);
            setFormData(prev => ({
                ...prev,
                from: { name: s.name || "", email: s.email || "", taxId: s.taxId || "", address: s.address || "" },
                bankDetails: s.bankDetails || prev.bankDetails,
                currency: s.defaultCurrency || prev.currency,
                taxPercent: s.taxPercent || 0,
                invoiceNumber: s.nextInvoiceNumber ? `${s.invoicePrefix || "INV"}-${s.nextInvoiceNumber.toString().padStart(4, "0")}` : prev.invoiceNumber
            }));
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Nav 
                title="Invoice Creator" 
                subtitle="Design professional invoices" 
                active="invoice"
                action={
                    <>
                        <Button
                            onClick={handlePrint}
                            className="gap-2"
                            style={{ background: 'linear-gradient(135deg, #4c3d6e 0%, #6b5a8c 100%)' }}
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </Button>
                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            className="gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                        <Button
                            onClick={saveCompanySettings}
                            variant="ghost"
                            className="gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={sending}
                            className="gap-2"
                            style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Sending...' : 'Send'}
                        </Button>
                    </>
                }
            />
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-5 space-y-6 print:hidden overflow-y-auto form-scroll" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                        <div
                            className={`space-y-6 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <Card className="border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                        Invoice Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Invoice #</Label>
                                            <Input
                                                value={formData.invoiceNumber}
                                                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                                                placeholder="INV-001"
                                                className="bg-[var(--background)]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Title</Label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => updateField("title", e.target.value)}
                                                placeholder="INVOICE"
                                                className="bg-[var(--background)]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.invoiceDate}
                                                onChange={(e) => updateField("invoiceDate", e.target.value)}
                                                className="bg-[var(--background)]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Due Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.dueDate}
                                                onChange={(e) => updateField("dueDate", e.target.value)}
                                                className="bg-[var(--background)]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Currency</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
                                            value={formData.currency}
                                            onChange={(e) => updateField("currency", e.target.value)}
                                        >
                                            {CURRENCIES.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.code} — {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                        From
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Name</Label>
                                        <Input
                                            value={formData.from.name}
                                            onChange={(e) => updateField("from.name", e.target.value)}
                                            placeholder="Your Business Name"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Email</Label>
                                        <Input
                                            type="email"
                                            value={formData.from.email}
                                            onChange={(e) => updateField("from.email", e.target.value)}
                                            placeholder="email@example.com"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Tax ID</Label>
                                        <Input
                                            value={formData.from.taxId}
                                            onChange={(e) => updateField("from.taxId", e.target.value)}
                                            placeholder="GSTIN / Tax ID"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Address</Label>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm resize-none"
                                            value={formData.from.address}
                                            onChange={(e) => updateField("from.address", e.target.value)}
                                            placeholder="Address"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                        Bill To
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Client Name</Label>
                                        <Input
                                            value={formData.billTo.name}
                                            onChange={(e) => updateField("billTo.name", e.target.value)}
                                            placeholder="Client Name"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Email</Label>
                                        <Input
                                            type="email"
                                            value={formData.billTo.email}
                                            onChange={(e) => updateField("billTo.email", e.target.value)}
                                            placeholder="client@example.com"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Tax ID</Label>
                                        <Input
                                            value={formData.billTo.taxId}
                                            onChange={(e) => updateField("billTo.taxId", e.target.value)}
                                            placeholder="GSTIN / Tax ID"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Address</Label>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm resize-none"
                                            value={formData.billTo.address}
                                            onChange={(e) => updateField("billTo.address", e.target.value)}
                                            placeholder="Client Address"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                        Line Items
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addLineItem}
                                        className="gap-1"
                                    >
                                        <Plus className="h-3 w-3" /> Add
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {formData.lineItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="p-4 border border-[var(--border)] rounded-lg space-y-3 bg-[var(--background)]/50"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                                                    Item {index + 1}
                                                </span>
                                                {formData.lineItems.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeLineItem(item.id)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Trash2 className="h-3 w-3 text-[var(--destructive)]" />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase text-[var(--muted-foreground)]">Item Name</Label>
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) => updateLineItem(item.id, "name", e.target.value)}
                                                        placeholder="Product/Service"
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase text-[var(--muted-foreground)]">Description</Label>
                                                    <Input
                                                        value={item.description}
                                                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                                                        placeholder="Description"
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase text-[var(--muted-foreground)]">Price</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => updateLineItem(item.id, "price", parseFloat(e.target.value) || 0)}
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase text-[var(--muted-foreground)]">Qty</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.quantity || 1}
                                                        onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                                                        min="1"
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <Label className="text-[10px] uppercase text-[var(--muted-foreground)]">Discount %</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.discountPercent}
                                                        onChange={(e) => updateLineItem(item.id, "discountPercent", parseFloat(e.target.value) || 0)}
                                                        placeholder="0"
                                                        min="0"
                                                        max="100"
                                                        step="0.1"
                                                        className="h-8"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                        Adjustments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Discount %</Label>
                                            <Input
                                                type="number"
                                                value={formData.discountPercent}
                                                onChange={(e) => updateField("discountPercent", parseFloat(e.target.value) || 0)}
                                                placeholder="0"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                className="bg-[var(--background)]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Tax %</Label>
                                            <Input
                                                type="number"
                                                value={formData.taxPercent}
                                                onChange={(e) => updateField("taxPercent", parseFloat(e.target.value) || 0)}
                                                placeholder="0"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                className="bg-[var(--background)]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Advance Paid</Label>
                                            <Input
                                                type="number"
                                                value={formData.advancePaid}
                                                onChange={(e) => updateField("advancePaid", parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                className="bg-[var(--background)]"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                        Bank Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Account Name</Label>
                                        <Input
                                            value={formData.bankDetails.accountName}
                                            onChange={(e) => updateField("bankDetails.accountName", e.target.value)}
                                            placeholder="Account Name"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Account Number</Label>
                                        <Input
                                            value={formData.bankDetails.accountNumber}
                                            onChange={(e) => updateField("bankDetails.accountNumber", e.target.value)}
                                            placeholder="Account Number"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">SWIFT / IFSC</Label>
                                        <Input
                                            value={formData.bankDetails.swiftIfsc}
                                            onChange={(e) => updateField("bankDetails.swiftIfsc", e.target.value)}
                                            placeholder="SWIFT/IFSC"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">UTR No / Transaction ID</Label>
                                        <Input
                                            value={formData.bankDetails.utrNumber}
                                            onChange={(e) => updateField("bankDetails.utrNumber", e.target.value)}
                                            placeholder="UTR Number"
                                            className="bg-[var(--background)]"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm resize-none"
                                        value={formData.notes}
                                        onChange={(e) => updateField("notes", e.target.value)}
                                        placeholder="Additional notes or terms..."
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                        Signature
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        updateField("signatureImage", reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="bg-[var(--background)] text-sm"
                                        />
                                        {formData.signatureImage && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => updateField("signatureImage", "")}
                                                className="text-red-500"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    {formData.signatureImage && (
                                        <div className="mt-3 p-3 border border-[var(--border)] rounded-lg inline-block">
                                            <img src={formData.signatureImage} alt="Signature" className="h-16 object-contain" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="xl:col-span-7 overflow-y-auto preview-scroll" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-4 print:hidden">
                                <h2
                                    className="text-lg font-medium text-[var(--muted-foreground)]"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    Live Preview
                                </h2>
                            </div>

                            <div
                                ref={printRef}
                                className="bg-white shadow-xl rounded-sm overflow-hidden print-container"
                                style={{
                                    fontFamily: "var(--font-body), Georgia, serif",
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02)'
                                }}
                            >
                                <div className="p-8 sm:p-12">
                                    <div className="flex items-start justify-between mb-12">
                                        <div className="flex items-center gap-5">
                                            <div
                                                className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden"
                                                style={{
                                                    boxShadow: '0 8px 24px rgba(76, 61, 110, 0.3)'
                                                }}
                                            >
                                                <Image src="/logo-dark.png" alt="Logo" width={80} height={80} className="object-contain" />
                                            </div>
                                            <div>
                                                <h1
                                                    className="text-4xl font-bold text-gray-900 tracking-tight"
                                                    style={{ fontFamily: "var(--font-display)" }}
                                                >
                                                    {formData.title || "INVOICE"}
                                                </h1>
                                                {formData.invoiceNumber && (
                                                    <p className="text-gray-400 text-sm mt-1">#{formData.invoiceNumber}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            {formData.from.name && (
                                                <p className="font-semibold text-gray-900 text-lg">{formData.from.name}</p>
                                            )}
                                            {formData.from.address && (
                                                <p className="text-gray-500 text-xs mt-2 whitespace-pre-line leading-relaxed">{formData.from.address}</p>
                                            )}
                                            {formData.from.email && (
                                                <p className="text-gray-400 text-xs mt-2">{formData.from.email}</p>
                                            )}
                                            {formData.from.taxId && (
                                                <p className="text-gray-400 text-xs">Tax ID: {formData.from.taxId}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-12 mb-12">
                                        <div>
                                            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mb-4">Paid To</h3>
                                            {formData.from.name ? (
                                                <>
                                                    <p className="font-semibold text-gray-900 text-lg mb-2">{formData.from.name}</p>
                                                    {formData.from.address && (
                                                        <p className="text-gray-500 text-xs whitespace-pre-line leading-relaxed mb-2">{formData.from.address}</p>
                                                    )}
                                                    {formData.from.email && (
                                                        <p className="text-gray-400 text-xs mb-1">{formData.from.email}</p>
                                                    )}
                                                    {formData.from.taxId && (
                                                        <p className="text-gray-400 text-xs">Tax ID: {formData.from.taxId}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-gray-300 text-sm">—</p>
                                            )}
                                        </div>

                                        <div className="text-right">
                                            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mb-4">Bill To</h3>
                                            {formData.billTo.name ? (
                                                <>
                                                    <p className="font-semibold text-gray-900 text-lg mb-2">{formData.billTo.name}</p>
                                                    {formData.billTo.address && (
                                                        <p className="text-gray-500 text-xs whitespace-pre-line leading-relaxed mb-2">{formData.billTo.address}</p>
                                                    )}
                                                    {formData.billTo.email && (
                                                        <p className="text-gray-400 text-xs mb-1">{formData.billTo.email}</p>
                                                    )}
                                                    {formData.billTo.taxId && (
                                                        <p className="text-gray-400 text-xs">Tax ID: {formData.billTo.taxId}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-gray-300 text-sm">—</p>
                                            )}
                                            
                                            <div className="mt-6">
                                                <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mb-4">Details</h3>
                                                {formData.invoiceDate && (
                                                    <p className="text-gray-600 mb-2">
                                                        <span className="text-gray-400">Date:</span>{" "}
                                                        {new Date(formData.invoiceDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                )}
                                                {formData.dueDate && (
                                                    <p className="text-gray-600">
                                                        <span className="text-gray-400">Due:</span>{" "}
                                                        {new Date(formData.dueDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-gray-200">
                                                    <th className="text-left py-4 text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold w-full">Description</th>
                                                    <th className="text-center py-4 text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold w-20">Qty</th>
                                                    <th className="text-right py-4 text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold w-28">Price</th>
                                                    <th className="text-right py-4 text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold w-24">Discount</th>
                                                    <th className="text-right py-4 text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold w-32">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.lineItems.map((item) => {
                                                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                                                    const discount = itemTotal * ((item.discountPercent || 0) / 100);
                                                    const netAmount = itemTotal - discount;
                                                    return (
                                                        <tr key={item.id} className="border-b border-gray-100">
                                                            <td className="py-4">
                                                                <p className="font-medium text-gray-800">{item.name || "—"}</p>
                                                                {item.description && (
                                                                    <p className="text-gray-400 text-xs mt-1">{item.description}</p>
                                                                )}
                                                            </td>
                                                            <td className="text-center py-4 text-gray-600">{item.quantity || 1}</td>
                                                            <td className="text-right py-4 text-gray-600">
                                                                {getCurrencySymbol()}{(item.price || 0).toFixed(2)}
                                                            </td>
                                                            <td className="text-right py-4 text-gray-500">
                                                                {item.discountPercent > 0 ? `${item.discountPercent}%` : "—"}
                                                            </td>
                                                            <td className="text-right py-4 text-gray-800 font-medium">
                                                                {getCurrencySymbol()}{netAmount.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex justify-end mb-12">
                                        <div className="w-72">
                                            <div className="flex justify-between py-3 border-b border-gray-100">
                                                <span className="text-gray-500">Subtotal</span>
                                                <span className="text-gray-800 font-medium">
                                                    {getCurrencySymbol()}{calculateSubtotal().toFixed(2)}
                                                </span>
                                            </div>
                                            {formData.discountPercent > 0 && (
                                                <div className="flex justify-between py-3 border-b border-gray-100">
                                                    <span className="text-gray-500">Discount ({formData.discountPercent}%)</span>
                                                    <span className="text-red-500 font-medium">
                                                        -{getCurrencySymbol()}{calculateDiscount().toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            {formData.taxPercent > 0 && (
                                                <div className="flex justify-between py-3 border-b border-gray-100">
                                                    <span className="text-gray-500">Tax ({formData.taxPercent}%)</span>
                                                    <span className="text-orange-600 font-medium">
                                                        +{getCurrencySymbol()}{calculateTax().toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            {formData.advancePaid > 0 && (
                                                <div className="flex justify-between py-3 border-b border-gray-100">
                                                    <span className="text-gray-500">Advance Paid</span>
                                                    <span className="text-green-600 font-medium">
                                                        -{getCurrencySymbol()}{formData.advancePaid.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                className="flex justify-between py-4 px-4 rounded-lg mt-2"
                                                style={{
                                                    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                                                }}
                                            >
                                                <span className="font-bold text-gray-900">Total Due</span>
                                                <span className="font-bold text-xl" style={{ color: '#4c3d6e' }}>
                                                    {getCurrencySymbol()}{calculateTotal().toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.bankDetails.accountName && (
                                        <div
                                            className="mb-8 p-5 rounded-lg"
                                            style={{ backgroundColor: '#faf9f7' }}
                                        >
                                            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mb-4">Bank Details</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">Account Name</p>
                                                    <p className="text-gray-800 font-medium mt-1">{formData.bankDetails.accountName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">Account Number</p>
                                                    <p className="text-gray-800 font-medium mt-1">{formData.bankDetails.accountNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">SWIFT / IFSC</p>
                                                    <p className="text-gray-800 font-medium mt-1">{formData.bankDetails.swiftIfsc}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">UTR / Transaction ID</p>
                                                    <p className="text-gray-800 font-medium mt-1">{formData.bankDetails.utrNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {formData.notes && (
                                        <div className="mb-8">
                                            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mb-3">Notes</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{formData.notes}</p>
                                        </div>
                                    )}

                                    <div className="pt-8 border-t border-gray-200">
                                        <div className="flex justify-end">
                                            <div className="text-right">
                                                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">Authorized Signature</p>
                                                {formData.signatureImage ? (
                                                    <img 
                                                        src={formData.signatureImage} 
                                                        alt="Signature" 
                                                        className="h-20 object-contain"
                                                    />
                                                ) : (
                                                    <p
                                                        className="italic text-gray-600 text-xl"
                                                        style={{ fontFamily: "var(--font-display)" }}
                                                    >
                                                        {formData.from.name || "________________"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print-container {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 210mm;
            min-height: 297mm;
            box-shadow: none !important;
            margin: 0;
            padding: 15mm !important;
            background: white;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container * {
            font-size: 11pt !important;
            line-height: 1.3 !important;
          }
        }
      `}</style>
        </div>
    );
}
