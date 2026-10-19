import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { Vehicle } from '../../types';
import { DealershipService } from '../../services/dealershipService';
import { useAuth } from '../../contexts/AuthContext';

interface EnquiryModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState(
    `Hello, I am interested in the ${vehicle.title} (${vehicle.year}) listed at ${vehicle.currency} ${new Intl.NumberFormat('en-US').format(vehicle.price)}. Is it available for inspection and test drive?`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please provide your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await DealershipService.sendEnquiry({
        vehicle_id: vehicle.id,
        vehicle_title: vehicle.title,
        vehicle_image: vehicle.primary_image || (vehicle.images && vehicle.images[0]) || undefined,
        customer_id: user?.user_id || user?.id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || undefined,
        seller_id: vehicle.seller_id,
        message: message,
        status: 'New'
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2200);
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/30 text-red-500 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Send Vehicle Enquiry</h3>
              <p className="text-xs text-slate-400">{vehicle.title} ({vehicle.year})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Enquiry Sent Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Thank you! The verified dealer has received your inquiry in their dashboard and will respond promptly.
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Salim Khamis"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+255 770 000 000"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Direct message to dealer</span>
              <div className="flex gap-2">
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
                  className="px-5 py-2.5 bg-[#ef172b] hover:bg-[#d01122] disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
