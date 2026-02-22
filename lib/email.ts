import { Reservation } from './types';

const ADMIN_EMAIL = 'wediabrhana@gmail.com';
const ADMIN_PHONE = '+31686371240';

/** Resend: use RESEND_FROM_EMAIL after verifying a domain so emails reach any address. With onboarding@resend.dev, Resend only allows sending to the account owner email (403 to other addresses). */
const FROM_EMAIL_RESEND = process.env.RESEND_FROM_EMAIL?.trim() || 'Ristorante Africa <onboarding@resend.dev>';

/** Gmail: no domain needed. Set GMAIL_USER and GMAIL_APP_PASSWORD in Vercel to send to any address (admin + guests). */
const GMAIL_USER = process.env.GMAIL_USER?.trim();
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.trim();
const USE_GMAIL = GMAIL_USER && GMAIL_APP_PASSWORD;

/** Basic email format check. */
function isValidEmail(email: string): boolean {
  const s = (email || '').trim();
  if (s.length < 5 || s.length > 254) return false;
  const at = s.indexOf('@');
  if (at <= 0 || at === s.length - 1) return false;
  const domain = s.slice(at + 1);
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return false;
  return true;
}

/** Send one email to one or more recipients. Uses Gmail if configured (no domain needed), else Resend. */
async function sendEmail(to: string[], subject: string, html: string): Promise<boolean> {
  if (to.length === 0) return false;
  const toList = to.filter((e) => isValidEmail(e));
  if (toList.length === 0) return false;

  if (USE_GMAIL && GMAIL_USER) {
    try {
      const nodemailer = await import('nodemailer');
      const transport = nodemailer.default.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      });
      await transport.sendMail({
        from: `"Ristorante Africa" <${GMAIL_USER}>`,
        to: toList.join(', '),
        subject,
        html,
      });
      console.log('✅ Email sent via Gmail to', toList.join(', '));
      return true;
    } catch (err) {
      console.error('❌ Gmail send failed:', err);
      return false;
    }
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const { Resend } = await import('resend');
    const client = new Resend(key);
    const { error } = await client.emails.send({
      from: FROM_EMAIL_RESEND,
      to: toList,
      subject,
      html,
    });
    if (error) {
      console.error('❌ Resend error:', JSON.stringify(error));
      return false;
    }
    console.log('✅ Email sent via Resend to', toList.join(', '));
    return true;
  } catch (err) {
    console.error('❌ Resend send failed:', err);
    return false;
  }
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Send email to the admin when a new reservation is submitted.
 * Uses Gmail (no domain) or Resend if configured.
 */
export async function sendAdminReservationNotification(
  reservation: Reservation
): Promise<boolean> {
  if (!USE_GMAIL && !process.env.RESEND_API_KEY?.trim()) {
    console.warn('⚠️ No email configured. Set GMAIL_USER + GMAIL_APP_PASSWORD (no domain) or RESEND_API_KEY in Vercel.');
    return false;
  }

  const formattedDate = formatDate(reservation.date);
  const subject = `🍽️ New reservation – ${reservation.name} – ${formattedDate}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Reservation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 24px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #b45309 0%, #92400e 50%, #78350f 100%); padding: 28px 32px; text-align: center;">
              <h1 style="margin: 0; color: #fff; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">Ristorante Africa</h1>
              <p style="margin: 6px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">New reservation request</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 28px 28px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 15px; line-height: 1.5;">You have received a new table reservation request. Details below.</p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-top: 8px;">
                <tr>
                  <td style="padding: 14px 16px; background: #fefce8; border-radius: 10px; border-left: 4px solid #eab308;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Guest name</td></tr>
                      <tr><td style="color: #1c1917; font-size: 17px; font-weight: 600; padding-top: 4px;">${escapeHtml(reservation.name)}</td></tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 14px 16px; background: #f8fafc; border-radius: 10px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Phone</td></tr>
                      <tr><td style="color: #1c1917; font-size: 16px; font-weight: 500; padding-top: 4px;"><a href="tel:${escapeHtml(reservation.phone)}" style="color: #b45309; text-decoration: none;">${escapeHtml(reservation.phone)}</a></td></tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 14px 16px; background: #f8fafc; border-radius: 10px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Date & time</td></tr>
                      <tr><td style="color: #1c1917; font-size: 16px; font-weight: 500; padding-top: 4px;">${escapeHtml(formattedDate)} · ${escapeHtml(reservation.time)}</td></tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 14px 16px; background: #f8fafc; border-radius: 10px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Guests</td></tr>
                      <tr><td style="color: #1c1917; font-size: 16px; font-weight: 500; padding-top: 4px;">${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}</td></tr>
                    </table>
                  </td>
                </tr>
                ${
                  reservation.specialRequests && reservation.specialRequests.trim()
                    ? `
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 14px 16px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Special requests</td></tr>
                      <tr><td style="color: #1c1917; font-size: 15px; line-height: 1.5; padding-top: 4px;">${escapeHtml(reservation.specialRequests.trim())}</td></tr>
                    </table>
                  </td>
                </tr>
                `
                    : ''
                }
              </table>

              <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px;">Please confirm or reject this reservation in the admin panel.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">Ristorante Africa · Admin</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return sendEmail([ADMIN_EMAIL], subject, html);
}

/**
 * Send "We received your request" email to the guest when they submit (if they gave an email).
 */
export async function sendGuestRequestReceivedEmail(reservation: Reservation): Promise<boolean> {
  const to = (reservation.email || '').trim();
  if (!isValidEmail(to)) return false;
  if (!USE_GMAIL && !process.env.RESEND_API_KEY?.trim()) return false;
  const formattedDate = formatDate(reservation.date);
  const subject = `We received your reservation request – Ristorante Africa`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#b45309 0%,#92400e 100%);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Ristorante Africa</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Request received</p>
        </td></tr>
        <tr><td style="padding:32px 28px;">
          <p style="margin:0 0 20px;color:#374151;font-size:16px;">Hello ${escapeHtml(reservation.name)},</p>
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">We have received your table reservation request. You will receive another email once we confirm it.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;">
            <tr><td style="padding:12px 16px;background:#f8fafc;border-radius:10px;">
              <span style="color:#64748b;font-size:12px;">Your request</span><br/>
              <span style="color:#1c1917;font-size:16px;font-weight:600;">${escapeHtml(formattedDate)} · ${escapeHtml(reservation.time)} · ${reservation.guests} guest${reservation.guests !== 1 ? 's' : ''}</span>
            </td></tr>
          </table>
          <p style="margin:24px 0 0;color:#64748b;font-size:13px;">Thank you for choosing Ristorante Africa.</p>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;color:#64748b;font-size:12px;">Ristorante Africa</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
  return sendEmail([to], subject, html);
}

/**
 * Send confirmation email to the customer when admin confirms (if they gave an email).
 */
export async function sendCustomerConfirmationEmail(reservation: Reservation): Promise<boolean> {
  const to = (reservation.email || '').trim();
  if (!isValidEmail(to)) return false;
  if (!USE_GMAIL && !process.env.RESEND_API_KEY?.trim()) return false;
  const formattedDate = formatDate(reservation.date);
  const subject = `Your reservation at Ristorante Africa is confirmed – ${formattedDate}`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#b45309 0%,#92400e 100%);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Ristorante Africa</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Reservation confirmed</p>
        </td></tr>
        <tr><td style="padding:32px 28px;">
          <p style="margin:0 0 20px;color:#374151;font-size:16px;">Hello ${escapeHtml(reservation.name)},</p>
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">Your table reservation has been <strong>confirmed</strong>. We look forward to welcoming you.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;border-collapse:collapse;">
            <tr><td style="padding:12px 16px;background:#f8fafc;border-radius:10px;margin-bottom:8px;">
              <span style="color:#64748b;font-size:12px;">Date & time</span><br/>
              <span style="color:#1c1917;font-size:16px;font-weight:600;">${escapeHtml(formattedDate)} · ${escapeHtml(reservation.time)}</span>
            </td></tr>
            <tr><td style="height:8px;"></td></tr>
            <tr><td style="padding:12px 16px;background:#f8fafc;border-radius:10px;">
              <span style="color:#64748b;font-size:12px;">Guests</span><br/>
              <span style="color:#1c1917;font-size:16px;font-weight:600;">${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}</span>
            </td></tr>
          </table>
          <p style="margin:24px 0 0;color:#64748b;font-size:13px;">If you need to change or cancel, please contact us.</p>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;color:#64748b;font-size:12px;">Ristorante Africa</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
  return sendEmail([to], subject, html);
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
}

export { ADMIN_EMAIL, ADMIN_PHONE };
