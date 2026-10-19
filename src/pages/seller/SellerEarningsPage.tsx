import React, { useState } from 'react';
import {
  Wallet, DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle2,
  Clock, Building2, Smartphone, Download, Plus, X
} from 'lucide-react';

export const SellerEarningsPage: React.FC = () => {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(5000000);
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'mpesa'>('bank');
  const [successMsg, setSuccessMsg] = useState(false);

  const [payoutHistory, setPayoutHistory] = useState([
    {
      id: 'PAY-8921',
      date: '2026-10-15',
      destination: 'CRDB Bank (Acct: ...9842)',
      amount: 14500000,
      fee: 25000,
      status: 'completed'
    },
    {
      id: 'PAY-8734',
      date: '2026-09-30',
      destination: 'M-Pesa Business Lipa (+255 754 112 233)',
      amount: 8200000,
      fee: 15000,
      status: 'completed'
    },
    {
      id: 'PAY-8512',
      date: '2026-09-12',
      destination: 'NMB Bank (Acct: ...3301)',
      amount: 22000000,
      fee: 35000,
      status: 'completed'
    }
  ]);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      destination: payoutMethod === 'bank' ? 'CRDB Bank (Acct: ...9842)' : 'M-Pesa Lipa (+255 754 112 233)',
      amount: Number(payoutAmount),
      fee: 20000,
      status: 'processing'
    };

    setPayoutHistory([newTx, ...payoutHistory]);
    setIsPayoutModalOpen(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-[#ef172b]" />
            Payouts & Earnings
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor vehicle sale settlements, escrow releases, and request bank disbursements.
          </p>
        </div>

        <button
          onClick={() => setIsPayoutModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-500/20 active:scale-95"
        >
          <ArrowDownRight className="w-4 h-4" /> Request Payout
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Payout request of TZS {payoutAmount.toLocaleString()} submitted! Funds will arrive within 24 business hours.
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#081725] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Available for Withdrawal
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            TZS 38,450,000
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for same-day bank or mobile transfer</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Escrow Verified
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pending Escrow Holds
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            TZS 18,200,000
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Releases upon buyer vehicle delivery confirmation</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-600 font-bold">
            <Clock className="w-4 h-4" /> 2 pending orders
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Sales Transacted
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            TZS 184.6M
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lifetime showroom revenue on Swahivo</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
            <ArrowUpRight className="w-4 h-4" /> +32% this quarter
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Disbursement History</span>
          <button className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Payout Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Fee</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payoutHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{item.date}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{item.destination}</td>
                  <td className="py-3 px-4 font-black text-slate-900">TZS {item.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">TZS {item.fee.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Request Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsPayoutModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">Request Showroom Payout</h3>
            <p className="text-xs text-slate-500 mt-1">Available balance: TZS 38,450,000</p>

            <form onSubmit={handleRequestPayout} className="space-y-4 my-5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Withdrawal Amount (TZS)</label>
                <input
                  type="number"
                  min="50000"
                  max="38450000"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-base text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Destination Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank')}
                    className={`p-3 rounded-xl border text-left font-bold flex flex-col gap-1 transition ${
                      payoutMethod === 'bank'
                        ? 'bg-red-50 border-[#ef172b] text-[#ef172b]'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>CRDB Bank</span>
                    <span className="text-[10px] font-normal text-slate-400">Acct ending ...9842</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('mpesa')}
                    className={`p-3 rounded-xl border text-left font-bold flex flex-col gap-1 transition ${
                      payoutMethod === 'mpesa'
                        ? 'bg-red-50 border-[#ef172b] text-[#ef172b]'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>M-Pesa Business</span>
                    <span className="text-[10px] font-normal text-slate-400">+255 754 112 233</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                Transfers are processed within 2-4 hours on business days via the Tanzania Automated Clearing House (TACH).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-500/20"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
