import React, { useState } from 'react';
import {
  X,
  Calculator,
  Info,
  TrendingUp,
  Percent,
  CheckCircle2,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { calculateCharges, CalculationSegment } from '../../utils/chargesCalculator';
import { formatCurrency } from '../../utils/formatters';

interface ChargesCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSegment?: CalculationSegment;
}

export const ChargesCalculatorModal: React.FC<ChargesCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialSegment = 'EQUITY_DELIVERY',
}) => {
  const [segment, setSegment] = useState<CalculationSegment>(initialSegment);
  const [exchange, setExchange] = useState<'NSE' | 'BSE'>('NSE');
  const [buyPrice, setBuyPrice] = useState<number>(1000);
  const [sellPrice, setSellPrice] = useState<number>(1100);
  const [quantity, setQuantity] = useState<number>(100);

  if (!isOpen) return null;

  const result = calculateCharges({
    segment,
    exchange,
    buyPrice: Number(buyPrice) || 0,
    sellPrice: Number(sellPrice) || 0,
    quantity: Number(quantity) || 0,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Brokerage & Charges Calculator</h2>
              <p className="text-xs text-slate-400">100% transparent statutory breakdown & break-even estimator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Segment Selector Tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/60 text-xs font-semibold">
            {[
              { id: 'EQUITY_DELIVERY', label: 'Delivery' },
              { id: 'EQUITY_INTRADAY', label: 'Intraday' },
              { id: 'FUTURES', label: 'Futures' },
              { id: 'OPTIONS', label: 'Options' },
              { id: 'CURRENCY', label: 'Currency' },
              { id: 'COMMODITY', label: 'Commodity' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSegment(tab.id as CalculationSegment)}
                className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                  segment === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inputs Row */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Trade Parameters</span>
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
                {(['NSE', 'BSE'] as const).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setExchange(ex)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      exchange === ex ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">
                  {segment === 'OPTIONS' ? 'Buy Premium (₹)' : 'Buy Price (₹)'}
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {segment === 'OPTIONS' ? 'Sell Premium (₹)' : 'Sell Price (₹)'}
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Quantity / Lots</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Result Highlights (Turnover, Net P&L, Break-Even) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">Total Turnover</span>
              <span className="text-base font-bold text-white font-mono">{formatCurrency(result.totalTurnover)}</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Buy: {formatCurrency(result.buyTurnover)} • Sell: {formatCurrency(result.sellTurnover)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">Total Charges & Taxes</span>
              <span className="text-base font-bold text-amber-400 font-mono">{formatCurrency(result.totalCharges)}</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Brokerage: {formatCurrency(result.brokerage)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">Net P&L (After Charges)</span>
              <span
                className={`text-base font-bold font-mono ${
                  result.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(result.netPnl)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Break-even: <strong>+₹{result.breakEvenPoints.toFixed(2)}</strong> per share
              </span>
            </div>
          </div>

          {/* Granular Breakdown Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900 text-xs">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 font-bold text-white flex items-center justify-between">
              <span>Statutory Itemized Charges</span>
              <span className="text-[11px] font-normal text-slate-400">Rate / Formula</span>
            </div>
            <div className="divide-y divide-slate-800/80 p-1">
              <div className="flex items-center justify-between py-2 px-3">
                <span className="text-slate-300">Finstock Brokerage</span>
                <span className="font-mono text-white">
                  {result.brokerage === 0 ? '₹0.00 (Zero Delivery)' : formatCurrency(result.brokerage)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3">
                <span className="text-slate-300">Securities Transaction Tax (STT)</span>
                <span className="font-mono text-white">{formatCurrency(result.stt)}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3">
                <span className="text-slate-300">Exchange Turnover Charges ({exchange})</span>
                <span className="font-mono text-white">{formatCurrency(result.exchangeCharges)}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3">
                <span className="text-slate-300">SEBI Turnover Fee (₹10 / Crore)</span>
                <span className="font-mono text-white">{formatCurrency(result.sebiTurnover)}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3">
                <span className="text-slate-300">Goods and Services Tax (GST @ 18%)</span>
                <span className="font-mono text-white">{formatCurrency(result.gst)}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3">
                <span className="text-slate-300">State Stamp Duty</span>
                <span className="font-mono text-white">{formatCurrency(result.stampDuty)}</span>
              </div>
              {result.dpCharges > 0 && (
                <div className="flex items-center justify-between py-2 px-3 bg-slate-800/40">
                  <span className="text-slate-300">Depository (DP) Charges (CDSL ₹13.50 + GST)</span>
                  <span className="font-mono text-white">{formatCurrency(result.dpCharges)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Model Info Card */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 text-xs space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              Standard Finstock Pricing Schedule
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
              <div>Account Opening: <strong>₹0 (Free)</strong></div>
              <div>Demat AMC: <strong>₹0 BSDA</strong></div>
              <div>Call & Trade: <strong>₹50/order</strong></div>
              <div>Payment Gateway: <strong>₹0 UPI</strong></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
