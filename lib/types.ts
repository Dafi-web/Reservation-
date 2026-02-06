export interface MenuItem {
  id: string;
  name: string;
  nameTranslations?: Record<string, string>;
  description: string;
  descriptionTranslations?: Record<string, string>;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'wine' | 'beer' | 'cocktail';
  image?: string;
  allergens?: string[];
  tags?: ('vegetarian' | 'vegan' | 'glutenFree' | 'spicy')[];
  available: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  email?: string; // Email is now optional
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  rejectionReason?: string;
  checkedIn?: boolean; // Whether the customer has checked in/arrived
  checkedInAt?: string; // Timestamp when checked in
  createdAt: string;
}
