import { Resend } from "resend";
import { WelcomeEmail, OutreachEmail, FollowupEmail } from "@/emails";

type CSVRecord = Record<string, string>;

type EmailComponent = React.ComponentType<any>;

const templateMap: Record<string, EmailComponent> = {
  welcome: WelcomeEmail,
  outreach: OutreachEmail,
  followup: FollowupEmail,
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  cc: string,
  subject: string,
  template: string,
  data: CSVRecord
) {
  const Template = templateMap[template];

  if (!Template) {
    throw new Error(`Unknown template: ${template}`);
  }

  return resend.emails.send({
    from: "NerDev <hello@nerdev.in>",
    to,
    cc: cc || undefined,
    subject,
    react: <Template {...data} />,
  });
}