import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Plus, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface WatchlistViewProps {
  onOpenOrderSheet: (symbol: string, ltp: number) => void;
  colorBlindMode: boolean;
}

interface StockItem {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  ltp: number;
  change: number;
  pChange: number;
  dayHigh: number;
  dayLow: number;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  onOpenOrderSheet,
  colorBlindMode,
}) => {
  const [stocks, setStocks] = useState<StockItem[]>([
    { symbol: 'NIFTY 50', name: 'Nifty 50 Index', exchange: 'NSE', ltp: 24380.5, change: 112.4, pChange: 0.46, dayHigh: 24420.0, dayLow: 24290.0 },
    { symbol: 'SENSEX', name: 'BSE Sensex Index', exchange: 'BSE', ltp: 80110.2, change: 340.8, pChange: 0.43, dayHigh: 80250.0, dayLow: 79800.0 },
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', ltp: 2840.5, change: 18.2, pChange: 0.64, dayHigh: 2855.0, dayLow: 2822.0 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', ltp: 3950.0, change: -14.5, pChange: -0.37, dayHigh: 3975.0, dayLow: 3930.0 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE', ltp: 1740.2, change: 8.4, pChange: 0.49, dayHigh: 1748.0, dayLow: 1731.0 },
    { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE', ltp: 1620.0, change: -6.2, pChange: -0.38, dayHigh: 1632.0, dayLow: 1612.0 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', exchange: 'NSE', ltp: 980.5, change: 22.1, pChange: 2.31, dayHigh: 985.0, dayLow: 958.0 },
    { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE', ltp: 472.4, change: 1.8, pChange: 0.38, dayHigh: 474.0, dayLow: 469.5 },
  ]);

  const [flashMap, setFlashMap] = useState<Record<string, 'up' | 'down' | null>>({});

  // Simulate subtle real-time market tick fluctuations (throttled)
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * stocks.length);
      const delta = (Math.random() - 0.48) * 1.5;

      setStocks((prev) => {
        const next = [...prev];
        const item = next[idx];
        const newLtp = Math.round((item.ltp + delta) * 100) / 100;
        const newChange = Math.round((item.change + delta) * 100) / 100;
        const newPChange = Math.round(((newChange / (newLtp - newChange)) * 100) * 100) / 100;

        next[idx] = {
          ...item,
          ltp: newLtp,
          change: newChange,
          pChange: newPChange,
        };
        return next;
      });

      const sym = stocks[idx].symbol;
      setFlashMap((prev) => ({ ...prev, [sym]: delta >= 0 ? 'up' : 'down' }));
      setTimeout(() => {
        setFlashMap((prev) => ({ ...prev, [sym]: null }));
      }, 400);
    }, 2500);

    return () => clearInterval(interval);
  }, [stocks]);

  return (
    <div className="space-y-3 pb-20 max-w-2xl mx-auto px-4 pt-3">
      {/* Search & Watchlist Selector Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto text-xs">
          <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg shadow-sm">
            Nifty 50
          </span>
          <span className="px-3 py-1 text-slate-400 hover:text-white cursor-pointer font-medium">
            Banking
          </span>
          <span className="px-3 py-1 text-slate-400 hover:text-white cursor-pointer font-medium">
            F&O Leaders
          </span>
        </div>

        <button
          onClick={() => alert('Search across 4,500+ NSE & BSE stocks, futures and options...')}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          aria-label="Add Scrip"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Stocks List */}
      <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-sm">
        {stocks.map((stock) => {
          const isPositive = stock.change >= 0;
          const flash = flashMap[stock.symbol];

          return (
            <div
              key={stock.symbol}
              className={`p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/50 transition-colors ${
                flash === 'up' ? 'bg-emerald-500/10' : flash === 'down' ? 'bg-rose-500/10' : ''
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">{stock.symbol}</span>
                  <span className="text-[10px] text-slate-500 font-mono px-1 rounded bg-slate-800">
                    {stock.exchange}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block truncate mt-0.5">{stock.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-mono font-bold text-white text-xs block tabular-nums">
                    {formatCurrency(stock.ltp)}
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
                  onClick={() => onOpenOrderSheet(stock.symbol, stock.ltp)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-bold rounded-lg text-[11px] border border-slate-700 transition-colors shrink-0"
                >
                  Trade
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
