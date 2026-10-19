import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Search, Filter, Phone, Mail, Clock, Send,
  CheckCircle2, X, AlertCircle, Car, User
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Enquiry } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const SellerEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const sellerId = user?.user_id || user?.id || 'seller-ali-hassan';

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'closed'>('all');
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadEnquiries();
    const unsub = DealershipService.subscribeToTable('enquiries', () => loadEnquiries());
    return () => unsub();
  }, [sellerId]);

  const loadEnquiries = async () => {
    // Only fetch enquiries for this seller
    const data = await DealershipService.getEnquiries(sellerId);
    setEnquiries(data);
  };

  const handleSendReply = async () => {
    if (!activeEnquiry || !replyMessage.trim()) return;
    setIsSending(true);

    try {
      const updated = await DealershipService.replyToEnquiry(
        activeEnquiry.id,
        replyMessage,
        'Ali Hassan (Prime Auto Showroom)'
      );

      setEnquiries(enquiries.map(e => e.id === updated.id ? updated : e));
      setActiveEnquiry(updated);
      setReplyMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch =
      e.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.vehicle_title || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && (e.status === 'Pending' || e.status === 'New' || e.status === 'pending')) ||
      (statusFilter === 'in_progress' && (e.status === 'Responded' || e.status === 'Contacted' || e.status === 'in_progress')) ||
      (statusFilter === 'closed' && (e.status === 'Closed' || e.status === 'closed'));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-7 h-7 text-[#ef172b]" />
          Vehicle Enquiries
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Respond directly to buyer leads and questions about your listed vehicles.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search enquiries by buyer or car..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'New / Unreplied' },
            { id: 'in_progress', label: 'Replied' },
            { id: 'closed', label: 'Closed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
            Incoming Messages ({filteredEnquiries.length})
          </div>
          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No enquiries matching your filters.</div>
            ) : (
              filteredEnquiries.map(enq => {
                const isSelected = activeEnquiry?.id === enq.id;
                return (
                  <div
                    key={enq.id}
                    onClick={() => setActiveEnquiry(enq)}
                    className={`p-4 cursor-pointer transition text-left ${
                      isSelected ? 'bg-red-50/60 border-l-4 border-[#ef172b]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs">{enq.customer_name}</span>
                      <span className="text-[10px] text-slate-400">
                        {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mt-1 line-clamp-1">
                      <Car className="w-3.5 h-3.5 text-[#ef172b]" />
                      {enq.vehicle_title || 'Vehicle Inquiry'}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {enq.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{enq.customer_phone}</span>
                      {enq.status === 'pending' || enq.status === 'Pending' || enq.status === 'New' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                          Needs Reply
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Replied
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail and Reply Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          {activeEnquiry ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {activeEnquiry.customer_name[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">{activeEnquiry.customer_name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {activeEnquiry.customer_phone}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {activeEnquiry.customer_email}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    activeEnquiry.status === 'pending' || activeEnquiry.status === 'Pending' || activeEnquiry.status === 'New'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {activeEnquiry.status === 'pending' || activeEnquiry.status === 'Pending' || activeEnquiry.status === 'New' ? 'Needs Response' : 'Replied'}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Interested In:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-[#ef172b]" />
                    {activeEnquiry.vehicle_title}
                  </span>
                </div>
              </div>

              {/* Message thread */}
              <div className="space-y-4">
                {/* Buyer Message */}
                <div className="bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Buyer Enquiry • {activeEnquiry.created_at ? new Date(activeEnquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {activeEnquiry.message}
                  </p>
                </div>

                {/* Seller Reply */}
                {activeEnquiry.reply ? (
                  <div className="bg-red-50/60 p-4 rounded-xl text-xs border border-red-100">
                    <div className="text-[10px] font-bold text-[#ef172b] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Your Dealership Reply • {activeEnquiry.replied_at ? new Date(activeEnquiry.replied_at).toLocaleDateString() : 'Just now'}
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {activeEnquiry.reply}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">No reply has been sent yet.</div>
                )}
              </div>

              {/* Send reply form */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Send Reply to Customer</label>
                <textarea
                  rows={3}
                  placeholder="Type your response with car availability, viewing times, or inspection details..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSendReply}
                    disabled={isSending || !replyMessage.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-[#ef172b] hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-200 mb-2" />
              <div className="font-bold text-slate-700 text-xs">Select an enquiry to view full thread</div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                You will be able to read buyer questions and reply with vehicle inspection details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
