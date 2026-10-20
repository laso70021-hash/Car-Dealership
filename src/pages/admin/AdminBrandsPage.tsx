import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit3, Trash2, CheckCircle2, XCircle, X, Search, Globe } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Brand } from '../../types';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const AdminBrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [formName, setFormName] = useState('');
  const [formCountry, setFormCountry] = useState('Japan');
  const [formLogo, setFormLogo] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const list = await DealershipService.getBrands();
    const seen = new Set<string>();
    const unique = list.filter((b, idx) => {
      const id = b.id || `br_${idx}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    setBrands(unique);
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.country && b.country.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createBrand({
      name: formName,
      slug: formName.toLowerCase().replace(/\s+/g, '-'),
      country: formCountry,
      logo_url: formLogo || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=100&q=80',
      vehicle_count: 0
    });
    setBrands((prev) => [...prev.filter((b) => b.id !== created.id), created]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;
    const updated = await DealershipService.updateBrand(editingBrand.id, {
      name: formName,
      country: formCountry,
      logo_url: formLogo
    });
    if (updated) {
      setBrands(brands.map((b) => (b.id === updated.id ? updated : b)));
    }
    setEditingBrand(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this brand from the dealership database?')) {
      await DealershipService.deleteBrand(id);
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  const openEdit = (b: Brand) => {
    setEditingBrand(b);
    setFormName(b.name);
    setFormCountry(b.country || 'Japan');
    setFormLogo(b.logo_url || '');
  };

  const resetForm = () => {
    setFormName('');
    setFormCountry('Japan');
    setFormLogo('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Brands & Manufacturers</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage supported global automakers, logos, and origin tracking</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter brands by name or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBrands.map((brand, idx) => (
          <div
            key={`${brand.id}-${idx}`}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between group hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
                <img
                  src={brand.logo_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=100&q=80'}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{brand.name}</h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Globe className="w-3 h-3 text-slate-400" />
                  {brand.country || 'Global'}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold text-[#ef172b] bg-red-50 px-2 py-0.5 rounded-full">
                  {brand.vehicle_count || 0} listings
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(brand)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Edit brand"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(brand.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete brand"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isAddOpen || editingBrand) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </h3>
              <button
                onClick={() => { setIsAddOpen(false); setEditingBrand(null); }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingBrand ? handleUpdate : handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Subaru"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  placeholder="e.g. Japan, Germany, USA, UK"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <ImageUploadInput
                label="Brand Logo"
                value={formLogo}
                onChange={setFormLogo}
                aspectRatio="square"
                placeholder="https://..."
                helperText="Upload official emblem or brand logo (SVG, PNG, or JPG)"
              />

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingBrand(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold shadow-md shadow-red-500/20"
                >
                  {editingBrand ? 'Save Changes' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
