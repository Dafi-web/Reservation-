'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function FloatingAdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const t = useTranslations('common');

  useEffect(() => {
    // Always show the button on mobile
    if (typeof window !== 'undefined') {
      setIsVisible(true);
      const token = sessionStorage.getItem('adminAuth');
      setIsAdmin(!!token);
    }
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('adminAuth');
        setIsAdmin(!!token);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const handleClick = () => {
    if (isAdmin) {
      router.push('/admin');
    } else {
      // Show admin login - redirect to admin page which will show login
      router.push('/admin');
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 md:hidden bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 rounded-full shadow-elegant-lg hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label={isAdmin ? "Admin Panel" : "Admin Access"}
      title={isAdmin ? "Admin Panel" : "Admin Access"}
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {isAdmin ? (
          // Shield with checkmark (authenticated)
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        ) : (
          // Lock icon (not authenticated)
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        )}
      </svg>
      {!isAdmin && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      )}
    </button>
  );
}
