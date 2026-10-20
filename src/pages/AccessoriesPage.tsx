import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { DealershipService } from '../services/dealershipService';
import { useAuth } from '../contexts/AuthContext';
import { Accessory } from '../types';

export const AccessoriesPage: React.FC = () => {
  const { user } = useAuth();
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [orderedId, setOrderedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await DealershipService.getAccessories();
        setAccessories(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categories = ['All', 'Wheels & Rims', 'Audio & Tech', 'Detailing', 'Lighting', 'Interior', 'Performance'];

  const filtered = accessories.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !(item.brand && item.brand.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const handleOrder = async (item: Accessory) => {
    try {
      await DealershipService.createOrder({
        customer_name: user?.full_name || user?.name || 'Walk-in Customer',
        phone: user?.phone || '+255 777 123456',
        email: user?.email || 'buyer@swahivo.com',
        city: user?.city || 'Dar es Salaam',
        product_name: item.name,
        accessory_id: item.id,
        quantity: 1,
        amount: item.price,
        currency: item.currency || 'TZS',
        status: 'Pending',
        payment_status: 'pending_verification',
        notes: `Accessory order for ${item.name}`
      });
      setOrderedId(item.id);
      setTimeout(() => setOrderedId(null), 3000);
    } catch (err) {
      console.error('Failed to create accessory order:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#ef172b] uppercase tracking-wider">Swahivo Auto Store</span>
            <h1 className="text-3xl font-extrabold text-slate-900">Genuine & Performance Accessories</h1>
            <p className="text-xs text-slate-500">Certified auto parts, alloy wheels, high-end sound systems, and 4x4 upgrades in Tanzania.</p>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search parts, wheels, audio..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-[#ef172b] outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-[#ef172b] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">{item.brand}</p>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#ef172b] transition-colors">{item.name}</h3>
                  <p className="text-base font-extrabold text-[#ef172b]">
                    TZS {new Intl.NumberFormat('en-US').format(item.price)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Fitment:</span> {item.compatibility}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOrder(item)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    orderedId === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-[#ef172b] text-white shadow-xs'
                  }`}
                >
                  {orderedId === item.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Order Request Sent!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Part / Enquire</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
