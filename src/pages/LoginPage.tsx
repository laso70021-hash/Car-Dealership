import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, Store, UserCheck, ArrowRight } from 'lucide-react';
import { SwahivoLogo } from '../components/common/SwahivoLogo';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { signIn, switchRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(email, role);
    setIsLoading(false);

    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'seller') navigate('/seller/dashboard');
    else navigate('/account/dashboard');
  };

  const handleQuickLogin = (targetRole: UserRole) => {
    switchRole(targetRole);
    if (targetRole === 'admin') navigate('/admin/dashboard');
    else if (targetRole === 'seller') navigate('/seller/dashboard');
    else navigate('/account/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-6">
          <SwahivoLogo size="lg" />
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900">Sign In to Your Account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Access your buyer portal, seller inventory, or admin management dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-200/90 space-y-6">
          
          {/* Quick Demo Access Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              Quick One-Click Demo Access
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
              >
                <Shield className="w-3 h-3 text-[#ef172b]" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('seller')}
                className="py-1.5 px-2 bg-[#ef172b] hover:bg-[#d01122] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
              >
                <Store className="w-3 h-3" />
                <span>Seller</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('buyer')}
                className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
              >
                <UserCheck className="w-3 h-3" />
                <span>Buyer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['buyer', 'seller', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      role === r
                        ? 'bg-[#ef172b] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@swahivo.com' : role === 'seller' ? 'ali.hassan@swahivocars.com' : 'salim.khamis@example.com'}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#ef172b] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
