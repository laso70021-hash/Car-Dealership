import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit3, Trash2, ArrowUpDown, X, Check, Eye } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formOrder, setFormOrder] = useState(1);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const list = await DealershipService.getCategories();
    setCategories(list);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createCategory({
      name: formName,
      slug: formSlug || formName.toLowerCase().replace(/\s+/g, '-'),
      description: formDescription,
      image_url: formImage || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
      vehicle_count: 0,
      display_order: Number(formOrder),
      is_active: true
    });
    setCategories([...categories, created]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const updated = await DealershipService.updateCategory(editingCategory.id, {
      name: formName,
      slug: formSlug,
      description: formDescription,
      image_url: formImage,
      display_order: Number(formOrder)
    });
    if (updated) {
      setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
    }
    setEditingCategory(null);
    resetForm();
  };

  const handleDelete = async (id: string, count?: number) => {
    if (count && count > 0) {
      if (!confirm(`Warning: This category currently has ${count} vehicles assigned. Deleting it may leave those vehicles uncategorized. Proceed?`)) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this category?')) return;
    }
    await DealershipService.deleteCategory(id);
    setCategories(categories.filter((c) => c.id !== id));
  };

  const openEdit = (c: Category) => {
    setEditingCategory(c);
    setFormName(c.name);
    setFormSlug(c.slug);
    setFormDescription(c.description || '');
    setFormImage(c.image_url || '');
    setFormOrder(c.display_order || 1);
  };

  const resetForm = () => {
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormImage('');
    setFormOrder(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Categories</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage classification hierarchy, images, and homepage display priority</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all"
          >
            <div className="h-40 w-full relative overflow-hidden bg-slate-100">
              <img
                src={cat.image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-[#081725]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Order #{cat.display_order || 1}
              </div>
              <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {cat.vehicle_count || 0} Vehicles
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">/{cat.slug}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{cat.description || 'Primary showroom category'}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active in Navigation
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.vehicle_count)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isAddOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => { setIsAddOpen(false); setEditingCategory(null); }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingCategory ? handleUpdate : handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Electric & Hybrid"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug / URL Key</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. electric-hybrid"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short tagline for homepage card"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingCategory(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold shadow-md shadow-red-500/20"
                >
                  {editingCategory ? 'Update' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
