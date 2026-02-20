'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

const CUSTOMER_SUPPORT_PHONE = '394567890';

export default function ReservationsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const effectiveDate = formData.date || today;

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoadingAvailability(true);
        const url = effectiveDate ? `/api/availability?date=${effectiveDate}` : '/api/availability';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setAvailableSeats(data.availableSeats);
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
    const interval = setInterval(fetchAvailability, 15000);
    return () => clearInterval(interval);
  }, [effectiveDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Check availability before submitting
    const requestedGuests = parseInt(formData.guests, 10);
    if (availableSeats !== null && availableSeats < requestedGuests) {
      setMessage({ 
        type: 'error', 
        text: `Not enough available seats. Only ${availableSeats} seat${availableSeats !== 1 ? 's' : ''} available. Please contact customer support at ${CUSTOMER_SUPPORT_PHONE}.` 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: t('reservation.success') });
        const bookedDate = formData.date || today;
        const availResponse = await fetch(`/api/availability?date=${bookedDate}`);
        if (availResponse.ok) {
          const availData = await availResponse.json();
          setAvailableSeats(availData.availableSeats);
        }
        setFormData({
          name: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          specialRequests: '',
        });
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        if (responseData.availableSeats !== undefined) {
          setMessage({ 
            type: 'error', 
            text: `Not enough available seats. Only ${responseData.availableSeats} seat${responseData.availableSeats !== 1 ? 's' : ''} available. Please contact customer support at ${CUSTOMER_SUPPORT_PHONE}.` 
          });
        } else {
          setMessage({ type: 'error', text: t('reservation.error') });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('reservation.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 py-12 lg:py-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-stone-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-effect rounded-3xl shadow-elegant-lg p-8 lg:p-12 border border-white/50 animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-stone-700 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {t('reservation.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              Reserve your table and experience culinary excellence
            </p>
            
            {/* Available Seats Display */}
            {availableSeats !== null && (
              <div className={`mt-4 p-4 rounded-xl border-2 ${
                availableSeats === 0 
                  ? 'bg-red-50 border-red-300 text-red-800' 
                  : availableSeats <= 10
                  ? 'bg-amber-50 border-amber-400 text-amber-800'
                  : 'bg-green-50 border-green-300 text-green-800'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-semibold text-lg">
                    {availableSeats === 0 
                      ? 'No Availability' 
                      : `${availableSeats} Seat${availableSeats !== 1 ? 's' : ''} Available`
                    }
                  </span>
                </div>
                {availableSeats === 0 && (
                  <p className="text-center mt-2 text-sm">
                    Please contact customer support at{' '}
                    <a href={`tel:${CUSTOMER_SUPPORT_PHONE}`} className="font-bold underline hover:text-red-900">
                      {CUSTOMER_SUPPORT_PHONE}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.date')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  min={today}
                  max={maxDateStr}
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.time')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="guests" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('common.guests')} <span className="text-red-500">*</span>
                {availableSeats !== null && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (Max: {availableSeats} available)
                  </span>
                )}
              </label>
              <select
                id="guests"
                name="guests"
                required
                value={formData.guests}
                onChange={handleChange}
                disabled={availableSeats === 0}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${
                  availableSeats === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isDisabled = availableSeats !== null && num > availableSeats;
                  return (
                    <option key={num} value={num} disabled={isDisabled}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                      {isDisabled ? ' (Not Available)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="specialRequests" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('common.specialRequests')}
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows={4}
                value={formData.specialRequests}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                placeholder="Any dietary restrictions, allergies, or special requests..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || availableSeats === 0 || (availableSeats !== null && parseInt(formData.guests, 10) > availableSeats)}
                className="flex-1 bg-gradient-to-r from-amber-600 to-stone-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-700 hover:to-stone-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-elegant-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  t('common.submit')
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-200"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
