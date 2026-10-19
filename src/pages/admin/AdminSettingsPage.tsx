import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Shield, Database, RefreshCw, Key, Bell, Globe } from 'lucide-react';
import { DealershipService, DatabaseStatus } from '../../services/dealershipService';
import { DealershipSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<DealershipSettings | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  useEffect(() => {
    loadSettings();
    checkDatabase();
  }, []);

  const loadSettings = async () => {
    const s = await DealershipService.getSettings();
    setSettings(s);
  };

  const checkDatabase = async () => {
    setIsCheckingDb(true);
    const status = await DealershipService.checkDatabaseStatus();
    setDbStatus(status);
    setIsCheckingDb(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await DealershipService.updateSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Application & Dealership Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure system parameters, business branding, currency, and Supabase integration</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>System configuration saved successfully!</span>
        </div>
      )}

      {/* Database Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Supabase Backend Status</h3>
              <p className="text-xs text-slate-500 font-mono">https://yefbfstqxxqpbqzloeod.supabase.co</p>
            </div>
          </div>
          <button
            onClick={checkDatabase}
            disabled={isCheckingDb}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
            <span>Check Connectivity</span>
          </button>
        </div>

        {dbStatus && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${dbStatus.isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="font-bold text-slate-800">
                {dbStatus.isConnected ? 'Supabase Project Connected' : 'Connection Error'}
              </span>
              <span className="text-slate-400">({dbStatus.message})</span>
            </div>
            <span className="text-[10px] text-slate-400">Checked at: {dbStatus.checkedAt}</span>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Dealership Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#ef172b]" />
            Brand Identity & Locale
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dealership Business Name</label>
              <input
                type="text"
                value={settings.dealership_name}
                onChange={(e) => setSettings({ ...settings, dealership_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Transaction Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              >
                <option value="TZS">TZS - Tanzanian Shilling (Sh)</option>
                <option value="USD">USD - United States Dollar ($)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanzania VAT Tax Rate (%)</label>
              <input
                type="number"
                value={settings.tax_percentage}
                onChange={(e) => setSettings({ ...settings, tax_percentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>
          </div>
        </div>

        {/* Contact and Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#ef172b]" />
            Official Notification Channels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Administrative Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dealership Hotline</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Business Dispatch</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-red-500/20 text-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
