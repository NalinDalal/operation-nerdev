import { Resend } from "resend";
import InvoiceEmail from "@/emails/Invoice";

type CSVRecord = Record<string, string>;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(
  to: string,
  data: CSVRecord,
  currencySymbol: string,
  subtotal: number,
  discount: number,
  tax: number,
  total: number
) {
  return resend.emails.send({
    from: "NerDev <hello@nerdev.in>",
    to,
    subject: `Invoice #${data.invoice_number} – NerDev`,
    react: <InvoiceEmail
      invoice_number={data.invoice_number}
      client_name={data.client_name}
      project_name={data.project_name}
      delivery_date={data.delivery_date}
      due_date={data.due_date}
      tax_percent={data.tax_percent}
      payment_link={data.payment_link}
      bank_name={data.bank_name}
      account_number={data.account_number}
      ifsc_code={data.ifsc_code}
      currencySymbol={currencySymbol}
      subtotal={subtotal}
      discount={discount}
      tax={tax}
      total={total}
    />,
  });
}