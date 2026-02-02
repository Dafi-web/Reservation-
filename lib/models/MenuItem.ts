import mongoose, { Schema, Model } from 'mongoose';
import { MenuItem } from '../types';

const MenuItemSchema = new Schema<MenuItem>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    nameTranslations: {
      type: Map,
      of: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionTranslations: {
      type: Map,
      of: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['appetizer', 'main', 'dessert', 'beverage', 'wine', 'beer', 'cocktail'],
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    allergens: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      enum: ['vegetarian', 'vegan', 'glutenFree', 'spicy'],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItemModel: Model<MenuItem> =
  mongoose.models.MenuItem || mongoose.model<MenuItem>('MenuItem', MenuItemSchema);

export default MenuItemModel;
