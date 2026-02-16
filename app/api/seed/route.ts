import { NextResponse } from 'next/server';
import { seedMenuItems } from '@/lib/data';

export async function POST() {
  try {
    await seedMenuItems();
    return NextResponse.json({ 
      message: 'Menu items seeded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error seeding menu items:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed menu items',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
