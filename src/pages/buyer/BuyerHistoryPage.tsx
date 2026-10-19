import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History, Search, Trash2, ArrowRight, Clock, Filter,
  Sparkles, ExternalLink
} from 'lucide-react';

export const BuyerHistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState([
    {
      id: 'h1',
      query: 'Toyota Land Cruiser Prado TX-L',
      filters: 'SUV • Automatic • Dar es Salaam • 2020+',
      resultsCount: 14,
      searchedAt: '2 hours ago'
    },
    {
      id: 'h2',
      query: 'Mercedes-Benz C-Class / E-Class',
      filters: 'Sedan • Petrol • Under 60,000,000 TZS',
      resultsCount: 8,
      searchedAt: 'Yesterday'
    },
    {
      id: 'h3',
      query: 'Toyota RAV4 4WD',
      filters: 'SUV • Arusha & Dar es Salaam',
      resultsCount: 22,
      searchedAt: '3 days ago'
    },
    {
      id: 'h4',
      query: 'Japanese Pickup Truck Double Cabin',
      filters: 'Diesel • Manual/Automatic • Commercial',
      resultsCount: 19,
      searchedAt: '5 days ago'
    }
  ]);

  const handleClearAll = () => {
    if (confirm('Clear your entire search history?')) {
      setHistoryItems([]);
    }
  };

  const handleRemove = (id: string) => {
    setHistoryItems(historyItems.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-[#ef172b]" />
            Search History
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Saved car searches, budget filters, and keyword queries you ran on Swahivo.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl text-xs font-bold transition"
          >
            <Trash2 className="w-4 h-4" /> Clear All History
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <History className="w-12 h-12 text-slate-200 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700">No search history</h3>
          <p className="mt-1">When you search for cars on Swahivo, your search terms and filters will be saved here.</p>
          <Link
            to="/cars"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-[#ef172b] text-white rounded-xl text-xs font-bold"
          >
            Start Searching
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl mt-0.5">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.query}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{item.filters}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">{item.resultsCount} matches</span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> Searched {item.searchedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  to="/cars"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  Rerun Search <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="Remove query"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
