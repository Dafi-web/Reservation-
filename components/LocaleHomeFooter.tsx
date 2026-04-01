'use client';

import { usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

/**
 * Home + QR page only. No barcode on the menu: QR lives at `/qr`; home footer links there.
 */
export default function LocaleHomeFooter() {
  const pathname = usePathname();
  const tMenu = useTranslations('menu');

  if (pathname !== '/' && pathname !== '/qr') {
    return null;
  }

  const isHome = pathname === '/';

  return (
    <footer className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-amber-100 py-10 mt-20 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] animate-fade-in-up animation-delay-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 w-full">
          <div className="text-sm text-center md:text-left order-2 md:order-1">
            <p className="font-semibold text-amber-200 mb-1">Ristorante Africa</p>
            <p>&copy; {new Date().getFullYear()} Ristorante Africa. All rights reserved.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4 order-1 md:order-2 shrink-0">
            {isHome ? (
              <Link
                href="/qr"
                className="text-sm font-semibold text-amber-200 hover:text-amber-100 transition-colors text-center md:text-right px-4 py-3 rounded-xl bg-stone-800/35 hover:bg-stone-800/55 shadow-md"
              >
                {tMenu('footerQrLink')}
              </Link>
            ) : (
              <Link
                href="/"
                className="text-sm font-semibold text-amber-200 hover:text-amber-100 transition-colors text-center md:text-right px-4 py-3 rounded-xl bg-stone-800/35 hover:bg-stone-800/55 shadow-md"
              >
                {tMenu('backToMenu')}
              </Link>
            )}
            <Link
              href="/admin"
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800/25 hover:bg-stone-800/45 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
