import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Edit3, Trash2, Search, CheckCircle2, AlertTriangle, X, ShoppingBag } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Accessory } from '../../types';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const AdminAccessoriesPage: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Accessory | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Wheels & Rims');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState(1000000);
  const [formStock, setFormStock] = useState(10);
  const [formSku, setFormSku] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');

  useEffect(() => {
    loadAccessories();
  }, []);

  const loadAccessories = async () => {
    const list = await DealershipService.getAccessories();
    const seen = new Set<string>();
    const unique = list.filter((item, idx) => {
      const id = item.id || `acc_${idx}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    setAccessories(unique);
  };

  const filtered = accessories.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase()) ||
    (a.brand && a.brand.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createAccessory({
      name: formName,
      slug: formName.toLowerCase().replace(/\s+/g, '-'),
      category: formCategory,
      brand: formBrand,
      description: formDescription,
      price: Number(formPrice),
      currency: 'TZS',
      quantity: Number(formStock),
      sku: formSku || 'ACC-' + Math.floor(100 + Math.random() * 900),
      images: [formImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80'],
      status: Number(formStock) > 0 ? 'active' : 'out_of_stock'
    });
    setAccessories((prev) => [created, ...prev.filter((a) => a.id !== created.id)]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const updated = await DealershipService.updateAccessory(editingItem.id, {
      name: formName,
      category: formCategory,
      brand: formBrand,
      price: Number(formPrice),
      quantity: Number(formStock),
      sku: formSku,
      description: formDescription,
      images: [formImage],
      status: Number(formStock) > 0 ? 'active' : 'out_of_stock'
    });
    if (updated) {
      setAccessories(accessories.map((a) => (a.id === updated.id ? updated : a)));
    }
    setEditingItem(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this accessory item?')) {
      await DealershipService.deleteAccessory(id);
      setAccessories(accessories.filter((a) => a.id !== id));
    }
  };

  const openEdit = (item: Accessory) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormBrand(item.brand || '');
    setFormPrice(item.price);
    setFormStock(item.quantity);
    setFormSku(item.sku || '');
    setFormDescription(item.description || '');
    setFormImage(item.images?.[0] || '');
  };

  const resetForm = () => {
    setFormName('');
    setFormCategory('Wheels & Rims');
    setFormBrand('');
    setFormPrice(1000000);
    setFormStock(10);
    setFormSku('');
    setFormDescription('');
    setFormImage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Accessories & Parts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage genuine vehicle upgrades, rim packages, sound systems, and stock levels</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Accessory</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by part name, SKU, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Accessories Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, index) => (
                <tr key={`${item.id}-${index}`} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.brand || 'Genuine Part'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-500 text-[11px]">
                    {item.sku || 'N/A'}
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-900">
                    TZS {item.price.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    {item.quantity > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        In Stock ({item.quantity} units)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700">
                        <AlertTriangle className="w-3 h-3" />
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit accessory"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete accessory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Accessory' : 'Add New Accessory'}
              </h3>
              <button
                onClick={() => { setIsAddOpen(false); setEditingItem(null); }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingItem ? handleUpdate : handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Accessory Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Heavy Duty Winch 12,000 lbs"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  >
                    <option>Wheels & Rims</option>
                    <option>Audio & Tech</option>
                    <option>Detailing</option>
                    <option>Lighting</option>
                    <option>Interior</option>
                    <option>Off-Road & Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Warn, Fuel, Stedi"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (TZS)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity (Stock)</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="ACC-001"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Product Photo"
                value={formImage}
                onChange={setFormImage}
                aspectRatio="square"
                placeholder="https://images.unsplash.com/..."
                helperText="Upload clear image of the accessory, parts, or packaging"
              />

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingItem(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold shadow-md shadow-red-500/20"
                >
                  {editingItem ? 'Save Updates' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
