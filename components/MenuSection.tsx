'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import MenuItemCard from './MenuItemCard';

interface MenuSectionProps {
  category: {
    key: string;
    label: string;
    icon: string;
    color: string;
  };
  items: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function MenuSection({ category, items, isOpen, onToggle }: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
      {/* Category Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`text-4xl transform transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-0'}`}>
            {category.icon}
          </div>
          <div className="flex-1 text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
              {category.label}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-sm font-semibold">
            {items.length}
          </span>
          <svg
            className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
