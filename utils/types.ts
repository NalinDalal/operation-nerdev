export interface Product {
  name: string;
  quantity: number;
  price: number;
  description?: string;
  discountPercent: number;
}

export interface InvoiceData {
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;
  products: Product[];
  totalAmount: number;
  currency: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
}

export interface Party {
  name: string;
  email: string;
  taxId: string;
  address: string;
}

export interface LineItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discountPercent: number;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  swiftIfsc: string;
  utrNumber: string;
}

export interface InvoiceFormData {
  from: Party;
  billTo: Party;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  title: string;
  currency: string;
  lineItems: LineItem[];
  discountPercent: number;
  taxPercent: number;
  advancePaid: number;
  bankDetails: BankDetails;
  notes: string;
  signatureImage: string;
}

export interface CompanySettings {
  name: string;
  email: string;
  taxId: string;
  address: string;
  bankDetails: BankDetails;
  defaultCurrency: string;
  taxPercent: number;
  invoicePrefix: string;
  nextInvoiceNumber: number;
}
