'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter, routing } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as string || 'en';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as admin
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('adminAuth');
      setIsAdmin(!!token);
    }
  }, []);

  // Listen for storage changes (when admin logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('adminAuth');
        setIsAdmin(!!token);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check on focus in case of same-tab logout
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.push(pathname as any, { locale: newLocale });
  };

  const navLinks = [
    { href: '/', label: t('menu') },
    { href: '/reservations', label: t('reservations') },
  ];

  // Only add admin link if authenticated (for desktop navigation)
  // Mobile uses floating button instead
  if (isAdmin) {
    navLinks.push({ href: '/admin', label: t('admin') });
  }

  return (
    <nav className="glass-effect shadow-elegant sticky top-0 z-50 border-b border-amber-200/30 bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  🍽️
                </div>
              </div>
              <span className="text-2xl font-bold gradient-text">
                Africa Restorante
              </span>
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                    pathname === link.href 
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-elegant' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700'
                  }`}
                >
                  {pathname === link.href && (
                    <div className="absolute inset-0 shimmer"></div>
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 uppercase tracking-wider hidden sm:inline font-medium">{t('language')}</span>
            <select
              onChange={handleLanguageChange}
              value={currentLocale}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-all cursor-pointer hover:border-amber-400 hover:shadow-elegant"
            >
              {routing.locales.map((locale) => (
                <option key={locale} value={locale}>
                  {locale.toUpperCase()}
                </option>
              ))}
            </select>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-amber-100/50 py-4 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    pathname === link.href 
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-elegant' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
