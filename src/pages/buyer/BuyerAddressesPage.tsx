import React, { useState, useEffect } from 'react';
import {
  MapPin, Plus, Trash2, Edit3, CheckCircle2, Home, Building2,
  X, Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, sanitizeUuid } from '../../integrations/supabase/client';

interface BuyerAddress {
  id: string;
  title: string;
  street: string;
  district: string;
  city: string;
  phone: string;
  isDefault: boolean;
  type?: string;
}

export const BuyerAddressesPage: React.FC = () => {
  const { user } = useAuth();
  const uid = sanitizeUuid(user?.user_id || user?.id) || 'be3c05de-2678-471d-90e7-8010a6bf9010';

  const [addresses, setAddresses] = useState<BuyerAddress[]>(() => {
    try {
      const saved = localStorage.getItem('swahivo_buyer_addresses');
      return saved ? JSON.parse(saved) : [
        {
          id: 'a1',
          title: 'Home Residence',
          street: 'Plot 12, Mwaya Road, Masaki',
          district: 'Kinondoni',
          city: 'Dar es Salaam',
          phone: '+255 765 443 322',
          isDefault: true,
          type: 'home'
        },
        {
          id: 'a2',
          title: 'Office / Business',
          street: 'Floor 7, Amani Place, Ohio Street',
          district: 'Ilala',
          city: 'Dar es Salaam',
          phone: '+255 22 211 4455',
          isDefault: false,
          type: 'office'
        }
      ];
    } catch {
      return [];
    }
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('Masaki Residence');
  const [newStreet, setNewStreet] = useState('Haile Selassie Road, Oysterbay');
  const [newDistrict, setNewDistrict] = useState('Kinondoni');
  const [newCity, setNewCity] = useState('Dar es Salaam');
  const [newPhone, setNewPhone] = useState('+255 765 443 322');

  const saveAddresses = (list: typeof addresses) => {
    setAddresses(list);
    try {
      localStorage.setItem('swahivo_buyer_addresses', JSON.stringify(list));
      const def = list.find(a => a.isDefault) || list[0];
      if (def && uid) {
        supabase.from('profiles').update({
          address: `${def.street}, ${def.district}, ${def.city}`,
          city: def.city
        }).eq('user_id', uid);
      }
    } catch {}
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    saveAddresses(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this address?')) {
      const updated = addresses.filter(a => a.id !== id);
      saveAddresses(updated);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr = {
      id: 'a-' + Date.now(),
      title: newTitle,
      street: newStreet,
      district: newDistrict,
      city: newCity,
      phone: newPhone,
      isDefault: addresses.length === 0,
      type: 'home'
    };
    const updated = [...addresses, newAddr];
    saveAddresses(updated);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-[#ef172b]" />
            Saved Addresses & Locations
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Addresses used for TRA logbook registration, doorstep vehicle delivery, and inspection dispatch.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {/* Address cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
              a.isDefault ? 'border-[#ef172b] ring-2 ring-red-500/10' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                    {a.type === 'home' ? <Home className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{a.title}</h3>
                </div>
                {a.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Default
                  </span>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div className="font-medium text-slate-800">{a.street}</div>
                <div>{a.district}, {a.city}</div>
                <div className="text-slate-400 mt-1">Phone: {a.phone}</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              {!a.isDefault ? (
                <button
                  onClick={() => handleSetDefault(a.id)}
                  className="font-bold text-slate-600 hover:text-slate-900"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Primary delivery address</span>
              )}

              <button
                onClick={() => handleDelete(a.id)}
                className="text-slate-400 hover:text-red-600 p-1 rounded-lg"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">Add New Address</h3>

            <form onSubmit={handleAdd} className="space-y-4 my-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Address Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home, Office, Showroom"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Street / House Number</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">District / Area</label>
                  <input
                    type="text"
                    required
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Mwanza">Mwanza</option>
                    <option value="Dodoma">Dodoma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
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
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
