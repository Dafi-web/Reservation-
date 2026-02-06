import { NextResponse } from 'next/server';
import { getAvailableSeats } from '@/lib/data';
import connectDB from '@/lib/mongodb';
import ReservationModel from '@/lib/models/Reservation';

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET() {
  try {
    const availableSeats = await getAvailableSeats();
    const totalBookedSeats = 70 - availableSeats;
    const today = getTodayDate();
    
    // Get confirmed bookings count separately for display (only for today)
    await connectDB();
    const confirmedReservations = await ReservationModel.find({ 
      status: 'confirmed',
      date: today // Only count today's reservations
    }).lean();
    const confirmedBookedSeats = confirmedReservations.reduce((total, res: any) => {
      return total + (res.guests || 0);
    }, 0);
    
    // Get pending bookings for today
    const pendingReservations = await ReservationModel.find({ 
      status: 'pending',
      date: today // Only count today's reservations
    }).lean();
    const pendingBookedSeats = pendingReservations.reduce((total, res: any) => {
      return total + (res.guests || 0);
    }, 0);
    
    return NextResponse.json({ 
      availableSeats,
      totalCapacity: 70,
      bookedSeats: totalBookedSeats, // Total (pending + confirmed) for today
      confirmedBookedSeats, // Only confirmed for today
      pendingBookedSeats, // Only pending for today
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
