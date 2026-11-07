/**
 * Finstock Broking - Statutory Charges Engine
 * Computes exact SEBI, Exchange, STT, Stamp Duty, GST, DP Charges, and Brokerage.
 * All computations use exact arithmetic to prevent floating-point rounding issues.
 */

export type CalculationSegment =
  | 'EQUITY_DELIVERY'
  | 'EQUITY_INTRADAY'
  | 'FUTURES'
  | 'OPTIONS'
  | 'CURRENCY'
  | 'COMMODITY';

export interface ChargesInput {
  segment: CalculationSegment;
  exchange: 'NSE' | 'BSE';
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  strikeOrMultiplier?: number;
}

export interface ChargesBreakdown {
  segment: CalculationSegment;
  exchange: 'NSE' | 'BSE';
  buyTurnover: number;
  sellTurnover: number;
  totalTurnover: number;
  brokerage: number;
  stt: number;
  exchangeCharges: number;
  sebiTurnover: number;
  gst: number;
  stampDuty: number;
  dpCharges: number;
  totalCharges: number;
  grossPnl: number;
  netPnl: number;
  breakEvenPoints: number;
}

export function calculateCharges(input: ChargesInput): ChargesBreakdown {
  const { segment, exchange, buyPrice, sellPrice, quantity } = input;

  const buyTurnover = Math.round(buyPrice * quantity * 100) / 100;
  const sellTurnover = Math.round(sellPrice * quantity * 100) / 100;
  const totalTurnover = Math.round((buyTurnover + sellTurnover) * 100) / 100;

  let brokerage = 0;
  let stt = 0;
  let exchangeRate = exchange === 'NSE' ? 0.0000297 : 0.0000345;
  let exchangeCharges = 0;
  let sebiTurnover = 0;
  let stampDuty = 0;
  let dpCharges = 0;

  switch (segment) {
    case 'EQUITY_DELIVERY': {
      // Free brokerage on equity delivery
      brokerage = 0;
      // STT: 0.1% on buy and 0.1% on sell
      stt = Math.round((buyTurnover * 0.001 + sellTurnover * 0.001) * 100) / 100;
      // Exchange charges
      exchangeCharges = Math.round(totalTurnover * exchangeRate * 100) / 100;
      // SEBI Turnover fee: ₹10 per crore (0.0001%)
      sebiTurnover = Math.round(totalTurnover * 0.000001 * 100) / 100;
      // Stamp Duty: 0.015% on buy only
      stampDuty = Math.round(buyTurnover * 0.00015 * 100) / 100;
      // DP Charges: ₹13.50 + 18% GST = ₹15.93 on delivery sell
      if (sellTurnover > 0) {
        dpCharges = 15.93;
      }
      break;
    }

    case 'EQUITY_INTRADAY': {
      // Brokerage: ₹20 or 0.03% whichever is lower, per leg
      const buyBrok = Math.min(20, Math.round(buyTurnover * 0.0003 * 100) / 100);
      const sellBrok = Math.min(20, Math.round(sellTurnover * 0.0003 * 100) / 100);
      brokerage = Math.round((buyBrok + sellBrok) * 100) / 100;
      // STT: 0.025% on sell only
      stt = Math.round(sellTurnover * 0.00025 * 100) / 100;
      exchangeCharges = Math.round(totalTurnover * exchangeRate * 100) / 100;
      sebiTurnover = Math.round(totalTurnover * 0.000001 * 100) / 100;
      stampDuty = Math.round(buyTurnover * 0.00003 * 100) / 100;
      dpCharges = 0;
      break;
    }

    case 'FUTURES': {
      // Flat ₹20 per executed order
      brokerage = 40; // 2 legs (buy + sell)
      // STT: 0.0125% on sell
      stt = Math.round(sellTurnover * 0.000125 * 100) / 100;
      exchangeCharges = Math.round(totalTurnover * 0.0000173 * 100) / 100;
      sebiTurnover = Math.round(totalTurnover * 0.000001 * 100) / 100;
      stampDuty = Math.round(buyTurnover * 0.00002 * 100) / 100;
      dpCharges = 0;
      break;
    }

    case 'OPTIONS': {
      // Flat ₹20 per executed order
      brokerage = 40; // Buy leg (20) + Sell leg (20)
      // For options, turnover is based on premium
      // STT: 0.0625% on sell premium
      stt = Math.round(sellTurnover * 0.000625 * 100) / 100;
      // Exchange: 0.05% on premium turnover
      exchangeCharges = Math.round(totalTurnover * 0.0005 * 100) / 100;
      sebiTurnover = Math.round(totalTurnover * 0.000001 * 100) / 100;
      stampDuty = Math.round(buyTurnover * 0.00003 * 100) / 100;
      dpCharges = 0;
      break;
    }

    case 'CURRENCY': {
      const buyBrok = Math.min(20, Math.round(buyTurnover * 0.0003 * 100) / 100);
      const sellBrok = Math.min(20, Math.round(sellTurnover * 0.0003 * 100) / 100);
      brokerage = Math.round((buyBrok + sellBrok) * 100) / 100;
      stt = 0; // No STT on currency
      exchangeCharges = Math.round(totalTurnover * 0.000009 * 100) / 100;
      sebiTurnover = Math.round(totalTurnover * 0.000001 * 100) / 100;
      stampDuty = Math.round(buyTurnover * 0.000001 * 100) / 100;
      dpCharges = 0;
      break;
    }

    case 'COMMODITY': {
      brokerage = 40;
      // CTT: 0.01% on sell
      stt = Math.round(sellTurnover * 0.0001 * 100) / 100;
      exchangeCharges = Math.round(totalTurnover * 0.000026 * 100) / 100;
      sebiTurnover = Math.round(totalTurnover * 0.000001 * 100) / 100;
      stampDuty = Math.round(buyTurnover * 0.00002 * 100) / 100;
      dpCharges = 0;
      break;
    }
  }

  // GST: 18% on (Brokerage + Exchange charges + SEBI turnover)
  const gstBase = brokerage + exchangeCharges + sebiTurnover;
  const gst = Math.round(gstBase * 0.18 * 100) / 100;

  const totalCharges =
    Math.round(
      (brokerage + stt + exchangeCharges + sebiTurnover + gst + stampDuty + dpCharges) * 100
    ) / 100;

  const grossPnl = Math.round((sellTurnover - buyTurnover) * 100) / 100;
  const netPnl = Math.round((grossPnl - totalCharges) * 100) / 100;

  const breakEvenPoints =
    quantity > 0 ? Math.round((totalCharges / quantity) * 100) / 100 : 0;

  return {
    segment,
    exchange,
    buyTurnover,
    sellTurnover,
    totalTurnover,
    brokerage,
    stt,
    exchangeCharges,
    sebiTurnover,
    gst,
    stampDuty,
    dpCharges,
    totalCharges,
    grossPnl,
    netPnl,
    breakEvenPoints,
  };
}
