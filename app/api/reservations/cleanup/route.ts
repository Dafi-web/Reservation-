import { NextResponse } from 'next/server';
import {
  deleteReservationsOlderThanOneDayAfterReservationDate,
} from '@/lib/data';

/**
 * API endpoint to run reservation cleanup. Call via cron (e.g. daily).
 * - Deletes all reservations that are older than 1 day after reservation date/time
 */
export async function GET() {
  try {
    const { deletedCount } = await deleteReservationsOlderThanOneDayAfterReservationDate();

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Cleanup done. Deleted: ${deletedCount} reservation(s) older than 1 day after reservation date/time.`,
    });
  } catch (error) {
    console.error('Error cleaning up reservations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cleanup reservations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
