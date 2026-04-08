type CSVRecord = Record<string, string>;

const generateInvoiceEmail = (data: CSVRecord, currencySymbol: string, subtotal: number, discount: number, tax: number, total: number) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice #${data.invoice_number} – NerDev</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f2;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f2;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:4px;border:1px solid #e0e0dc;">

          <tr>
            <td style="background-color:#111111;padding:24px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <span style="font-family:'Courier New',monospace;font-size:18px;font-weight:700;color:#ffffff;">Ner<span style="color:#a8ff78;">Dev</span></span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Courier New',monospace;font-size:12px;color:#888888;">INVOICE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">

              <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Invoice #${data.invoice_number}</p>
              <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">Hi ${data.client_name}, here's your invoice for the project delivered. Payment is due within 7 days.</p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9f9f7;border:1px solid #e5e5e0;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:0 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">Client</td>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">${data.client_name}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">Project</td>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">${data.project_name}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">Delivery date</td>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">${data.delivery_date}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">Due date</td>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">${data.due_date}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">Subtotal</td>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">${currencySymbol}${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">Discount</td>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">-${currencySymbol}${discount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#888888;">Tax (${data.tax_percent || 18}%)</td>
                        <td style="padding:12px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111111;font-weight:500;text-align:right;">${currencySymbol}${tax.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0 12px;font-size:16px;font-weight:500;color:#111111;">Total due</td>
                        <td style="padding:16px 0 12px;font-family:'Courier New',monospace;font-size:18px;font-weight:700;color:#111111;text-align:right;">${currencySymbol}${total.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${data.payment_link}" style="display:block;background-color:#111111;color:#ffffff;font-family:'Courier New',monospace;font-size:13px;text-decoration:none;padding:14px 32px;border-radius:6px;letter-spacing:0.3px;">Pay now →</a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border-left:2px solid #e0e0dc;padding-left:14px;font-size:13px;color:#999999;line-height:1.7;">
                    Bank transfer: ${data.bank_name} · A/C ${data.account_number} · IFSC ${data.ifsc_code}<br/>
                    Please use invoice number <strong style="color:#777777;">${data.invoice_number}</strong> as payment reference.
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-top:20px;border-top:1px solid #ebebeb;">
                    <p style="margin:0;font-size:14px;font-weight:500;color:#333333;">The NerDev Team</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#888888;">hello@nerdev.in · nerdev.in</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background-color:#f4f4f2;padding:20px 40px;border-top:1px solid #e5e5e0;">
              <p style="font-family:'Courier New',monospace;font-size:11px;color:#aaaaaa;line-height:1.8;margin:0;">
                © 2026 NerDev · Indore, India<br/>
                This is a transactional email sent in relation to your project with NerDev.<br/>
                Questions? Reply to this email or contact hello@nerdev.in
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

export async function sendInvoiceEmail(
  to: string,
  data: CSVRecord,
  currencySymbol: string,
  subtotal: number,
  discount: number,
  tax: number,
  total: number
) {
  const { Resend } = await import('resend');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const html = generateInvoiceEmail(data, currencySymbol, subtotal, discount, tax, total);
  
  return resend.emails.send({
    from: 'NerDev <hello@nerdev.in>',
    to,
    subject: `Invoice #${data.invoice_number} – NerDev`,
    html,
  });
}