import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Car, ArrowLeft, Upload, CheckCircle2, ShieldAlert, Sparkles,
  Info, DollarSign, MapPin, Gauge, Fuel, Check
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { useAuth } from '../../contexts/AuthContext';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const SellerAddVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const sellerId = user?.user_id || user?.id || '8916c8d8-3037-4e54-9ea5-d025cd77e042';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2022);
  const [vehicleType, setVehicleType] = useState('SUV');
  const [condition, setCondition] = useState<'New' | 'Used' | 'Certified Pre-Owned'>('Used');
  const [price, setPrice] = useState<number>(45000000);
  const [mileage, setMileage] = useState<number>(24000);
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [engineCapacity, setEngineCapacity] = useState('2.8L');
  const [color, setColor] = useState('Pearl White');
  const [city, setCity] = useState('Dar es Salaam');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80');

  const [features, setFeatures] = useState<string[]>([
    'Air Conditioning', 'Leather Seats', 'Reverse Camera', 'Bluetooth Audio'
  ]);

  const availableFeatures = [
    'Air Conditioning', 'Leather Seats', 'Reverse Camera', 'Bluetooth Audio',
    'Sunroof', '4WD / AWD', 'Navigation System', 'Keyless Entry',
    'Cruise Control', 'Parking Sensors', 'Apple CarPlay / Android Auto', 'Alloy Wheels'
  ];

  const toggleFeature = (feat: string) => {
    if (features.includes(feat)) {
      setFeatures(features.filter(f => f !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !model || !price) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await DealershipService.createVehicle({
        seller_id: sellerId,
        title,
        slug: `${brand.toLowerCase()}-${model.toLowerCase()}-${Date.now()}`.replace(/\s+/g, '-'),
        brand,
        model,
        vehicle_type: vehicleType,
        condition: condition as any,
        year: Number(year),
        mileage: Number(mileage),
        fuel_type: fuelType as any,
        transmission,
        price: Number(price),
        currency: 'TZS',
        location: city,
        city: city,
        color,
        engine_size: engineCapacity,
        description: description || `Clean ${year} ${brand} ${model} available for immediate inspection and drive in ${city}. Fully maintained and well kept.`,
        features,
        availability: 'available',
        verification_status: 'pending',
        featured_status: false,
        publication_status: 'pending_approval', // Enforces rule: sellers cannot approve their own listings
        primary_image: imageUrl
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/seller/vehicles');
      }, 1500);
    } catch (err) {
      console.error('Error creating vehicle:', err);
      alert('Failed to submit vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/seller/vehicles"
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Car className="w-6 h-6 text-[#ef172b]" />
              List a New Vehicle
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish your vehicle to thousands of verified buyers on Swahivo Car Dealership.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Review Policy Notice */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <div className="font-bold">Dealership Compliance Note</div>
          <div className="mt-0.5 text-amber-700 leading-relaxed font-medium">
            To ensure highest buyer trust in Tanzania, all new vehicle listings are submitted as <strong>Pending Approval</strong> and reviewed by our quality verification team within 2 to 4 business hours.
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Vehicle submitted successfully! Redirecting to your vehicle listings...
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Info className="w-4 h-4 text-[#ef172b]" />
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1.5">Vehicle Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2022 Toyota Land Cruiser Prado TX-L"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Brand *</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Toyota">Toyota</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="BMW">BMW</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Nissan">Nissan</option>
                <option value="Subaru">Subaru</option>
                <option value="Ford">Ford</option>
                <option value="Audi">Audi</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Honda">Honda</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Suzuki">Suzuki</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. Land Cruiser Prado, RAV4, C200"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Manufacturing Year *</label>
              <input
                type="number"
                min="1995"
                max="2026"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Truck / Pickup">Truck / Pickup</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Van">Van / Minibus</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Condition *</label>
              <div className="flex gap-2">
                {(['Used', 'New', 'Certified Pre-Owned'] as const).map((cond) => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setCondition(cond)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      condition === cond
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">City / Location</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Arusha">Arusha</option>
                <option value="Mwanza">Mwanza</option>
                <option value="Dodoma">Dodoma</option>
                <option value="Zanzibar">Zanzibar</option>
                <option value="Mbeya">Mbeya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Technical Specifications & Price */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Gauge className="w-4 h-4 text-[#ef172b]" />
            2. Specifications & Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Price (TZS) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Approx. TZS {price.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Mileage (km)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Engine Capacity</label>
              <input
                type="text"
                placeholder="e.g. 2.0L, 2.8L, 3.5L V6"
                value={engineCapacity}
                onChange={(e) => setEngineCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Color</label>
              <input
                type="text"
                placeholder="e.g. Pearl White, Metallic Black"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Features & Photo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Upload className="w-4 h-4 text-[#ef172b]" />
            3. Photo & Features
          </h2>

          <div className="space-y-4 text-xs">
            <ImageUploadInput
              label="Primary Vehicle Photo"
              required
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://images.unsplash.com/..."
              helperText="Upload high quality exterior photo of your vehicle (clear daylight angle recommended)"
            />

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Features & Options</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableFeatures.map((feat) => {
                  const active = features.includes(feat);
                  return (
                    <button
                      type="button"
                      key={feat}
                      onClick={() => toggleFeature(feat)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                        active
                          ? 'bg-red-50 text-[#ef172b] border-red-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{feat}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#ef172b]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Description & Condition Notes</label>
              <textarea
                rows={3}
                placeholder="Highlight vehicle condition, service history, documentation status (TIN, TRA clearance), and why buyers will love it."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/seller/vehicles"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-500/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting to Review...' : 'Submit Vehicle for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};
