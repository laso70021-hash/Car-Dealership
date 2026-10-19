import React from 'react';
import {
  BarChart3, TrendingUp, Eye, MessageSquare, Car, Users,
  ArrowUpRight, Clock, Award, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const VIEWS_TREND = [
  { month: 'Jun', views: 3200, leads: 45 },
  { month: 'Jul', views: 4800, leads: 68 },
  { month: 'Aug', views: 6100, leads: 92 },
  { month: 'Sep', views: 7900, leads: 114 },
  { month: 'Oct', views: 9800, leads: 148 },
];

const TOP_CARS = [
  { model: 'Land Cruiser Prado', views: 3420, enquiries: 42, avgDays: 14 },
  { model: 'Toyota RAV4', views: 2890, enquiries: 38, avgDays: 11 },
  { model: 'Mercedes C200', views: 2150, enquiries: 29, avgDays: 19 },
  { model: 'BMW X5 xDrive', views: 1840, enquiries: 22, avgDays: 24 },
];

export const SellerAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-[#ef172b]" />
          Showroom Analytics & Traffic
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Real-time buyer engagement metrics, vehicle page views, and lead conversions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Impressions</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">31,800</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +24%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Across all search & categories</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Enquiries</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-[#ef172b]">467</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +18%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Direct phone & WhatsApp leads</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Days to Sell</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">16.4</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              -3 days
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">From listing to completed order</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-blue-600">4.8%</span>
            <span className="text-xs font-bold text-slate-400">Top 10% in TZ</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">View to customer booking</span>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">
          Monthly Views vs. Qualified Buyer Leads
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={VIEWS_TREND}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef172b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef172b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="views" stroke="#ef172b" strokeWidth={2.5} fill="url(#viewsGrad)" name="Views" />
              <Area type="monotone" dataKey="leads" stroke="#081725" strokeWidth={2} fill="transparent" name="Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Models Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
          Most Viewed Models in Your Showroom
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Vehicle Model</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Enquiries</th>
                <th className="py-3 px-4">Turnaround Time</th>
                <th className="py-3 px-4">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TOP_CARS.map((car, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{car.model}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{car.views.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-[#ef172b]">{car.enquiries}</td>
                  <td className="py-3 px-4 text-slate-500">{car.avgDays} days avg.</td>
                  <td className="py-3 px-4">
                    <span className="p-1 px-2 bg-slate-100 text-slate-700 rounded-md font-black text-[10px]">
                      #{idx + 1}
                    </span>
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
