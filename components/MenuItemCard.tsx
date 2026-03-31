'use client';

import { MenuItem } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import MenuItemModal from './MenuItemModal';
import { getProxiedImageUrl } from '@/lib/imageProxy';
import { getMenuItemImageUrls } from '@/lib/menuImages';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const t = useTranslations('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(false);
  const imageUrls = getMenuItemImageUrls(item);
  const primaryImage = imageUrls[0];

  const handleCardActivate = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      setExpandedMobile((v) => !v);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className="group flex flex-col h-full min-h-0 w-full min-w-0 rounded-xl shadow-elegant overflow-hidden border border-amber-500/30 transition-shadow duration-300 ease-out relative cursor-pointer bg-gradient-to-br from-stone-800 via-amber-950 to-stone-900 hover:border-amber-400/50 hover:shadow-xl"
        onClick={handleCardActivate}
        role="button"
        tabIndex={0}
        aria-expanded={expandedMobile}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardActivate();
          }
        }}
      >
        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-all duration-500 pointer-events-none rounded-xl" />
        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 shimmer"></div>
        </div>

        <div className="p-4 relative z-10 flex flex-col flex-1 min-h-0 min-w-0">
          {/* Clickable Image Area */}
          <div className="mb-3 relative overflow-hidden rounded-lg shrink-0">
            <div className="w-full h-48 bg-stone-900/80 rounded-lg group-hover:scale-[1.02] transition-transform duration-300 ease-out relative flex items-center justify-center overflow-hidden border border-stone-600/50">
              {primaryImage ? (
                <Image
                  src={getProxiedImageUrl(primaryImage)}
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
              <div className={`absolute inset-0 flex items-center justify-center ${primaryImage ? 'bg-black/0 group-hover:bg-black/20' : ''} transition-all duration-300`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for details
                  </span>
                </div>
              </div>
              {imageUrls.length > 1 && (
                <span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 text-amber-100 text-[10px] font-bold px-2 py-0.5 border border-amber-500/40">
                  +{imageUrls.length - 1} photo{imageUrls.length - 1 !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Mobile only: description opens directly under the image (md+ uses block below) */}
          {expandedMobile && (
            <div className="mb-3 rounded-lg border border-amber-500/25 bg-stone-900/80 px-3 py-2.5 md:hidden">
              <p className="text-amber-50 text-sm leading-relaxed break-words whitespace-pre-wrap">{item.description}</p>
            </div>
          )}

          <div className="flex flex-col min-w-0 flex-1 min-h-0">
            {/* Title + price: stacked on mobile so description stays directly below */}
            <div className="flex flex-col gap-2 w-full min-w-0 sm:flex-row sm:justify-between sm:items-start">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors duration-300 min-w-0 leading-tight line-clamp-3 break-words">
                {item.name}
              </h3>
              <div className="flex-shrink-0 self-start sm:self-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/50 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="relative px-3 py-1.5 bg-gradient-to-r from-amber-600 to-stone-700 rounded-lg shadow-elegant border border-amber-500/30">
                    <span className="text-lg font-bold text-white">€{item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* md+: description below title + price; hidden on small screens (use expand under image) */}
            <p className="hidden md:block text-amber-100/90 mt-2 mb-3 text-sm leading-relaxed w-full break-words whitespace-pre-wrap group-hover:text-amber-100 transition-colors">
              {item.description}
            </p>

            {/* Mobile collapsed: short hint only */}
            {!expandedMobile && (
              <p className="md:hidden text-amber-200/75 mt-2 mb-0 text-xs leading-snug">Tap to show description under the photo</p>
            )}

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
            <div className="flex items-center gap-1 text-xs text-amber-200 mt-3">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Contains allergens</span>
            </div>
            )}
          </div>
        </div>
      </div>
      <MenuItemModal item={item} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
