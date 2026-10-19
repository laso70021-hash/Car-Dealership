import React from 'react';
import { X, Play, MapPin, Sparkles, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import heroSunsetImg from '../../assets/images/Swahivo Dealership at Sunset.png';

interface ShowroomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowroomModal: React.FC<ShowroomModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#081725] text-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-700 animate-in zoom-in-95">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/30 text-red-500 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Swahivo Dealership Experience</h3>
              <p className="text-xs text-slate-400">Virtual Showroom & Service Facility Tour</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src={heroSunsetImg}
            alt="Swahivo Dealership"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081725] via-transparent to-black/40" />

          {/* Center Play Button Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#ef172b] text-white flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
              <Play className="w-7 h-7 ml-1 fill-current" />
            </div>
            <h4 className="text-xl font-extrabold text-white">Experience Swahivo In Person</h4>
            <p className="text-xs text-slate-300 max-w-md">
              Visit our state-of-the-art climate-controlled showroom featuring over 150 luxury SUVs, sports sedans, and commercial 4x4s in Tanzania.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-[#ef172b]" />
            <span>Kiembe Samaki, Zanzibar & Ocean Road, Dar es Salaam</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="tel:+255770565656"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-2 font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Us</span>
            </a>
            <Link
              to="/cars"
              onClick={onClose}
              className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl flex items-center gap-2 font-bold shadow-md shadow-red-500/20"
            >
              <span>Explore Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
