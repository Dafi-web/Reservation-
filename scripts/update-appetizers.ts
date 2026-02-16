/**
 * Script to update appetizer menu items
 * Run with: npx tsx scripts/update-appetizers.ts
 * Or use the API endpoint: POST /api/menu/add-appetizers
 */

import connectDB from '../lib/mongodb';
import MenuItemModel from '../lib/models/MenuItem';

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

async function updateAppetizers() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB\n');
    
    // Remove old items with old names
    const oldItemNames = [
      'Vegetarian Sambusa', 
      'Meat Sambusa',
      'Bruschetta Trio',
      'Caesar Salad',
      'Shrimp Cocktail'
    ];
    
    console.log('Removing old appetizer items...');
    let removedCount = 0;
    for (const oldName of oldItemNames) {
      const deleted = await MenuItemModel.deleteMany({ name: oldName });
      if (deleted.deletedCount > 0) {
        removedCount += deleted.deletedCount;
        console.log(`  ✓ Removed: ${oldName}`);
      }
    }
    console.log(`\nRemoved ${removedCount} old item(s)\n`);
    
    const addedItems: string[] = [];
    const updatedItems: string[] = [];
    
    console.log('Updating appetizer items...');
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
          console.log(`  ✓ Added: ${item.name} (ID: ${nextId})`);
        } catch (error: any) {
          console.error(`  ✗ Failed to add ${item.name}:`, error.message);
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
          console.log(`  ✓ Updated: ${item.name}`);
        } catch (error: any) {
          console.error(`  ✗ Failed to update ${item.name}:`, error.message);
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Update Summary:');
    console.log(`  Added: ${addedItems.length} item(s)`);
    console.log(`  Updated: ${updatedItems.length} item(s)`);
    console.log(`  Removed: ${removedCount} old item(s)`);
    console.log('='.repeat(50));
    
    if (addedItems.length > 0 || updatedItems.length > 0 || removedCount > 0) {
      console.log('\n✅ Appetizers updated successfully!');
    } else {
      console.log('\nℹ️  No changes needed - database is already up to date.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating appetizers:', error);
    process.exit(1);
  }
}

updateAppetizers();
