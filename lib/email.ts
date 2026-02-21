import { Reservation } from './types';

const ADMIN_EMAIL = 'fikrselina@gmail.com';
const ADMIN_PHONE = '+393513468002';

const FROM_EMAIL = 'Ristorante Africa <onboarding@resend.dev>';

/** Lazy-load Resend so the reservations API still works if the package is missing. */
async function getResendClient(): Promise<{ emails: { send: (opts: unknown) => Promise<{ data?: { id: string }; error: unknown }> } } | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    const { Resend } = await import('resend');
    return new Resend(key) as unknown as { emails: { send: (opts: unknown) => Promise<{ data?: { id: string }; error: unknown }> } };
  } catch {
    return null;
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
 * Send a nice HTML email to the admin when a new reservation is submitted.
 * Does not throw; returns false if Resend is not configured or send fails.
 */
export async function sendAdminReservationNotification(
  reservation: Reservation
): Promise<boolean> {
  const client = await getResendClient();
  if (!client) {
    console.warn(
      '⚠️ Resend not configured. Admin email notification will not be sent. Set RESEND_API_KEY in .env.local (and run npm install resend)'
    );
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

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject,
      html,
    });
    if (error) {
      console.error('❌ Resend error:', error);
      return false;
    }
    console.log('✅ Admin reservation email sent:', data?.id);
    return true;
  } catch (err) {
    console.error('❌ Failed to send admin reservation email:', err);
    return false;
  }
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
