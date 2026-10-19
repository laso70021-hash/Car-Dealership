import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { DealershipService } from '../services/dealershipService';
import { useAuth } from '../contexts/AuthContext';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await DealershipService.sendEnquiry({
        customer_id: user?.user_id || user?.id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || undefined,
        message: message,
        vehicle_title: 'General Showroom Inquiry',
        status: 'New'
      });

      setSubmitted(true);
      setName('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#ef172b] uppercase tracking-wider">Get In Touch</span>
          <h1 className="text-3xl font-extrabold text-slate-900">Visit Our Showroom or Contact Us</h1>
          <p className="text-xs text-slate-500">
            Our automotive sales and customer support specialists are available Monday to Saturday to assist your car buying journey.
          </p>
        </div>

        {/* Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Info Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Showroom Locations</h3>
                <p className="text-xs text-slate-500 mt-1">Kiembe Samaki - Zanzibar, Tanzania</p>
                <p className="text-xs text-slate-500">Ocean Road / Bagamoyo Rd, Dar es Salaam</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Telephone / WhatsApp</h3>
                <p className="text-xs text-slate-500 mt-1">+255 770 565656</p>
                <p className="text-xs text-slate-500">+255 777 998877</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Email Address</h3>
                <p className="text-xs text-slate-500 mt-1">auto.link@yahoo.com</p>
                <p className="text-xs text-slate-500">sales@swahivocars.com</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Operating Hours</h3>
                <p className="text-xs text-slate-500 mt-1">Mon - Sat: 8:00 AM - 6:00 PM</p>
                <p className="text-xs text-slate-500">Sunday: By Appointment</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Send Direct Message to Management</h2>

            {submitted ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Thank You!</h3>
                <p className="text-xs text-slate-500">Your message has been stored in our Supabase system. Our team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Salim Khamis"
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+255 770 000000"
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
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
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what vehicle you are looking for, or any enquiry..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-[#ef172b] hover:bg-[#d01122] disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
