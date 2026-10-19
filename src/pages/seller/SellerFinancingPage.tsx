import React, { useState, useEffect } from 'react';
import {
  DollarSign, Search, CheckCircle2, Clock, Eye, AlertCircle,
  Car, User, Phone, Mail, Building2, X
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { FinancingApplication } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const SellerFinancingPage: React.FC = () => {
  const { user } = useAuth();
  const sellerId = user?.user_id || user?.id || '8916c8d8-3037-4e54-9ea5-d025cd77e042';

  const [applications, setApplications] = useState<FinancingApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<FinancingApplication | null>(null);

  useEffect(() => {
    loadFinancing();
  }, [sellerId]);

  const loadFinancing = async () => {
    const data = await DealershipService.getFinancingApplications();
    setApplications(data);
  };

  const filtered = applications.filter(a =>
    a.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.vehicle_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.bank_partner || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <DollarSign className="w-7 h-7 text-[#ef172b]" />
          Buyer Financing Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Track bank auto loan applications submitted by buyers for your listed vehicles.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by buyer, car, or partner bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Bank Partner</th>
                <th className="py-3.5 px-4">Loan Details</th>
                <th className="py-3.5 px-4">Bank Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{a.applicant_name}</div>
                    <div className="text-[11px] text-slate-400">{a.applicant_phone || a.phone || ''}</div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div className="line-clamp-1">{a.vehicle_title}</div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      Price: TZS {a.vehicle_price.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg text-[11px]">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {a.bank_partner || 'CRDB Auto Loan'}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-black text-slate-900">
                      TZS {(a.loan_amount || (a.vehicle_price - a.down_payment)).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Down: TZS {a.down_payment.toLocaleString()} ({a.term_months || a.loan_term_months || 36} mos)
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      String(a.status).toLowerCase() === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : String(a.status).toLowerCase() === 'under_review' || String(a.status).toLowerCase() === 'under review'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {String(a.status).toLowerCase() === 'approved' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      {String(a.status).replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedApp(a)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">Loan Application Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">Reference ID: {selectedApp.id}</p>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl text-xs my-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{selectedApp.applicant_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-bold text-slate-900">{selectedApp.vehicle_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle Price:</span>
                <span className="font-black text-slate-900">TZS {selectedApp.vehicle_price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Down Payment:</span>
                <span className="font-bold text-emerald-600">TZS {selectedApp.down_payment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Loan Principal:</span>
                <span className="font-black text-slate-900">TZS {(selectedApp.loan_amount || (selectedApp.vehicle_price - selectedApp.down_payment)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Partner Bank:</span>
                <span className="font-bold text-blue-700">{selectedApp.bank_partner || 'CRDB Auto Loan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-black text-slate-900 uppercase">{String(selectedApp.status).replace('_', ' ')}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
