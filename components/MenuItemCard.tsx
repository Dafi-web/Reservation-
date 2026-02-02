'use client';

import { MenuItem } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const t = useTranslations('common');

  return (
    <div className="group bg-white rounded-3xl shadow-elegant overflow-hidden hover-lift border border-gray-100/50 transition-all duration-500 relative">
      {/* Decorative Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-orange-50/0 to-amber-50/0 group-hover:from-amber-50/40 group-hover:via-orange-50/20 group-hover:to-amber-50/40 transition-all duration-500 pointer-events-none"></div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 shimmer"></div>
      </div>

      <div className="p-6 lg:p-8 relative z-10">
        {/* Header with Price Badge */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 flex-1 leading-tight">
            {item.name}
          </h3>
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-elegant">
                <span className="text-xl font-bold text-white">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-5 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs rounded-full font-semibold border border-amber-200/50 group-hover:border-amber-300 group-hover:shadow-elegant transition-all duration-300"
            >
              {t(tag)}
            </span>
          ))}
        </div>

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="pt-4 border-t border-gray-100/50 group-hover:border-amber-100 transition-colors">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">{t('allergens')}:</p>
                <p className="text-xs text-gray-600">{item.allergens.join(', ')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
