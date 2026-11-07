import React, { useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Zap,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { initialPositions } from '../data/mockData';
import { Position } from '../types';

interface OrdersViewProps {
  onOpenCalculator: () => void;
  onOpenOrderSheet?: (symbol: string, ltp: number) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  onOpenCalculator,
  onOpenOrderSheet,
}) => {
  const [activeTab, setActiveTab] = useState<'POSITIONS' | 'OPEN' | 'EXECUTED' | 'TRADEBOOK' | 'GTT'>('POSITIONS');
  const [positions, setPositions] = useState<Position[]>(initialPositions);

  const [openOrders, setOpenOrders] = useState([
    {
      id: 'ORD553012',
      symbol: 'INFY',
      exchange: 'NSE',
      side: 'BUY',
      qty: 20,
      price: 1610.0,
      triggerPrice: 0,
      orderType: 'LIMIT',
      product: 'CNC',
      time: '02:45 PM',
      status: 'OPEN',
    },
    {
      id: 'ORD553019',
      symbol: 'GOLDM 05DEC26',
      exchange: 'MCX',
      side: 'BUY',
      qty: 10,
      price: 78200.0,
      triggerPrice: 78150.0,
      orderType: 'SL',
      product: 'NRML',
      time: '03:10 PM',
      status: 'TRIGGER_PENDING',
    },
  ]);

  const executedOrders = [
    { id: 'ORD551920', symbol: 'RELIANCE', exchange: 'NSE', side: 'BUY', qty: 25, price: 2840.5, time: '10:14:22 AM', status: 'FILLED', product: 'CNC' },
    { id: 'ORD551934', symbol: 'TCS', exchange: 'NSE', side: 'SELL', qty: 15, price: 3950.0, time: '11:45:08 AM', status: 'FILLED', product: 'CNC' },
    { id: 'ORD552011', symbol: 'NIFTY 24500 CE', exchange: 'NSE', side: 'BUY', qty: 50, price: 112.4, time: '02:20:15 PM', status: 'FILLED', product: 'NRML' },
    { id: 'ORD552044', symbol: 'CRUDEOIL 19NOV26', exchange: 'MCX', side: 'BUY', qty: 100, price: 6140.0, time: '02:35:40 PM', status: 'FILLED', product: 'NRML' },
  ];

  const tradeBook = [
    { tradeId: 'TRD992810', orderId: 'ORD551920', symbol: 'RELIANCE', exchange: 'NSE', side: 'BUY', qty: 25, price: 2840.5, tradeTime: '10:14:22.341', netAmount: 71096.73 },
    { tradeId: 'TRD992842', orderId: 'ORD551934', symbol: 'TCS', exchange: 'NSE', side: 'SELL', qty: 15, price: 3950.0, tradeTime: '11:45:08.109', netAmount: 59172.67 },
    { tradeId: 'TRD993104', orderId: 'ORD552011', symbol: 'NIFTY 24500 CE', exchange: 'NSE', side: 'BUY', qty: 50, price: 112.4, tradeTime: '14:20:15.892', netAmount: 5647.10 },
    { tradeId: 'TRD993215', orderId: 'ORD552044', symbol: 'CRUDEOIL 19NOV26', exchange: 'MCX', side: 'BUY', qty: 100, price: 6140.0, tradeTime: '14:35:40.450', netAmount: 614320.00 },
  ];

  const totalPositionsMtm = positions.reduce((acc, curr) => acc + curr.pnl, 0);

  const handleSquareOff = (posId: string) => {
    const target = positions.find((p) => p.id === posId);
    if (!target) return;
    setPositions((prev) => prev.filter((p) => p.id !== posId));
    alert(`Position ${target.symbol} (${target.product}) squared off at LTP ${formatCurrency(target.ltp)}. Realized P&L: ${formatCurrency(target.pnl)}.`);
  };

  const handleCancelOrder = (orderId: string) => {
    setOpenOrders((prev) => prev.filter((o) => o.id !== orderId));
    alert(`Order ${orderId} cancelled successfully.`);
  };

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto px-4 pt-3 text-xs">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-xl px-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
        {[
          { id: 'POSITIONS', label: `Positions (${positions.length})` },
          { id: 'OPEN', label: `Open Orders (${openOrders.length})` },
          { id: 'EXECUTED', label: `Executed (${executedOrders.length})` },
          { id: 'TRADEBOOK', label: `Trade Book (${tradeBook.length})` },
          { id: 'GTT', label: 'GTT Triggers (1)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-3.5 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* POSITIONS TAB */}
      {activeTab === 'POSITIONS' && (
        <div className="space-y-3">
          {/* MTM Banner */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Total Unrealized MTM P&L
              </span>
              <span
                className={`font-mono font-extrabold text-xl block mt-0.5 tabular-nums ${
                  totalPositionsMtm >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {totalPositionsMtm >= 0 ? `+${formatCurrency(totalPositionsMtm)}` : formatCurrency(totalPositionsMtm)}
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <span>Auto Square-off Time:</span>
              <strong className="text-white block font-mono">03:15 PM IST</strong>
            </div>
          </div>

          {/* Positions List */}
          {positions.length > 0 ? (
            <div className="space-y-2.5">
              {positions.map((pos) => {
                const isPositive = pos.pnl >= 0;
                return (
                  <div
                    key={pos.id}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            pos.side === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {pos.side}
                        </span>
                        <span className="font-bold text-white text-xs">{pos.symbol}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {pos.exchange} · {pos.product}
                        </span>
                      </div>

                      <div className="text-right font-mono tabular-nums">
                        <span
                          className={`font-bold text-xs block ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? `+${formatCurrency(pos.pnl)}` : formatCurrency(pos.pnl)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isPositive ? `+${pos.pChange}%` : `${pos.pChange}%`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums pt-1 border-t border-slate-800/80">
                      <div>
                        <span>Qty: <strong className="text-white">{pos.quantity}</strong></span>
                        <span className="mx-2">·</span>
                        <span>Avg: <strong className="text-white">{formatCurrency(pos.avgPrice)}</strong></span>
                        <span className="mx-2">·</span>
                        <span>LTP: <strong className="text-emerald-400">{formatCurrency(pos.ltp)}</strong></span>
                      </div>

                      <button
                        onClick={() => handleSquareOff(pos.id)}
                        className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/30 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                      >
                        Square Off
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800">
              No open intraday or derivative positions.
            </div>
          )}
        </div>
      )}

      {/* OPEN ORDERS TAB */}
      {activeTab === 'OPEN' && (
        <div className="space-y-2.5">
          {openOrders.length > 0 ? (
            openOrders.map((ord) => (
              <div key={ord.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {ord.side}
                    </span>
                    <span className="font-bold text-white text-xs">{ord.symbol}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {ord.exchange} · {ord.orderType} · {ord.product}
                    </span>
                  </div>
                  <span className="text-amber-400 font-semibold text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ord.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono tabular-nums">
                  <span>Qty: {ord.qty} @ {formatCurrency(ord.price)}</span>
                  <div className="flex items-center gap-2">
                    <span>{ord.time}</span>
                    <button
                      onClick={() => handleCancelOrder(ord.id)}
                      className="text-rose-400 hover:text-rose-300 font-semibold text-[10px] hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800">
              No open orders in execution queue.
            </div>
          )}
        </div>
      )}

      {/* EXECUTED ORDERS TAB */}
      {activeTab === 'EXECUTED' && (
        <div className="space-y-2.5">
          {executedOrders.map((ord) => (
            <div key={ord.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ord.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {ord.side}
                  </span>
                  <span className="font-bold text-white text-xs">{ord.symbol}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {ord.exchange} · {ord.product}
                  </span>
                </div>
                <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Executed
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono tabular-nums">
                <span>Qty: {ord.qty} @ {formatCurrency(ord.price)}</span>
                <span>{ord.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRADE BOOK TAB */}
      {activeTab === 'TRADEBOOK' && (
        <div className="space-y-2.5">
          <div className="text-[11px] text-slate-400 mb-1">
            Exchange trade confirmations with microsecond execution timestamps.
          </div>
          {tradeBook.map((trade) => (
            <div key={trade.tradeId} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-bold text-xs">{trade.tradeId}</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-bold text-white text-xs">{trade.symbol}</span>
                </div>
                <span className="font-mono text-white font-bold text-xs tabular-nums">
                  {formatCurrency(trade.netAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 tabular-nums">
                <span>Order: {trade.orderId} · {trade.side} {trade.qty} @ {formatCurrency(trade.price)}</span>
                <span>{trade.tradeTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GTT TRIGGERS TAB */}
      {activeTab === 'GTT' && (
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">TATAMOTORS (Single Leg Trigger)</span>
            <span className="text-emerald-400 text-[10px] font-semibold">ACTIVE</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Trigger Price: <strong>₹950.00</strong> · Limit Price: <strong>₹950.50</strong> · Qty: <strong>50</strong>
          </div>
          <div className="text-[10px] text-slate-500">
            Valid for 1 year until triggered or cancelled. Automated routing to NSE.
          </div>
        </div>
      )}

      {/* Quick link to charges calculator */}
      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Curious about statutory fees on executed trades?</span>
        </div>
        <button
          onClick={onOpenCalculator}
          className="text-emerald-400 hover:underline font-bold text-xs cursor-pointer"
        >
          Open Calculator
        </button>
      </div>
    </div>
  );
};
