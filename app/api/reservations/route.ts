import { NextRequest, NextResponse } from 'next/server';
import {
  getReservations,
  createReservation,
  updateReservationStatus,
  updateCheckedInStatus,
  checkAvailabilityForDate,
} from '@/lib/data';
import { Reservation } from '@/lib/types';
import { sendConfirmationSMS, sendRejectionSMS, sendAdminReservationWhatsApp, sendAdminReservationSMS } from '@/lib/sms';
import { sendAdminReservationNotification, sendCustomerConfirmationEmail, sendGuestRequestReceivedEmail } from '@/lib/email';

export async function GET() {
  try {
    const reservations = await getReservations();
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, date, time, guests, specialRequests, email } = body;

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate date - only allow today or future dates
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reservationDate = new Date(date + 'T12:00:00');
    const reservationDateOnly = new Date(reservationDate.getFullYear(), reservationDate.getMonth(), reservationDate.getDate());
    if (reservationDateOnly.getTime() < today.getTime()) {
      return NextResponse.json(
        { error: 'Cannot create reservation for a past date' },
        { status: 400 }
      );
    }
    // If booking for today, require the time to be in the future (so it does not get auto-expired)
    if (reservationDateOnly.getTime() === today.getTime() && time) {
      const [hours, minutes] = String(time).split(':').map(Number);
      const slot = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours || 0, (minutes ?? 0), 0);
      const graceMs = 5 * 60 * 1000; // 5 min grace
      if (slot.getTime() < now.getTime() - graceMs) {
        return NextResponse.json(
          { error: 'Cannot create reservation for a time that has already passed. Please choose a future time.' },
          { status: 400 }
        );
      }
    }

    const requestedGuests = parseInt(guests, 10);
    const dateStr = String(date).trim();

    const availability = await checkAvailabilityForDate(dateStr, requestedGuests);
    
    if (!availability.available) {
      return NextResponse.json(
        { 
          error: 'Not enough available seats',
          availableSeats: availability.availableSeats,
          requestedGuests,
        },
        { status: 400 }
      );
    }

    const reservation = await createReservation({
      name,
      email: (typeof email === 'string' && email.trim()) ? email.trim() : '',
      phone,
      date,
      time,
      guests: requestedGuests,
      specialRequests: specialRequests || '',
    });

    // Notify admin by SMS, email, and WhatsApp (non-blocking)
    let smsOk = false;
    let emailOk = false;
    let whatsappOk = false;
    try {
      smsOk = await sendAdminReservationSMS(reservation);
      if (!smsOk) console.warn('[Reservation] Admin SMS not sent (check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env.local)');
      else console.log('[Reservation] Admin SMS sent to', process.env.ADMIN_PHONE || '+31686371240');
    } catch (e) {
      console.error('[Reservation] Admin SMS error:', e);
    }
    try {
      emailOk = await sendAdminReservationNotification(reservation);
      if (!emailOk) console.warn('[Reservation] Admin email not sent (set RESEND_API_KEY in .env.local for email)');
      else console.log('[Reservation] Admin email sent');
    } catch (e) {
      console.error('[Reservation] Admin email error:', e);
    }
    try {
      await sendGuestRequestReceivedEmail(reservation);
    } catch (e) {
      console.error('[Reservation] Guest request-received email error:', e);
    }
    try {
      whatsappOk = await sendAdminReservationWhatsApp(reservation);
      if (!whatsappOk) console.warn('[Reservation] Admin WhatsApp not sent (Twilio WhatsApp: set TWILIO_WHATSAPP_NUMBER or use sandbox)');
      else console.log('[Reservation] Admin WhatsApp sent');
    } catch (e) {
      console.error('[Reservation] Admin WhatsApp error:', e);
    }

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, rejectionReason, checkedIn } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing reservation ID' },
        { status: 400 }
      );
    }

    // Handle check-in status update
    if (typeof checkedIn === 'boolean') {
      const reservation = await updateCheckedInStatus(id, checkedIn);
      if (!reservation) {
        return NextResponse.json(
          { error: 'Reservation not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(reservation);
    }

    // Handle status update (pending, confirmed, rejected)
    if (!status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    if (status === 'rejected' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting a reservation' },
        { status: 400 }
      );
    }

    const reservation = await updateReservationStatus(
      id,
      status as Reservation['status'],
      rejectionReason
    );

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Send SMS and email notifications based on status
    let smsSent = false;
    let smsError = null;

    try {
      if (status === 'confirmed') {
        console.log('📱 Attempting to send confirmation SMS...');
        smsSent = await sendConfirmationSMS(reservation);
        if (smsSent) console.log('✅ Confirmation SMS sent');
        else console.warn('⚠️ Confirmation SMS not sent (check Twilio)');
        try {
          await sendCustomerConfirmationEmail(reservation);
        } catch (e) {
          console.error('Customer confirmation email failed:', e);
        }
      } else if (status === 'rejected') {
        console.log('📱 Attempting to send rejection SMS...');
        smsSent = await sendRejectionSMS(reservation, rejectionReason);
        if (smsSent) console.log('✅ Rejection SMS sent');
        else console.warn('⚠️ Rejection SMS not sent (check Twilio)');
      }
    } catch (error: any) {
      smsError = error.message || 'Unknown error';
      console.error('❌ Failed to send SMS notification:', error);
    }

    // Return reservation with SMS status (for debugging)
    return NextResponse.json({
      ...reservation,
      _smsStatus: smsSent ? 'sent' : 'not_sent',
      _smsError: smsError || null,
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}
