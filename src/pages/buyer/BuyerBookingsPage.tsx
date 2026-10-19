import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, CheckCircle2, Car, X, Compass,
  Phone, AlertCircle
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Booking } from '../../types';

export const BuyerBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await DealershipService.getBookings();
    setBookings(data);
  };

  const handleCancelBooking = async (id: string) => {
    if (confirm('Are you sure you want to cancel this test drive booking?')) {
      await DealershipService.updateBookingStatus(id, 'cancelled');
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-[#ef172b]" />
            My Test Drive Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Scheduled dealership visits, vehicle road test inspections, and showroom consultations.
          </p>
        </div>

        <Link
          to="/cars"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-500/20"
        >
          <Car className="w-4 h-4" /> Book Another Test Drive
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No bookings scheduled yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-mono text-xs font-bold text-slate-900">{b.booking_reference}</div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    b.status === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : b.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {b.status === 'confirmed' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-600" />
                    )}
                    {b.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-black text-slate-900 text-sm">{b.vehicle_title || 'Showroom Test Drive'}</h3>
                  <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4 text-[#ef172b]" />
                      <span>{b.preferred_date} • {b.preferred_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Prime Auto Showroom, Upanga, Dar es Salaam</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Please bring valid driving license</span>
                {b.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
