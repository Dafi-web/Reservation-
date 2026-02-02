import { getTranslations } from 'next-intl/server';
import { getMenuItems } from '@/lib/data';
import MenuItemCard from '@/components/MenuItemCard';
import { Link } from '@/i18n/routing';

// Force dynamic rendering to avoid build-time MongoDB connection
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations();
  const menuItems = await getMenuItems();

  const categories = [
    { key: 'appetizer', label: t('menu.appetizers'), icon: '🥗', color: 'from-green-400 to-emerald-500' },
    { key: 'main', label: t('menu.mainCourses'), icon: '🍽️', color: 'from-amber-400 to-orange-500' },
    { key: 'dessert', label: t('menu.desserts'), icon: '🍰', color: 'from-pink-400 to-rose-500' },
    { key: 'beverage', label: t('menu.beverages'), icon: '☕', color: 'from-amber-300 to-yellow-400' },
    { key: 'wine', label: t('menu.wine'), icon: '🍷', color: 'from-purple-400 to-pink-500' },
    { key: 'beer', label: t('menu.beer'), icon: '🍺', color: 'from-yellow-400 to-amber-500' },
    { key: 'cocktail', label: t('menu.cocktails'), icon: '🍹', color: 'from-blue-400 to-cyan-500' },
  ] as const;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Enhanced Visual Appeal */}
      <section className="relative bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-amber-100/80 py-24 lg:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNTllMGIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC0xNHYyaC0ydi0yaDJ6bS0xNCAxNHYyaC0ydi0yaDJ6bTAtMTR2MmgtMnYtMmgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            {/* Decorative Elements */}
            <div className="flex justify-center items-center mb-6 space-x-2">
              <div className="decorative-dot animate-pulse-glow"></div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="text-2xl">✨</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="decorative-dot animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="gradient-text">
                {t('menu.title')}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed font-light">
              Discover our exquisite selection of culinary delights and handcrafted beverages
              <br />
              <span className="text-amber-600 font-medium">Crafted with passion, served with excellence</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/reservations"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white rounded-2xl font-bold text-lg shadow-glow hover:shadow-2xl transition-all duration-300 transform hover:scale-110 overflow-hidden"
              >
                <span className="absolute inset-0 shimmer"></span>
                <span className="relative z-10 flex items-center">
                  {t('common.bookTable')}
                  <svg className="ml-2 w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Fresh Ingredients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Sections with Enhanced Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {categories.map((category, index) => {
          const items = menuItems.filter(
            (item) => item.category === category.key
          );
          if (items.length === 0) return null;

          return (
            <section key={category.key} className="mb-24 last:mb-0">
              {/* Category Header with Icon */}
              <div className="flex items-center mb-10">
                <div className="flex items-center space-x-6 flex-1">
                  <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-elegant-lg transform hover:scale-110 transition-transform duration-300`}>
                    <span className="text-5xl relative z-10">{category.icon}</span>
                    <div className="absolute inset-0 rounded-2xl bg-white opacity-20"></div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
                      {category.label}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-32 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full"></div>
                      <div className="decorative-dot"></div>
                      <div className="h-1.5 w-16 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
              
              {/* Section Divider */}
              {index < categories.length - 1 && (
                <div className="section-divider mt-16"></div>
              )}
            </section>
          );
        })}
      </div>

      {/* Footer with Admin Access */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              <p>&copy; {new Date().getFullYear()} Restaurant. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2"
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
