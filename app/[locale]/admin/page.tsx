'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Reservation, MenuItem } from '@/lib/types';
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
  const [availability, setAvailability] = useState<{ availableSeats: number; totalCapacity: number; bookedSeats: number; confirmedBookedSeats: number; pendingBookedSeats: number } | null>(null);
  const [syncMenuLoading, setSyncMenuLoading] = useState(false);
  const [syncMenuMessage, setSyncMenuMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [clearMenuLoading, setClearMenuLoading] = useState(false);
  const [clearMenuConfirm, setClearMenuConfirm] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [addMenuItemLoading, setAddMenuItemLoading] = useState(false);
  const [addMenuItemMessage, setAddMenuItemMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main' as MenuItem['category'],
    image: '',
    tags: [] as string[],
    available: true,
  });
  const [showMenuSection, setShowMenuSection] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main' as MenuItem['category'],
    image: '',
    tags: [] as string[],
    available: true,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('adminAuth');
      if (token) {
        setIsAuthenticated(true);
        setCheckingAuth(false);
        fetchReservations();
        fetchAvailability();
        fetchMenuItems();
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

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/availability');
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu?all=true');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMenuItemMessage(null);
    setAddMenuItemLoading(true);
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: menuForm.name.trim(),
          description: menuForm.description.trim(),
          price: Number(menuForm.price),
          category: menuForm.category,
          image: menuForm.image.trim() || undefined,
          tags: menuForm.tags,
          available: menuForm.available,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setAddMenuItemMessage({ type: 'success', text: `"${menuForm.name}" added to the menu. It will appear on the main menu page.` });
        setMenuForm({ name: '', description: '', price: '', category: 'main', image: '', tags: [], available: true });
        fetchMenuItems();
      } else {
        setAddMenuItemMessage({ type: 'error', text: data.error || data.details || 'Failed to add menu item.' });
      }
    } catch (error) {
      setAddMenuItemMessage({ type: 'error', text: 'Failed to add menu item.' });
    } finally {
      setAddMenuItemLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setMenuForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image || '',
      tags: item.tags || [],
      available: item.available,
    });
    setEditMessage(null);
  };

  const closeEdit = () => {
    setEditingItem(null);
    setEditMessage(null);
  };

  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setEditMessage(null);
    setEditLoading(true);
    try {
      const response = await fetch(`/api/menu/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          price: Number(editForm.price),
          category: editForm.category,
          image: editForm.image.trim() || undefined,
          tags: editForm.tags,
          available: editForm.available,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setEditMessage({ type: 'success', text: `"${editForm.name}" updated.` });
        fetchMenuItems();
        setTimeout(() => closeEdit(), 1000);
      } else {
        setEditMessage({ type: 'error', text: data.error || data.details || 'Failed to update.' });
      }
    } catch (error) {
      setEditMessage({ type: 'error', text: 'Failed to update menu item.' });
    } finally {
      setEditLoading(false);
    }
  };

  const toggleEditTag = (tag: string) => {
    setEditForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleDeleteMenuItem = async () => {
    if (!deleteItemId) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/menu/${deleteItemId}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setDeleteItemId(null);
        fetchMenuItems();
      } else {
        setAddMenuItemMessage({ type: 'error', text: data.error || data.details || 'Failed to delete.' });
      }
    } catch (error) {
      setAddMenuItemMessage({ type: 'error', text: 'Failed to delete menu item.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const syncMenu = async () => {
    setSyncMenuLoading(true);
    setSyncMenuMessage(null);
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setSyncMenuMessage({ type: 'success', text: data.message || 'Menu synced successfully. Refresh the main page to see updates.' });
      } else {
        setSyncMenuMessage({ type: 'error', text: data.error || data.details || 'Failed to sync menu.' });
      }
    } catch (error) {
      setSyncMenuMessage({ type: 'error', text: 'Failed to sync menu.' });
    } finally {
      setSyncMenuLoading(false);
    }
  };

  const clearMenu = async () => {
    if (!clearMenuConfirm) {
      setClearMenuConfirm(true);
      setSyncMenuMessage({ type: 'error', text: 'Click "Clear menu" again to confirm. All menu items will be removed.' });
      return;
    }
    setClearMenuLoading(true);
    setSyncMenuMessage(null);
    setClearMenuConfirm(false);
    try {
      const response = await fetch('/api/menu/clear', { method: 'POST' });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setSyncMenuMessage({ type: 'success', text: data.message || 'Menu cleared. All items removed.' });
      } else {
        setSyncMenuMessage({ type: 'error', text: data.error || data.details || 'Failed to clear menu.' });
      }
    } catch (error) {
      setSyncMenuMessage({ type: 'error', text: 'Failed to clear menu.' });
    } finally {
      setClearMenuLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
      fetchAvailability();
      fetchMenuItems();
      const interval = setInterval(() => {
        fetchReservations();
        fetchAvailability();
      }, 30000);
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
        await fetchReservations();
        await fetchAvailability(); // Refresh so seat count updates immediately
        setRejectModal({ open: false, reservationId: null });
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  };

  const handleCheckIn = async (id: string, checkedIn: boolean) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, checkedIn }),
      });

      if (response.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error('Failed to update check-in status:', error);
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

  // Get confirmed (booked) reservations
  const bookedReservations = reservations.filter((reservation) => reservation.status === 'confirmed');
  const totalBookedSeats = bookedReservations.reduce((total, res) => total + res.guests, 0);

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
                Manage and track all Ristorante Africa reservations
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
                onClick={syncMenu}
                disabled={syncMenuLoading}
                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition-all duration-300 font-semibold text-sm border border-amber-200 disabled:opacity-50"
              >
                {syncMenuLoading ? 'Syncing…' : 'Sync menu'}
              </button>
              <button
                onClick={clearMenu}
                disabled={clearMenuLoading}
                className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-sm border disabled:opacity-50 ${clearMenuConfirm ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}
              >
                {clearMenuLoading ? 'Clearing…' : 'Clear menu'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold text-sm border border-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
          {syncMenuMessage && (
            <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${syncMenuMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {syncMenuMessage.text}
            </div>
          )}

          {/* Menu items: Add form + list */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowMenuSection(!showMenuSection)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-amber-200 shadow-elegant hover:bg-amber-50 transition-all font-semibold text-gray-700 mb-4"
            >
              <span>{showMenuSection ? '▼' : '▶'}</span>
              <span>Menu items</span>
              <span className="text-sm font-normal text-gray-500">({menuItems.length} on menu)</span>
            </button>
            {showMenuSection && (
              <div className="bg-white rounded-2xl shadow-elegant-lg p-6 lg:p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add menu item</h2>
                <form onSubmit={handleAddMenuItem} className="space-y-4 max-w-2xl">
                  <div>
                    <label htmlFor="menu-name" className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                    <input
                      id="menu-name"
                      type="text"
                      required
                      value={menuForm.name}
                      onChange={(e) => setMenuForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g. Grilled Salmon"
                    />
                  </div>
                  <div>
                    <label htmlFor="menu-description" className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                    <textarea
                      id="menu-description"
                      required
                      rows={3}
                      value={menuForm.description}
                      onChange={(e) => setMenuForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      placeholder="Short description of the dish"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="menu-price" className="block text-sm font-semibold text-gray-700 mb-1">Price *</label>
                      <input
                        id="menu-price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={menuForm.price}
                        onChange={(e) => setMenuForm((f) => ({ ...f, price: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="menu-category" className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                      <select
                        id="menu-category"
                        value={menuForm.category}
                        onChange={(e) => setMenuForm((f) => ({ ...f, category: e.target.value as MenuItem['category'] }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                      >
                        <option value="appetizer">Appetizer</option>
                        <option value="main">Main course</option>
                        <option value="dessert">Dessert</option>
                        <option value="beverage">Beverage</option>
                        <option value="wine">Wine</option>
                        <option value="beer">Beer</option>
                        <option value="cocktail">Cocktail</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="menu-image" className="block text-sm font-semibold text-gray-700 mb-1">Image URL (optional)</label>
                    <input
                      id="menu-image"
                      type="url"
                      value={menuForm.image}
                      onChange={(e) => setMenuForm((f) => ({ ...f, image: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-gray-700 mb-2">Tags (optional)</span>
                    <div className="flex flex-wrap gap-2">
                      {['vegetarian', 'vegan', 'glutenFree', 'spicy'].map((tag) => (
                        <label key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-amber-50">
                          <input
                            type="checkbox"
                            checked={menuForm.tags.includes(tag)}
                            onChange={() => toggleTag(tag)}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm font-medium capitalize">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="menu-available"
                      type="checkbox"
                      checked={menuForm.available}
                      onChange={(e) => setMenuForm((f) => ({ ...f, available: e.target.checked }))}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="menu-available" className="text-sm font-semibold text-gray-700">Available (show on menu)</label>
                  </div>
                  {addMenuItemMessage && (
                    <div className={`px-4 py-2 rounded-lg text-sm ${addMenuItemMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {addMenuItemMessage.text}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={addMenuItemLoading}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 font-semibold shadow-elegant disabled:opacity-50"
                  >
                    {addMenuItemLoading ? 'Adding…' : 'Add to menu'}
                  </button>
                </form>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Current menu items ({menuItems.length})</h3>
                  {menuItems.length === 0 ? (
                    <p className="text-gray-500 text-sm">No items yet. Add one above or use “Sync menu” to load the default list.</p>
                  ) : (
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                      {menuItems.map((item) => (
                        <li key={item.id} className="flex justify-between items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg text-sm group">
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="font-medium text-gray-900 truncate">{item.name}</span>
                            {!item.available && (
                              <span className="px-1.5 py-0.5 bg-gray-300 text-gray-600 rounded text-xs font-medium shrink-0">Hidden</span>
                            )}
                          </div>
                          <span className="text-amber-700 font-semibold shrink-0 capitalize">{item.category}</span>
                          <span className="text-gray-600 shrink-0">€{item.price.toFixed(2)}</span>
                          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteItemId(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Availability Summary */}
          {availability && (
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Available seats count down only when you <strong>accept</strong> a reservation. Pending requests do not reduce capacity. Seats reset to {availability.totalCapacity} each day.</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-elegant">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-green-700 mb-1">Available Seats</p>
                      <p className="text-3xl font-bold text-green-900">{availability.availableSeats}</p>
                      <p className="text-xs text-green-600 mt-1">out of {availability.totalCapacity} total (today)</p>
                    </div>
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 shadow-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-700 mb-1">Confirmed Bookings</p>
                    <p className="text-3xl font-bold text-amber-900">{availability.confirmedBookedSeats}</p>
                    <p className="text-xs text-amber-600 mt-1">
                      {bookedReservations.length} booking{bookedReservations.length !== 1 ? 's' : ''}
                      {availability.pendingBookedSeats > 0 && (
                        <span className="block mt-1 text-orange-600">+ {availability.pendingBookedSeats} pending</span>
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700 mb-1">Total Capacity</p>
                    <p className="text-3xl font-bold text-blue-900">{availability.totalCapacity}</p>
                    <p className="text-xs text-blue-600 mt-1">maximum seats</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}
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

        {/* Booked Users Section */}
        {bookedReservations.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-elegant-lg p-6 lg:p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    📋 Booked Users ({bookedReservations.length})
                  </h2>
                  <p className="text-gray-600">
                    Total confirmed bookings: <span className="font-bold text-amber-700">{totalBookedSeats} seats</span>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {bookedReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:shadow-elegant transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900">{reservation.name}</h3>
                          <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                            ✓ Confirmed
                          </span>
                          {reservation.checkedIn && (
                            <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Checked In
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-medium">{reservation.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{format(new Date(reservation.date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{reservation.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-medium font-bold text-amber-700">{reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}</span>
                          </div>
                        </div>
                        {reservation.checkedIn && reservation.checkedInAt && (
                          <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-300">
                            <p className="text-xs font-semibold text-blue-800 flex items-center gap-2">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Checked In: {format(new Date(reservation.checkedInAt), 'PPpp')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
          <div className="bg-white rounded-2xl shadow-elegant-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">Time</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">Name</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">Phone</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">Guests</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">Status</th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className={`border-b border-gray-100 hover:bg-amber-50/50 transition-colors ${reservation.status === 'pending' ? 'bg-amber-50/30' : ''}`}
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {format(new Date(reservation.date), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{reservation.time}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">{reservation.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{reservation.phone}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-amber-700">{reservation.guests}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)} {t(`admin.${reservation.status}`)}
                        </span>
                        {reservation.checkedIn && (
                          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            Checked in
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-wrap gap-2 justify-end">
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(reservation.id, 'confirmed')}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectClick(reservation.id)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {reservation.status === 'confirmed' && (
                            <>
                              {!reservation.checkedIn ? (
                                <button
                                  onClick={() => handleCheckIn(reservation.id, true)}
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                  Check In
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleCheckIn(reservation.id, false)}
                                  className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
                                >
                                  Undo
                                </button>
                              )}
                              <button
                                onClick={() => handleRejectClick(reservation.id)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {reservation.status === 'rejected' && (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredReservations.some((r) => r.specialRequests || r.rejectionReason) && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600">
                <strong>Details:</strong> Some rows have special requests or rejection reasons—check the &quot;Booked Users&quot; section or the reservation date/time for full info.
              </div>
            )}
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

      {/* Edit menu item modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit menu item</h2>
            <form onSubmit={handleUpdateMenuItem} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value as MenuItem['category'] }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="appetizer">Appetizer</option>
                    <option value="main">Main course</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                    <option value="wine">Wine</option>
                    <option value="beer">Beer</option>
                    <option value="cocktail">Cocktail</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-700 mb-2">Tags (optional)</span>
                <div className="flex flex-wrap gap-2">
                  {['vegetarian', 'vegan', 'glutenFree', 'spicy'].map((tag) => (
                    <label key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-amber-50">
                      <input
                        type="checkbox"
                        checked={editForm.tags.includes(tag)}
                        onChange={() => toggleEditTag(tag)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium capitalize">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.available}
                  onChange={(e) => setEditForm((f) => ({ ...f, available: e.target.checked }))}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-semibold text-gray-700">Available (show on menu)</span>
              </div>
              {editMessage && (
                <div className={`px-4 py-2 rounded-lg text-sm ${editMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {editMessage.text}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 font-semibold disabled:opacity-50"
                >
                  {editLoading ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete menu item confirmation */}
      {deleteItemId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete menu item?</h2>
            <p className="text-gray-600 mb-6">
              This will remove the item from the menu. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteMenuItem}
                disabled={deleteLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteItemId(null)}
                disabled={deleteLoading}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold border border-gray-200"
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
