import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, Car, Wrench, AlertCircle } from 'lucide-react';
import { Vehicle } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { DealershipService } from '../../services/dealershipService';

interface BookingModalProps {
  vehicle?: Vehicle;
  type: 'test_drive' | 'service';
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  vehicle,
  type,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+255 770 000 000');
  const [date, setDate] = useState('2026-10-25');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) {
      setErrorMessage('Please fill in your name, phone number, and date.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await DealershipService.createBooking({
        booking_type: type,
        vehicle_id: vehicle?.id,
        vehicle_title: vehicle?.title,
        customer_id: user?.user_id || user?.id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        seller_id: vehicle?.seller_id,
        booking_date: date,
        booking_time: time,
        notes: notes || undefined,
        status: 'Confirmed'
      });

      setBookingRef(res.booking_number);
      setIsSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMessage(err.message || 'Failed to submit appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/30 text-red-500 rounded-xl">
              {type === 'test_drive' ? <Car className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base">
                {type === 'test_drive' ? 'Book Test Drive' : 'Schedule Service Booking'}
              </h3>
              <p className="text-xs text-slate-400">
                {vehicle ? vehicle.title : 'Swahivo Certified Service Center'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Booking Confirmed!</h4>
            <div className="text-xs font-mono bg-slate-100 text-slate-800 py-1 px-3 rounded-lg inline-block">
              Reference: {bookingRef}
            </div>
            <p className="text-xs text-slate-600">
              Your appointment is scheduled for {date} at {time}. Our team will contact you at {phone} to coordinate details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Salim Khamis"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+255 770 000 000"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time *</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none bg-white"
                >
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:30 AM</option>
                  <option>02:00 PM</option>
                  <option>04:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Notes / Requests</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests, route preferences, or questions..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#ef172b] hover:bg-[#d01122] disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
              >
                {isSubmitting ? 'Saving...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
