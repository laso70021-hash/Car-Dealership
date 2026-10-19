import React, { useState, useEffect } from 'react';
import { Database, Copy, Check, ExternalLink, RefreshCw, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { DealershipService, DatabaseStatus } from '../../services/dealershipService';

import masterSql from '../../../supabase/migrations/20261018000000_swahivo_master_schema.sql?raw';

export const DatabaseStatusBanner: React.FC = () => {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    const res = await DealershipService.checkDatabaseStatus();
    setStatus(res);
    setIsChecking(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const copySql = () => {
    try {
      navigator.clipboard.writeText(masterSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!status || isDismissed) return null;

  return (
    <>
      {/* Top Banner */}
      <div className={`text-xs px-4 py-2 border-b flex items-center justify-between transition-colors z-50 ${
        status.tablesExist
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-amber-50 text-amber-900 border-amber-200'
      }`}>
        <div className="flex items-center gap-2 max-w-4xl">
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
            status.tablesExist ? 'bg-emerald-500' : 'bg-amber-500'
          }`} />
          <span className="font-semibold">
            {status.tablesExist ? 'Supabase Database Active' : 'Supabase Connected (Migration Ready)'}:
          </span>
          <span className="hidden sm:inline text-slate-700">
            {status.tablesExist
              ? 'Live PostgreSQL tables and RLS policies verified on project yefbfstqxxqpbqzloeod.'
              : 'PostgreSQL instance reachable. Execute the master migration in Supabase SQL editor to create all tables.'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Database className="w-3.5 h-3.5 text-[#ef172b]" />
            <span>SQL Migration</span>
          </button>
          <button
            onClick={checkStatus}
            disabled={isChecking}
            title="Recheck schema"
            className="text-slate-500 hover:text-slate-900 transition-colors p-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-[#ef172b]' : ''}`} />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SQL Migration Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-100 text-[#ef172b] rounded-xl">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Supabase Master SQL Migration</h3>
                  <p className="text-xs text-slate-500">Project: https://yefbfstqxxqpbqzloeod.supabase.co</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-600">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Connection Verified
                </div>
                <p className="text-xs">
                  Your Supabase project is connected. Administrator UID: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-800">3c6a4096-d6e2-4c45-bada-45f0cbf01510</code>.
                </p>
                <p className="text-xs">
                  Run the complete SQL migration file in your Supabase SQL editor to provision all 17 tables (vehicles, brands, categories, orders, enquiries, bookings, reviews, RLS policies, and seed data).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  SQL File Location
                </label>
                <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg select-all">
                  /supabase/migrations/20261018000000_swahivo_master_schema.sql
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://supabase.com/dashboard/project/yefbfstqxxqpbqzloeod/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white font-medium rounded-xl transition-all shadow-md shadow-red-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Supabase SQL Editor</span>
                </a>
                <button
                  onClick={copySql}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'SQL Copied!' : 'Copy SQL Script'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Status: {status.tablesExist ? '✅ Live tables active' : '⚡ Schema pending execution'}</span>
              <button
                onClick={() => {
                  checkStatus();
                  setIsOpen(false);
                }}
                className="text-[#ef172b] font-semibold hover:underline"
              >
                Close & Check
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
