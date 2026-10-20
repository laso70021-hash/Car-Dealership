import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, Store, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { SwahivoLogo } from '../components/common/SwahivoLogo';
import { useAuth, VERIFIED_ACCOUNTS } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setErrorMsg(result.error || 'Login failed. Please check your email and password.');
        return;
      }

      if (result.role === 'admin') navigate('/admin/dashboard');
      else if (result.role === 'seller') navigate('/seller/dashboard');
      else navigate('/account/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillCredentials = async (targetRole: UserRole) => {
    const creds = VERIFIED_ACCOUNTS[targetRole];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setErrorMsg(null);
      setIsLoading(true);

      const result = await signIn(creds.email, creds.password);
      setIsLoading(false);
      if (result.success) {
        if (result.role === 'admin') navigate('/admin/dashboard');
        else if (result.role === 'seller') navigate('/seller/dashboard');
        else navigate('/account/dashboard');
      } else {
        setErrorMsg(result.error || 'Failed to authenticate demo user.');
      }
    }
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

          {/* Real Supabase Credentials Shortcut Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Instant Sign In (Real Supabase Auth)
              </span>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                Live DB
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleFillCredentials('admin')}
                className="py-2 px-2 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <Shield className="w-3 h-3 text-[#ef172b]" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillCredentials('seller')}
                className="py-2 px-2 bg-[#ef172b] hover:bg-[#d01122] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <Store className="w-3 h-3" />
                <span>Seller</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillCredentials('buyer')}
                className="py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <UserCheck className="w-3 h-3" />
                <span>Buyer</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#ef172b] flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="admin@swahivo.com or seller@swahivo.com"
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
              className="w-full py-3 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating with Supabase...' : 'Sign In'}</span>
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
