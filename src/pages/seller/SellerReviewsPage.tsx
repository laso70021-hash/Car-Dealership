import React, { useState, useEffect } from 'react';
import {
  Star, MessageSquare, ThumbsUp, Send, CheckCircle2,
  User, ShieldCheck, Filter
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { CustomerReview } from '../../types';

export const SellerReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const data = await DealershipService.getReviews();
    setReviews(data);
  };

  const handleReplySubmit = (reviewId: string) => {
    const reply = replyText[reviewId];
    if (!reply) return;
    alert(`Response posted: "${reply}"`);
    setReplyText({ ...replyText, [reviewId]: '' });
  };

  const filtered = reviews.filter(r =>
    starFilter === 'all' || r.rating === starFilter
  );

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Star className="w-7 h-7 text-[#ef172b]" />
          Customer Reviews & Reputation
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Monitor your showroom feedback, buyer trust scores, and reply to client testimonials.
        </p>
      </div>

      {/* Rating summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-slate-900">{averageRating}</div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Based on {reviews.length} verified buyer transactions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2">Filter by rating:</span>
          {['all', 5, 4, 3].map((val) => (
            <button
              key={val}
              onClick={() => setStarFilter(val as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                starFilter === val
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {val === 'all' ? 'All Stars' : `${val} Stars`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {(rev.user_name || rev.customer_name || 'B')[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    {rev.user_name || rev.customer_name || 'Verified Buyer'}
                    {rev.verified_buyer && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">
                {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              "{rev.comment}"
            </p>

            {/* Dealership reply form */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Write a public thank you or reply..."
                value={replyText[rev.id] || ''}
                onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
              />
              <button
                onClick={() => handleReplySubmit(rev.id)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
