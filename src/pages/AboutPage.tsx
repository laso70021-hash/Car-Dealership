import React from 'react';
import { ShieldCheck, Award, Users, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import heroSunsetImg from '../assets/images/Swahivo Dealership at Sunset.png';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f7fb] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row items-center gap-10">
          <div className="space-y-4 flex-1">
            <span className="text-xs font-bold text-[#ef172b] uppercase tracking-wider">About Swahivo</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Tanzania's Most Trusted Automotive Dealership & Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Founded with the vision to revolutionize car ownership in East Africa, Swahivo Car Dealership combines transparent vehicle sourcing, full Tanzania Revenue Authority (TRA) customs documentation, multi-point mechanical inspections, and flexible bank financing.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/cars"
                className="px-6 py-3 bg-[#ef172b] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#d01122] transition-colors"
              >
                Explore Showroom
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                Contact Dealership
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
            <img
              src={heroSunsetImg}
              alt="Swahivo Dealership"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">100% Verified TRA Documentation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every single vehicle in our inventory undergoes rigorous customs duty and registration verification with TRA, ensuring clear titles without hidden encumbrances.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Certified Dealer Warranties</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We stand behind every car we sell. Our certified pre-owned vehicles include up to 12 months comprehensive engine and gearbox warranties with local service support.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Multi-Vendor Agent Network</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect directly with verified professional car sellers and dealerships across Dar es Salaam, Zanzibar, Arusha, and Mwanza through our secure platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
