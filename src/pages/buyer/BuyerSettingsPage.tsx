import React, { useState } from 'react';
import {
  Settings, Bell, Globe, Shield, Save, CheckCircle2,
  Lock, Smartphone, Mail, AlertTriangle
} from 'lucide-react';

export const BuyerSettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(() => {
    try {
      const s = localStorage.getItem('swahivo_buyer_pref_pricedrop');
      return s !== null ? JSON.parse(s) : true;
    } catch { return true; }
  });
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(() => {
    try {
      const s = localStorage.getItem('swahivo_buyer_pref_whatsapp');
      return s !== null ? JSON.parse(s) : true;
    } catch { return true; }
  });
  const [notifyEmailSummary, setNotifyEmailSummary] = useState(() => {
    try {
      const s = localStorage.getItem('swahivo_buyer_pref_email');
      return s !== null ? JSON.parse(s) : false;
    } catch { return false; }
  });
  const [currency, setCurrency] = useState('TZS');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('swahivo_buyer_pref_pricedrop', JSON.stringify(notifyPriceDrops));
      localStorage.setItem('swahivo_buyer_pref_whatsapp', JSON.stringify(notifyWhatsApp));
      localStorage.setItem('swahivo_buyer_pref_email', JSON.stringify(notifyEmailSummary));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-[#ef172b]" />
          Buyer Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Customize notifications, alert preferences, and security settings.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Account preferences saved!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification preferences */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-[#ef172b]" /> Notification & Alert Preferences
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">WhatsApp Price Drop Alerts</div>
                  <div className="text-[11px] text-slate-400">Receive an alert when saved cars drop in price</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsApp}
                onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                className="w-4 h-4 accent-[#ef172b] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Showroom Reply Notifications</div>
                  <div className="text-[11px] text-slate-400">Notify immediately when a seller answers your enquiry</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyPriceDrops}
                onChange={(e) => setNotifyPriceDrops(e.target.checked)}
                className="w-4 h-4 accent-[#ef172b] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Weekly Car Deals Digest</div>
                  <div className="text-[11px] text-slate-400">Top newly imported cars matching your taste</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyEmailSummary}
                onChange={(e) => setNotifyEmailSummary(e.target.checked)}
                className="w-4 h-4 accent-[#ef172b] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Currency & Region */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-[#ef172b]" /> Currency & Display
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="TZS">TZS - Tanzanian Shilling (Default)</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Password */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-[#ef172b]" /> Change Password
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
              <label className="block text-slate-700 font-bold mb-1.5">Confirm Password</label>
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
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
