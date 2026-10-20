import React, { useState, useEffect } from 'react';
import { Bike, Plus, Edit3, Trash2, Search, CheckCircle2, Clock, MapPin, X } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Motorbike } from '../../types';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const AdminMotorbikesPage: React.FC = () => {
  const [motorbikes, setMotorbikes] = useState<Motorbike[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Motorbike | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState('Yamaha');
  const [formModel, setFormModel] = useState('');
  const [formYear, setFormYear] = useState(2023);
  const [formCc, setFormCc] = useState(650);
  const [formMileage, setFormMileage] = useState(5000);
  const [formPrice, setFormPrice] = useState(15000000);
  const [formCondition, setFormCondition] = useState<'New' | 'Used'>('Used');
  const [formColor, setFormColor] = useState('Black');
  const [formImage, setFormImage] = useState('');
  const [formLocation, setFormLocation] = useState('Dar es Salaam');

  useEffect(() => {
    loadMotorbikes();
  }, []);

  const loadMotorbikes = async () => {
    const list = await DealershipService.getMotorbikes();
    const seen = new Set<string>();
    const unique = list.filter((m, idx) => {
      const id = m.id || `mb_${idx}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    setMotorbikes(unique);
  };

  const filtered = motorbikes.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase()) ||
    m.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createMotorbike({
      title: formTitle,
      brand: formBrand,
      model: formModel,
      year: Number(formYear),
      engine_cc: Number(formCc),
      mileage: Number(formMileage),
      price: Number(formPrice),
      currency: 'TZS',
      condition: formCondition,
      color: formColor,
      image_url: formImage || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80',
      availability: 'available',
      location: formLocation
    });
    setMotorbikes((prev) => [created, ...prev.filter((m) => m.id !== created.id)]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBike) return;
    const updated = await DealershipService.updateMotorbike(editingBike.id, {
      title: formTitle,
      brand: formBrand,
      model: formModel,
      year: Number(formYear),
      engine_cc: Number(formCc),
      mileage: Number(formMileage),
      price: Number(formPrice),
      condition: formCondition,
      color: formColor,
      image_url: formImage,
      location: formLocation
    });
    if (updated) {
      setMotorbikes(motorbikes.map((m) => (m.id === updated.id ? updated : m)));
    }
    setEditingBike(null);
    resetForm();
  };

  const handleToggleAvailability = async (mb: Motorbike) => {
    const newAvail = mb.availability === 'available' ? 'sold' : 'available';
    const updated = await DealershipService.updateMotorbike(mb.id, { availability: newAvail });
    if (updated) {
      setMotorbikes(motorbikes.map((m) => (m.id === updated.id ? updated : m)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this motorbike listing?')) {
      await DealershipService.deleteMotorbike(id);
      setMotorbikes(motorbikes.filter((m) => m.id !== id));
    }
  };

  const openEdit = (mb: Motorbike) => {
    setEditingBike(mb);
    setFormTitle(mb.title);
    setFormBrand(mb.brand);
    setFormModel(mb.model);
    setFormYear(mb.year);
    setFormCc(mb.engine_cc);
    setFormMileage(mb.mileage);
    setFormPrice(mb.price);
    setFormCondition(mb.condition);
    setFormColor(mb.color);
    setFormImage(mb.image_url);
    setFormLocation(mb.location);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormBrand('Yamaha');
    setFormModel('');
    setFormYear(2023);
    setFormCc(650);
    setFormMileage(5000);
    setFormPrice(15000000);
    setFormCondition('Used');
    setFormColor('Black');
    setFormImage('');
    setFormLocation('Dar es Salaam');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Motorbike Listings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage sports bikes, adventure touring models, and commercial delivery fleets</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Motorbike</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by title, brand, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((bike, idx) => (
          <div
            key={`${bike.id}-${idx}`}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all"
          >
            <div className="h-48 w-full relative overflow-hidden bg-slate-100">
              <img
                src={bike.image_url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80'}
                alt={bike.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-[#081725]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {bike.engine_cc} CC • {bike.year}
              </div>
              <button
                onClick={() => handleToggleAvailability(bike)}
                className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  bike.availability === 'available'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {bike.availability === 'available' ? 'Available' : 'Sold'}
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{bike.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{bike.brand} • {bike.condition} • {bike.color}</p>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="font-extrabold text-slate-900 text-sm">
                    TZS {bike.price.toLocaleString()}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {bike.location}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {bike.mileage.toLocaleString()} km
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(bike)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit motorbike"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bike.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete listing"
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
      {(isAddOpen || editingBike) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingBike ? 'Edit Motorbike' : 'Add Motorbike'}
              </h3>
              <button
                onClick={() => { setIsAddOpen(false); setEditingBike(null); }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingBike ? handleUpdate : handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 2024 Honda Africa Twin Adventure"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Yamaha, Honda, Boxer, BMW"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. MT-07, CRF1100"
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
                  <label className="block font-bold text-slate-700 mb-1">Engine (CC)</label>
                  <input
                    type="number"
                    required
                    value={formCc}
                    onChange={(e) => setFormCc(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    value={formMileage}
                    onChange={(e) => setFormMileage(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condition</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Motorbike Photo"
                value={formImage}
                onChange={setFormImage}
                placeholder="https://images.unsplash.com/..."
                helperText="Upload clear side-profile or showroom photo of the motorbike"
              />

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingBike(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold shadow-md shadow-red-500/20"
                >
                  {editingBike ? 'Save Changes' : 'Publish Motorbike'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
