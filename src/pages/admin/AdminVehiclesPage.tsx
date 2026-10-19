import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, Search, Plus, Filter, Star, Eye, Edit3, Trash2, CheckCircle2,
  XCircle, Clock, MapPin, Check, X, ShieldAlert, Sparkles
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';

export const AdminVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending_approval' | 'inactive'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState('Toyota');
  const [formModel, setFormModel] = useState('');
  const [formYear, setFormYear] = useState(2023);
  const [formPrice, setFormPrice] = useState(50000000);
  const [formMileage, setFormMileage] = useState(20000);
  const [formFuel, setFormFuel] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'>('Petrol');
  const [formTransmission, setFormTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [formCondition, setFormCondition] = useState<'New' | 'Used'>('Used');
  const [formLocation, setFormLocation] = useState('Dar es Salaam');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const list = await DealershipService.getVehicles();
    setVehicles(list);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || v.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && (v.publication_status === 'approved' || v.publication_status === 'active')) ||
      (statusFilter === 'pending_approval' && v.publication_status === 'pending_approval') ||
      (statusFilter === 'inactive' && (v.publication_status === 'inactive' || v.publication_status === 'archived'));
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const newV = await DealershipService.createVehicle({
      title: formTitle,
      slug: formTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      brand: formBrand,
      model: formModel,
      vehicle_type: 'SUV',
      condition: formCondition,
      year: Number(formYear),
      mileage: Number(formMileage),
      fuel_type: formFuel,
      transmission: formTransmission,
      price: Number(formPrice),
      currency: 'TZS',
      location: formLocation,
      city: formLocation,
      availability: 'available',
      verification_status: 'verified',
      featured_status: true,
      publication_status: 'approved',
      primary_image: formImage
    });
    setVehicles([newV, ...vehicles]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    const updated = await DealershipService.updateVehicle(editingVehicle.id, {
      title: formTitle,
      brand: formBrand,
      model: formModel,
      year: Number(formYear),
      price: Number(formPrice),
      mileage: Number(formMileage),
      fuel_type: formFuel,
      transmission: formTransmission,
      condition: formCondition,
      location: formLocation,
      primary_image: formImage
    });
    if (updated) {
      setVehicles(vehicles.map((v) => (v.id === updated.id ? updated : v)));
    }
    setEditingVehicle(null);
    resetForm();
  };

  const handleToggleFeatured = async (v: Vehicle) => {
    const updated = await DealershipService.updateVehicle(v.id, {
      featured_status: !v.featured_status
    });
    if (updated) {
      setVehicles(vehicles.map((item) => (item.id === v.id ? updated : item)));
    }
  };

  const handleToggleApproval = async (v: Vehicle) => {
    const newStatus = v.publication_status === 'approved' ? 'inactive' : 'approved';
    const updated = await DealershipService.updateVehicle(v.id, {
      publication_status: newStatus
    });
    if (updated) {
      setVehicles(vehicles.map((item) => (item.id === v.id ? updated : item)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle listing? This action cannot be undone.')) {
      await DealershipService.deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormTitle(v.title);
    setFormBrand(v.brand);
    setFormModel(v.model);
    setFormYear(v.year);
    setFormPrice(v.price);
    setFormMileage(v.mileage);
    setFormFuel(v.fuel_type);
    setFormTransmission(v.transmission);
    setFormCondition(v.condition === 'New' ? 'New' : 'Used');
    setFormLocation(v.location || 'Dar es Salaam');
    setFormImage(v.primary_image || '');
  };

  const resetForm = () => {
    setFormTitle('');
    setFormBrand('Toyota');
    setFormModel('');
    setFormYear(2023);
    setFormPrice(50000000);
    setFormMileage(20000);
    setFormFuel('Petrol');
    setFormTransmission('Automatic');
    setFormCondition('Used');
    setFormLocation('Dar es Salaam');
    setFormImage('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage, approve, feature, and edit all showroom and seller listings</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Status Badges Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'all'
              ? 'bg-[#081725] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Listings ({vehicles.length})
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'approved'
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Active / Approved ({vehicles.filter((v) => v.publication_status === 'approved' || v.publication_status === 'active').length})
        </button>
        <button
          onClick={() => setStatusFilter('pending_approval')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'pending_approval'
              ? 'bg-amber-500 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Pending Review ({vehicles.filter((v) => v.publication_status === 'pending_approval').length})
        </button>
        <button
          onClick={() => setStatusFilter('inactive')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'inactive'
              ? 'bg-slate-700 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Inactive / Sold ({vehicles.filter((v) => v.publication_status === 'inactive' || v.publication_status === 'archived').length})
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, brand, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#ef172b]"
          >
            <option value="All">All Brands</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Ford">Ford</option>
            <option value="Land Rover">Land Rover</option>
            <option value="Nissan">Nissan</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Featured</th>
                <th className="py-3.5 px-6">Vehicle</th>
                <th className="py-3.5 px-6">Specs</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((vehicle) => {
                const isApproved = vehicle.publication_status === 'approved' || vehicle.publication_status === 'active';
                return (
                  <tr key={vehicle.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => handleToggleFeatured(vehicle)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          vehicle.featured_status
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={vehicle.featured_status ? 'Remove from Featured' : 'Mark as Featured on Homepage'}
                      >
                        <Star className={`w-4 h-4 ${vehicle.featured_status ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={vehicle.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=80'}
                            alt={vehicle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{vehicle.title}</p>
                          <p className="text-[10px] text-slate-400">
                            {vehicle.brand} • {vehicle.condition} • {vehicle.year}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      <div>
                        <p>{vehicle.transmission} • {vehicle.fuel_type}</p>
                        <p className="text-[10px] text-slate-400">{vehicle.mileage.toLocaleString()} km</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-extrabold text-slate-900">
                      TZS {vehicle.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => handleToggleApproval(vehicle)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title="Click to toggle listing publication"
                      >
                        {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {isApproved ? 'Approved' : 'Pending / Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {vehicle.location || 'Dar es Salaam'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/cars/${vehicle.slug}`}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                          title="View live page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(vehicle)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit vehicle"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {(isAddOpen || editingVehicle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle'}
              </h3>
              <button
                onClick={() => { setIsAddOpen(false); setEditingVehicle(null); }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingVehicle ? handleUpdateVehicle : handleCreateVehicle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 2023 Toyota Land Cruiser 300 ZX"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  >
                    <option>Toyota</option>
                    <option>BMW</option>
                    <option>Mercedes-Benz</option>
                    <option>Ford</option>
                    <option>Land Rover</option>
                    <option>Nissan</option>
                    <option>Honda</option>
                    <option>Mitsubishi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. Land Cruiser"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                  <label className="block font-bold text-slate-700 mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    required
                    value={formMileage}
                    onChange={(e) => setFormMileage(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                  <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={formFuel}
                    onChange={(e) => setFormFuel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={formTransmission}
                    onChange={(e) => setFormTransmission(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingVehicle(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold shadow-md shadow-red-500/20"
                >
                  {editingVehicle ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
