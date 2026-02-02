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
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and our signature Caesar dressing',
    price: 10.99,
    category: 'appetizer',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Shrimp Cocktail',
    description: 'Jumbo shrimp served with house-made cocktail sauce and lemon',
    price: 15.99,
    category: 'appetizer',
    allergens: ['shellfish'],
    available: true,
  },
  // Main Courses
  {
    name: 'Grilled Salmon',
    description: 'Atlantic salmon grilled to perfection, served with roasted vegetables and lemon butter sauce',
    price: 24.99,
    category: 'main',
    tags: ['glutenFree'],
    available: true,
  },
  {
    name: 'Ribeye Steak',
    description: '12oz prime ribeye, cooked to your preference, with garlic mashed potatoes and seasonal vegetables',
    price: 32.99,
    category: 'main',
    available: true,
  },
  {
    name: 'Vegetarian Risotto',
    description: 'Creamy arborio rice with seasonal vegetables, parmesan, and fresh herbs',
    price: 18.99,
    category: 'main',
    tags: ['vegetarian', 'glutenFree'],
    available: true,
  },
  {
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast with marinara sauce, mozzarella, and spaghetti',
    price: 22.99,
    category: 'main',
    available: true,
  },
  {
    name: 'Spicy Thai Curry',
    description: 'Aromatic red curry with vegetables and your choice of chicken or tofu, served with jasmine rice',
    price: 19.99,
    category: 'main',
    tags: ['spicy'],
    available: true,
  },
  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 9.99,
    category: 'dessert',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 8.99,
    category: 'dessert',
    tags: ['vegetarian'],
    available: true,
  },
  {
    name: 'Fresh Fruit Platter',
    description: 'Seasonal fresh fruits with a honey yogurt dip',
    price: 7.99,
    category: 'dessert',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  // Beverages
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 4.99,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Iced Tea',
    description: 'House-made iced tea, sweetened or unsweetened',
    price: 3.99,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Espresso',
    description: 'Single or double shot of premium espresso',
    price: 2.99,
    category: 'beverage',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  // Wine
  {
    name: 'Chardonnay',
    description: 'California Chardonnay, 2019',
    price: 12.99,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Cabernet Sauvignon',
    description: 'Napa Valley Cabernet, 2018',
    price: 15.99,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Pinot Grigio',
    description: 'Italian Pinot Grigio, 2020',
    price: 11.99,
    category: 'wine',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  // Beer
  {
    name: 'Craft IPA',
    description: 'Local craft IPA, hoppy and refreshing',
    price: 6.99,
    category: 'beer',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Wheat Beer',
    description: 'German-style wheat beer',
    price: 5.99,
    category: 'beer',
    tags: ['vegetarian', 'vegan'],
    available: true,
  },
  // Cocktails
  {
    name: 'Mojito',
    description: 'White rum, fresh mint, lime, and soda water',
    price: 10.99,
    category: 'cocktail',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Old Fashioned',
    description: 'Bourbon, sugar, bitters, and orange peel',
    price: 12.99,
    category: 'cocktail',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
  },
  {
    name: 'Margarita',
    description: 'Tequila, triple sec, and fresh lime juice',
    price: 11.99,
    category: 'cocktail',
    tags: ['vegetarian', 'vegan', 'glutenFree'],
    available: true,
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
