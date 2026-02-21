'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import MenuItemCard from './MenuItemCard';

interface MenuSectionProps {
  category: {
    key: string;
    label: string;
    icon: string;
    iconImageUrl?: string;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
  items: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function MenuSection({ category, items, isOpen, onToggle }: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className={`mb-6 border-2 ${category.borderColor} rounded-3xl overflow-hidden bg-white shadow-elegant hover:shadow-elegant-lg transition-all duration-300`}>
      {/* Category Header - Clickable and Centered */}
      <button
        onClick={onToggle}
        className={`w-full p-8 flex flex-col items-center justify-center hover:bg-gradient-to-r ${category.bgColor} transition-all duration-300 group relative overflow-hidden`}
      >
        {/* Gradient Background Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        <div className="relative z-10 flex flex-col items-center gap-4 w-full">
          {/* Icon with Gradient Background (or image for e.g. beverage) */}
          <div
            className={`relative rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 overflow-hidden ${
              category.iconImageUrl ? 'w-24 h-24 md:w-28 md:h-28' : `p-4 bg-gradient-to-br ${category.color}`
            }`}
            style={category.iconImageUrl ? { backgroundImage: `url(${category.iconImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
          >
            {!category.iconImageUrl && (
              <>
                <span className="text-5xl md:text-6xl relative z-10 block">{category.icon}</span>
                <div className="absolute inset-0 rounded-2xl bg-white opacity-20"></div>
              </>
            )}
          </div>
          
          {/* Title and Count - Centered */}
          <div className="text-center w-full">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold ${category.textColor} group-hover:scale-105 transition-transform duration-300 mb-3 text-center`}>
              {category.label}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className={`px-4 py-2 bg-gradient-to-r ${category.color} text-white rounded-full text-sm font-bold shadow-lg`}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          
          {/* Arrow Indicator */}
          <svg
            className={`w-8 h-8 ${category.textColor} transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
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
