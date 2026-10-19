import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Plus, Filter, Phone, Mail, Clock, CheckCircle2, ChevronRight, X, MessageSquare } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Lead } from '../../types';

export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const list = await DealershipService.getLeads();
    setLeads(list);
  };

  const handleUpdateStatus = async (id: string, status: Lead['status']) => {
    const updated = await DealershipService.updateLeadStatus(id, status);
    if (updated) {
      setLeads(leads.map((l) => (l.id === id ? updated : l)));
    }
  };

  const handleAssignSeller = async (id: string, seller: string) => {
    const updated = await DealershipService.assignLead(id, seller);
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

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.vehicle_interest.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Leads CRM & Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track prospective vehicle buyers from initial inquiry to final contract closing</p>
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter leads by buyer name, car interest, or phone..."
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
                <th className="py-3.5 px-6">Lead / Prospect</th>
                <th className="py-3.5 px-6">Interested Vehicle</th>
                <th className="py-3.5 px-6">Budget</th>
                <th className="py-3.5 px-6">Lead Source</th>
                <th className="py-3.5 px-6">Assigned Seller / Rep</th>
                <th className="py-3.5 px-6">Pipeline Stage</th>
                <th className="py-3.5 px-6 text-right">CRM Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">{l.name}</p>
                    <p className="text-[10px] text-slate-400">{l.phone}</p>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-[#ef172b]">
                    {l.vehicle_interest}
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-900">
                    TZS {l.budget.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {l.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      value={l.assigned_to || 'Unassigned'}
                      onChange={(e) => handleAssignSeller(l.id, e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Ali Hassan (Prime Motors)">Ali Hassan (Prime Motors)</option>
                      <option value="Swahivo Direct Sales">Swahivo Direct Sales</option>
                      <option value="Kigamboni Motors Rep">Kigamboni Motors Rep</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      value={l.status}
                      onChange={(e) => handleUpdateStatus(l.id, e.target.value as any)}
                      className={`text-xs font-bold px-2 py-1 rounded-xl outline-none border ${
                        l.status === 'Won'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : l.status === 'Lost'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => setSelectedLead(l)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs"
                    >
                      Notes ({l.notes.length})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">CRM Notes: {selectedLead.name}</h3>
                <p className="text-xs text-slate-500">{selectedLead.vehicle_interest} • {selectedLead.phone}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedLead.notes.map((note, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <p>{note}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add Follow-Up Note</label>
                <input
                  type="text"
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Sent proforma invoice via WhatsApp..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ef172b]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#ef172b] text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/20"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
