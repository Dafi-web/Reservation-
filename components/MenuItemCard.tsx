'use client';

import { MenuItem } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import MenuItemModal from './MenuItemModal';

interface MenuItemCardProps {
  item: MenuItem;
  index?: number;
  isVisible?: boolean;
}

export default function MenuItemCard({ item, index = 0, isVisible = true }: MenuItemCardProps) {
  const t = useTranslations('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const staggerDelay = isVisible ? index * 0.06 : 0;

  return (
    <>
      <div
        className="group rounded-xl shadow-elegant overflow-hidden hover-lift border border-amber-500/30 transition-all duration-500 ease-out relative cursor-pointer bg-gradient-to-br from-stone-800 via-amber-950 to-stone-900 hover:border-amber-400/50 hover:shadow-amber-900/30"
        style={
          isVisible
            ? {
                animation: 'fadeInUpScale 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
                animationDelay: `${staggerDelay}s`,
              }
            : undefined
        }
        onClick={() => setIsModalOpen(true)}
      >
        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-all duration-500 pointer-events-none rounded-xl" />
        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 shimmer"></div>
        </div>

        <div className="p-4 relative z-10">
          {/* Clickable Image Area */}
          <div className="mb-3 relative overflow-hidden rounded-lg">
            <div className="w-full h-48 bg-stone-900/80 rounded-lg group-hover:scale-105 transition-transform duration-500 ease-out relative flex items-center justify-center overflow-hidden border border-stone-600/50">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-stone-900/80 flex items-center justify-center">
                  <span className="text-6xl opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.category === 'appetizer' ? '🥗' : 
                     item.category === 'main' ? '🍽️' : 
                     item.category === 'dessert' ? '🍰' : 
                     item.category === 'beverage' ? '☕' : 
                     item.category === 'wine' ? '🍷' : 
                     item.category === 'beer' ? '🍺' : '🍹'}
                  </span>
                </div>
              )}
              <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'bg-black/0 group-hover:bg-black/20' : ''} transition-all duration-300`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for details
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Header with Price Badge */}
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors duration-300 flex-1 leading-tight line-clamp-2">
              {item.name}
            </h3>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/50 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="relative px-3 py-1.5 bg-gradient-to-r from-amber-600 to-stone-700 rounded-lg shadow-elegant border border-amber-500/30">
                  <span className="text-lg font-bold text-white">
                    €{item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-amber-100/90 mb-3 text-xs leading-relaxed line-clamp-2 group-hover:text-amber-100 transition-colors">
            {item.description}
          </p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-amber-500/20 text-amber-200 text-xs rounded-full font-semibold border border-amber-500/40"
                >
                  {t(tag)}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="px-2 py-1 bg-stone-600/50 text-amber-100/90 text-xs rounded-full">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Allergens Indicator */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Contains allergens</span>
            </div>
          )}
        </div>
      </div>
      <MenuItemModal item={item} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
