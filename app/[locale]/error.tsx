'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
