import twilio from 'twilio';
import { Reservation } from './types';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

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
    console.warn('Twilio not configured. SMS will not be sent.');
    return false;
  }

  // Validate phone number
  if (!reservation.phone || reservation.phone.trim() === '') {
    console.warn('No phone number provided for SMS');
    return false;
  }

  try {
    // Format phone number (ensure it starts with +)
    let phoneNumber = reservation.phone.trim();
    if (!phoneNumber.startsWith('+')) {
      // If no country code, assume it needs one (you may want to adjust this)
      // For now, we'll try to send as-is and let Twilio handle it
      phoneNumber = phoneNumber;
    }

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
    const message = `Hello ${reservation.name}! Your reservation at Africa Restorante has been confirmed. 📅 Date: ${formattedDate} ⏰ Time: ${formattedTime} 👥 Guests: ${reservation.guests} We look forward to serving you!`;

    // Send SMS
    const messageResult = await client.messages.create({
      body: message,
      from: fromNumber,
      to: phoneNumber,
    });

    console.log('SMS sent successfully:', messageResult.sid);
    return true;
  } catch (error: any) {
    console.error('Error sending SMS:', error);
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

    const message = `Hello ${reservation.name}, we're sorry to inform you that your reservation at Africa Restorante could not be confirmed.${reason ? ` Reason: ${reason}` : ''} Please contact us to make a new reservation. Thank you for your understanding.`;

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
