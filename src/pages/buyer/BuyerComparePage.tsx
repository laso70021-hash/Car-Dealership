import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale, Plus, X, Car, Check, CheckCircle2, ArrowRight,
  Sparkles, Compass
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';

export const BuyerComparePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [comparedVehicles, setComparedVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const data = await DealershipService.getVehicles();
    setVehicles(data);
    // Pick the first 2 vehicles by default
    setComparedVehicles(data.slice(0, 2));
  };

  const handleRemove = (id: string) => {
    setComparedVehicles(comparedVehicles.filter(v => v.id !== id));
  };

  const handleAddCar = (vehicleId: string) => {
    const toAdd = vehicles.find(v => v.id === vehicleId);
    if (toAdd && !comparedVehicles.some(v => v.id === toAdd.id)) {
      if (comparedVehicles.length >= 3) {
        alert('You can compare at most 3 vehicles at once.');
        return;
      }
      setComparedVehicles([...comparedVehicles, toAdd]);
    }
  };

  const specsList = [
    { label: 'Price (TZS)', getVal: (v: Vehicle) => `TZS ${v.price.toLocaleString()}` },
    { label: 'Condition', getVal: (v: Vehicle) => v.condition },
    { label: 'Year', getVal: (v: Vehicle) => String(v.year) },
    { label: 'Mileage', getVal: (v: Vehicle) => `${v.mileage?.toLocaleString() || 'N/A'} km` },
    { label: 'Transmission', getVal: (v: Vehicle) => v.transmission },
    { label: 'Fuel Type', getVal: (v: Vehicle) => v.fuel_type },
    { label: 'Engine Capacity', getVal: (v: Vehicle) => v.engine_capacity || v.engine_size || '2.8L' },
    { label: 'Location', getVal: (v: Vehicle) => v.city || v.location },
    { label: 'Availability', getVal: (v: Vehicle) => v.availability?.toUpperCase() || 'IN STOCK' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-[#ef172b]" />
            Side-by-Side Car Comparison
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Compare specs, pricing, and features to make the best purchasing decision.
          </p>
        </div>

        {comparedVehicles.length < 3 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => handleAddCar(e.target.value)}
              value=""
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="" disabled>+ Add vehicle to compare...</option>
              {vehicles
                .filter(v => !comparedVehicles.some(c => c.id === v.id))
                .map(v => (
                  <option key={v.id} value={v.id}>
                    {v.title} (TZS {v.price.toLocaleString()})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {comparedVehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <Scale className="w-12 h-12 text-slate-200 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700">No cars to compare</h3>
          <p className="mt-1">Add vehicles using the selector above or browse our car catalog.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              {/* Header row with vehicle cards */}
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-4 bg-slate-50 text-left font-black text-slate-400 uppercase tracking-wider text-[10px] w-48">
                    Specification
                  </th>
                  {comparedVehicles.map(v => (
                    <th key={v.id} className="p-4 text-left min-w-[240px] relative">
                      <button
                        onClick={() => handleRemove(v.id)}
                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={v.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'}
                        alt={v.title}
                        className="w-full h-32 object-cover rounded-xl border border-slate-200 mb-3"
                      />
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">{v.title}</div>
                      <div className="font-black text-[#ef172b] text-base mt-1">
                        TZS {v.price.toLocaleString()}
                      </div>
                      <Link
                        to={`/cars/${v.slug || v.id}`}
                        className="mt-3 block text-center py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                      >
                        View Listing
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Spec Rows */}
              <tbody className="divide-y divide-slate-100">
                {specsList.map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/70 text-xs">
                      {spec.label}
                    </td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4 font-semibold text-slate-900 text-xs">
                        {spec.getVal(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
