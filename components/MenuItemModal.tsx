'use client';

import { useEffect, useState } from 'react';
import { MenuItem } from '@/lib/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getProxiedImageUrl } from '@/lib/imageProxy';
import { getMenuItemImageUrls } from '@/lib/menuImages';

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
  const t = useTranslations('common');
  const [photoIndex, setPhotoIndex] = useState(0);

  const urls = item ? getMenuItemImageUrls(item) : [];
  const hasPhotos = urls.length > 0;
  const currentUrl = urls[photoIndex] ?? urls[0];

  useEffect(() => {
    setPhotoIndex(0);
  }, [item?.id, isOpen]);

  if (!item || !isOpen) return null;

  const goPrev = () => setPhotoIndex((i) => (i <= 0 ? urls.length - 1 : i - 1));
  const goNext = () => setPhotoIndex((i) => (i >= urls.length - 1 ? 0 : i + 1));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image(s) only — text follows below so mobile layout stays one column */}
        <div className="relative shrink-0">
          {hasPhotos ? (
            <div className="relative w-full min-h-[200px] max-h-[45vh] sm:max-h-[50vh] flex items-center justify-center bg-gray-100 rounded-t-3xl overflow-hidden">
              <Image
                key={currentUrl}
                src={getProxiedImageUrl(currentUrl)}
                alt={item.name}
                width={800}
                height={600}
                className="w-full h-auto max-h-[45vh] sm:max-h-[50vh] object-contain"
                unoptimized
              />
              {urls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/55 text-white flex items-center justify-center backdrop-blur-sm z-10"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/55 text-white flex items-center justify-center backdrop-blur-sm z-10"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {urls.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoIndex(i);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          i === photoIndex ? 'w-6 bg-white' : 'w-2 bg-white/70 hover:bg-white'
                        }`}
                        aria-label={`Photo ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-10 h-10 bg-black/45 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors text-white z-10"
                type="button"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative rounded-t-3xl bg-stone-100 min-h-[3.5rem] shrink-0">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-stone-200/90 hover:bg-stone-300 flex items-center justify-center transition-colors text-stone-800 z-10"
                type="button"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Name, price, description — directly under image (single column, mobile-friendly) */}
        <div className="px-4 sm:px-8 pt-5 pb-6 sm:pb-8 flex-1 min-h-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{item.name}</h2>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-2">€{item.price.toFixed(2)}</div>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-gray-700 text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap break-words">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-stone-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200/80"
                  >
                    {t(tag)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-1">{t('allergens')}</p>
                  <p className="text-sm text-red-600">{item.allergens.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-600 capitalize">{item.category}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
