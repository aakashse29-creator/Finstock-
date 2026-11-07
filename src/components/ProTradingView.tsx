import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag,
  Zap,
  Activity,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { sampleMarketDepth, sampleCandleData, initialPositions } from '../data/mockData';
import { CandleData, MarketDepth, Position } from '../types';

interface ProTradingViewProps {
  onOpenOrderSheet: (symbol: string, ltp: number, side?: 'BUY' | 'SELL') => void;
  onSquareOffPosition?: (positionId: string) => void;
  colorBlindMode?: boolean;
}

export const ProTradingView: React.FC<ProTradingViewProps> = ({
  onOpenOrderSheet,
  onSquareOffPosition,
  colorBlindMode = false,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('15m');
  const [activeIndicators, setActiveIndicators] = useState<Record<string, boolean>>({
    EMA20: true,
    EMA50: false,
    VWAP: true,
    RSI: true,
  });

  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  const symbols = [
    { symbol: 'RELIANCE', name: 'Reliance Ind.', ltp: 2840.5, change: 18.2, pChange: 0.64, exchange: 'NSE' },
    { symbol: 'NIFTY 50', name: 'Nifty 50 Index', ltp: 24380.5, change: 112.4, pChange: 0.46, exchange: 'NSE' },
    { symbol: 'CRUDEOIL 19NOV26', name: 'Crude Oil Future', ltp: 6185.0, change: 78.0, pChange: 1.28, exchange: 'MCX' },
    { symbol: 'GOLDM 05DEC26', name: 'Gold Mini Future', ltp: 78420.0, change: 340.0, pChange: 0.44, exchange: 'MCX' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', ltp: 980.5, change: 22.1, pChange: 2.31, exchange: 'NSE' },
  ];

  const currentScrip = symbols.find((s) => s.symbol === selectedSymbol) || symbols[0];

  const toggleIndicator = (id: string) => {
    setActiveIndicators((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // SVG Candlestick Chart calculations
  const candles = sampleCandleData;
  const minPrice = Math.min(...candles.map((c) => c.low)) - 4;
  const maxPrice = Math.max(...candles.map((c) => c.high)) + 4;
  const priceRange = maxPrice - minPrice;
  const chartHeight = 220;
  const chartWidth = 540;
  const candleWidth = chartWidth / (candles.length + 1);

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * chartHeight;
  };

  const depth: MarketDepth = sampleMarketDepth;
  const maxDepthQty = Math.max(
    ...depth.bids.map((b) => b.quantity),
    ...depth.asks.map((a) => a.quantity)
  );

  const buyRatio = Math.round((depth.totalBuyQty / (depth.totalBuyQty + depth.totalSellQty)) * 100);
  const sellRatio = 100 - buyRatio;

  const currentCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div className="space-y-4 pb-24 max-w-5xl mx-auto px-4 pt-3 text-xs">
      {/* Scrip Quick Selector Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {symbols.map((item) => {
          const isSelected = item.symbol === selectedSymbol;
          const isPositive = item.change >= 0;
          return (
            <button
              key={item.symbol}
              onClick={() => setSelectedSymbol(item.symbol)}
              className={`px-3 py-2 rounded-xl text-left border transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-sm'
                  : 'bg-slate-900/70 hover:bg-slate-800/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-xs">{item.symbol}</span>
                <span className="text-[9px] font-mono px-1 rounded bg-slate-800/80 text-slate-400">
                  {item.exchange}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] tabular-nums">
                <span className="text-white font-semibold">{formatCurrency(item.ltp)}</span>
                <span className={isPositive ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                  {item.change > 0 ? `+${item.pChange}%` : `${item.pChange}%`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart and Market Depth 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Candlestick Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
          {/* Chart Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{currentScrip.symbol}</span>
              <span className="text-[10px] text-slate-400 font-mono">{currentScrip.exchange}</span>
              <span className="text-emerald-400 font-mono font-bold text-sm ml-2 tabular-nums">
                {formatCurrency(currentScrip.ltp)}
              </span>
            </div>

            {/* Timeframe Selectors */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
              {['1m', '5m', '15m', '1H', '1D', '1W'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    selectedTimeframe === tf
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Indicators Strip */}
          <div className="flex items-center gap-2 overflow-x-auto text-[10px]">
            <span className="text-slate-500 font-semibold uppercase">Indicators:</span>
            {['EMA20', 'EMA50', 'VWAP', 'RSI'].map((ind) => (
              <button
                key={ind}
                onClick={() => toggleIndicator(ind)}
                className={`px-2 py-0.5 rounded-full border transition-all ${
                  activeIndicators[ind]
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>

          {/* OHLCV Crosshair Display Bar */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-lg tabular-nums">
            <span>O: <strong className="text-white">{currentCandle.open.toFixed(1)}</strong></span>
            <span>H: <strong className="text-white">{currentCandle.high.toFixed(1)}</strong></span>
            <span>L: <strong className="text-white">{currentCandle.low.toFixed(1)}</strong></span>
            <span>C: <strong className="text-white">{currentCandle.close.toFixed(1)}</strong></span>
            <span>Vol: <strong className="text-white">{currentCandle.volume.toLocaleString()}</strong></span>
            <span>Time: <strong className="text-slate-300">{currentCandle.time}</strong></span>
          </div>

          {/* SVG Candlestick Renderer */}
          <div className="relative w-full overflow-hidden bg-slate-950/60 rounded-xl p-2 border border-slate-800/80">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 select-none"
            >
              {/* Background grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = (chartHeight / 4) * i;
                const price = (maxPrice - (priceRange / 4) * i).toFixed(1);
                return (
                  <g key={i}>
                    <line
                      x1="0"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={chartWidth - 45}
                      y={y - 4}
                      fill="rgba(148,163,184,0.6)"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {price}
                    </text>
                  </g>
                );
              })}

              {/* Candles */}
              {candles.map((candle, idx) => {
                const x = (idx + 1) * candleWidth;
                const isGreen = candle.close >= candle.open;
                const candleColor = isGreen ? '#10b981' : '#f43f5e';
                const bodyTop = getY(Math.max(candle.open, candle.close));
                const bodyHeight = Math.max(Math.abs(getY(candle.open) - getY(candle.close)), 2);
                const highY = getY(candle.high);
                const lowY = getY(candle.low);

                return (
                  <g
                    key={candle.time}
                    onMouseEnter={() => setHoveredCandle(candle)}
                    onMouseLeave={() => setHoveredCandle(null)}
                    className="cursor-crosshair group"
                  >
                    {/* Wick */}
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={candleColor}
                      strokeWidth="1.2"
                    />
                    {/* Body */}
                    <rect
                      x={x - 12}
                      y={bodyTop}
                      width={24}
                      height={bodyHeight}
                      fill={candleColor}
                      rx="1"
                      className="transition-opacity group-hover:opacity-80"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Fast Order Trigger Bar */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onOpenOrderSheet(currentScrip.symbol, currentScrip.ltp, 'BUY')}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>BUY ({formatCurrency(currentScrip.ltp)})</span>
            </button>
            <button
              onClick={() => onOpenOrderSheet(currentScrip.symbol, currentScrip.ltp, 'SELL')}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>SELL ({formatCurrency(currentScrip.ltp)})</span>
            </button>
          </div>
        </div>

        {/* Right Column: 5-Level Real-Time Market Depth Ladder (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                5-Level Market Depth (DOM)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">NSE Feed L2</span>
          </div>

          {/* Depth Headers */}
          <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-400 font-semibold border-b border-slate-800 pb-1">
            <div className="flex justify-between">
              <span>Orders · Qty</span>
              <span className="text-emerald-400">Bid (₹)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-400">Ask (₹)</span>
              <span>Qty · Orders</span>
            </div>
          </div>

          {/* 5 Bids and 5 Asks rows */}
          <div className="space-y-1 font-mono text-[11px] tabular-nums">
            {depth.bids.map((bid, i) => {
              const ask = depth.asks[i];
              const bidWidth = `${(bid.quantity / maxDepthQty) * 100}%`;
              const askWidth = `${(ask.quantity / maxDepthQty) * 100}%`;

              return (
                <div key={i} className="grid grid-cols-2 gap-4">
                  {/* Bid side */}
                  <div
                    onClick={() => onOpenOrderSheet(currentScrip.symbol, bid.price, 'BUY')}
                    className="relative flex items-center justify-between p-1 rounded hover:bg-emerald-500/10 cursor-pointer overflow-hidden group"
                  >
                    <div
                      className="absolute inset-y-0 right-0 bg-emerald-500/15 pointer-events-none transition-all"
                      style={{ width: bidWidth }}
                    />
                    <div className="flex items-center gap-1.5 text-slate-400 relative z-10 text-[10px]">
                      <span>{bid.orders}</span>
                      <span className="text-slate-300 font-medium">{bid.quantity}</span>
                    </div>
                    <span className="text-emerald-400 font-bold relative z-10">
                      {bid.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Ask side */}
                  <div
                    onClick={() => onOpenOrderSheet(currentScrip.symbol, ask.price, 'SELL')}
                    className="relative flex items-center justify-between p-1 rounded hover:bg-rose-500/10 cursor-pointer overflow-hidden group"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-rose-500/15 pointer-events-none transition-all"
                      style={{ width: askWidth }}
                    />
                    <span className="text-rose-400 font-bold relative z-10">
                      {ask.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 relative z-10 text-[10px]">
                      <span className="text-slate-300 font-medium">{ask.quantity}</span>
                      <span>{ask.orders}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Volumes & Pressure Indicator Bar */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] tabular-nums">
              <span className="text-emerald-400 font-bold">
                Total Buy: {depth.totalBuyQty.toLocaleString()} ({buyRatio}%)
              </span>
              <span className="text-rose-400 font-bold">
                Total Sell: {depth.totalSellQty.toLocaleString()} ({sellRatio}%)
              </span>
            </div>

            {/* Visual ratio bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${buyRatio}%` }} />
              <div className="bg-rose-500 h-full transition-all" style={{ width: `${sellRatio}%` }} />
            </div>
          </div>

          {/* Quick Contract Specs summary */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Day Range:</span>
              <span className="text-white font-mono">₹2,822.00 — ₹2,855.00</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>52W High / Low:</span>
              <span className="text-white font-mono">₹3,024.90 / ₹2,220.30</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Volume Turnover:</span>
              <span className="text-white font-mono">₹1,842.10 Cr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
