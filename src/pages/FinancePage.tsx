import React, { useState } from 'react';
import { CreditCard, Calculator, CheckCircle2, ShieldCheck, Building2, Send } from 'lucide-react';

export const FinancePage: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState<number>(50000000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(36);
  const [interestRatePct] = useState<number>(12); // 12% annual interest

  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantIncome, setApplicantIncome] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Calculation
  const downPayment = (vehiclePrice * downPaymentPct) / 100;
  const principal = vehiclePrice - downPayment;
  const monthlyRate = interestRatePct / 100 / 12;
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) /
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  const totalRepayment = monthlyPayment * loanTermMonths;
  const totalInterest = totalRepayment - principal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#ef172b] uppercase tracking-wider">Swahivo Financial Services</span>
            <h1 className="text-3xl font-extrabold text-slate-900">Flexible Vehicle Financing in Tanzania</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Competitive auto loans in partnership with CRDB, NMB, Stanbic, and Equity Bank Tanzania. Low deposits and terms up to 60 months.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fast 24-Hour Approval</span>
          </div>
        </div>

        {/* Finance Calculator & Pre-Approval Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Calculator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 bg-red-50 text-[#ef172b] rounded-xl">
                <Calculator className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Auto Loan Calculator</h2>
            </div>

            <div className="space-y-5">
              {/* Vehicle Price */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Vehicle Price (TZS)</span>
                  <span className="text-[#ef172b] font-extrabold">
                    TZS {new Intl.NumberFormat('en-US').format(vehiclePrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="15000000"
                  max="150000000"
                  step="2500000"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-full accent-[#ef172b] cursor-pointer"
                />
              </div>

              {/* Down Payment % */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Down Payment ({downPaymentPct}%)</span>
                  <span className="text-slate-900 font-bold">
                    TZS {new Intl.NumberFormat('en-US').format(downPayment)}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-[#ef172b] cursor-pointer"
                />
              </div>

              {/* Loan Term Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Loan Term (Months)</label>
                <div className="grid grid-cols-5 gap-2">
                  {[12, 24, 36, 48, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setLoanTermMonths(m)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        loanTermMonths === m
                          ? 'bg-[#ef172b] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {m} M
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Results Box */}
            <div className="p-6 bg-[#081725] text-white rounded-2xl space-y-4">
              <p className="text-xs text-slate-400 font-semibold uppercase">Estimated Monthly Installment</p>
              <p className="text-3xl font-extrabold text-[#ef172b]">
                TZS {new Intl.NumberFormat('en-US').format(Math.round(monthlyPayment))} <span className="text-xs text-slate-400 font-normal">/ month</span>
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <p className="text-slate-400">Principal Loan</p>
                  <p className="font-bold text-white mt-0.5">TZS {new Intl.NumberFormat('en-US').format(principal)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Total Interest</p>
                  <p className="font-bold text-white mt-0.5">TZS {new Intl.NumberFormat('en-US').format(Math.round(totalInterest))}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Application Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Get Pre-Approved for Finance</h2>
            </div>

            {submitted ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-500">
                  Our finance officer will review your application and contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Salim Khamis"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+255 770 000000"
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Net Income *</label>
                    <input
                      type="text"
                      required
                      value={applicantIncome}
                      onChange={(e) => setApplicantIncome(e.target.value)}
                      placeholder="e.g. TZS 3,500,000"
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Banking Partner</label>
                  <select className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none bg-white">
                    <option>CRDB Bank Tanzania</option>
                    <option>NMB Bank</option>
                    <option>Stanbic Bank Tanzania</option>
                    <option>Equity Bank Tanzania</option>
                    <option>KCB Bank Tanzania</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Pre-Approval Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
