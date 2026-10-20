import React, { useState, useEffect } from 'react';
import {
  UserCheck, Search, Plus, Filter, Phone, Mail, Clock, CheckCircle2,
  ChevronRight, X, MessageSquare, Sparkles, Zap, ShieldCheck, DollarSign,
  TrendingUp, Award, ArrowRight, Lock, Check, RefreshCw
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Lead } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const SellerCrmPage: React.FC = () => {
  const { user } = useAuth();
  const sellerId = user?.user_id || 'seller-ali-hassan';
  
  const [isPro, setIsPro] = useState<boolean>(() => {
    return DealershipService.isSellerCrmProActive(sellerId);
  });
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // New lead form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+255 ');
  const [formEmail, setFormEmail] = useState('');
  const [formVehicle, setFormVehicle] = useState('Toyota Land Cruiser Prado');
  const [formBudget, setFormBudget] = useState(55000000);
  const [formSource, setFormSource] = useState<Lead['source']>('Website');
  const [formInitialNote, setFormInitialNote] = useState('Customer called inquiring about financing terms.');

  useEffect(() => {
    loadLeads();
  }, [sellerId]);

  const loadLeads = async () => {
    const list = await DealershipService.getLeads();
    setLeads(list);
  };

  const handleActivatePro = () => {
    DealershipService.setSellerCrmProActive(sellerId, true);
    setIsPro(true);
    setShowUpgradeModal(false);
  };

  const handleDeactivatePro = () => {
    DealershipService.setSellerCrmProActive(sellerId, false);
    setIsPro(false);
  };

  const handleUpdateStatus = async (id: string, status: Lead['status']) => {
    const updated = await DealershipService.updateLeadStatus(id, status);
    if (updated) {
      setLeads(leads.map((l) => (l.id === id ? updated : l)));
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;
    const updated = await DealershipService.addLeadNote(selectedLead.id, newNote);
    if (updated) {
      setLeads(leads.map((l) => (l.id === updated.id ? updated : l)));
      setSelectedLead(updated);
      setNewNote('');
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createLead({
      name: formName,
      phone: formPhone,
      email: formEmail,
      vehicle_interest: formVehicle,
      budget: Number(formBudget),
      source: formSource,
      status: 'New',
      assigned_to: 'Prime Motors (You)',
      notes: formInitialNote ? [formInitialNote] : []
    });
    setLeads([created, ...leads]);
    setIsAddLeadOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormPhone('+255 ');
    setFormEmail('');
    setFormVehicle('Toyota Land Cruiser Prado');
    setFormBudget(55000000);
    setFormSource('Website');
    setFormInitialNote('');
  };

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.vehicle_interest.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paywall upgrade screen if not subscribed to Pro Plan
  if (!isPro) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#081725] via-[#0d2238] to-[#1a385c] text-white p-8 md:p-12 overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef172b]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-[#ff4d5e] border border-red-500/30 text-xs font-black uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Agent & Showroom Pro Feature
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Swahivo Dealership CRM
            </h1>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Track vehicle buyer leads, automate WhatsApp follow-ups, and manage high-value negotiations from discovery to car delivery.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleActivatePro}
                className="px-6 py-3.5 bg-[#ef172b] hover:bg-[#d01122] text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-red-500/30 flex items-center gap-2 transition hover:scale-102"
              >
                <Zap className="w-4 h-4" />
                <span>Start 14-Day Free Trial</span>
              </button>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-2xl border border-white/20 transition"
              >
                <span>View CRM Pro Plans (TZS 45,000/mo)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Direct WhatsApp Outreach</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Message prospective car buyers directly with pre-filled vehicle quotes and inspection booking reminders in 1 click.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">6-Stage Pipeline Funnel</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monitor deals across New, Contacted, Qualified, Negotiation, Won, and Lost stages with instant conversion metrics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Private Seller Logs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Record customer budgets, financing pre-approvals, and trade-in valuations securely within your showroom team.
            </p>
          </div>
        </div>

        {/* Demo preview CTA */}
        <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-center space-y-2">
          <p className="text-xs font-bold text-slate-700">Want to test the full CRM interface immediately?</p>
          <button
            onClick={handleActivatePro}
            className="text-xs font-bold text-[#ef172b] hover:underline"
          >
            Click here to unlock instant trial access & test CRM pipeline →
          </button>
        </div>

        {/* Upgrade Plan Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#ef172b] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Swahivo CRM Pro Plan</h3>
                    <p className="text-[11px] text-slate-500">Billed monthly • Cancel anytime</p>
                  </div>
                </div>
                <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">TZS 45,000</span>
                  <span className="text-xs font-bold text-slate-500">/ showroom / month</span>
                </div>
                <p className="text-[11px] text-slate-500">Includes 14 days free trial. No card required upfront.</p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                {[
                  'Unlimited buyer lead capture & pipeline management',
                  '1-Click WhatsApp direct messaging with custom templates',
                  'Dealership sales conversion rate tracking',
                  'Priority buyer inquiry notifications via SMS',
                  'Export leads & customer directory to Excel / CSV'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleActivatePro}
                  className="w-full py-3 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20"
                >
                  Activate 14-Day Free Trial
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active CRM Workspace
  return (
    <div className="space-y-6">
      {/* Header with Pro Badge & Deactivate test toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Seller Leads CRM</h1>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#ef172b] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Pro Plan Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Manage buyer pipeline, schedule test drives, and close vehicle sales</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prospective Buyer</span>
          </button>
          <button
            onClick={handleDeactivatePro}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition"
            title="Preview standard free plan screen"
          >
            Free Tier Preview
          </button>
        </div>
      </div>

      {/* Pipeline Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(['New', 'Contacted', 'Qualified', 'Negotiation', 'Won', 'Lost'] as const).map((stage) => {
          const count = leads.filter((l) => l.status === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setStatusFilter(statusFilter === stage ? 'All' : stage)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                statusFilter === stage
                  ? 'border-[#ef172b] bg-red-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase">{stage}</p>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by buyer name, vehicle, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Buyer Name</th>
                <th className="py-3.5 px-6">Vehicle Interest</th>
                <th className="py-3.5 px-6">Budget</th>
                <th className="py-3.5 px-6">Source</th>
                <th className="py-3.5 px-6">Pipeline Status</th>
                <th className="py-3.5 px-6 text-right">Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((lead, idx) => (
                <tr key={`${lead.id}-${idx}`} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-left group cursor-pointer"
                    >
                      <p className="font-bold text-slate-900 group-hover:text-[#ef172b] transition-colors">{lead.name}</p>
                      <p className="text-[10px] text-slate-400">{lead.phone}</p>
                    </button>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">
                    {lead.vehicle_interest}
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-900">
                    TZS {lead.budget.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl outline-none border cursor-pointer ${
                        lead.status === 'Won'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : lead.status === 'Negotiation'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : lead.status === 'Qualified'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : lead.status === 'Lost'
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won (Closed Sale)</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name}, thank you for your interest in the ${lead.vehicle_interest} at our dealership showroom.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="View Lead Notes"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Prospective Buyer Lead</h3>
              <button onClick={() => setIsAddLeadOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rashid Mwinyi"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+255 7..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle of Interest</label>
                  <input
                    type="text"
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    placeholder="e.g. Toyota Prado TX"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Budget (TZS)</label>
                  <input
                    type="number"
                    value={formBudget}
                    onChange={(e) => setFormBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Source</label>
                <select
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                >
                  <option value="Website">Showroom Website</option>
                  <option value="Walk-in">Showroom Walk-in</option>
                  <option value="WhatsApp">WhatsApp Inbound</option>
                  <option value="Phone">Phone Call</option>
                  <option value="Facebook">Social Media</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Contact Notes</label>
                <textarea
                  rows={2}
                  value={formInitialNote}
                  onChange={(e) => setFormInitialNote(e.target.value)}
                  placeholder="Record customer preferences, target purchase timeline, trade-in..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold shadow-md shadow-red-500/20"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Lead Drawer/Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedLead.name}</h3>
                <p className="text-[11px] text-slate-400">Target: {selectedLead.vehicle_interest}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400">Phone:</span>
                <p className="font-bold text-slate-900">{selectedLead.phone}</p>
              </div>
              <div>
                <span className="text-slate-400">Budget:</span>
                <p className="font-extrabold text-slate-900">TZS {selectedLead.budget.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400">Lead Source:</span>
                <p className="font-bold text-slate-900">{selectedLead.source}</p>
              </div>
              <div>
                <span className="text-slate-400">Current Stage:</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {selectedLead.status}
                </span>
              </div>
            </div>

            {/* Notes Log */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Dealership Notes & Follow-up History</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedLead.notes.map((note, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            {/* Add note */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Log customer interaction note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ef172b]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Log Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
