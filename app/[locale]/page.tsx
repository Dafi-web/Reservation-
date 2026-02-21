import { getTranslations } from 'next-intl/server';
import { getMenuItems } from '@/lib/data';
import InteractiveMenu from '@/components/InteractiveMenu';
import { Link } from '@/i18n/routing';

// Force dynamic rendering to avoid build-time MongoDB connection
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations();
  let menuItems: Awaited<ReturnType<typeof getMenuItems>>;
  try {
    menuItems = await getMenuItems();
  } catch {
    menuItems = [];
  }
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  const categories = [
    { key: 'appetizer', label: t('menu.appetizers'), icon: '🥗', iconImageUrl: 'https://github.com/Dafi-web/digital-menu-list/blob/master/WhatsApp%20Image%202026-02-21%20at%2019.07.24.jpeg?raw=true', color: 'from-green-500 via-emerald-500 to-teal-500', bgColor: 'from-green-50 to-emerald-50', textColor: 'text-green-700', borderColor: 'border-green-300' },
    { key: 'main', label: t('menu.mainCourses'), icon: '🍽️', iconImageUrl: 'https://github.com/Dafi-web/digital-menu-list/blob/master/WhatsApp%20Image%202026-02-21%20at%2015.17.15.jpeg?raw=true', color: 'from-red-600 via-amber-600 to-stone-700', bgColor: 'from-red-50 to-stone-50', textColor: 'text-red-700', borderColor: 'border-red-300' },
    { key: 'dessert', label: t('menu.desserts'), icon: '🍰', iconImageUrl: 'https://github.com/Dafi-web/digital-menu-list/blob/master/WhatsApp%20Image%202026-02-21%20at%2015.29.50.jpeg?raw=true', color: 'from-pink-500 via-rose-500 to-fuchsia-500', bgColor: 'from-pink-50 to-rose-50', textColor: 'text-pink-700', borderColor: 'border-pink-300' },
    { key: 'beverage', label: t('menu.beverages'), icon: '☕', iconImageUrl: 'https://raw.githubusercontent.com/dafi-tech/Menu/refs/heads/main/Boss.jpg', color: 'from-amber-700 via-amber-600 to-stone-600', bgColor: 'from-amber-50 to-stone-50', textColor: 'text-amber-800', borderColor: 'border-amber-300' },
    { key: 'wine', label: t('menu.wine'), icon: '🍷', iconImageUrl: 'https://github.com/Dafi-web/digital-menu-list/blob/master/WhatsApp%20Image%202026-02-21%20at%2018.52.37.jpeg?raw=true', color: 'from-purple-600 via-indigo-600 to-blue-600', bgColor: 'from-purple-50 to-indigo-50', textColor: 'text-purple-700', borderColor: 'border-purple-300' },
    { key: 'beer', label: t('menu.beer'), icon: '🍺', color: 'from-amber-500 via-amber-600 to-stone-600', bgColor: 'from-amber-50 to-stone-50', textColor: 'text-amber-800', borderColor: 'border-amber-300' },
    { key: 'cocktail', label: t('menu.cocktails'), icon: '🍹', color: 'from-cyan-500 via-blue-500 to-indigo-500', bgColor: 'from-cyan-50 to-blue-50', textColor: 'text-cyan-700', borderColor: 'border-cyan-300' },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Ristorante Africa */}
      <section className="relative py-32 lg:py-40 overflow-hidden min-h-screen">
        {/* Background - professional gradient, no image */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-stone-800 via-amber-950 to-stone-900"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-700/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-stone-700/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-amber-800/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Restaurant Name */}
            <div className="mb-8 animate-fade-in-up animation-delay-100">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white tracking-tight">
                Ristorante Africa
              </h1>
              <div className="flex justify-center items-center mb-6 space-x-3">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                <div className="text-amber-500 text-xl animate-breathe">✦</div>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white animate-fade-in-up animation-delay-200">
              {t('menu.title')}
            </h2>
            
            <p className="text-lg md:text-xl text-amber-50 mb-12 leading-relaxed font-light max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
              {t('menu.heroSubtitle')}
              <br />
              <span className="text-amber-400 font-medium mt-2 block">{t('menu.heroTagline')}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animation-delay-400">
              <Link
                href="/reservations"
                className="group relative inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-amber-600 via-amber-700 to-stone-800 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-amber-600/50 transition-all duration-300 transform hover:scale-105 overflow-hidden border-2 border-amber-500/30 animate-glow-pulse"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-700 via-stone-800 to-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  {t('common.bookTable')}
                  <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <div className="flex items-center space-x-6 text-sm text-amber-200 animate-fade-in-up animation-delay-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Authentic Flavors</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Traditional Recipes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Menu with Collapsible Categories - professional color background, no image */}
      <section className="bg-gradient-to-b from-stone-100 via-slate-50 to-gray-50">
        <InteractiveMenu categories={categories} menuItems={safeMenuItems} />
      </section>

      {/* Footer with Admin Access */}
      <footer className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-amber-100 py-10 mt-20 border-t border-stone-700/50 animate-fade-in-up animation-delay-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              <p className="font-semibold text-amber-200 mb-1">Ristorante Africa</p>
              <p>&copy; {new Date().getFullYear()} Ristorante Africa. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 border border-stone-700/50 px-4 py-2 rounded-lg hover:bg-stone-800/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
