import connectDB from './mongodb';
import MenuItemModel from './models/MenuItem';
import ReservationModel from './models/Reservation';
import { MenuItem, Reservation } from './types';

// Initial menu items data for seeding
export const initialMenuItems: Omit<MenuItem, 'id'>[] = [
  // Appetizers
  {
    name: 'Bruschetta Trio',
    description: 'Three varieties of bruschetta: classic tomato & basil, mushroom & truffle, and goat cheese & honey',
    price: 12.99,
    category: 'appetizer',
    tags: ['vegetarian'],
    available: true,
    image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=300&fit=crop',
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and our signature Caesar dressing',
    price: 10.99,
    category: 'appetizer',
    tags: ['vegetarian'],
    available: true,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
  },
  {
    name: 'Shrimp Cocktail',
    description: 'Jumbo shrimp served with house-made cocktail sauce and lemon',
    price: 15.99,
    category: 'appetizer',
    allergens: ['shellfish'],
    available: true,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
  },
  // Main Courses
  {
    name: 'Grilled Salmon',
    description: 'Atlantic salmon grilled to perfection, served with roasted vegetables and lemon butter sauce',
    price: 24.99,
    category: 'main',
    tags: ['glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  },
  {
    name: 'Ribeye Steak',
    description: '12oz prime ribeye, cooked to your preference, with garlic mashed potatoes and seasonal vegetables',
    price: 32.99,
    category: 'main',
    available: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
  },
  {
    name: 'Vegetarian Risotto',
    description: 'Creamy arborio rice with seasonal vegetables, parmesan, and fresh herbs',
    price: 18.99,
    category: 'main',
    tags: ['vegetarian', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&h=300&fit=crop',
  },
  {
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast with marinara sauce, mozzarella, and spaghetti',
    price: 22.99,
    category: 'main',
    available: true,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
  },
  {
    name: 'Spicy Thai Curry',
    description: 'Aromatic red curry with vegetables and your choice of chicken or tofu, served with jasmine rice',
    price: 19.99,
    category: 'main',
    tags: ['spicy'],
    available: true,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
  },
  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 9.99,
    category: 'dessert',
    tags: ['vegetarian'],
    available: true,
    image: 'https://images.unsplash.com/photo-1606312619070-d48d4e5b6916?w=400&h=300&fit=crop',
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 8.99,
    category: 'dessert',
    tags: ['vegetarian'],
    available: true,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
  },
  {
    name: 'Fresh Fruit Platter',
    description: 'Seasonal fresh fruits with a honey yogurt dip',
    price: 7.99,
    category: 'dessert',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
  },
  // Beverages
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 4.99,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
  },
  {
    name: 'Iced Tea',
    description: 'House-made iced tea, sweetened or unsweetened',
    price: 3.99,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c197cbc?w=400&h=300&fit=crop',
  },
  {
    name: 'Espresso',
    description: 'Single or double shot of premium espresso',
    price: 2.99,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
  },
  // Wine
  {
    name: 'Chardonnay',
    description: 'California Chardonnay, 2019',
    price: 12.99,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
  },
  {
    name: 'Cabernet Sauvignon',
    description: 'Napa Valley Cabernet, 2018',
    price: 15.99,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1506377247727-2a5f3a1a4d69?w=400&h=300&fit=crop',
  },
  {
    name: 'Pinot Grigio',
    description: 'Italian Pinot Grigio, 2020',
    price: 11.99,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
  },
  // Beer
  {
    name: 'Craft IPA',
    description: 'Local craft IPA, hoppy and refreshing',
    price: 6.99,
    category: 'beer',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1535958637004-8967b8379f98?w=400&h=300&fit=crop',
  },
  {
    name: 'Wheat Beer',
    description: 'German-style wheat beer',
    price: 5.99,
    category: 'beer',
    tags: ['vegetarian', 'vegan'],
    available: true,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
  },
  // Cocktails
  {
    name: 'Mojito',
    description: 'White rum, fresh mint, lime, and soda water',
    price: 10.99,
    category: 'cocktail',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=300&fit=crop',
  },
  {
    name: 'Old Fashioned',
    description: 'Bourbon, sugar, bitters, and orange peel',
    price: 12.99,
    category: 'cocktail',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=300&fit=crop',
  },
  {
    name: 'Margarita',
    description: 'Tequila, triple sec, and fresh lime juice',
    price: 11.99,
    category: 'cocktail',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
  },
];

export async function getMenuItems(): Promise<MenuItem[]> {
  await connectDB();
  const items = await MenuItemModel.find({ available: true }).lean();
  return items.map((item: any) => ({
    ...item,
    id: item.id || item._id?.toString() || String(item._id),
  })) as MenuItem[];
}

export async function getMenuItemsByCategory(category: MenuItem['category']): Promise<MenuItem[]> {
  const items = await getMenuItems();
  return items.filter(item => item.category === category);
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

// Seed function to populate initial menu items
export async function seedMenuItems(): Promise<void> {
  await connectDB();
  const count = await MenuItemModel.countDocuments();
  
  if (count === 0) {
    const itemsWithIds = initialMenuItems.map((item, index) => ({
      ...item,
      id: (index + 1).toString(),
    }));
    await MenuItemModel.insertMany(itemsWithIds);
    console.log('Menu items seeded successfully');
  }
}
