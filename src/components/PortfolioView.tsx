import React from 'react';
import { Eye, EyeOff, TrendingUp, PieChart, ShieldCheck, Download, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface PortfolioViewProps {
  privacyMode: boolean;
  onTogglePrivacyMode: () => void;
  onOpenReports: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  privacyMode,
  onTogglePrivacyMode,
  onOpenReports,
}) => {
  const holdings = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', qty: 45, avgPrice: 2520.0, ltp: 2840.5, pnl: 14422.5, pChange: 12.72 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', qty: 25, avgPrice: 3410.0, ltp: 3950.0, pnl: 13500.0, pChange: 15.84 },
    { symbol: 'INFY', name: 'Infosys Ltd', qty: 60, avgPrice: 1450.0, ltp: 1620.0, pnl: 10200.0, pChange: 11.72 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', qty: 50, avgPrice: 1580.0, ltp: 1740.2, pnl: 8010.0, pChange: 10.14 },
    { symbol: 'ITC', name: 'ITC Ltd', qty: 180, avgPrice: 432.0, ltp: 472.4, pnl: 7272.0, pChange: 9.35 },
  ];

  const totalCurrentValue = 348200;
  const totalInvested = 295000;
  const totalPnl = 53200;
  const totalReturnPercent = 18.03;

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto px-4 pt-3 text-xs">
      {/* Portfolio Summary Card */}
      <div className="bg-gradient-to-br from-slate-800/90 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            Total Equity & Demat Portfolio
          </span>
          <button
            onClick={onTogglePrivacyMode}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            {privacyMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-extrabold text-white font-mono">
              {privacyMode ? '••••••••' : formatCurrency(totalCurrentValue)}
            </span>
            <span className="text-slate-400 block text-[11px] mt-0.5">
              Invested: <strong>{privacyMode ? '••••••••' : formatCurrency(totalInvested)}</strong>
            </span>
          </div>

          <div className="text-right">
            <span className="text-base font-bold text-emerald-400 font-mono">
              {privacyMode ? '••••' : `+${formatCurrency(totalPnl)}`}
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold block">
              (+{totalReturnPercent}%) • XIRR: 22.4%
            </span>
          </div>
        </div>

        {/* Depository Link & DP Statement */}
        <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> CDSL Demat Safe Custody
          </span>
          <button
            onClick={onOpenReports}
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Download DP Statement</span>
          </button>
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-white text-xs uppercase tracking-wider">
            Holdings ({holdings.length} Scrips)
          </span>
          <span className="text-slate-400 text-[11px]">T+1 Settled in CDSL</span>
        </div>

        <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-sm">
          {holdings.map((stock) => (
            <div key={stock.symbol} className="p-3.5 flex items-center justify-between hover:bg-slate-800/40">
              <div>
                <span className="font-bold text-white text-xs">{stock.symbol}</span>
                <span className="text-slate-400 block text-[11px] font-mono mt-0.5">
                  Qty: {stock.qty} • Avg: {formatCurrency(stock.avgPrice)}
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="font-bold text-white text-xs block">
                  {privacyMode ? '••••' : formatCurrency(stock.ltp * stock.qty)}
                </span>
                <span className="text-emerald-400 text-[11px] font-semibold block">
                  {privacyMode ? '••••' : `+${formatCurrency(stock.pnl)} (+${stock.pChange}%)`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
