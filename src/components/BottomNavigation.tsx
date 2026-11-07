import React from 'react';
import { Bookmark, ShoppingBag, PieChart, Compass, User } from 'lucide-react';
import { AppTab } from '../types';
import { translations } from '../utils/i18n';

interface BottomNavigationProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  language: keyof typeof translations;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  language,
}) => {
  const t = translations[language].tabs;

  const tabs: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'watchlist', label: t.watchlist, icon: Bookmark },
    { id: 'orders', label: t.orders, icon: ShoppingBag },
    { id: 'portfolio', label: t.portfolio, icon: PieChart },
    { id: 'explore', label: t.explore, icon: Compass },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-300 py-1.5 px-2 flex justify-around items-center"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
              isActive
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full transition-transform ${
                isActive ? 'bg-emerald-500/15 scale-110' : ''
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
