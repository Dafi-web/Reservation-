'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Reservation } from '@/lib/types';
import { format } from 'date-fns';
import AdminAuth from '@/components/AdminAuth';

export default function AdminPage() {
  const t = useTranslations();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; reservationId: string | null }>({
    open: false,
    reservationId: null,
  });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('adminAuth');
      if (token) {
        setIsAuthenticated(true);
        setCheckingAuth(false);
        fetchReservations();
      } else {
        setIsAuthenticated(false);
        setCheckingAuth(false);
      }
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    fetchReservations();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setReservations([]);
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
      const interval = setInterval(fetchReservations, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const updateStatus = async (id: string, status: Reservation['status'], reason?: string) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, rejectionReason: reason }),
      });

      if (response.ok) {
        fetchReservations();
        setRejectModal({ open: false, reservationId: null });
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  };

  const handleRejectClick = (id: string) => {
    setRejectModal({ open: true, reservationId: id });
    setRejectionReason('');
  };

  const handleRejectConfirm = () => {
    if (rejectModal.reservationId && rejectionReason.trim()) {
      updateStatus(rejectModal.reservationId, 'rejected', rejectionReason.trim());
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const reservationDate = new Date(`${reservation.date}T${reservation.time}`);
    const now = new Date();

    if (filter === 'upcoming') {
      return reservationDate >= now;
    } else if (filter === 'past') {
      return reservationDate < now;
    }
    return true;
  });

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return '✓';
      case 'rejected':
        return '✕';
      default:
        return '⏳';
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={handleAuthSuccess} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-gray-600">Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {t('admin.title')}
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track all restaurant reservations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-elegant">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-gray-700">{filteredReservations.length}</span>
                <span className="text-gray-500 text-sm">reservations</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold text-sm border border-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-elegant-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-elegant'
              }`}
            >
              All Reservations
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'upcoming'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-elegant-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-elegant'
              }`}
            >
              {t('admin.upcoming')}
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'past'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-elegant-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-elegant'
              }`}
            >
              {t('admin.past')}
            </button>
          </div>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-elegant-lg p-12 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('admin.noReservations')}</h3>
            <p className="text-gray-500">No reservations match your current filter</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl shadow-elegant-lg p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {reservation.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(reservation.status)}`}>
                            <span className="mr-1">{getStatusIcon(reservation.status)}</span>
                            {t(`admin.${reservation.status}`)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {reservation.email && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium truncate">{reservation.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">{reservation.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{format(new Date(reservation.date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{reservation.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">{reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}</span>
                      </div>
                    </div>
                    {reservation.specialRequests && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Special Requests:</p>
                        <p className="text-sm text-gray-600">{reservation.specialRequests}</p>
                      </div>
                    )}
                    {reservation.rejectionReason && (
                      <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-600">{reservation.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 lg:min-w-[200px]">
                    {reservation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(reservation.id, 'confirmed')}
                          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-elegant hover:shadow-lg transform hover:scale-105"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleRejectClick(reservation.id)}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 font-semibold shadow-elegant hover:shadow-lg transform hover:scale-105"
                        >
                          ✕ Reject
                        </button>
                      </>
                    )}
                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => handleRejectClick(reservation.id)}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 font-semibold shadow-elegant hover:shadow-lg transform hover:scale-105"
                      >
                        ✕ Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8 animate-scale-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reject Reservation</h2>
              <p className="text-gray-600">Please provide a reason for rejecting this reservation.</p>
            </div>
            <div className="mb-6">
              <label htmlFor="rejectionReason" className="block text-sm font-semibold text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                placeholder="Enter the reason for rejection..."
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 font-semibold shadow-elegant hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setRejectModal({ open: false, reservationId: null });
                  setRejectionReason('');
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold border border-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
