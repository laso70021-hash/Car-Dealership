import React, { useState, useEffect } from 'react';
import { DollarSign, Search, CheckCircle2, XCircle, Clock, AlertCircle, FileText, X, Check } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { FinancingApplication } from '../../types';

export const AdminFinancingPage: React.FC = () => {
  const [applications, setApplications] = useState<FinancingApplication[]>([]);
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<FinancingApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadFinancing();
  }, []);

  const loadFinancing = async () => {
    const list = await DealershipService.getFinancingApplications();
    setApplications(list);
  };

  const handleUpdateStatus = async (id: string, status: FinancingApplication['status']) => {
    const updated = await DealershipService.updateFinancingStatus(id, status, adminNotes || undefined);
    if (updated) {
      setApplications(applications.map((a) => (a.id === id ? updated : a)));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(updated);
      }
    }
  };

  const filtered = applications.filter((a) =>
    a.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
    a.application_number.toLowerCase().includes(search.toLowerCase()) ||
    a.vehicle_title.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Auto Financing Applications</h1>
          <p className="text-xs text-slate-500 mt-0.5">Underwrite bank-assisted auto financing, verify employment income, and approve lease terms</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-400">Total Applications</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-amber-600">Under Review</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {applications.filter((a) => a.status === 'Under Review' || a.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-emerald-600">Approved</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {applications.filter((a) => a.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-400">Approved Volume</p>
          <p className="text-xl font-extrabold text-[#ef172b] mt-1">TZS 121.5M</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by applicant name, FIN number, or vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">App #</th>
                <th className="py-3.5 px-6">Applicant</th>
                <th className="py-3.5 px-6">Vehicle</th>
                <th className="py-3.5 px-6">Vehicle Price</th>
                <th className="py-3.5 px-6">Down Payment</th>
                <th className="py-3.5 px-6">Monthly Term</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                    {app.application_number}
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">{app.applicant_name}</p>
                    <p className="text-[10px] text-slate-400">{app.employment_status} • {app.phone}</p>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-[#ef172b]">
                    {app.vehicle_title}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">
                    TZS {app.vehicle_price.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700">
                    TZS {app.down_payment.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    TZS {app.monthly_payment.toLocaleString()} / mo
                    <span className="block text-[10px] text-slate-400 font-normal">({app.loan_term_months} Months)</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : app.status === 'Rejected'
                        ? 'bg-red-50 text-red-700'
                        : app.status === 'Under Review'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => { setSelectedApp(app); setAdminNotes(app.notes || ''); }}
                      className="px-3 py-1.5 bg-[#081725] hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Financing Application: {selectedApp.application_number}
                </h3>
                <p className="text-xs text-slate-500">{selectedApp.applicant_name} • NIDA: {selectedApp.national_id}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Employment</p>
                <p className="font-bold text-slate-800">{selectedApp.employment_status}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Income</p>
                <p className="font-bold text-emerald-600">TZS {selectedApp.monthly_income.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Vehicle</p>
                <p className="font-bold text-[#ef172b]">{selectedApp.vehicle_title}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Payment</p>
                <p className="font-bold text-slate-900">TZS {selectedApp.monthly_payment.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Underwriter Review Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add verification notes, bank reference IDs, or condition pre-approvals..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ef172b]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Current: <span className="text-slate-900">{selectedApp.status}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                  className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl text-xs"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, 'Under Review')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl text-xs"
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, 'Approved')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
