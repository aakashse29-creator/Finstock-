import test from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyLedgerContinuity,
  verifyMarginObligations,
  verifyHoldingsLotReconciliation,
  verifyContractNoteCharges,
  verifyDpChargeRule,
  verifyMakerCheckerAuthorization,
  verifyProductionMockLockdown,
  verifyAuditHashChain,
  verifyPmlaRetentionPeriod,
  verifyOrderSafeguards,
} from './invariantsChecker';

test('1. Invariant: Double-entry ledger continuity with integer paise math', () => {
  const openingPaise = 5000000; // ₹50,000.00
  const entries: Array<{ type: 'CREDIT' | 'DEBIT'; amountPaise: number }> = [
    { type: 'CREDIT', amountPaise: 1000000 }, // +₹10,000
    { type: 'DEBIT', amountPaise: 450000 },   // -₹4,500
    { type: 'DEBIT', amountPaise: 250000 },   // -₹2,500
  ];
  const closingPaise = 5300000; // ₹53,000.00

  const resultOk = verifyLedgerContinuity(openingPaise, entries, closingPaise);
  assert.equal(resultOk.valid, true);
  assert.equal(resultOk.code, 'INV_LEDGER_CONTINUITY_OK');

  // Intentional discrepancy of 1 paise
  const resultFail = verifyLedgerContinuity(openingPaise, entries, closingPaise + 1);
  assert.equal(resultFail.valid, false);
  assert.equal(resultFail.code, 'INV_LEDGER_CONTINUITY_FAIL');
});

test('2. Invariant: Blocked margin cannot exceed available collateral + cash', () => {
  const cash = 1000000;       // ₹10,000
  const collateral = 2000000; // ₹20,000
  const obligations = [500000, 300000]; // ₹5,000 + ₹3,000 = ₹8,000
  const blockedMargin = 800000;

  const resultOk = verifyMarginObligations(cash, collateral, blockedMargin, obligations);
  assert.equal(resultOk.valid, true);

  // Mismatch between sum of open orders and blocked margin
  const resultMismatch = verifyMarginObligations(cash, collateral, 750000, obligations);
  assert.equal(resultMismatch.valid, false);
  assert.equal(resultMismatch.code, 'INV_MARGIN_MISMATCH');

  // Breach exceeding total available
  const resultBreach = verifyMarginObligations(cash, collateral, 3500000, [3500000]);
  assert.equal(resultBreach.valid, false);
  assert.equal(resultBreach.code, 'INV_MARGIN_BREACH');
});

test('3. Invariant: Holdings lot reconciliation against settled trades', () => {
  const isin = 'INE002A01018'; // Reliance
  const buyQty = 150;
  const sellQty = 50;
  const currentHolding = 100;

  const resultOk = verifyHoldingsLotReconciliation(isin, buyQty, sellQty, currentHolding);
  assert.equal(resultOk.valid, true);

  const resultMismatch = verifyHoldingsLotReconciliation(isin, buyQty, sellQty, 99);
  assert.equal(resultMismatch.valid, false);
  assert.equal(resultMismatch.code, 'INV_HOLDINGS_MISMATCH');

  // Negative quantity check
  const resultNegative = verifyHoldingsLotReconciliation(isin, 10, 20, -10);
  assert.equal(resultNegative.valid, false);
  assert.equal(resultNegative.code, 'INV_HOLDINGS_NEGATIVE');
});

test('4. Invariant: Contract note charges sum matches reported total', () => {
  const brokerage = 2000;
  const stt = 1250;
  const exchange = 345;
  const sebi = 10;
  const gst = 424;
  const stamp = 150;
  const dp = 0;
  const reportedTotal = 2000 + 1250 + 345 + 10 + 424 + 150 + 0;

  const resultOk = verifyContractNoteCharges(
    brokerage, stt, exchange, sebi, gst, stamp, dp, reportedTotal
  );
  assert.equal(resultOk.valid, true);

  const resultFail = verifyContractNoteCharges(
    brokerage, stt, exchange, sebi, gst, stamp, dp, reportedTotal + 50
  );
  assert.equal(resultFail.valid, false);
  assert.equal(resultFail.code, 'INV_CONTRACT_NOTE_MATH_FAIL');
});

test('5. Invariant: DP Charges ₹15.93 applied only to delivery sell', () => {
  const deliverySellOk = verifyDpChargeRule('DELIVERY_SELL', 1593);
  assert.equal(deliverySellOk.valid, true);

  const deliverySellIncorrect = verifyDpChargeRule('DELIVERY_SELL', 1350);
  assert.equal(deliverySellIncorrect.valid, false);
  assert.equal(deliverySellIncorrect.code, 'INV_DP_CHARGE_INCORRECT');

  const intradayIllegal = verifyDpChargeRule('INTRADAY', 1593);
  assert.equal(intradayIllegal.valid, false);
  assert.equal(intradayIllegal.code, 'INV_DP_CHARGE_ILLEGAL');

  const buyOk = verifyDpChargeRule('DELIVERY_BUY', 0);
  assert.equal(buyOk.valid, true);
});

test('6. Invariant: Maker-Checker separation of duties', () => {
  const resultOk = verifyMakerCheckerAuthorization('adm_ops_maker_1', 'adm_ops_checker_1');
  assert.equal(resultOk.valid, true);

  const resultFail = verifyMakerCheckerAuthorization('adm_ops_maker_1', 'adm_ops_maker_1');
  assert.equal(resultFail.valid, false);
  assert.equal(resultFail.code, 'INV_MAKER_CHECKER_COLLUSION_FAIL');
});

test('7. Invariant: Production mock-mode lockdown', () => {
  // Staging / Dev can have mocks
  const devOk = verifyProductionMockLockdown({ NODE_ENV: 'development', ALLOW_MOCKS: 'true' });
  assert.equal(devOk.valid, true);

  // Production with mocks MUST fail fatally
  const prodBreach = verifyProductionMockLockdown({ NODE_ENV: 'production', ALLOW_MOCKS: 'true' });
  assert.equal(prodBreach.valid, false);
  assert.equal(prodBreach.code, 'INV_PRODUCTION_MOCK_BREACH');

  // Production without mocks is safe
  const prodSafe = verifyProductionMockLockdown({ NODE_ENV: 'production', ALLOW_MOCKS: 'false' });
  assert.equal(prodSafe.valid, true);
});

test('8. Invariant: Tamper-evident audit log cryptographic hash-chaining', () => {
  const validChain = [
    { id: 'b0', prevHash: 'GENESIS_00000000000000000000000000000000', currentHash: 'hash_b0_abc', payload: 'Init' },
    { id: 'b1', prevHash: 'hash_b0_abc', currentHash: 'hash_b1_def', payload: 'Order Placed' },
    { id: 'b2', prevHash: 'hash_b1_def', currentHash: 'hash_b2_ghi', payload: 'Trade Filled' },
  ];

  const resultOk = verifyAuditHashChain(validChain);
  assert.equal(resultOk.valid, true);

  // Tampered chain where block 2 has forged prevHash
  const tamperedChain = [
    { id: 'b0', prevHash: 'GENESIS_00000000000000000000000000000000', currentHash: 'hash_b0_abc', payload: 'Init' },
    { id: 'b1', prevHash: 'hash_b0_abc', currentHash: 'hash_b1_def', payload: 'Order Placed' },
    { id: 'b2', prevHash: 'FORGED_HASH_999', currentHash: 'hash_b2_ghi', payload: 'Trade Filled' },
  ];

  const resultTampered = verifyAuditHashChain(tamperedChain);
  assert.equal(resultTampered.valid, false);
  assert.equal(resultTampered.code, 'INV_AUDIT_CHAIN_BROKEN');
});

test('9. Invariant: PMLA statutory data retention (>= 8 years)', () => {
  const resultOk = verifyPmlaRetentionPeriod(8);
  assert.equal(resultOk.valid, true);

  const result10Yr = verifyPmlaRetentionPeriod(10);
  assert.equal(result10Yr.valid, true);

  const resultFail = verifyPmlaRetentionPeriod(5);
  assert.equal(resultFail.valid, false);
  assert.equal(resultFail.code, 'INV_PMLA_RETENTION_BREACH');
});

test('10. Invariant: Fat-finger circuit bounds and order velocity throttling', () => {
  const ltp = 2500;
  const circuitLower = 2250; // -10%
  const circuitUpper = 2750; // +10%

  // Normal order
  const normalOrder = verifyOrderSafeguards(2510, circuitLower, circuitUpper, 5, 30);
  assert.equal(normalOrder.valid, true);

  // Fat finger price breach
  const fatFinger = verifyOrderSafeguards(3200, circuitLower, circuitUpper, 5, 30);
  assert.equal(fatFinger.valid, false);
  assert.equal(fatFinger.code, 'INV_FAT_FINGER_CIRCUIT_BREACH');

  // Rate limit spike breach (e.g. runaway algo placing 45 orders/sec)
  const rateBreach = verifyOrderSafeguards(2510, circuitLower, circuitUpper, 45, 30);
  assert.equal(rateBreach.valid, false);
  assert.equal(rateBreach.code, 'INV_RATE_LIMIT_EXCEEDED');
});
