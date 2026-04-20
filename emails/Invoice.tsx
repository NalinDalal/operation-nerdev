import { Html, Body, Container, Text, Head, Hr, Link } from "@react-email/components";

interface InvoiceData {
  invoice_number: string;
  client_name: string;
  project_name: string;
  delivery_date: string;
  due_date: string;
  tax_percent?: string;
  payment_link: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
}

interface InvoiceEmailProps extends InvoiceData {
  currencySymbol: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export default function InvoiceEmail({
  invoice_number,
  client_name,
  project_name,
  delivery_date,
  due_date,
  tax_percent = "18",
  payment_link,
  bank_name,
  account_number,
  ifsc_code,
  currencySymbol,
  subtotal,
  discount,
  tax,
  total,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f4f4f2", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ background: "#fff", padding: "0", borderRadius: "4px", border: "1px solid #e0e0dc" }}>
          <Container style={{ backgroundColor: "#111", padding: "24px 40px", borderRadius: "4px 4px 0 0" }}>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td>
                    <Text style={{ fontFamily: "'Courier New', monospace", fontSize: "18px", fontWeight: 700, color: "#fff", margin: 0 }}>
                      Ner<span style={{ color: "#a8ff78" }}>Dev</span>
                    </Text>
                  </td>
                  <td align="right">
                    <Text style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#888", margin: 0 }}>INVOICE</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Container>

          <Container style={{ padding: "40px" }}>
            <Text style={{ fontSize: "22px", fontWeight: 500, color: "#111", margin: "0 0 8px" }}>
              Invoice #{invoice_number}
            </Text>
            <Text style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Hi {client_name}, here's your invoice for the project delivered. Payment is due within 7 days.
            </Text>

            <Container style={{ background: "#f9f9f7", border: "1px solid #e5e5e0", borderRadius: "8px", marginBottom: "28px" }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>Client</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>{client_name}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>Project</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>{project_name}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>Delivery date</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>{delivery_date}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>Due date</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>{due_date}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>Subtotal</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>{currencySymbol}{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>Discount</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>-{currencySymbol}{discount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>Tax ({tax_percent}%)</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>{currencySymbol}{tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "16px 24px 12px", fontSize: "16px", fontWeight: 500, color: "#111" }}>Total due</td>
                    <td style={{ padding: "16px 24px 12px", fontFamily: "'Courier New', monospace", fontSize: "18px", fontWeight: 700, color: "#111", textAlign: "right" }}>{currencySymbol}{total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </Container>

            <Container style={{ marginBottom: "24px", textAlign: "center" }}>
              <Link
                href={payment_link}
                style={{
                  display: "inline-block",
                  backgroundColor: "#111",
                  color: "#fff",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "13px",
                  textDecoration: "none",
                  padding: "14px 32px",
                  borderRadius: "6px",
                  letterSpacing: "0.3px",
                }}
              >
                Pay now →
              </Link>
            </Container>

            <Container style={{ marginBottom: "28px" }}>
              <Text style={{ borderLeft: "2px solid #e0e0dc", paddingLeft: "14px", fontSize: "13px", color: "#999", lineHeight: 1.7, margin: 0 }}>
                Bank transfer: {bank_name} · A/C {account_number} · IFSC {ifsc_code}
                <br />
                Please use invoice number <strong style={{ color: "#777" }}>{invoice_number}</strong> as payment reference.
              </Text>
            </Container>

            <Hr style={{ borderTop: "1px solid #ebebeb", margin: "20px 0" }} />

            <Container style={{ paddingTop: "20px" }}>
              <Text style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#333" }}>The NerDev Team</Text>
              <Text style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>hello@nerdev.in · nerdev.in</Text>
            </Container>
          </Container>

          <Container style={{ backgroundColor: "#f4f4f2", padding: "20px 40px", borderTop: "1px solid #e5e5e0", borderRadius: "0 0 4px 4px" }}>
            <Text style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "#aaa", lineHeight: 1.8, margin: 0 }}>
              © 2026 NerDev · Indore, India
              <br />
              This is a transactional email sent in relation to your project with NerDev.
              <br />
              Questions? Reply to this email or contact hello@nerdev.in
            </Text>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}