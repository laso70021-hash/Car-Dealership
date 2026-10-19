import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Save, CheckCircle2, ShieldCheck,
  Camera, Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, sanitizeUuid } from '../../integrations/supabase/client';

export const BuyerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const uid = sanitizeUuid(user?.user_id || user?.id) || 'be3c05de-2678-471d-90e7-8010a6bf9010';

  const [name, setName] = useState(user?.full_name || user?.name || 'Salim Khamis');
  const [email, setEmail] = useState(user?.email || 'buyer@swahivo.com');
  const [phone, setPhone] = useState(user?.phone || '+255 777 123456');
  const [city, setCity] = useState(user?.city || 'Dar es Salaam');
  const [occupation, setOccupation] = useState('Business Executive');
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', uid)
          .single();
        if (!error && data) {
          if (data.full_name) setName(data.full_name);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);
          if (data.city) setCity(data.city);
        }
      } catch (e) {
        console.warn('Load buyer profile error:', e);
      }
    };
    loadProfile();
  }, [uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('profiles').update({
        full_name: name,
        phone,
        city,
        updated_at: new Date().toISOString()
      }).eq('user_id', uid);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.error('Failed to update buyer profile:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-[#ef172b]" />
          My Profile & Identification
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage your personal details for car registration and escrow contract processing.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Profile updated successfully!
        </div>
      )}

      {/* Avatar Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-white">
            {name[0]}
          </div>
          <button className="absolute -bottom-1 -right-1 p-1.5 bg-[#ef172b] text-white rounded-lg shadow-md hover:bg-red-700 transition">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 text-lg">{name}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Buyer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{occupation} • Member since 2024</p>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Full Legal Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Phone (TRA / Verification) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">City / Region</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              >
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Arusha">Arusha</option>
                <option value="Mwanza">Mwanza</option>
                <option value="Dodoma">Dodoma</option>
                <option value="Zanzibar">Zanzibar</option>
                <option value="Mbeya">Mbeya</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1.5">Occupation / Company</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
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
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
