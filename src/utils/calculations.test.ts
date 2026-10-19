import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLoanMonthlyPayment, formatTanzanianShillings, isAdminUser } from './calculations.ts';

test('loan calculation computes correct downpayment and monthly payment', () => {
  const result = calculateLoanMonthlyPayment(50000000, 20, 36, 12);
  assert.equal(result.downPayment, 10000000);
  assert.equal(result.principal, 40000000);
  assert.ok(result.monthlyPayment > 1300000 && result.monthlyPayment < 1400000);
  assert.ok(result.totalRepayment > result.principal);
});

test('currency formatting prefixes TZS with clean number commas', () => {
  assert.equal(formatTanzanianShillings(76500000), 'TZS 76,500,000');
  assert.equal(formatTanzanianShillings(45000000), 'TZS 45,000,000');
});

test('admin authorization identifies configured master admin UID', () => {
  assert.equal(isAdminUser('3c6a4096-d6e2-4c45-bada-45f0cbf01510', 'buyer'), true);
  assert.equal(isAdminUser('other-uid', 'admin'), true);
  assert.equal(isAdminUser('other-uid', 'seller'), false);
  assert.equal(isAdminUser('other-uid', 'buyer'), false);
});
