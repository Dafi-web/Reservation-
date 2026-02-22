import twilio from 'twilio';
import { Reservation } from './types';

// Initialize Twilio client (supports TWILIO_ACCOUNT_SID or TWILIO_SID, TWILIO_AUTH_TOKEN or TWILIO_TOKEN)
const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'; // Twilio WhatsApp sandbox default

// Admin receives new-reservation SMS and WhatsApp on this number
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+31686371240';

// Only initialize if credentials are available
const client = accountSid && authToken
  ? twilio(accountSid, authToken)
  : null;

/**
 * Send SMS confirmation to customer when reservation is confirmed
 */
export async function sendConfirmationSMS(reservation: Reservation): Promise<boolean> {
  // Skip if Twilio is not configured
  if (!client || !fromNumber) {
    console.warn('⚠️ Twilio not configured. SMS will not be sent.');
    console.warn('   Missing:', !accountSid ? 'TWILIO_ACCOUNT_SID' : '', !authToken ? 'TWILIO_AUTH_TOKEN' : '', !fromNumber ? 'TWILIO_PHONE_NUMBER' : '');
    console.warn('   Please add Twilio credentials to your .env.local file or environment variables');
    return false;
  }

  // Validate phone number
  if (!reservation.phone || reservation.phone.trim() === '') {
    console.warn('No phone number provided for SMS');
    return false;
  }

  // Format phone number (ensure it starts with +)
  let phoneNumber = reservation.phone.trim();
  
  try {
    // Remove any non-digit characters except +
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // If no country code, try to add default (this is a fallback - should ideally have country code)
    if (!phoneNumber.startsWith('+')) {
      // Try to detect if it's a US number (starts with 1) or add a default
      // For international numbers, user should include country code
      if (phoneNumber.length === 10 && phoneNumber.startsWith('1') === false) {
        // Likely a US number without country code
        phoneNumber = '+1' + phoneNumber;
      } else if (phoneNumber.length > 10 && !phoneNumber.startsWith('+')) {
        // Might already have country code but missing +
        phoneNumber = '+' + phoneNumber;
      } else {
        // Unknown format - log warning but try anyway
        console.warn('Phone number format unclear:', phoneNumber);
      }
    }
    
    console.log('Attempting to send SMS to:', phoneNumber);

    // Format date and time
    const date = new Date(`${reservation.date}T${reservation.time}`);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    // Create confirmation message
    const message = `Hello ${reservation.name}! Your reservation at Ristorante Africa has been confirmed. 📅 Date: ${formattedDate} ⏰ Time: ${formattedTime} 👥 Guests: ${reservation.guests} We look forward to serving you!`;

    // Send SMS
    const messageResult = await client.messages.create({
      body: message,
      from: fromNumber,
      to: phoneNumber,
    });

    console.log('✅ SMS sent successfully!');
    console.log('   Message SID:', messageResult.sid);
    console.log('   To:', phoneNumber);
    console.log('   From:', fromNumber);
    console.log('   Status:', messageResult.status);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending SMS:');
    console.error('   Phone number:', phoneNumber || reservation.phone);
    console.error('   Error code:', error?.code);
    console.error('   Error message:', error?.message);
    console.error('   Full error:', error);
    // Don't throw error - SMS failure shouldn't break the reservation update
    return false;
  }
}

/**
 * Send SMS rejection notification to customer
 */
export async function sendRejectionSMS(reservation: Reservation, reason?: string): Promise<boolean> {
  if (!client || !fromNumber) {
    console.warn('Twilio not configured. SMS will not be sent.');
    return false;
  }

  if (!reservation.phone || reservation.phone.trim() === '') {
    console.warn('No phone number provided for SMS');
    return false;
  }

  try {
    let phoneNumber = reservation.phone.trim();
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber;
    }

    const message = `Hello ${reservation.name}, we're sorry to inform you that your reservation at Ristorante Africa could not be confirmed.${reason ? ` Reason: ${reason}` : ''} Please contact us to make a new reservation. Thank you for your understanding.`;

    const messageResult = await client.messages.create({
      body: message,
      from: fromNumber,
      to: phoneNumber,
    });

    console.log('Rejection SMS sent successfully:', messageResult.sid);
    return true;
  } catch (error: any) {
    console.error('Error sending rejection SMS:', error);
    return false;
  }
}

/**
 * Send WhatsApp notification to admin when a new reservation is submitted.
 * Uses Twilio WhatsApp API; "from" must be a WhatsApp-enabled Twilio number (e.g. sandbox).
 */
export async function sendAdminReservationWhatsApp(reservation: Reservation): Promise<boolean> {
  if (!client) {
    console.warn('⚠️ Admin WhatsApp skipped: need TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.local');
    return false;
  }
  const from = (whatsappFrom || '').trim();
  if (!from) {
    console.warn('⚠️ Admin WhatsApp skipped: set TWILIO_WHATSAPP_NUMBER (e.g. +14155238886) in .env.local');
    return false;
  }

  let to = ADMIN_PHONE.trim().replace(/[^\d+]/g, '');
  if (!to.startsWith('+')) to = '+' + to;
  if (to.length < 10) {
    console.warn('Admin WhatsApp number too short');
    return false;
  }

  try {
    const fromClean = from.replace(/^whatsapp:/i, '');
    const body = [
      '📅 New reservation – Ristorante Africa',
      `Name: ${reservation.name}`,
      `Date: ${reservation.date}`,
      `Time: ${reservation.time}`,
      `Guests: ${reservation.guests}`,
      ...(reservation.specialRequests?.trim() ? [`Request: ${reservation.specialRequests.trim()}`] : []),
      'Confirm or reject in admin panel.',
    ].join('\n');

    const messageResult = await client.messages.create({
      body,
      from: `whatsapp:${fromClean}`,
      to: `whatsapp:${to.replace(/^whatsapp:/i, '').trim()}`,
    });

    console.log('✅ Admin WhatsApp sent:', messageResult.sid);
    return true;
  } catch (error: any) {
    console.error('❌ Admin WhatsApp failed:', error?.message || error);
    return false;
  }
}

/**
 * Send SMS to admin when a new reservation is submitted.
 * Uses same Twilio credentials as customer SMS (TWILIO_PHONE_NUMBER).
 */
export async function sendAdminReservationSMS(reservation: Reservation): Promise<boolean> {
  if (!client || !fromNumber) {
    console.warn('⚠️ Admin SMS skipped: need TWILIO_ACCOUNT_SID (or TWILIO_SID), TWILIO_AUTH_TOKEN (or TWILIO_TOKEN), and TWILIO_PHONE_NUMBER in .env.local');
    return false;
  }

  let to = ADMIN_PHONE.trim().replace(/[^\d+]/g, '');
  if (!to.startsWith('+')) to = '+' + to;
  if (to.length < 10) {
    console.warn('Admin phone number too short');
    return false;
  }

  try {
    const dateFormatted = new Date(`${reservation.date}T12:00:00`).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const body = [
      'Ristorante Africa – New reservation',
      `${reservation.name} | ${reservation.phone}`,
      `${dateFormatted} ${reservation.time} | ${reservation.guests} guest${reservation.guests !== 1 ? 's' : ''}`,
      ...(reservation.specialRequests?.trim() ? [`Request: ${reservation.specialRequests.trim()}`] : []),
      'Confirm or reject in admin panel.',
    ].join('\n');

    await client.messages.create({
      body,
      from: fromNumber,
      to,
    });

    console.log('✅ Admin SMS sent');
    return true;
  } catch (error: any) {
    console.error('❌ Admin SMS failed:', error?.message || error);
    return false;
  }
}
