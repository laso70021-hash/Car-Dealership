import React, { useState, useEffect } from 'react';
import {
  Users, Search, Phone, Mail, MapPin, Eye, ShoppingBag,
  MessageSquare, Calendar, Plus, X
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Order, Enquiry } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const SellerCustomersPage: React.FC = () => {
  const { user } = useAuth();
  const sellerId = user?.user_id || user?.id || '8916c8d8-3037-4e54-9ea5-d025cd77e042';

  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, [sellerId]);

  const loadData = async () => {
    const [o, e] = await Promise.all([
      DealershipService.getOrders(),
      DealershipService.getEnquiries(sellerId)
    ]);
    setOrders(o);
    setEnquiries(e);
  };

  // Compile unique customers from orders and enquiries
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    city: string;
    lastActive: string;
    orderCount: number;
    enquiryCount: number;
    totalSpent: number;
    carsInterested: string[];
  }>();

  enquiries.forEach(enq => {
    const key = (enq.customer_email || 'customer@example.com').toLowerCase();
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: enq.customer_name,
        email: enq.customer_email || 'customer@example.com',
        phone: enq.customer_phone || '+255 700 000 000',
        city: 'Dar es Salaam',
        lastActive: enq.created_at || new Date().toISOString(),
        orderCount: 0,
        enquiryCount: 1,
        totalSpent: 0,
        carsInterested: enq.vehicle_title ? [enq.vehicle_title] : []
      });
    } else {
      const c = customerMap.get(key)!;
      c.enquiryCount += 1;
      if (enq.vehicle_title && !c.carsInterested.includes(enq.vehicle_title)) {
        c.carsInterested.push(enq.vehicle_title);
      }
    }
  });

  orders.forEach(ord => {
    const email = ord.customer_email || ord.email || 'customer@example.com';
    const key = email.toLowerCase();
    const phone = ord.customer_phone || ord.phone || '+255 700 000 000';
    const totalAmount = Number(ord.total_amount || ord.amount || 0);
    const cars = ord.items?.map(i => i.name) || [ord.product_name || 'Showroom Vehicle'];
    const createdAt = ord.created_at || new Date().toISOString();

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: ord.customer_name,
        email: email,
        phone: phone,
        city: ord.shipping_address?.city || ord.city || 'Dar es Salaam',
        lastActive: createdAt,
        orderCount: 1,
        enquiryCount: 0,
        totalSpent: totalAmount,
        carsInterested: cars
      });
    } else {
      const c = customerMap.get(key)!;
      c.orderCount += 1;
      c.totalSpent += totalAmount;
    }
  });

  const customersList = Array.from(customerMap.values()).filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-[#ef172b]" />
          My Customers
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Directory of buyers who have purchased or enquired about your dealership vehicles.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          Total Buyers: <span className="text-slate-900 font-black">{customersList.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Vehicle History</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customersList.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-400">{c.city}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1 font-medium"><Phone className="w-3 h-3 text-slate-400" /> {c.phone}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400"><Mail className="w-3 h-3" /> {c.email}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 line-clamp-1">
                      {c.carsInterested.join(', ') || 'General Enquiry'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {c.orderCount} purchases • {c.enquiryCount} enquiries
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-slate-700">
                      TZS {c.totalSpent.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#ef172b] font-black text-lg flex items-center justify-center">
                {selectedCustomer.name[0]}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">{selectedCustomer.name}</h3>
                <span className="text-xs text-slate-400">{selectedCustomer.city}</span>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-bold text-slate-900">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-slate-900">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Purchase Value:</span>
                <span className="font-black text-slate-900">TZS {selectedCustomer.totalSpent.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Vehicles Interacted:</span>
                <div className="font-medium text-slate-800">
                  {selectedCustomer.carsInterested.map((car: string, i: number) => (
                    <span key={i} className="inline-block bg-white px-2 py-1 rounded border border-slate-200 text-[11px] mr-1.5 mb-1.5 font-bold">
                      {car}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
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
