import { NextRequest, NextResponse } from 'next/server';
import {
  getReservations,
  createReservation,
  updateReservationStatus,
} from '@/lib/data';
import { Reservation } from '@/lib/types';
import { sendConfirmationSMS, sendRejectionSMS } from '@/lib/sms';

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
    const { name, phone, date, time, guests, specialRequests } = body;

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reservation = await createReservation({
      name,
      email: '', // Email is optional, set to empty string
      phone,
      date,
      time,
      guests: parseInt(guests, 10),
      specialRequests: specialRequests || '',
    });

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
    const { id, status, rejectionReason } = body;

    if (!id || !status) {
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

    // Send SMS notification based on status
    let smsSent = false;
    let smsError = null;
    
    try {
      if (status === 'confirmed') {
        console.log('📱 Attempting to send confirmation SMS...');
        smsSent = await sendConfirmationSMS(reservation);
        if (smsSent) {
          console.log('✅ Confirmation SMS sent successfully');
        } else {
          console.warn('⚠️ Confirmation SMS was not sent (check Twilio configuration)');
        }
      } else if (status === 'rejected') {
        console.log('📱 Attempting to send rejection SMS...');
        smsSent = await sendRejectionSMS(reservation, rejectionReason);
        if (smsSent) {
          console.log('✅ Rejection SMS sent successfully');
        } else {
          console.warn('⚠️ Rejection SMS was not sent (check Twilio configuration)');
        }
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
