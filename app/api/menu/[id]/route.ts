import { NextResponse } from 'next/server';
import { updateMenuItem, deleteMenuItem } from '@/lib/data';
import { MenuItem } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Menu item id is required' }, { status: 400 });
    }
    const body = await request.json();
    const {
      name,
      description,
      price,
      category,
      image,
      tags,
      allergens,
      available,
    } = body;

    const updates: Partial<Omit<MenuItem, 'id'>> = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (price !== undefined) {
      const num = Number(price);
      if (!Number.isNaN(num) && num >= 0) updates.price = num;
    }
    if (category !== undefined) {
      const valid: MenuItem['category'][] = ['appetizer', 'main', 'dessert', 'beverage', 'wine', 'beer', 'cocktail'];
      if (valid.includes(category)) updates.category = category;
    }
    if (image !== undefined) updates.image = String(image).trim() || undefined;
    if (Array.isArray(tags)) updates.tags = tags.filter((t: string) => ['vegetarian', 'vegan', 'glutenFree', 'spicy'].includes(t));
    if (Array.isArray(allergens)) updates.allergens = allergens.filter((a: unknown) => typeof a === 'string');
    if (typeof available === 'boolean') updates.available = available;

    const item = await updateMenuItem(id, updates);
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Menu item id is required' }, { status: 400 });
    }
    const deleted = await deleteMenuItem(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item', details: (error as Error).message },
      { status: 500 }
    );
  }
}
