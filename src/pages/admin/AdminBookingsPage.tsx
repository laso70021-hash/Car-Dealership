import React, { useState, useEffect } from 'react';
import { Calendar, Search, CheckCircle2, XCircle, Clock, Check, X, Car, Wrench, Phone, Mail } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Booking } from '../../types';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'test_drive' | 'service'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const list = await DealershipService.getBookings();
    setBookings(list);
  };

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    const updated = await DealershipService.updateBookingStatus(id, status);
    if (updated) {
      setBookings(bookings.map((b) => (b.id === id ? updated : b)));
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesType = typeFilter === 'all' || b.booking_type === typeFilter;
    const matchesSearch =
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (b.booking_number || b.booking_reference || '').toLowerCase().includes(search.toLowerCase()) ||
      b.customer_phone.includes(search);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Showroom Bookings & Test Drives</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage scheduled buyer test drives and certified technical inspection appointments</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'all'
                ? 'bg-[#081725] text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setTypeFilter('test_drive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'test_drive'
                ? 'bg-[#ef172b] text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Test Drives ({bookings.filter((b) => b.booking_type === 'test_drive').length})
          </button>
          <button
            onClick={() => setTypeFilter('service')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'service'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Service Appointments ({bookings.filter((b) => b.booking_type === 'service').length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by customer name, booking ID, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Booking Number</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Customer Notes</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                    {b.booking_number}
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">{b.customer_name}</p>
                    <p className="text-[10px] text-slate-400">{b.customer_phone}</p>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.booking_type === 'test_drive'
                        ? 'bg-red-50 text-[#ef172b]'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {b.booking_type === 'test_drive' ? <Car className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                      {b.booking_type === 'test_drive' ? 'Test Drive' : 'Inspection'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-800">{b.booking_date}</p>
                    <p className="text-[10px] text-slate-400">{b.booking_time}</p>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 max-w-xs">
                    <p className="truncate italic">"{b.notes || 'No special requests'}"</p>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : b.status === 'Completed'
                        ? 'bg-blue-50 text-blue-700'
                        : b.status === 'Cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'Cancelled')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Completed')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px]"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
