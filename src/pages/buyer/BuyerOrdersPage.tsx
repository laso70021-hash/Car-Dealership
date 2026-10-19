import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Clock, CheckCircle2, ShieldCheck, MapPin,
  Download, Car, Eye, X, ChevronRight, FileText
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Order } from '../../types';

export const BuyerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await DealershipService.getOrders();
    setOrders(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShoppingBag className="w-7 h-7 text-[#ef172b]" />
          My Orders & Reservations
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Track your vehicle down payments, escrow verification stages, and delivery status.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900 text-sm">{ord.order_number}</span>
                  <span className="text-xs text-slate-400">Placed on {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Recent'}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Escrow Protected Transaction • TRA Reg Included
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  ord.status === 'completed' || ord.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : ord.status === 'confirmed' || ord.status === 'Confirmed'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {ord.status === 'completed' || ord.status === 'Completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {ord.status.toUpperCase()}
                </span>
                <button
                  onClick={() => setSelectedOrder(ord)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </button>
              </div>
            </div>

            {/* Item and Price */}
            <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Car className="w-6 h-6 text-[#ef172b]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {ord.items?.[0]?.name || ord.product_name || 'Imported Motor Vehicle'}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Quantity: {ord.items?.[0]?.quantity || 1} • Showroom: Prime Auto Motors
                  </div>
                </div>
              </div>

              <div className="text-left md:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Amount</span>
                <span className="text-lg font-black text-slate-900">
                  TZS {(ord.total_amount || ord.amount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="pt-3 border-t border-slate-100">
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                <div className="text-emerald-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto mb-1" />
                  Deposit Paid
                </div>
                <div className="text-emerald-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto mb-1" />
                  TRA Inspection
                </div>
                <div className={ord.status === 'completed' ? 'text-emerald-600' : 'text-blue-600'}>
                  <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${ord.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500 ring-4 ring-blue-100'}`} />
                  Preparation
                </div>
                <div className={ord.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'}>
                  <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${ord.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  Key Handover
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">Order Invoice Summary</h3>
            <p className="text-xs text-slate-400">Order Ref: {selectedOrder.order_number}</p>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl text-xs my-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-bold text-slate-900">{selectedOrder.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Item:</span>
                <span className="font-bold text-slate-900">{selectedOrder.items?.[0]?.name || selectedOrder.product_name || 'Vehicle'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-bold text-slate-900">{selectedOrder.shipping_address?.street || selectedOrder.address || 'Showroom Dispatch'}, {selectedOrder.shipping_address?.city || selectedOrder.city || 'Dar es Salaam'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-700 font-bold">Total Paid:</span>
                <span className="font-black text-slate-900 text-sm">TZS {(selectedOrder.total_amount || selectedOrder.amount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => alert('Invoice receipt PDF generated.')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
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
