import connectDB from './mongodb';
import MenuItemModel from './models/MenuItem';
import ReservationModel from './models/Reservation';
import { MenuItem, Reservation } from './types';

// Initial menu items data for seeding
export const initialMenuItems: Omit<MenuItem, 'id'>[] = [
  // Appetizers
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
  // Main Courses (Habesha dishes)
  {
    name: 'Zighni di carne',
    description: 'A rich and flavorful Habesha-style beef, lamb and chicken stew slow-cooked in a spicy tomato and berbere sauce with onions and traditional spices. Tender, juicy beef simmered until soft and served hot, perfect to enjoy with fresh injera.',
    price: 18.00,
    category: 'main',
    tags: ['spicy'],
    available: true,
  },
  {
    name: 'Tibs / Spriss',
    description: 'Tender pieces of beef sautéed with onions and peppers, cooked with traditional Habesha spices. A flavorful, slightly spiced dish served hot and usually enjoyed with injera.',
    price: 19.00,
    category: 'main',
    tags: ['spicy'],
    available: true,
  },
  {
    name: 'Zighni Vegetarian',
    description: 'A colorful platter of different vegetarian dishes served together on injera. Includes a variety of lentils, split peas, vegetables, and flavorful stews all seasoned with traditional Habesha spices. Perfect for sharing or for anyone who wants to taste a little bit of everything.',
    price: 17.00,
    category: 'main',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Gored Gored',
    description: 'Fresh, tender cubes of raw beef lightly mixed with spiced butter and traditional Habesha spices. Rich, soft, and full of flavor, typically served with injera and enjoyed by those who love raw meat dishes.',
    price: 22.00,
    category: 'main',
    available: true,
  },
  {
    name: 'Zilzil',
    description: 'Strips of beef sautéed with onions, peppers, and traditional Habesha spices. Well-cooked and lightly seasoned, with a slightly dry texture.',
    price: 18.00,
    category: 'main',
    tags: ['spicy'],
    available: true,
  },
  {
    name: 'Kitfo',
    description: 'Finely minced raw beef mixed with spiced butter and traditional Habesha spices. Soft, rich, and full of flavor, served with injera. Can also be prepared lightly cooked upon request.',
    price: 21.00,
    category: 'main',
    available: true,
  },
  // Desserts (5 euros each)
  {
    name: 'Dolci di Coco',
    description: 'Coconut dessert',
    price: 5,
    category: 'dessert',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Dolci semolino',
    description: 'Semolina dessert',
    price: 5,
    category: 'dessert',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Sesamo con pistaccio',
    description: 'Sesame with pistachio',
    price: 5,
    category: 'dessert',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Sorbetto',
    description: 'Limone / mango / mela verde',
    price: 5,
    category: 'dessert',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  // Drinks (Beverages)
  {
    name: 'Water',
    description: 'Still or sparkling',
    price: 3,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Glass of wine',
    description: 'House wine by the glass',
    price: 4,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Glass of prosecco',
    description: 'Prosecco by the glass',
    price: 4,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: '0.5L Red or White wine',
    description: 'Half litre of red or white wine',
    price: 10,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Soft drinks',
    description: 'Coca-Cola, Fanta, Sprite, Red Bull, and more',
    price: 3,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  // Beer (under Drinks)
  {
    name: 'Beer 33 cl',
    description: 'Beer 33 cl',
    price: 4,
    category: 'beer',
    tags: ['vegetarian', 'vegan'],
    available: true,
  },
  {
    name: 'Draft beer medium',
    description: 'Medium draft beer',
    price: 6,
    category: 'beer',
    tags: ['vegetarian', 'vegan'],
    available: true,
  },
  {
    name: 'Draft beer small',
    description: 'Small draft beer',
    price: 4,
    category: 'beer',
    tags: ['vegetarian', 'vegan'],
    available: true,
  },
  // Wine
  {
    name: 'South African wine',
    description: 'Shiraz, Pinotage',
    price: 22,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Chianti 37.5 cl',
    description: 'Chianti 37.5 cl',
    price: 10,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Chianti 75 cl',
    description: 'Chianti 75 cl',
    price: 10,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: "Nero d'Avola 37.5 cl",
    description: "Nero d'Avola 37.5 cl",
    price: 20,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: "Nero d'Avola 75 cl",
    description: "Nero d'Avola 75 cl",
    price: 20,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
];

const MENU_FALLBACK: MenuItem[] = initialMenuItems.map((item, index) => ({
  ...item,
  id: String(index + 1),
})) as MenuItem[];

export async function getMenuItems(): Promise<MenuItem[]> {
  const fromDb = async (): Promise<MenuItem[]> => {
    await connectDB();
    const items = await MenuItemModel.find({ available: true }).lean();
    if (items.length > 0) {
      return items.map((item: any) => ({
        ...item,
        id: item.id || item._id?.toString() || String(item._id),
      })) as MenuItem[];
    }
    return MENU_FALLBACK;
  };

  try {
    const timeoutMs = 5000;
    const result = await Promise.race([
      fromDb(),
      new Promise<MenuItem[]>((resolve) => setTimeout(() => resolve(MENU_FALLBACK), timeoutMs)),
    ]);
    return Array.isArray(result) && result.length > 0 ? result : MENU_FALLBACK;
  } catch (e) {
    console.warn('Menu DB unavailable, using initial menu from data.ts:', (e as Error).message);
    return MENU_FALLBACK;
  }
}

export async function getMenuItemsByCategory(category: MenuItem['category']): Promise<MenuItem[]> {
  const items = await getMenuItems();
  return items.filter(item => item.category === category);
}

/** Returns all menu items (including unavailable) for admin. */
export async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    await connectDB();
    const items = await MenuItemModel.find().lean().sort({ category: 1, name: 1 });
    return items.map((item: any) => ({
      ...item,
      id: item.id || item._id?.toString() || String(item._id),
    })) as MenuItem[];
  } catch (e) {
    return [];
  }
}

export async function createMenuItem(payload: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  await connectDB();
  const id = Date.now().toString();
  const doc = {
    ...payload,
    id,
    tags: payload.tags ?? [],
    allergens: payload.allergens ?? [],
  };
  const created = await MenuItemModel.create(doc);
  const saved = created.toObject() as any;
  return {
    ...saved,
    id: saved.id || saved._id?.toString() || String(saved._id),
  } as MenuItem;
}

export async function updateMenuItem(id: string, updates: Partial<Omit<MenuItem, 'id'>>): Promise<MenuItem | null> {
  await connectDB();
  const updated = await MenuItemModel.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true }
  ).lean();
  if (!updated) return null;
  const item = updated as any;
  return {
    ...item,
    id: item.id || item._id?.toString() || String(item._id),
  } as MenuItem;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  await connectDB();
  const result = await MenuItemModel.deleteOne({ id });
  return result.deletedCount === 1;
}

export async function getReservations(): Promise<Reservation[]> {
  await connectDB();
  const reservations = await ReservationModel.find().lean().sort({ date: 1, time: 1 });
  return reservations.map((res: any) => ({
    ...res,
    id: res.id || res._id?.toString() || String(res._id),
  })) as Reservation[];
}

export async function createReservation(reservation: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Promise<Reservation> {
  await connectDB();
  const newReservation = new ReservationModel({
    ...reservation,
    email: reservation.email || '', // Set empty string if email is not provided
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  await newReservation.save();
  const saved = newReservation.toObject();
  return {
    ...saved,
    id: (saved as any).id || (saved as any)._id?.toString() || String((saved as any)._id),
  } as Reservation;
}

export async function updateReservationStatus(
  id: string, 
  status: Reservation['status'],
  rejectionReason?: string
): Promise<Reservation | null> {
  await connectDB();
  const updateData: any = { status };
  if (status === 'rejected' && rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  } else if (status !== 'rejected') {
    updateData.rejectionReason = undefined;
  }
  
  const reservation = await ReservationModel.findOneAndUpdate(
    { id },
    updateData,
    { new: true }
  ).lean();
  
  if (!reservation) {
    return null;
  }
  
  const res = reservation as any;
  return {
    ...res,
    id: res.id || res._id?.toString() || String(res._id),
  } as Reservation;
}

export async function updateCheckedInStatus(
  id: string,
  checkedIn: boolean
): Promise<Reservation | null> {
  await connectDB();
  const updateData: any = { 
    checkedIn,
    ...(checkedIn ? { checkedInAt: new Date().toISOString() } : { checkedInAt: undefined })
  };
  
  const reservation = await ReservationModel.findOneAndUpdate(
    { id },
    updateData,
    { new: true }
  ).lean();
  
  if (!reservation) {
    return null;
  }
  
  const res = reservation as any;
  return {
    ...res,
    id: res.id || res._id?.toString() || String(res._id),
  } as Reservation;
}

// Seat availability functions
const TOTAL_CAPACITY = 70;

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to check if a reservation is expired
function isReservationExpired(reservation: any): boolean {
  const today = getTodayDate();
  const reservationDate = reservation.date;
  
  // If reservation is for a past date, it's expired
  if (reservationDate < today) {
    return true;
  }
  
  // If reservation is for today, check the time
  if (reservationDate === today) {
    const now = new Date();
    const [hours, minutes] = reservation.time.split(':').map(Number);
    const reservationDateTime = new Date();
    reservationDateTime.setHours(hours, minutes, 0, 0);
    
    // Consider expired if reservation time has passed (with 15 minute grace period)
    const gracePeriod = 15 * 60 * 1000; // 15 minutes in milliseconds
    return now.getTime() > (reservationDateTime.getTime() + gracePeriod);
  }
  
  return false;
}

// Function to cancel all reservations from previous days (daily reset)
export async function cancelPreviousDayReservations(): Promise<number> {
  await connectDB();
  const today = getTodayDate();
  
  // Cancel ALL reservations from previous days (not just expired ones)
  // This ensures seats reset to 70 each day
  const result = await ReservationModel.updateMany(
    {
      date: { $lt: today }, // All dates before today
      status: { $in: ['pending', 'confirmed'] } // Only active reservations
    },
    {
      status: 'rejected',
      rejectionReason: 'Reservation cancelled - daily seat reset'
    }
  );
  
  if (result.modifiedCount > 0) {
    console.log(`✅ Daily reset: Cancelled ${result.modifiedCount} reservation(s) from previous days`);
  }
  
  return result.modifiedCount;
}

// Function to cancel expired reservations that haven't been checked in (for today's reservations)
export async function cancelExpiredReservations(): Promise<number> {
  await connectDB();
  const today = getTodayDate();
  
  // Find all confirmed or pending reservations for TODAY that are expired and not checked in
  const activeReservations = await ReservationModel.find({
    date: today, // Only today's reservations
    status: { $in: ['pending', 'confirmed'] },
    checkedIn: { $ne: true }
  }).lean();
  
  let cancelledCount = 0;
  
  for (const reservation of activeReservations) {
    if (isReservationExpired(reservation)) {
      await ReservationModel.findOneAndUpdate(
        { id: reservation.id },
        { 
          status: 'rejected',
          rejectionReason: 'Reservation expired - customer did not check in on time'
        }
      );
      cancelledCount++;
      console.log(`✅ Cancelled expired reservation: ${reservation.name} (${reservation.date} ${reservation.time})`);
    }
  }
  
  return cancelledCount;
}

export async function getAvailableSeats(): Promise<number> {
  await connectDB();
  const today = getTodayDate();
  
  // First, cancel all reservations from previous days (daily reset)
  await cancelPreviousDayReservations();
  
  // Then, cancel any expired reservations for today
  await cancelExpiredReservations();
  
  // Count both pending and confirmed reservations for TODAY only (rejected don't count)
  const activeReservations = await ReservationModel.find({ 
    status: { $in: ['pending', 'confirmed'] },
    date: today // Only count reservations for today
  }).lean();
  
  const bookedSeats = activeReservations.reduce((total, res: any) => {
    return total + (res.guests || 0);
  }, 0);
  
  const available = Math.max(0, TOTAL_CAPACITY - bookedSeats);
  return available;
}

export async function checkAvailability(requestedGuests: number): Promise<{ available: boolean; availableSeats: number }> {
  // This will automatically cancel expired reservations and calculate today's availability
  const availableSeats = await getAvailableSeats();
  return {
    available: availableSeats >= requestedGuests,
    availableSeats,
  };
}

// Seed function to populate initial menu items (full sync: DB menu = initialMenuItems)
export async function seedMenuItems(): Promise<void> {
  await connectDB();
  const count = await MenuItemModel.countDocuments();

  // Always replace entire menu with current initialMenuItems so DB matches code
  if (count > 0) {
    const deleted = await MenuItemModel.deleteMany({});
    console.log(`Removed ${deleted.deletedCount} existing menu item(s) for full sync.`);
  }

  const itemsWithIds = initialMenuItems.map((item, index) => ({
    ...item,
    id: (index + 1).toString(),
  }));
  await MenuItemModel.insertMany(itemsWithIds);
  console.log(`Menu synced: ${itemsWithIds.length} item(s) from code.`);
}
