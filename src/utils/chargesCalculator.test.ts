import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCharges } from './chargesCalculator';
import { formatCurrency, derivePdfPassword, maskAadhaar, maskMobile } from './formatters';

test('Equity Delivery charges: zero brokerage, 0.1% STT both sides, DP charges on sell', () => {
  const result = calculateCharges({
    segment: 'EQUITY_DELIVERY',
    exchange: 'NSE',
    buyPrice: 1000,
    sellPrice: 1100,
    quantity: 100,
  });

  // Buy turnover: 1,00,000 | Sell turnover: 1,10,000
  assert.equal(result.buyTurnover, 100000);
  assert.equal(result.sellTurnover, 110000);
  assert.equal(result.totalTurnover, 210000);
  assert.equal(result.brokerage, 0); // Delivery brokerage is ₹0
  // STT: 0.1% on buy (100) + 0.1% on sell (110) = 210
  assert.equal(result.stt, 210);
  // DP charges on delivery sell = 15.93
  assert.equal(result.dpCharges, 15.93);
  // Gross P&L: 1,10,000 - 1,00,000 = 10,000
  assert.equal(result.grossPnl, 10000);
  // Net P&L should be positive
  assert.ok(result.netPnl > 9500);
  assert.ok(result.breakEvenPoints > 0);
});

test('Equity Intraday charges: ₹20 or 0.03% cap, STT only on sell, no DP charges', () => {
  const result = calculateCharges({
    segment: 'EQUITY_INTRADAY',
    exchange: 'NSE',
    buyPrice: 500,
    sellPrice: 510,
    quantity: 50,
  });

  // Buy turnover: 25,000 (0.03% is 7.50)
  // Sell turnover: 25,500 (0.03% is 7.65)
  // Brokerage: 7.50 + 7.65 = 15.15 (< ₹40 cap)
  assert.equal(result.brokerage, 15.15);
  // Intraday STT: 0.025% on sell only (25500 * 0.00025 = 6.38)
  assert.equal(result.stt, 6.38);
  assert.equal(result.dpCharges, 0); // No DP charges for MIS
});

test('Options charges: ₹20 flat per executed leg, STT on sell premium', () => {
  const result = calculateCharges({
    segment: 'OPTIONS',
    exchange: 'NSE',
    buyPrice: 100,
    sellPrice: 130,
    quantity: 50, // 1 lot of Nifty
  });

  assert.equal(result.brokerage, 40); // 2 legs of ₹20
  // STT: 0.0625% on sell premium (6500 * 0.000625 = 4.06)
  assert.equal(result.stt, 4.06);
  assert.equal(result.dpCharges, 0);
});

test('Indian Currency formatting: Lakhs and Crores grouping', () => {
  assert.equal(formatCurrency(12345678.5, 'indian'), '₹1,23,45,678.50');
  assert.equal(formatCurrency(50000, 'indian'), '₹50,000.00');
  assert.equal(formatCurrency(100, 'indian'), '₹100.00');
  assert.equal(formatCurrency(-2500.75, 'indian'), '-₹2,500.75');
});

test('PDF Password derivation: uppercase PAN + DDMMYYYY', () => {
  const password = derivePdfPassword('abcde1234f', '15/08/1995');
  assert.equal(password, 'ABCDE1234F15081995');
});

test('Masking helpers for privacy compliance', () => {
  assert.equal(maskAadhaar('123456788921'), 'XXXX-XXXX-8921');
  assert.equal(maskMobile('+919876543421'), '+91 98*** **421');
});

test('Maker-checker validation rule: maker cannot be checker', () => {
  function validateMakerChecker(makerId: string, checkerId: string): boolean {
    return Boolean(makerId && checkerId && makerId !== checkerId);
  }

  assert.equal(validateMakerChecker('admin_maker_1', 'admin_checker_2'), true);
  assert.equal(validateMakerChecker('admin_maker_1', 'admin_maker_1'), false);
});

test('Nominee percentage validation rule: total must equal exactly 100%', () => {
  function validateNomineeShares(shares: number[]): boolean {
    const sum = shares.reduce((acc, curr) => acc + curr, 0);
    return Math.abs(sum - 100) < 0.001;
  }

  assert.equal(validateNomineeShares([60, 40]), true);
  assert.equal(validateNomineeShares([50, 30, 20]), true);
  assert.equal(validateNomineeShares([50, 40]), false);
  assert.equal(validateNomineeShares([70, 40]), false);
});
