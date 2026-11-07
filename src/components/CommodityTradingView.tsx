import React, { useState } from 'react';
import {
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  Layers,
  Scale,
  Zap,
  Clock,
  Info,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { initialCommodities } from '../data/mockData';
import { CommodityContract } from '../types';

interface CommodityTradingViewProps {
  onOpenOrderSheet: (symbol: string, ltp: number) => void;
  colorBlindMode?: boolean;
}

export const CommodityTradingView: React.FC<CommodityTradingViewProps> = ({
  onOpenOrderSheet,
  colorBlindMode = false,
}) => {
  const [commodities] = useState<CommodityContract[]>(initialCommodities);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'BULLION' | 'ENERGY' | 'METALS'>('ALL');

  const filtered = commodities.filter((c) => {
    if (selectedCategory === 'BULLION') return c.symbol.startsWith('GOLD') || c.symbol.startsWith('SILVER');
    if (selectedCategory === 'ENERGY') return c.symbol.startsWith('CRUDE') || c.symbol.startsWith('NATGAS');
    if (selectedCategory === 'METALS') return c.symbol.startsWith('COPPER') || c.symbol.startsWith('ZINC');
    return true;
  });

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto px-4 pt-3 text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-5 rounded-2xl border border-amber-500/20 space-y-2 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">MCX Commodity Derivatives</h2>
              <p className="text-[11px] text-slate-400">
                Official Multi Commodity Exchange of India (MCX) Member Terminal
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            MCX Live Feed
          </span>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <span>Market Hours: <strong className="text-white">09:00 AM — 11:30 PM IST</strong></span>
          <span aria-hidden="true">·</span>
          <span>Brokerage: <strong className="text-emerald-400">Flat ₹20 / order</strong></span>
          <span aria-hidden="true">·</span>
          <span>CTT: <strong className="text-white">0.01% on sell side</strong></span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 overflow-x-auto text-xs">
        {[
          { id: 'ALL', label: 'All Contracts (6)' },
          { id: 'BULLION', label: 'Bullion (Gold & Silver)' },
          { id: 'ENERGY', label: 'Energy (Crude & Gas)' },
          { id: 'METALS', label: 'Base Metals (Copper & Zinc)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((contract) => {
          const isPositive = contract.change >= 0;
          return (
            <div
              key={contract.symbol}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{contract.symbol}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                      MCX
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {contract.underlying}
                  </span>
                </div>

                <div className="text-right font-mono">
                  <span className="font-extrabold text-white text-base block tabular-nums">
                    {formatCurrency(contract.ltp)}
                  </span>
                  <div
                    className={`text-[11px] flex items-center justify-end gap-0.5 tabular-nums ${
                      isPositive ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{contract.change > 0 ? `+${contract.change}` : contract.change}</span>
                    <span>({contract.pChange > 0 ? `+${contract.pChange}` : contract.pChange}%)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Contract Specs */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 font-mono text-[11px] tabular-nums">
                <div>
                  <span className="text-slate-500 text-[10px] block">Lot Size</span>
                  <strong className="text-slate-200">{contract.lotSize} {contract.tradingUnit}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Tick Size</span>
                  <strong className="text-slate-200">₹{contract.tickSize}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Expiry</span>
                  <strong className="text-amber-400">{contract.expiryDate}</strong>
                </div>
              </div>

              {/* Day High/Low & Volume */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums px-1">
                <span>H: <strong className="text-slate-200">₹{contract.dayHigh}</strong> · L: <strong className="text-slate-200">₹{contract.dayLow}</strong></span>
                <span>Vol: <strong className="text-slate-200">{contract.volume}</strong></span>
              </div>

              {/* Margin & Action Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">Approx Margin (NRML)</span>
                  <span className="font-mono text-emerald-400 font-bold text-xs tabular-nums">
                    {formatCurrency(contract.marginRequired)} / lot
                  </span>
                </div>

                <button
                  onClick={() => onOpenOrderSheet(contract.symbol, contract.ltp)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Trade Contract</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statutory Guidance */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2.5 text-slate-400 text-[11px]">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Commodity contracts are settled via physical delivery or cash settlement per MCX contract specifications. Pre-expiry tender period margins apply 5 business days prior to contract expiry.
        </span>
      </div>
    </div>
  );
};
