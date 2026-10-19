import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Check, X, Search } from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { CustomerReview } from '../../types';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const list = await DealershipService.getReviews();
    setReviews(list);
  };

  const handleUpdateStatus = async (id: string, status: CustomerReview['status']) => {
    const updated = await DealershipService.updateReviewStatus(id, status);
    if (updated) {
      setReviews(reviews.map((r) => (r.id === id ? updated : r)));
    }
  };

  const filtered = reviews.filter((r) =>
    r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    r.comment.toLowerCase().includes(search.toLowerCase()) ||
    r.customer_city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Testimonials & Reviews</h1>
          <p className="text-xs text-slate-500 mt-0.5">Moderate public buyer feedback, 5-star vehicle ratings, and dealership testimonials</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter reviews by reviewer name, feedback, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b]"
        />
      </div>

      {/* Reviews Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={rev.customer_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'}
                      alt={rev.customer_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rev.customer_name}</h4>
                    <p className="text-[10px] text-slate-400">{rev.customer_city}, Tanzania</p>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                rev.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-700'
                  : rev.status === 'rejected'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {rev.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                {rev.status === 'rejected' && <XCircle className="w-3 h-3" />}
                {rev.status.toUpperCase()}
              </span>

              <div className="flex items-center gap-2">
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'approved')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Approve
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                    className="px-3 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-xs font-bold"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
