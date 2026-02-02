/**
 * Seed script to populate initial menu items
 * Run with: npx tsx scripts/seed.ts
 * Or use the API endpoint: POST /api/seed
 */

import connectDB from '../lib/mongodb';
import { seedMenuItems } from '../lib/data';

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Seeding menu items...');
    await seedMenuItems();
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();
