'use client';

import { MenuItem } from '@/lib/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
  const t = useTranslations('common');

  if (!item || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image */}
        <div className="relative">
          {item.image ? (
            <div className="relative w-full min-h-[280px] max-h-[70vh] flex items-center justify-center bg-gray-100 rounded-t-3xl overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                width={800}
                height={600}
                className="w-full h-auto max-h-[70vh] object-contain"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{item.name}</h2>
                <div className="text-2xl font-bold text-amber-200">€{item.price.toFixed(2)}</div>
              </div>
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-amber-600 via-stone-700 to-stone-800 p-8 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 pr-12">{item.name}</h2>
              <div className="text-2xl font-bold text-amber-200">€{item.price.toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-amber-100 to-stone-100 text-amber-700 rounded-full text-sm font-semibold border border-amber-200"
                  >
                    {t(tag)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-1">{t('allergens')}:</p>
                  <p className="text-sm text-red-600">{item.allergens.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Category: <span className="font-semibold text-gray-700 capitalize">{item.category}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
