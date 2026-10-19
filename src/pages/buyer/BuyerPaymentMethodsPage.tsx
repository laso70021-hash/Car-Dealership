import React, { useState } from 'react';
import {
  CreditCard, Smartphone, Building2, Plus, Trash2, CheckCircle2,
  ShieldCheck, X
} from 'lucide-react';

export const BuyerPaymentMethodsPage: React.FC = () => {
  const [methods, setMethods] = useState([
    {
      id: 'm1',
      type: 'mobile_money',
      provider: 'M-Pesa (Vodacom)',
      identifier: '+255 765 ••• 322',
      holder: 'Emmanuel Mrema',
      isPrimary: true
    },
    {
      id: 'm2',
      type: 'card',
      provider: 'CRDB Bank Visa Gold',
      identifier: '•••• •••• •••• 4129',
      holder: 'Emmanuel Mrema',
      expiry: '09/28',
      isPrimary: false
    },
    {
      id: 'm3',
      type: 'bank',
      provider: 'NMB Bank Escrow Transfer',
      identifier: 'Acct ending in ••• 8821',
      holder: 'Emmanuel Mrema',
      isPrimary: false
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProvider, setNewProvider] = useState('M-Pesa');
  const [newNumber, setNewNumber] = useState('+255 754 000 111');

  const handleSetPrimary = (id: string) => {
    setMethods(methods.map(m => ({ ...m, isPrimary: m.id === id })));
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this payment method?')) {
      setMethods(methods.filter(m => m.id !== id));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod = {
      id: 'm-' + Date.now(),
      type: 'mobile_money',
      provider: newProvider,
      identifier: newNumber,
      holder: 'Emmanuel Mrema',
      isPrimary: false
    };
    setMethods([...methods, newMethod]);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-[#ef172b]" />
            Payment Methods & Wallets
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your mobile money accounts and bank cards for vehicle deposits and reservation fees.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Payment Method
        </button>
      </div>

      {/* Security note */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span>
          <strong>Bank-Grade Encryption:</strong> All transactions on Swahivo are secured with 256-bit SSL and Bank of Tanzania regulatory escrow safeguards.
        </span>
      </div>

      {/* Payment methods grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
              m.isPrimary ? 'border-[#ef172b] ring-2 ring-red-500/10' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                    {m.type === 'card' ? (
                      <CreditCard className="w-4 h-4" />
                    ) : m.type === 'bank' ? (
                      <Building2 className="w-4 h-4" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{m.provider}</h4>
                </div>
                {m.isPrimary && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    Primary
                  </span>
                )}
              </div>

              <div className="mt-4 font-mono font-black text-slate-800 text-sm tracking-wider">
                {m.identifier}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-medium">{m.holder}</div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              {!m.isPrimary ? (
                <button
                  onClick={() => handleSetPrimary(m.id)}
                  className="font-bold text-slate-600 hover:text-slate-900"
                >
                  Set as Primary
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Default for deposits</span>
              )}

              <button
                onClick={() => handleDelete(m.id)}
                className="text-slate-400 hover:text-red-600 p-1 rounded-lg"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">Add Payment Account</h3>

            <form onSubmit={handleAdd} className="space-y-4 my-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Provider</label>
                <select
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="M-Pesa (Vodacom)">M-Pesa (Vodacom)</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Tigo Pesa (Mixx by Yas)">Tigo Pesa (Mixx by Yas)</option>
                  <option value="CRDB Bank">CRDB Bank SimBanking</option>
                  <option value="NMB Bank">NMB Bank Mkononi</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile / Account Number</label>
                <input
                  type="text"
                  required
                  placeholder="+255 7XX XXX XXX"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl font-bold"
                >
                  Link Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
