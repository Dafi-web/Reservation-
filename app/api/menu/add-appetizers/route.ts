import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItemModel from '@/lib/models/MenuItem';

const newAppetizers = [
  {
    name: 'Vegetarian Samosa',
    description: '(Price per person) Ingredients: Parcel filled with mixed vegetables',
    price: 3.00,
    category: 'appetizer',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Meat Samosal',
    description: '(Price per Person) Ingredients: Parcel filled with minced meat and parsley, slightly spicy',
    price: 3.00,
    category: 'appetizer',
    tags: ['spicy'],
    available: true,
  },
  {
    name: 'Catagna',
    description: '(Price per person) Injera rolls (typical Eritrean bread) with ghee and chili pepper. ***Spicy',
    price: 2.00,
    category: 'appetizer',
    tags: ['spicy'],
    available: true,
  },
];

export async function POST() {
  try {
    await connectDB();
    
    // Remove old items with old names
    const oldItemNames = ['Vegetarian Sambusa', 'Meat Sambusa'];
    let removedCount = 0;
    for (const oldName of oldItemNames) {
      const deleted = await MenuItemModel.deleteMany({ name: oldName });
      if (deleted.deletedCount > 0) {
        removedCount += deleted.deletedCount;
        console.log(`Removed old menu item: ${oldName}`);
      }
    }
    
    const addedItems = [];
    const updatedItems = [];
    
    for (const item of newAppetizers) {
      const existing = await MenuItemModel.findOne({ name: item.name });
      if (!existing) {
        // Find the highest numeric ID and increment
        const allItems = await MenuItemModel.find().lean();
        let maxId = 0;
        for (const doc of allItems) {
          const docId = (doc as any).id;
          if (docId) {
            const numId = parseInt(docId);
            if (!isNaN(numId) && numId > maxId) {
              maxId = numId;
            }
          }
        }
        const nextId = (maxId + 1).toString();
        try {
          await MenuItemModel.create({
            ...item,
            id: nextId,
          });
          addedItems.push(item.name);
          console.log(`Added menu item: ${item.name} (ID: ${nextId})`);
        } catch (error: any) {
          console.error(`Failed to add ${item.name}:`, error.message);
        }
      } else {
        // Update existing item
        try {
          await MenuItemModel.findOneAndUpdate(
            { name: item.name },
            {
              description: item.description,
              price: item.price,
              tags: item.tags,
              category: item.category,
              available: item.available,
            },
            { new: true }
          );
          updatedItems.push(item.name);
          console.log(`Updated menu item: ${item.name}`);
        } catch (error: any) {
          console.error(`Failed to update ${item.name}:`, error.message);
        }
      }
    }
    
    if (addedItems.length > 0 || updatedItems.length > 0 || removedCount > 0) {
      return NextResponse.json({ 
        message: `Successfully updated appetizers. Added ${addedItems.length} item(s), updated ${updatedItems.length} item(s), removed ${removedCount} old item(s)`,
        added: addedItems,
        updated: updatedItems,
        removed: removedCount
      });
    } else {
      return NextResponse.json({ 
        message: 'No changes needed',
        added: [],
        updated: [],
        removed: 0
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
