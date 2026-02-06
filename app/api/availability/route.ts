import { NextResponse } from 'next/server';
import { getAvailableSeats } from '@/lib/data';
import connectDB from '@/lib/mongodb';
import ReservationModel from '@/lib/models/Reservation';

export async function GET() {
  try {
    const availableSeats = await getAvailableSeats();
    const totalBookedSeats = 70 - availableSeats;
    
    // Get confirmed bookings count separately for display
    await connectDB();
    const confirmedReservations = await ReservationModel.find({ status: 'confirmed' }).lean();
    const confirmedBookedSeats = confirmedReservations.reduce((total, res: any) => {
      return total + (res.guests || 0);
    }, 0);
    
    return NextResponse.json({ 
      availableSeats,
      totalCapacity: 70,
      bookedSeats: totalBookedSeats, // Total (pending + confirmed)
      confirmedBookedSeats, // Only confirmed
      pendingBookedSeats: totalBookedSeats - confirmedBookedSeats, // Only pending
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
