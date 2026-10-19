import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Clock, CheckCircle2, Car, Store, Send,
  ArrowRight, Phone, Mail
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Enquiry } from '../../types';

export const BuyerEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    const data = await DealershipService.getEnquiries();
    setEnquiries(data);
    if (data.length > 0) setSelectedEnquiry(data[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-7 h-7 text-[#ef172b]" />
          My Vehicle Enquiries
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Messages, pricing requests, and inspection availability inquiries you sent to showrooms.
        </p>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No enquiries sent yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
              Submitted Inquiries ({enquiries.length})
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[550px]">
              {enquiries.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                return (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`p-4 cursor-pointer transition ${
                      isSelected ? 'bg-red-50/60 border-l-4 border-[#ef172b]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Store className="w-3 h-3 text-[#ef172b]" />
                        Prime Auto Showroom
                      </span>
                      <span>{enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'Recent'}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      {enq.vehicle_title || 'Vehicle Inquired'}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {enq.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Ref #{enq.id.slice(0, 6)}</span>
                      {enq.reply ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Showroom Replied
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Awaiting Response
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Thread */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            {selectedEnquiry ? (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle</span>
                      <h3 className="text-base font-black text-slate-900 mt-0.5">
                        {selectedEnquiry.vehicle_title}
                      </h3>
                    </div>
                    {selectedEnquiry.reply ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Answered
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        In Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Question bubble */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Your Question
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {selectedEnquiry.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Sent on {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleString() : 'Recent'}
                  </span>
                </div>

                {/* Showroom Reply Bubble */}
                {selectedEnquiry.reply ? (
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Showroom Response
                      </span>
                      <span className="text-[10px] text-emerald-600">
                        {selectedEnquiry.replied_at ? new Date(selectedEnquiry.replied_at).toLocaleDateString() : 'Replied'}
                      </span>
                    </div>
                    <p className="text-slate-900 font-medium leading-relaxed">
                      {selectedEnquiry.reply}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800">
                    <div className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" /> Showroom is reviewing your message
                    </div>
                    <p className="text-[11px] text-amber-700 mt-1">
                      Our dealers usually respond within 1 to 3 hours with vehicle availability and viewing slots.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400">
                Select an enquiry to view the conversation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
