import { NextResponse } from 'next/server';
import { getMenuItems, createMenuItem } from '@/lib/data';
import { MenuItem } from '@/lib/types';

export async function GET() {
  try {
    const menuItems = await getMenuItems();
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      category,
      image,
      tags,
      allergens,
      available = true,
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required', field: 'name' },
        { status: 400 }
      );
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return NextResponse.json(
        { error: 'Description is required', field: 'description' },
        { status: 400 }
      );
    }
    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json(
        { error: 'Valid price is required', field: 'price' },
        { status: 400 }
      );
    }
    const validCategories: MenuItem['category'][] = ['appetizer', 'main', 'dessert', 'beverage', 'wine', 'beer', 'cocktail'];
    if (!category || !validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Valid category is required', field: 'category' },
        { status: 400 }
      );
    }

    const payload: Omit<MenuItem, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      price: numPrice,
      category,
      available: Boolean(available),
    };
    if (image != null && String(image).trim()) payload.image = String(image).trim();
    if (Array.isArray(tags)) payload.tags = tags.filter((t: string) => ['vegetarian', 'vegan', 'glutenFree', 'spicy'].includes(t));
    if (Array.isArray(allergens)) payload.allergens = allergens.filter((a: unknown) => typeof a === 'string');

    const item = await createMenuItem(payload);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item', details: (error as Error).message },
      { status: 500 }
    );
  }
}
