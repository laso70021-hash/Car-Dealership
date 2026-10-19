import React, { useState } from 'react';
import { Wrench, ShieldCheck, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';
import { BookingModal } from '../components/modals/BookingModal';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 's1',
    name: 'Full Vehicle Diagnostic & Engine Health Check',
    description: 'Comprehensive computer diagnostic scanning for engine, transmission, ABS, airbag, and ECU sensors.',
    price: 150000,
    duration: '1.5 Hours',
    features: ['OBD2 Scanner Analysis', 'Battery & Alternator Test', 'Fluid Level Inspection', 'Live Sensor Readout']
  },
  {
    id: 's2',
    name: 'Major Scheduled Service & Fluid Flush',
    description: 'Full synthetic oil change, OEM oil filter, air filter, spark plug inspection, brake fluid, and coolant flush.',
    price: 450000,
    duration: '3 Hours',
    features: ['Fully Synthetic Motor Oil', 'OEM Oil & Fuel Filter', 'Spark Plug Check', '60-Point Safety Check']
  },
  {
    id: 's3',
    name: 'Ceramic Coating & Paint Correction',
    description: 'Multi-stage machine paint polish to remove swirl marks, followed by 3-year hydrophobic nano-ceramic sealant.',
    price: 850000,
    duration: '1 Day',
    features: ['Multi-Stage Machine Polish', 'Nano-Ceramic Sealant', 'Hydrophobic Glass Shield', 'Interior Deep Detailing']
  },
  {
    id: 's4',
    name: 'Air Conditioning Service & Antibacterial Purge',
    description: 'R134a refrigerant recharge, leak pressure testing, condenser cleaning, and cabin filter replacement.',
    price: 220000,
    duration: '2 Hours',
    features: ['Full Gas Recharge', 'Vacuum Leak Test', 'Compressor Lubricant', 'Cabin Air Sanitization']
  },
  {
    id: 's5',
    name: 'Brake Pad Replacement & Rotor Resurfacing',
    description: 'Front and rear premium ceramic brake pad installation and computerized brake disc rotor resurfacing.',
    price: 320000,
    duration: '2 Hours',
    features: ['Ceramic Brake Pads', 'Rotor Lathe Machining', 'Caliper Pin Greasing', 'Brake Line Bleed']
  },
  {
    id: 's6',
    name: 'Pre-Purchase Vehicle Inspection (TRA Verification)',
    description: 'Comprehensive 150-point technical, mechanical, chassis integrity, and customs documentation report.',
    price: 180000,
    duration: '2 Hours',
    features: ['Full Mechanical Report', 'Chassis & Structural Inspection', 'Paint Thickness Meter', 'Full TRA Documentation Audit']
  }
];

export const ServicesPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleBook = (srv: ServiceItem) => {
    setSelectedService(srv);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#ef172b] uppercase tracking-wider">Swahivo Authorized Workshop</span>
            <h1 className="text-3xl font-extrabold text-slate-900">Certified Vehicle Service & Maintenance</h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Factory trained master technicians, state-of-the-art diagnostic equipment, and genuine OEM parts for luxury and utility vehicles in Tanzania.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedService(SERVICES_DATA[0]);
              setIsBookingOpen(true);
            }}
            className="px-6 py-3.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-500/20 self-start md:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Service Appointment</span>
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((srv) => (
            <div key={srv.id} className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {srv.duration}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{srv.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{srv.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {srv.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Estimated Cost</p>
                  <p className="text-lg font-extrabold text-[#ef172b]">
                    TZS {new Intl.NumberFormat('en-US').format(srv.price)}
                  </p>
                </div>
                <button
                  onClick={() => handleBook(srv)}
                  className="px-4 py-2 bg-slate-900 hover:bg-[#ef172b] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        type="service"
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
