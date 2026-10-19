export function calculateLoanMonthlyPayment(
  vehiclePrice: number,
  downPaymentPct: number,
  termMonths: number,
  annualInterestRatePct: number = 12
): {
  downPayment: number;
  principal: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
} {
  const downPayment = (vehiclePrice * downPaymentPct) / 100;
  const principal = vehiclePrice - downPayment;
  if (termMonths <= 0) {
    return { downPayment, principal, monthlyPayment: 0, totalRepayment: 0, totalInterest: 0 };
  }
  const monthlyRate = annualInterestRatePct / 100 / 12;
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = totalRepayment - principal;

  return {
    downPayment,
    principal,
    monthlyPayment: Math.round(monthlyPayment),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest)
  };
}

export function formatTanzanianShillings(amount: number): string {
  return 'TZS ' + new Intl.NumberFormat('en-US').format(amount);
}

export function isAdminUser(uid: string | null | undefined, role: string): boolean {
  return uid === '3c6a4096-d6e2-4c45-bada-45f0cbf01510' || role === 'admin';
}
