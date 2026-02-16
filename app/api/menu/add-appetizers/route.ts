import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItemModel from '@/lib/models/MenuItem';

const newAppetizers = [
  {
    name: 'Vegetarian Sambusa',
    description: 'Parcel filled with mixed vegetables',
    price: 3.00,
    category: 'appetizer',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Meat Sambusa',
    description: 'Parcel filled with minced meat and parsley, slightly spicy',
    price: 3.00,
    category: 'appetizer',
    tags: ['spicy'],
    available: true,
  },
  {
    name: 'Catagna',
    description: 'Injera rolls (typical Eritrean bread) with ghee and chili pepper. ***Spicy',
    price: 2.00,
    category: 'appetizer',
    tags: ['spicy'],
    available: true,
  },
];

export async function POST() {
  try {
    await connectDB();
    const addedItems = [];
    
    for (const item of newAppetizers) {
      const existing = await MenuItemModel.findOne({ name: item.name });
      if (!existing) {
        // Find the highest ID and increment
        const maxIdDoc = await MenuItemModel.findOne().sort({ id: -1 }).lean();
        let nextId = '1';
        if (maxIdDoc && (maxIdDoc as any).id) {
          const maxId = parseInt((maxIdDoc as any).id);
          nextId = (maxId + 1).toString();
        }
        await MenuItemModel.create({
          ...item,
          id: nextId,
        });
        addedItems.push(item.name);
        console.log(`Added menu item: ${item.name}`);
      }
    }
    
    if (addedItems.length > 0) {
      return NextResponse.json({ 
        message: `Successfully added ${addedItems.length} menu item(s)`,
        added: addedItems 
      });
    } else {
      return NextResponse.json({ 
        message: 'All items already exist',
        added: [] 
      });
    }
  } catch (error) {
    console.error('Error adding menu items:', error);
    return NextResponse.json(
      { error: 'Failed to add menu items' },
      { status: 500 }
    );
  }
}
