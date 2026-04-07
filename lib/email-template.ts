type CSVRecord = Record<string, string>;

const generateEmail = (template: string, data: CSVRecord) => {
  const templates: Record<string, (data: CSVRecord) => string> = {
    welcome: (d) => `
      <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Welcome aboard 👋</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">
        Thanks for signing up — we received your request and will get back to you within 24 hours. Until then, here's what we do.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9f9f7;border:1px solid #e5e5e0;border-radius:8px;margin-bottom:28px;">
        <tr><td style="padding:0 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">Web development</td><td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">Fast, scalable sites</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">App development</td><td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">iOS & Android</td></tr>
            <tr><td style="padding:12px 0;font-size:14px;color:#888888;">Consulting</td><td style="padding:12px 0;font-size:14px;color:#111111;font-weight:500;text-align:right;">Audits & architecture</td></tr>
          </table>
        </td></tr>
      </table>
      <p style="font-size:13px;color:#999999;line-height:1.7;">
        Have a specific project in mind? Reply directly to this email — it goes straight to our team.
      </p>
    `,
    outreach: (d) => `
      <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Let's build something.</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 16px;">Hi ${d.first_name || '[Name]'},</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">
        Came across ${d.company_name || '[Company]'} and had a few ideas on how we could help you scale the tech side. 
        We've shipped similar work for early-stage startups — happy to share examples or jump on a quick call.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9f9f7;border:1px solid #e5e5e0;border-radius:8px;margin-bottom:28px;">
        <tr><td style="padding:0 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">What we'd do first</td><td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">Free 30-min tech audit</td></tr>
            <tr><td style="padding:12px 0;font-size:14px;color:#888888;">Timeline</td><td style="padding:12px 0;font-size:14px;color:#111111;font-weight:500;text-align:right;">Within 2 weeks</td></tr>
          </table>
        </td></tr>
      </table>
      <p style="font-size:13px;color:#999999;line-height:1.7;">
        Not a fit right now? No hard feelings — just reply and I'll stop reaching out.
      </p>
    `,
    followup: (d) => `
      <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Just following up</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 16px;">Hi ${d.first_name || '[Name]'},</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">
        Wanted to check in on our earlier conversation about ${d.topic || 'your project'}. 
        Let me know if you have any questions or if there's anything I can help with!
      </p>
    `,
  };

  const body = templates[template] ? templates[template](data) : '';
  const customBody = data.body || '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f2;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f2;">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:4px;border:1px solid #e0e0dc;">
        <tr><td style="background-color:#111111;padding:24px 40px;">
          <span style="font-family:'Courier New',monospace;font-size:18px;font-weight:700;color:#ffffff;">Ner<span style="color:#a8ff78;">Dev</span></span>
        </td></tr>
        <tr><td style="padding:40px;">
          ${body}
          ${customBody ? `<p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">${customBody}</p>` : ''}
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #ebebeb;padding-top:20px;">
            <tr><td>
              <p style="margin:0;font-size:14px;font-weight:500;color:#333333;">The NerDev Team</p>
              <p style="margin:0;font-size:13px;color:#888888;">hello@nerdev.in · nerdev.in</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#f4f4f2;padding:20px 40px;border-top:1px solid #e5e5e0;">
          <p style="font-family:'Courier New',monospace;font-size:11px;color:#aaaaaa;line-height:1.8;margin:0;">
            © 2026 NerDev · Indore, India<br/>
            <a href="#" style="color:#bbbbbb;">Unsubscribe</a> · <a href="#" style="color:#bbbbbb;">Privacy Policy</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

export async function sendEmail(
  to: string,
  cc: string,
  subject: string,
  template: string,
  data: CSVRecord
) {
  const { Resend } = await import('resend');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const html = generateEmail(template, data);
  
  return resend.emails.send({
    from: 'NerDev <onboarding@resend.dev>',
    to,
    cc: cc || undefined,
    subject,
    html,
  });
}