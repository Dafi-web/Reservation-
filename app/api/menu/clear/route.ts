import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItemModel from '@/lib/models/MenuItem';

export async function POST() {
  try {
    await connectDB();
    const result = await MenuItemModel.deleteMany({});
    return NextResponse.json({
      message: `Menu cleared. Removed ${result.deletedCount} item(s).`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error('Error clearing menu:', error);
    return NextResponse.json(
      { error: 'Failed to clear menu', details: error.message },
      { status: 500 }
    );
  }
}
