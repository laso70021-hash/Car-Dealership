import React, { useState } from 'react';
import {
  Store, Save, CheckCircle2, ShieldCheck, MapPin, Phone,
  Mail, Clock, Image, ExternalLink, Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const SellerStoreProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [saved, setSaved] = useState(false);
  const [storeName, setStoreName] = useState('Prime Auto Showroom & Motors');
  const [tagline, setTagline] = useState('Premium Certified Japanese & European Imports in Dar es Salaam');
  const [phone, setPhone] = useState('+255 754 112 233');
  const [whatsapp, setWhatsapp] = useState('+255 754 112 233');
  const [email, setEmail] = useState('showroom@primeauto.co.tz');
  const [city, setCity] = useState('Dar es Salaam');
  const [address, setAddress] = useState('Plot 44, Ali Hassan Mwinyi Road, Upanga, Dar es Salaam');
  const [workingHours, setWorkingHours] = useState('Mon - Sat: 8:00 AM - 6:30 PM');
  const [bio, setBio] = useState('Specializing in carefully selected Japanese, UK and South African imports with full pre-delivery inspection, genuine mileage guarantee, and registration support.');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1400&q=80');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&q=80');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Store className="w-7 h-7 text-[#ef172b]" />
            My Store Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Customize how your verified showroom appears to car buyers across Tanzania.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Seller
          </span>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Store profile updated successfully! Changes are live on your public dealership showcase.
        </div>
      )}

      {/* Showroom Preview Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 text-white">
        <img
          src={bannerUrl}
          alt="Showroom Banner"
          className="w-full h-44 object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6">
          <div className="flex items-center gap-4">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">{storeName}</h2>
                <span className="p-1 bg-red-600 rounded-md text-[10px] font-bold uppercase tracking-wider">Showroom</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{tagline}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-500" /> {city}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-red-500" /> {workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            General Showroom Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Dealership Name *</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Tagline / Slogan</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Official Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">WhatsApp Inquiry Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Showroom Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Operating Hours</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1.5">Physical Showroom Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1.5">Dealership Bio & Story</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Branding & Media Assets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Logo Image URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Banner Image URL</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-500/20 active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Store Profile
          </button>
        </div>
      </form>
    </div>
  );
};
