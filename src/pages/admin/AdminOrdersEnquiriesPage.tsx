import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageSquare, Search, CheckCircle2, Clock, X, Send, Eye, Phone, Mail, Filter } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Order, Enquiry } from '../../types';

interface Props {
  defaultTab?: 'orders' | 'enquiries';
}

export const AdminOrdersEnquiriesPage: React.FC<Props> = ({ defaultTab = 'orders' }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'enquiries'>(defaultTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [oData, eData] = await Promise.all([
      DealershipService.getOrders(),
      DealershipService.getEnquiries()
    ]);
    setOrders(oData);
    setEnquiries(eData);
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: Order['status']) => {
    const updated = await DealershipService.updateOrderStatus(id, newStatus);
    if (updated) {
      setOrders(orders.map((o) => (o.id === id ? updated : o)));
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, newStatus: Enquiry['status']) => {
    const updated = await DealershipService.updateEnquiryStatus(id, newStatus);
    if (updated) {
      setEnquiries(enquiries.map((e) => (e.id === id ? updated : e)));
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !replyText.trim()) return;
    await DealershipService.updateEnquiryStatus(selectedEnquiry.id, 'Responded');
    setEnquiries(
      enquiries.map((enq) =>
        enq.id === selectedEnquiry.id ? { ...enq, status: 'Responded', last_message_at: 'Just now' } : enq
      )
    );
    setReplySuccess(true);
    setTimeout(() => {
      setReplySuccess(false);
      setSelectedEnquiry(null);
      setReplyText('');
    }, 1500);
  };

  const filteredOrders = orders.filter((o) =>
    o.order_number.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    (o.product_name || o.items?.[0]?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredEnquiries = enquiries.filter((e) =>
    e.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    (e.vehicle_title && e.vehicle_title.toLowerCase().includes(search.toLowerCase())) ||
    e.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Orders & Inquiries</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer purchase commitments and inbound showroom enquiries</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/90 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#ef172b] text-white shadow-md shadow-red-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'enquiries'
                ? 'bg-[#ef172b] text-white shadow-md shadow-red-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Enquiries ({enquiries.length})</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder={activeTab === 'orders' ? 'Search orders by #ID, customer, vehicle...' : 'Search enquiries by customer, car, note...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Product / Vehicle</th>
                  <th className="py-3.5 px-6">Amount (TZS)</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-900">{ord.customer_name}</p>
                      <p className="text-[10px] text-slate-400">{ord.phone} • {ord.city}</p>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {ord.product_name}
                    </td>
                    <td className="py-3.5 px-6 font-extrabold text-slate-900">
                      TZS {(ord.amount || ord.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.payment_status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl outline-none border ${
                          ord.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ord.status === 'Confirmed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiries Tab Content */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Vehicle Inquired</th>
                  <th className="py-3.5 px-6">Inquiry Message</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Received</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-900">{enq.customer_name}</p>
                      <p className="text-[10px] text-slate-400">{enq.customer_email}</p>
                      {enq.customer_phone && (
                        <p className="text-[10px] text-slate-400">{enq.customer_phone}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-[#ef172b]">
                      {enq.vehicle_title || 'General Inbound'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 max-w-xs">
                      <p className="line-clamp-2">"{enq.message}"</p>
                    </td>
                    <td className="py-3.5 px-6">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl outline-none border ${
                          enq.status === 'Responded' || enq.status === 'Closed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Pending">Pending</option>
                        <option value="Responded">Responded</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400 text-[11px]">
                      {enq.last_message_at || 'Recently'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="px-3 py-1.5 bg-[#081725] hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Reply to Customer Enquiry</h3>
                <p className="text-xs text-slate-500">{selectedEnquiry.customer_name} • {selectedEnquiry.customer_email}</p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Vehicle: {selectedEnquiry.vehicle_title || 'Showroom Inquiry'}
              </span>
              <p className="text-slate-700 italic">"{selectedEnquiry.message}"</p>
            </div>

            {replySuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Response dispatched and logged successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Official Response</label>
                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Dear Customer, thank you for contacting Swahivo Dealership. We are pleased to inform you that this vehicle is available for immediate viewing..."
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-red-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
