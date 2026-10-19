import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ShoppingBag, Calendar, Search, CheckCircle2, Clock, XCircle,
  Phone, Mail, Car, MapPin, User, Check, X
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Order, Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const SellerOrdersBookingsPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const sellerId = user?.user_id || user?.id || 'seller-ali-hassan';

  // If path is /seller/bookings default to bookings tab
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings'>(
    location.pathname.includes('/bookings') ? 'bookings' : 'orders'
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [sellerId]);

  useEffect(() => {
    if (location.pathname.includes('/bookings')) {
      setActiveTab('bookings');
    } else if (location.pathname.includes('/orders')) {
      setActiveTab('orders');
    }
  }, [location.pathname]);

  const loadData = async () => {
    const [ordersData, bookingsData] = await Promise.all([
      DealershipService.getOrders(),
      DealershipService.getBookings(sellerId)
    ]);
    // Filter to seller's orders and test drives
    setOrders(ordersData);
    setBookings(bookingsData);
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    await DealershipService.updateOrderStatus(id, status);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleUpdateBookingStatus = async (id: string, status: Booking['status']) => {
    await DealershipService.updateBookingStatus(id, status);
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          {activeTab === 'orders' ? (
            <ShoppingBag className="w-7 h-7 text-[#ef172b]" />
          ) : (
            <Calendar className="w-7 h-7 text-[#ef172b]" />
          )}
          Orders & Bookings
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage customer vehicle reservations, purchase orders, and scheduled test drive appointments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-[#ef172b] text-[#ef172b]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Vehicle Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'bookings'
              ? 'border-[#ef172b] text-[#ef172b]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Test Drive Bookings ({bookings.length})
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'orders' ? 'orders' : 'bookings'} by customer or car...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'orders' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Item Details</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {o.order_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{o.customer_name}</div>
                      <div className="text-[11px] text-slate-400">{o.customer_phone || o.phone || ''}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">{o.items?.[0]?.name || o.product_name || 'Showroom Vehicle'}</div>
                      <div className="text-[10px] text-slate-400">Qty: {o.items?.[0]?.quantity || 1}</div>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      TZS {(o.total_amount || o.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        String(o.status).toLowerCase() === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : String(o.status).toLowerCase() === 'confirmed'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {String(o.status).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'Confirmed')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold"
                          title="Confirm Order"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'Completed')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-bold"
                          title="Mark Delivered"
                        >
                          Deliver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Appointment</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {b.booking_reference || b.booking_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{b.customer_name}</div>
                      <div className="text-[11px] text-slate-400">{b.customer_phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {b.vehicle_title || 'Showroom Vehicle'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      <div>{b.preferred_date || b.booking_date}</div>
                      <div className="text-[11px] text-slate-400">{b.preferred_time || b.booking_time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        String(b.status).toLowerCase() === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : String(b.status).toLowerCase() === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {String(b.status).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                          className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
