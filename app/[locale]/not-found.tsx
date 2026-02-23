import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-stone-800 via-amber-950 to-stone-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-700/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-stone-700/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }} />
      </div>
      <div className="text-center px-4 relative z-10">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-2">404</h2>
        <div className="h-px w-16 bg-amber-500/60 mx-auto mb-4" />
        <p className="text-xl text-amber-100/90 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-700 to-stone-800 text-white rounded-full font-semibold shadow-elegant-lg hover:shadow-amber-600/30 transition-all duration-300 hover:scale-105 border-2 border-amber-500/30"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
