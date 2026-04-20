import { Html, Body, Container, Text, Head, Hr } from "@react-email/components";

interface WelcomeData {
  firstName?: string;
}

export default function WelcomeEmail({ firstName = "there" }: WelcomeData) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f4f4f2", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ background: "#fff", padding: "40px", borderRadius: "4px", border: "1px solid #e0e0dc" }}>
          <Container style={{ backgroundColor: "#111", padding: "24px 40px", borderRadius: "4px 4px 0 0", margin: "-40px -40px 0 -40px" }}>
            <Text style={{ fontFamily: "'Courier New', monospace", fontSize: "18px", fontWeight: 700, color: "#fff", margin: 0 }}>
              Ner<span style={{ color: "#a8ff78" }}>Dev</span>
            </Text>
          </Container>

          <Container style={{ padding: "40px 0" }}>
            <Text style={{ fontSize: "22px", fontWeight: 500, color: "#111", margin: "0 0 8px" }}>
              Welcome aboard 👋
            </Text>
            <Text style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Hi {firstName}, thanks for signing up — we received your request and will get back to you within 24 hours. Until then, here's what we do.
            </Text>

            <Container style={{ background: "#f9f9f7", border: "1px solid #e5e5e0", borderRadius: "8px", marginBottom: "28px" }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>Web development</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>Fast, scalable sites</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>App development</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>iOS & Android</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", fontSize: "14px", color: "#888" }}>Consulting</td>
                    <td style={{ padding: "12px 24px", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>Audits & architecture</td>
                  </tr>
                </tbody>
              </table>
            </Container>

            <Text style={{ fontSize: "13px", color: "#999", lineHeight: 1.7 }}>
              Have a specific project in mind? Reply directly to this email — it goes straight to our team.
            </Text>
          </Container>

          <Hr style={{ borderTop: "1px solid #ebebeb", margin: "20px 0" }} />

          <Container style={{ paddingTop: "20px" }}>
            <Text style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#333" }}>The NerDev Team</Text>
            <Text style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>hello@nerdev.in · nerdev.in</Text>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}