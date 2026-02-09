import { NextResponse } from 'next/server';
import { cancelExpiredReservations, cancelPreviousDayReservations } from '@/lib/data';

/**
 * API endpoint to manually trigger cleanup of expired reservations
 * This can be called by a cron job or scheduled task
 * 
 * Usage:
 * - GET /api/reservations/cleanup - Run cleanup and return count
 * - Can be called periodically (e.g., every 15 minutes) via cron
 */
export async function GET() {
  try {
    // First, cancel all previous day reservations (daily reset)
    const previousDayCount = await cancelPreviousDayReservations();
    
    // Then, cancel expired reservations for today
    const expiredCount = await cancelExpiredReservations();
    
    const totalCancelled = previousDayCount + expiredCount;
    
    return NextResponse.json({
      success: true,
      cancelledCount: totalCancelled,
      previousDayCount,
      expiredCount,
      message: `Cleanup completed. ${previousDayCount} previous day reservation(s) cancelled, ${expiredCount} expired reservation(s) cancelled.`,
    });
  } catch (error) {
    console.error('Error cleaning up expired reservations:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to cleanup expired reservations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
