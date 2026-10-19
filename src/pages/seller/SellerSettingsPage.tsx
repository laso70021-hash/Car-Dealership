import React, { useState } from 'react';
import {
  Settings, Bell, Shield, Smartphone, Mail, Save, CheckCircle2,
  Lock, Globe, Moon, Sun, ToggleLeft, ToggleRight
} from 'lucide-react';

export const SellerSettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [notifySms, setNotifySms] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [vacationMode, setVacationMode] = useState(false);
  const [currency, setCurrency] = useState('TZS');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-[#ef172b]" />
          Seller Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Configure notification alerts, lead preferences, and showroom operating mode.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification preferences */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-[#ef172b]" /> Lead & Enquiry Notifications
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Instant WhatsApp Alerts</div>
                  <div className="text-[11px] text-slate-400">Receive instant buyer messages via WhatsApp bot</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsapp}
                onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                className="w-4 h-4 accent-[#ef172b] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">SMS Notifications</div>
                  <div className="text-[11px] text-slate-400">Receive SMS alert for urgent test drive bookings</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifySms}
                onChange={(e) => setNotifySms(e.target.checked)}
                className="w-4 h-4 accent-[#ef172b] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Email Digest</div>
                  <div className="text-[11px] text-slate-400">Daily summary of views, leads, and showroom metrics</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 accent-[#ef172b] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Showroom Status & Currency */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-[#ef172b]" /> Showroom Status & Regional Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Primary Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="TZS">TZS - Tanzanian Shilling</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Showroom Vacation Mode</label>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">Pause new bookings</span>
                <input
                  type="checkbox"
                  checked={vacationMode}
                  onChange={(e) => setVacationMode(e.target.checked)}
                  className="w-4 h-4 accent-[#ef172b] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-[#ef172b]" /> Account Security
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
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
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
