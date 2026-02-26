import { NextResponse } from 'next/server';
import {
  cancelExpiredReservations,
  cancelPreviousDayReservations,
  deleteOldCheckedInAndRejectedReservations,
} from '@/lib/data';

/**
 * API endpoint to run reservation cleanup. Call via cron (e.g. daily).
 * - Cancels previous-day and expired reservations
 * - Deletes checked-in reservations older than 1 week and rejected reservations older than 1 week
 */
export async function GET() {
  try {
    const previousDayCount = await cancelPreviousDayReservations();
    const expiredCount = await cancelExpiredReservations();
    const { deletedCheckedIn, deletedRejected } = await deleteOldCheckedInAndRejectedReservations();

    const totalCancelled = previousDayCount + expiredCount;
    const totalDeleted = deletedCheckedIn + deletedRejected;

    return NextResponse.json({
      success: true,
      previousDayCount,
      expiredCount,
      cancelledCount: totalCancelled,
      deletedCheckedIn,
      deletedRejected,
      totalDeleted,
      message: `Cleanup done. Cancelled: ${totalCancelled} (previous day + expired). Deleted: ${totalDeleted} (checked-in & rejected older than 1 week).`,
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
