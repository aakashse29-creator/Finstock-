import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  AlertCircle,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { calculateCharges } from '../../utils/chargesCalculator';
import { formatCurrency } from '../../utils/formatters';

interface OrderSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  initialPrice: number;
  initialSide?: 'BUY' | 'SELL';
  onOpenCalculator: () => void;
  onOrderPlaced: (order: any) => void;
}

export const OrderSheetModal: React.FC<OrderSheetModalProps> = ({
  isOpen,
  onClose,
  symbol,
  initialPrice,
  initialSide = 'BUY',
  onOpenCalculator,
  onOrderPlaced,
}) => {
  const isCommodity = symbol.includes('GOLD') || symbol.includes('SILVER') || symbol.includes('CRUDE') || symbol.includes('NATGAS') || symbol.includes('COPPER') || symbol.includes('ZINC');
  const isFno = isCommodity || symbol.includes('CE') || symbol.includes('PE') || symbol.includes('FUT');

  const [side, setSide] = useState<'BUY' | 'SELL'>(initialSide);
  const [productType, setProductType] = useState<'CNC' | 'MIS' | 'NRML'>(isFno ? 'NRML' : 'CNC');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'SL' | 'GTT'>('LIMIT');
  const [price, setPrice] = useState<number>(initialPrice);
  const [triggerPrice, setTriggerPrice] = useState<number>(Math.round(initialPrice * 0.98 * 10) / 10);
  const [quantity, setQuantity] = useState<number>(isCommodity ? 1 : 10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const exchange = isCommodity ? 'MCX' : 'NSE';
  const orderValue = Math.round(price * quantity * 100) / 100;
  const availableFunds = 148720.5;

  // Margin calculation based on product
  const requiredMargin =
    productType === 'MIS'
      ? Math.round(orderValue / 5) // 5x leverage
      : productType === 'NRML' && isCommodity
      ? Math.round(orderValue * 0.15) // ~15% MCX margin
      : orderValue; // Full CNC

  const hasSufficientMargin = availableFunds >= requiredMargin;

  const segmentMapping = isCommodity
    ? 'COMMODITY_FUTURES'
    : isFno
    ? 'EQUITY_FUTURES'
    : productType === 'CNC'
    ? 'EQUITY_DELIVERY'
    : 'EQUITY_INTRADAY';

  const charges = calculateCharges({
    segment: segmentMapping as any,
    exchange: exchange as any,
    buyPrice: side === 'BUY' ? price : 0,
    sellPrice: side === 'SELL' ? price : 0,
    quantity,
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSufficientMargin) {
      alert('Insufficient funds for required pre-trade margin.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      onOrderPlaced({
        symbol,
        exchange,
        side,
        productType,
        orderType,
        price: orderType === 'MARKET' ? initialPrice : price,
        triggerPrice: orderType === 'SL' || orderType === 'GTT' ? triggerPrice : undefined,
        quantity,
        requiredMargin,
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Header with Buy/Sell Toggle */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setSide('BUY')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  side === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setSide('SELL')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  side === 'SELL'
                    ? 'bg-rose-500 text-white shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SELL
              </button>
            </div>
            <div>
              <span className="font-bold text-white text-sm block">{symbol}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {exchange} · LTP: {formatCurrency(initialPrice)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handlePlaceOrder} className="p-6 space-y-4 text-xs">
          {success ? (
            <div className="p-6 text-center space-y-2 bg-emerald-950/40 rounded-xl border border-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Order Placed Successfully!</h3>
              <p className="text-xs text-slate-300">
                {side} {quantity} of {symbol} @ {orderType === 'MARKET' ? 'Market' : formatCurrency(price)} ({productType}). Sent to {exchange} matching engine.
              </p>
            </div>
          ) : (
            <>
              {/* Product Type Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium block">Product Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {!isCommodity && (
                    <button
                      type="button"
                      onClick={() => setProductType('CNC')}
                      className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                        productType === 'CNC'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold block text-xs">CNC (Delivery)</span>
                      <span className="text-[9px] text-slate-400">Zero brokerage</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setProductType('MIS')}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      productType === 'MIS'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold block text-xs">MIS (Intraday)</span>
                    <span className="text-[9px] text-slate-400">5x leverage, 3:15 PM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProductType('NRML')}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      productType === 'NRML'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold block text-xs">NRML (Normal)</span>
                    <span className="text-[9px] text-slate-400">F&O / MCX Carry</span>
                  </button>
                </div>
              </div>

              {/* Order Type Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium block">Order Variety</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['LIMIT', 'MARKET', 'SL', 'GTT'] as const).map((ot) => (
                    <button
                      key={ot}
                      type="button"
                      onClick={() => setOrderType(ot)}
                      className={`py-1.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                        orderType === ot
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity, Price, Trigger Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    {orderType === 'MARKET' ? 'Market Execution' : 'Price (₹)'}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    disabled={orderType === 'MARKET'}
                    required
                    value={orderType === 'MARKET' ? initialPrice : price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className={`w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500 tabular-nums ${
                      orderType === 'MARKET' ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Trigger Price if SL or GTT */}
              {(orderType === 'SL' || orderType === 'GTT') && (
                <div>
                  <label className="text-slate-400 block mb-1">Trigger Price (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                </div>
              )}

              {/* Live Pre-Trade RMS Margin Check */}
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Approx Order Value:</span>
                  <span className="font-mono text-white font-bold tabular-nums">{formatCurrency(orderValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Margin Required:</span>
                  <span className="font-mono text-white font-bold tabular-nums">{formatCurrency(requiredMargin)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Available Cash Balance:</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    {formatCurrency(availableFunds)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[11px]">
                  <span className="text-slate-400">Est. Statutory Charges:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-amber-400 tabular-nums">{formatCurrency(charges.totalCharges)}</span>
                    <button
                      type="button"
                      onClick={onOpenCalculator}
                      className="text-cyan-400 hover:underline flex items-center gap-0.5 text-[10px] cursor-pointer"
                    >
                      <Calculator className="w-3 h-3" />
                      <span>Breakdown</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Slide-to-Confirm Simulator */}
              <button
                type="submit"
                disabled={isSubmitting || !hasSufficientMargin}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  !hasSufficientMargin
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : side === 'BUY'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                }`}
              >
                <span>
                  {isSubmitting
                    ? 'Validating Risk Management Engine...'
                    : !hasSufficientMargin
                    ? 'Insufficient Margin Available'
                    : `Slide to Confirm ${side} (${formatCurrency(orderValue)})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
