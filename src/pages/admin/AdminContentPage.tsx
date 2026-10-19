import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2, Image, Video, Phone, Mail, MapPin, Eye } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { DealershipSettings, Vehicle } from '../../types';

export const AdminContentPage: React.FC = () => {
  const [settings, setSettings] = useState<DealershipSettings | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [s, v] = await Promise.all([
      DealershipService.getSettings(),
      DealershipService.getVehicles()
    ]);
    setSettings(s);
    setVehicles(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          <h1 className="text-2xl font-extrabold text-slate-900">Content Management System</h1>
          <p className="text-xs text-slate-500 mt-0.5">Edit homepage hero banner, showroom video link, featured cars, and public contact information</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Homepage content & public website settings updated successfully! Changes are live across the portal.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section Banner CMS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Image className="w-4 h-4 text-[#ef172b]" />
            Homepage Hero Section & Showcase
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Main Heading</label>
                <input
                  type="text"
                  value={settings.hero_title}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={settings.hero_subtitle}
                  onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Showcase Image Path / URL</label>
                <input
                  type="text"
                  value={settings.hero_image}
                  onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Showroom Tour Video URL (YouTube / Embed)</label>
                <input
                  type="text"
                  value={settings.showroom_video_url}
                  onChange={(e) => setSettings({ ...settings, showroom_video_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>
            </div>

            {/* Visual Preview */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">Hero Image Preview</label>
              <div className="h-56 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-900">
                <img
                  src={settings.hero_image}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to sunset showroom image
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <p className="font-extrabold text-sm">{settings.hero_title}</p>
                  <p className="text-[10px] text-slate-300 line-clamp-1">{settings.hero_subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Contact & Footer Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#ef172b]" />
            Public Contact & Footer Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Business</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Physical Showroom Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={settings.working_hours}
                onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-red-500/20 text-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Publish Content Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
