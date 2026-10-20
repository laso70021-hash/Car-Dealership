import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, ShieldAlert, CheckCircle2, UserPlus, X } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { UserProfile } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await DealershipService.getUsers();
    setUsers(list);
  };

  const handleRoleChange = async (userId: string, newRole: UserProfile['role']) => {
    try {
      await DealershipService.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u)));
    } catch (err: any) {
      alert(`Failed to update role: ${err.message}`);
    }
  };

  const handleToggleVerification = async (userId: string) => {
    try {
      const newStatus = await DealershipService.toggleUserVerification(userId);
      setUsers(users.map((u) => (u.user_id === userId ? { ...u, is_verified: newStatus } : u)));
    } catch (err: any) {
      alert(`Failed to toggle verification: ${err.message}`);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.city && u.city.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Access & Role Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control role-based privileges, verify official dealership agents, and manage user credentials</p>
        </div>
      </div>

      {/* Role Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">Administrators</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              {users.filter((u) => u.role === 'admin').length}
            </p>
          </div>
          <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600 font-bold text-xs">Super Admin</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">Verified Sellers & Dealers</p>
            <p className="text-xl font-extrabold text-[#ef172b] mt-1">
              {users.filter((u) => u.role === 'seller').length}
            </p>
          </div>
          <span className="p-2.5 rounded-xl bg-red-50 text-[#ef172b] font-bold text-xs">Multi-Vendor</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">Registered Buyers</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              {users.filter((u) => u.role === 'buyer').length}
            </p>
          </div>
          <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">Customer Accounts</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search users by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none w-full sm:w-auto"
        >
          <option value="All">All Roles</option>
          <option value="admin">Administrators</option>
          <option value="seller">Sellers / Dealerships</option>
          <option value="buyer">Buyers</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">User Profile</th>
                <th className="py-3.5 px-6">Email / Phone</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Role Assignment</th>
                <th className="py-3.5 px-6">Seller Verification</th>
                <th className="py-3.5 px-6 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.user_id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                          alt={u.full_name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.full_name || 'Anonymous User'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {u.user_id.slice(0, 10)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="text-slate-800">{u.email}</p>
                    <p className="text-[10px] text-slate-400">{u.phone}</p>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">
                    {u.city || 'Tanzania'}
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.user_id, e.target.value as any)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl outline-none border ${
                        u.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : u.role === 'seller'
                          ? 'bg-red-50 text-[#ef172b] border-red-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      <option value="admin">Super Admin</option>
                      <option value="seller">Seller / Agent</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => handleToggleVerification(u.user_id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        u.is_verified
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {u.is_verified ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                      {u.is_verified ? 'Verified Dealer' : 'Unverified'}
                    </button>
                  </td>
                  <td className="py-3.5 px-6 text-slate-400 text-right text-[11px]">
                    {u.created_at || '2026-01-15'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
