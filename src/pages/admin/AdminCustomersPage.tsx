import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, Eye, ShoppingBag, MessageSquare, X, Calendar } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Order, Enquiry } from '../../types';

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalEnquiries: number;
  totalSpent: number;
  joined: string;
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [customerEnquiries, setCustomerEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const [orders, enquiries] = await Promise.all([
      DealershipService.getOrders(),
      DealershipService.getEnquiries()
    ]);

    // Aggregate unique customers
    const map = new Map<string, CustomerSummary>();

    orders.forEach((o) => {
      const key = o.email || o.customer_email || o.phone || o.customer_phone || o.customer_name;
      const amt = Number(o.amount || o.total_amount || 0);
      if (!map.has(key)) {
        map.set(key, {
          id: 'cust_' + Math.random().toString(36).substr(2, 6),
          name: o.customer_name,
          email: o.email || o.customer_email || 'customer@example.com',
          phone: o.phone || o.customer_phone || '+255 700 000 000',
          city: o.city || 'Dar es Salaam',
          totalOrders: 1,
          totalEnquiries: 0,
          totalSpent: amt,
          joined: o.created_at || '2026-10-14'
        });
      } else {
        const c = map.get(key)!;
        c.totalOrders += 1;
        c.totalSpent += amt;
      }
    });

    enquiries.forEach((e) => {
      const key = e.customer_email || e.customer_name;
      if (!map.has(key)) {
        map.set(key, {
          id: 'cust_' + Math.random().toString(36).substr(2, 6),
          name: e.customer_name,
          email: e.customer_email,
          phone: e.customer_phone || '+255 770 000000',
          city: 'Dar es Salaam',
          totalOrders: 0,
          totalEnquiries: 1,
          totalSpent: 0,
          joined: '2026-10-18'
        });
      } else {
        const c = map.get(key)!;
        c.totalEnquiries += 1;
      }
    });

    setCustomers(Array.from(map.values()));
  };

  const handleViewCustomer = async (c: CustomerSummary) => {
    setSelectedCustomer(c);
    const [orders, enquiries] = await Promise.all([
      DealershipService.getOrders(),
      DealershipService.getEnquiries()
    ]);
    setCustomerOrders(orders.filter((o) => o.customer_name === c.name || o.email === c.email));
    setCustomerEnquiries(enquiries.filter((e) => e.customer_name === c.name || e.customer_email === c.email));
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Verified buyers, enquiry leads, and client transaction histories in Tanzania</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by customer name, email, phone, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Contact Info</th>
                <th className="py-3.5 px-6">City / Region</th>
                <th className="py-3.5 px-6">Activity</th>
                <th className="py-3.5 px-6">Total Value</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{c.name}</p>
                        <p className="text-[10px] text-slate-400">Customer</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="text-slate-700">{c.email}</p>
                    <p className="text-[10px] text-slate-400">{c.phone}</p>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {c.city}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 mr-1.5">
                      {c.totalOrders} Orders
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                      {c.totalEnquiries} Enquiries
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-900">
                    TZS {c.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleViewCustomer(c)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-[#ef172b] hover:text-white text-slate-700 font-bold rounded-lg text-xs transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#ef172b] flex items-center justify-center font-bold text-sm">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</p>
                <p className="text-lg font-extrabold text-slate-900 mt-1">{selectedCustomer.totalOrders}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Inquiries</p>
                <p className="text-lg font-extrabold text-slate-900 mt-1">{selectedCustomer.totalEnquiries}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Spend (TZS)</p>
                <p className="text-sm font-extrabold text-[#ef172b] mt-1">{selectedCustomer.totalSpent.toLocaleString()}</p>
              </div>
            </div>

            {/* Customer Orders */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Order History</h4>
              {customerOrders.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No completed orders yet.</p>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((o) => (
                    <div key={o.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{o.product_name}</p>
                        <p className="text-[10px] text-slate-500">{o.order_number} • {o.created_at}</p>
                      </div>
                      <span className="font-extrabold text-slate-900">TZS {(o.amount || o.total_amount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Inquiries */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Inquiry History</h4>
              {customerEnquiries.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No inquiries recorded.</p>
              ) : (
                <div className="space-y-2">
                  {customerEnquiries.map((e) => (
                    <div key={e.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#ef172b]">{e.vehicle_title || 'Vehicle Inquiry'}</span>
                        <span className="text-slate-400 font-normal">{e.last_message_at}</span>
                      </div>
                      <p className="text-slate-600 mt-1 italic">"{e.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
