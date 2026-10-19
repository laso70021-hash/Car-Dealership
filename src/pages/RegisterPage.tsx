import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Store, UserCheck, ArrowRight } from 'lucide-react';
import { SwahivoLogo } from '../components/common/SwahivoLogo';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('Dar es Salaam');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, role);
    if (role === 'seller') navigate('/seller/dashboard');
    else navigate('/account/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-6">
          <SwahivoLogo size="lg" />
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900">Create Your Swahivo Account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Join Tanzania's premier automotive network as a buyer or verified dealership seller.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-200/90 space-y-6">
          
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                role === 'buyer' ? 'bg-[#ef172b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Car Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                role === 'seller' ? 'bg-[#ef172b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Dealership / Agent</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Salim Khamis"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
              />
            </div>

            {role === 'seller' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dealership / Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Ali Motors Tanzania"
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+255 770 000000"
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none bg-white"
                >
                  <option>Dar es Salaam</option>
                  <option>Zanzibar</option>
                  <option>Arusha</option>
                  <option>Mwanza</option>
                  <option>Dodoma</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all hover:scale-[1.01]"
            >
              Complete Registration
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#ef172b] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
