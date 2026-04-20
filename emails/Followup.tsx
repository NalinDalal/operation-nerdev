import { Html, Body, Container, Text, Head, Hr } from "@react-email/components";

interface FollowupData {
  first_name?: string;
  topic?: string;
}

export default function FollowupEmail({ first_name = "", topic = "your project" }: FollowupData) {
  const displayName = first_name.trim() || "there";
  const displayTopic = topic.trim() || "your project";
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
              Just following up
            </Text>
            <Text style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 16px" }}>
              Hi {displayName},
            </Text>
            <Text style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Wanted to check in on our earlier conversation about {displayTopic}. 
              Let me know if you have any questions or if there's anything I can help with!
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