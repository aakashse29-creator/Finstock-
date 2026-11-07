import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus,
  ArrowDownToLine,
  Compass,
  PieChart,
  Flame,
  ShieldCheck,
  ChevronRight,
  Layers,
  Sparkles,
  Download,
  Smartphone,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface SimpleDashboardViewProps {
  portfolioValue: number;
  investedValue: number;
  totalPnl: number;
  todayPnl: number;
  availableFunds: number;
  onOpenAddFunds: () => void;
  onOpenWithdraw: () => void;
  onOpenOrderSheet: (symbol: string, ltp: number) => void;
  onOpenCommodities: () => void;
  onOpenExplore: () => void;
  onOpenDownloadApk?: () => void;
  colorBlindMode?: boolean;
}

export const SimpleDashboardView: React.FC<SimpleDashboardViewProps> = ({
  portfolioValue,
  investedValue,
  totalPnl,
  todayPnl,
  availableFunds,
  onOpenAddFunds,
  onOpenWithdraw,
  onOpenOrderSheet,
  onOpenCommodities,
  onOpenExplore,
  onOpenDownloadApk,
  colorBlindMode = false,
}) => {
  const totalReturnPercent = investedValue > 0 ? ((totalPnl / investedValue) * 100).toFixed(2) : '0.00';
  const todayReturnPercent = portfolioValue > 0 ? ((todayPnl / portfolioValue) * 100).toFixed(2) : '0.00';

  const curatedStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2840.5, change: 18.2, pChange: 0.64, category: 'Energy & Telecom' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3950.0, change: -14.5, pChange: -0.37, category: 'IT Services' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1740.2, change: 8.4, pChange: 0.49, category: 'Private Banking' },
    { symbol: 'INFY', name: 'Infosys Ltd', price: 1620.0, change: -6.2, pChange: -0.38, category: 'IT Consulting' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 980.5, change: 22.1, pChange: 2.31, category: 'Automotive & EV' },
    { symbol: 'ITC', name: 'ITC Ltd', price: 472.4, change: 1.8, pChange: 0.38, category: 'FMCG & Hotels' },
  ];

  const marketMovers = {
    gainers: [
      { symbol: 'TATAMOTORS', ltp: 980.5, pChange: 2.31 },
      { symbol: 'RELIANCE', ltp: 2840.5, pChange: 0.64 },
      { symbol: 'HDFCBANK', ltp: 1740.2, pChange: 0.49 },
    ],
    losers: [
      { symbol: 'TCS', ltp: 3950.0, pChange: -0.37 },
      { symbol: 'INFY', ltp: 1620.0, pChange: -0.38 },
      { symbol: 'NATGAS', ltp: 242.4, pChange: -1.54 },
    ],
  };

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto px-4 pt-3 text-xs">
      {/* Groww-style Hero Portfolio Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Total Investments
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Demat A/C:</span>
            <span className="font-mono text-white font-semibold">CDSL Verified</span>
          </div>
        </div>

        {/* Portfolio Value Figures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-baseline">
          <div>
            <span className="text-3xl font-extrabold text-white font-mono block tabular-nums tracking-tight">
              {formatCurrency(portfolioValue)}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Invested: <strong className="text-slate-200 tabular-nums">{formatCurrency(investedValue)}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Cash: <strong className="text-emerald-400 tabular-nums">{formatCurrency(availableFunds)}</strong></span>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="flex sm:justify-end items-center gap-1.5 font-mono text-emerald-400 font-bold text-sm tabular-nums">
              <span>+{formatCurrency(totalPnl)}</span>
              <span>(+{totalReturnPercent}%)</span>
            </div>
            <div className="flex sm:justify-end items-center gap-2 text-[11px] text-slate-400">
              <span>1-Day Returns:</span>
              <span className="text-emerald-400 font-mono font-semibold tabular-nums">
                +{formatCurrency(todayPnl)} (+{todayReturnPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* 1-Tap Action Buttons (Add Funds & Withdraw) */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={onOpenAddFunds}
            className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Funds</span>
          </button>
          <button
            onClick={onOpenWithdraw}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Withdraw Cash</span>
          </button>
        </div>
      </div>

      {/* Native Android App Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/src/assets/images/finstock_app_logo_1794047284102.jpg"
            alt="Finstock App Icon"
            className="w-11 h-11 rounded-xl object-cover ring-1 ring-emerald-500/30 shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs truncate">Finstock Android App</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                v10.0.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              60fps Jetpack Compose · Native biometric login · 18.4 MB
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDownloadApk}
          className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Get APK</span>
        </button>
      </div>

      {/* Quick Category Discovery Hub */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenExplore}
          className="p-3 bg-slate-900/70 hover:bg-slate-800/80 rounded-xl border border-slate-800 flex flex-col items-center text-center transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-[11px]">Stocks</span>
          <span className="text-[10px] text-slate-400 mt-0.5">₹0 Delivery</span>
        </button>

        <button
          onClick={onOpenExplore}
          className="p-3 bg-slate-900/70 hover:bg-slate-800/80 rounded-xl border border-slate-800 flex flex-col items-center text-center transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <PieChart className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-[11px]">Mutual Funds</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Direct SIP</span>
        </button>

        <button
          onClick={onOpenCommodities}
          className="p-3 bg-slate-900/70 hover:bg-slate-800/80 rounded-xl border border-slate-800 flex flex-col items-center text-center transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-[11px]">Commodities</span>
          <span className="text-[10px] text-slate-400 mt-0.5">MCX Gold/Oil</span>
        </button>

        <button
          onClick={onOpenExplore}
          className="p-3 bg-slate-900/70 hover:bg-slate-800/80 rounded-xl border border-slate-800 flex flex-col items-center text-center transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-[11px]">IPO Hub</span>
          <span className="text-[10px] text-slate-400 mt-0.5">UPI Mandate</span>
        </button>
      </div>

      {/* Market Movers Strip */}
      <div className="grid grid-cols-2 gap-3">
        {/* Top Gainers */}
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">Top Gainers</span>
            <span className="text-[10px] text-emerald-400 font-semibold">NSE Today</span>
          </div>
          <div className="space-y-1.5">
            {marketMovers.gainers.map((g) => (
              <div
                key={g.symbol}
                onClick={() => onOpenOrderSheet(g.symbol, g.ltp)}
                className="flex items-center justify-between cursor-pointer hover:bg-slate-800/40 p-1 rounded transition-colors"
              >
                <span className="font-medium text-slate-300 text-[11px]">{g.symbol}</span>
                <span className="font-mono text-emerald-400 font-semibold text-[11px] tabular-nums">
                  +{g.pChange}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">Top Losers</span>
            <span className="text-[10px] text-rose-400 font-semibold">NSE Today</span>
          </div>
          <div className="space-y-1.5">
            {marketMovers.losers.map((l) => (
              <div
                key={l.symbol}
                onClick={() => onOpenOrderSheet(l.symbol, l.ltp)}
                className="flex items-center justify-between cursor-pointer hover:bg-slate-800/40 p-1 rounded transition-colors"
              >
                <span className="font-medium text-slate-300 text-[11px]">{l.symbol}</span>
                <span className="font-mono text-rose-400 font-semibold text-[11px] tabular-nums">
                  {l.pChange}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Popular Stocks on Finstock (Curated Collection) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs uppercase tracking-wider">
            Most Bought on Finstock
          </span>
          <span className="text-slate-400 text-[11px]">Real-Time Market Prices</span>
        </div>

        <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-sm">
          {curatedStocks.map((stock) => {
            const isPositive = stock.change >= 0;
            return (
              <div
                key={stock.symbol}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{stock.symbol}</span>
                    <span className="text-[10px] text-slate-500 font-mono">NSE</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    <span>{stock.name}</span>
                    <span className="text-slate-600 mx-1.5">·</span>
                    <span className="text-slate-500">{stock.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-bold text-white text-xs block tabular-nums">
                      {formatCurrency(stock.price)}
                    </span>
                    <div
                      className={`text-[10px] font-mono flex items-center justify-end gap-0.5 tabular-nums ${
                        isPositive ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'
                      }`}
                    >
                      {colorBlindMode ? (
                        <span>{isPositive ? '[▲ +]' : '[▼ -]'}</span>
                      ) : isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>{stock.change > 0 ? `+${stock.change}` : stock.change}</span>
                      <span>({stock.pChange > 0 ? `+${stock.pChange}` : stock.pChange}%)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenOrderSheet(stock.symbol, stock.price)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors shrink-0 shadow-sm cursor-pointer"
                  >
                    Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
