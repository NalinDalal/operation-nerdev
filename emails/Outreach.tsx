import { Html, Body, Container, Text, Head, Hr } from "@react-email/components";

interface OutreachData {
  first_name?: string;
  company_name?: string;
}

export default function OutreachEmail({ first_name = "[Name]", company_name = "[Company]" }: OutreachData) {
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
              Let's build something.
            </Text>
            <Text style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 16px" }}>
              Hi {first_name},
            </Text>
            <Text style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Came across {company_name} and had a few ideas on how we could help you scale the tech side. 
              We've shipped similar work for early-stage startups — happy to share examples or jump on a quick call.
            </Text>

            <Container style={{ background: "#f9f9f7", border: "1px solid #e5e5e0", borderRadius: "8px", marginBottom: "28px" }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#888" }}>What we'd do first</td>
                    <td style={{ padding: "12px 24px", borderBottom: "1px solid #ebebeb", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>Free 30-min tech audit</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 24px", fontSize: "14px", color: "#888" }}>Timeline</td>
                    <td style={{ padding: "12px 24px", fontSize: "14px", color: "#111", fontWeight: 500, textAlign: "right" }}>Within 2 weeks</td>
                  </tr>
                </tbody>
              </table>
            </Container>

            <Text style={{ fontSize: "13px", color: "#999", lineHeight: 1.7 }}>
              Not a fit right now? No hard feelings — just reply and I'll stop reaching out.
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