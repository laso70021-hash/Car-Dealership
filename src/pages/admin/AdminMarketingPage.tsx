import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Search, BarChart3, TrendingUp, Users, MousePointer, X, CheckCircle2 } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { MarketingCampaign } from '../../types';

export const AdminMarketingPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<MarketingCampaign['type']>('Featured Vehicle');
  const [formBudget, setFormBudget] = useState(2500000);
  const [formStart, setFormStart] = useState('2026-10-20');
  const [formEnd, setFormEnd] = useState('2026-11-20');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const list = await DealershipService.getCampaigns();
    setCampaigns(list);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createCampaign({
      title: formTitle,
      type: formType,
      budget: Number(formBudget),
      spent: 0,
      clicks: 0,
      impressions: 0,
      conversions: 0,
      start_date: formStart,
      end_date: formEnd,
      status: 'Active'
    });
    setCampaigns([created, ...campaigns]);
    setIsAddOpen(false);
    setFormTitle('');
  };

  const handleToggleStatus = async (c: MarketingCampaign) => {
    const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
    const updated = await DealershipService.updateCampaignStatus(c.id, nextStatus);
    if (updated) {
      setCampaigns(campaigns.map((item) => (item.id === c.id ? updated : item)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Marketing & Promotional Campaigns</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage digital ad boosts, sponsored car listings, and seasonal holiday promotions</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* Aggregate Marketing KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-400">Total Impressions</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">462,000</p>
          <span className="text-[10px] text-emerald-600 font-bold">+18% this month</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-400">Ad Clicks</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">16,430</p>
          <span className="text-[10px] text-emerald-600 font-bold">3.55% CTR</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-400">Showroom Conversions</p>
          <p className="text-2xl font-extrabold text-[#ef172b] mt-1">64</p>
          <span className="text-[10px] text-slate-400">Test drives & leads</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-400">Total Spend</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">TZS 8.15M</p>
          <span className="text-[10px] text-slate-400">Budget: TZS 10.3M</span>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active & Scheduled Campaigns</h3>
          <span className="text-xs font-bold text-slate-500">{campaigns.length} campaigns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Campaign Name</th>
                <th className="py-3.5 px-6">Channel / Type</th>
                <th className="py-3.5 px-6">Budget vs Spent</th>
                <th className="py-3.5 px-6">Impressions</th>
                <th className="py-3.5 px-6">Clicks</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">{c.title}</p>
                    <p className="text-[10px] text-slate-400">{c.start_date} → {c.end_date}</p>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">TZS {c.spent.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">of TZS {c.budget.toLocaleString()}</p>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    {c.impressions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-blue-600">
                    {c.clicks.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : c.status === 'Ended'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleToggleStatus(c)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        c.status === 'Active'
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {c.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Launch Promotional Campaign</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Arusha Safari SUV Special Offer"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campaign Strategy</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                >
                  <option value="Featured Vehicle">Featured Vehicle Spotlight</option>
                  <option value="Social">Social Media Ads (Meta & TikTok)</option>
                  <option value="Seasonal Discount">Seasonal Discount Promo</option>
                  <option value="Banner Spotlight">Homepage Hero Banner Spotlight</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Budget (TZS)</label>
                <input
                  type="number"
                  required
                  value={formBudget}
                  onChange={(e) => setFormBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold shadow-md shadow-red-500/20"
                >
                  Launch Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
