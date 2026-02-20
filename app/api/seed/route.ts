import { NextResponse } from 'next/server';
import { seedMenuItems } from '@/lib/data';

export async function POST() {
  try {
    const added = await seedMenuItems();
    return NextResponse.json({ 
      message: added === 0 
        ? 'Default menu items already present. Your custom items were kept.'
        : `Added ${added} default item(s). Your custom items were kept.`,
      added,
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
