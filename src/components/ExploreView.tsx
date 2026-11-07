import React from 'react';
import {
  Compass,
  TrendingUp,
  Layers,
  Coins,
  Building,
  Landmark,
  PieChart,
  Calculator,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface ExploreViewProps {
  onOpenCalculator: () => void;
  onOpenModal: (modalName: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onOpenCalculator,
  onOpenModal,
}) => {
  const products = [
    { id: 'fno', title: 'F&O Derivatives Hub', desc: 'Option Chain, Greeks, Strategy Payoffs', icon: Layers, color: 'emerald' },
    { id: 'mf', title: 'Direct Mutual Funds', desc: 'Zero commission SIPs & ELSS tax savers', icon: PieChart, color: 'cyan' },
    { id: 'ipo', title: 'IPO & SME Bidding', desc: 'UPI mandate bidding on upcoming issues', icon: Flame, color: 'amber' },
    { id: 'bonds', title: 'Bonds & G-Secs', desc: 'Government securities, T-Bills & NCDs', icon: Landmark, color: 'indigo' },
    { id: 'sgb', title: 'Sovereign Gold Bonds', desc: '2.5% annual interest + gold price link', icon: Coins, color: 'amber' },
    { id: 'calculator', title: 'Brokerage Calculator', desc: 'Statutory fees & break-even estimator', icon: Calculator, color: 'emerald', isCalculator: true },
  ];

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto px-4 pt-3 text-xs">
      <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">Market Discovery & Products</h2>
          <p className="text-slate-400 text-[11px] mt-0.5">Explore investment vehicles across Indian exchanges</p>
        </div>
        <Compass className="w-6 h-6 text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {products.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.isCalculator) onOpenCalculator();
                else alert(`Opening ${item.title} section (Fully integrated with Finstock Core Engine)`);
              }}
              className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
