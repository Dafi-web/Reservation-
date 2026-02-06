import { NextResponse } from 'next/server';
import { getAvailableSeats } from '@/lib/data';

export async function GET() {
  try {
    const availableSeats = await getAvailableSeats();
    return NextResponse.json({ 
      availableSeats,
      totalCapacity: 70,
      bookedSeats: 70 - availableSeats,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
