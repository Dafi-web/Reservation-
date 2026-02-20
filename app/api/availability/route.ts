import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSeats, getAvailableSeatsForDate } from '@/lib/data';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const today = getTodayDate();
    const date = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : today;

    const availableSeats = await getAvailableSeatsForDate(date);
    const totalBookedSeats = 70 - availableSeats;
    
    // Get confirmed/pending counts for the requested date
    await connectDB();
    const confirmedReservations = await ReservationModel.find({
      status: 'confirmed',
      date,
    }).lean();
    const confirmedBookedSeats = confirmedReservations.reduce((total, res: any) => {
      return total + (res.guests || 0);
    }, 0);

    const pendingReservations = await ReservationModel.find({
      status: 'pending',
      date,
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
