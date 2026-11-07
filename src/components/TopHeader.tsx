import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Bell,
  Smartphone,
  Database,
  UserCheck,
  Zap,
  Sparkles,
  Download,
} from 'lucide-react';
import { ExperienceMode } from '../types';

interface TopHeaderProps {
  currentMode: 'mobile' | 'admin' | 'architecture';
  onModeChange: (mode: 'mobile' | 'admin' | 'architecture') => void;
  experienceMode: ExperienceMode;
  onExperienceModeChange: (mode: ExperienceMode) => void;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenDownloadApk: () => void;
  userInitial: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentMode,
  onModeChange,
  experienceMode,
  onExperienceModeChange,
  onOpenProfile,
  onOpenSearch,
  onOpenNotifications,
  onOpenDownloadApk,
  userInitial,
}) => {
  // Live ticking indices
  const [nifty, setNifty] = useState(24380.5);
  const [sensex, setSensex] = useState(80110.2);

  useEffect(() => {
    const timer = setInterval(() => {
      setNifty((prev) => Math.round((prev + (Math.random() - 0.49) * 2) * 100) / 100);
      setSensex((prev) => Math.round((prev + (Math.random() - 0.49) * 5) * 100) / 100);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark with Clear Visible App Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative group cursor-pointer" onClick={onOpenProfile}>
            <img
              src="/src/assets/images/finstock_app_logo_1794047284102.jpg"
              alt="Finstock Broking Official Logo"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white whitespace-nowrap">
                Finstock Broking
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">SEBI INZ000293438</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>NSE · BSE · MCX</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-medium">Market Open</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Ticker & Experience Mode Switcher (Simple vs Pro) */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          {/* Live Index Ticker Strip */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-800/60 px-3 py-1 rounded-xl border border-slate-800 text-[11px] font-mono tabular-nums">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">NIFTY</span>
              <span className="text-white font-bold">{nifty.toFixed(2)}</span>
              <span className="text-emerald-400 font-medium">(+0.46%)</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">SENSEX</span>
              <span className="text-white font-bold">{sensex.toFixed(2)}</span>
              <span className="text-emerald-400 font-medium">(+0.43%)</span>
            </div>
          </div>

          {/* Simple vs Pro Experience Mode Switcher */}
          {currentMode === 'mobile' && (
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
              <button
                onClick={() => onExperienceModeChange('simple')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  experienceMode === 'simple'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simple</span>
              </button>
              <button
                onClick={() => onExperienceModeChange('pro')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  experienceMode === 'pro'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Pro</span>
              </button>
            </div>
          )}

          {/* Admin & Architecture Portal Switchers */}
          <div className="hidden md:flex items-center bg-slate-800/70 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onModeChange('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentMode === 'mobile'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App</span>
            </button>
            <button
              onClick={() => onModeChange('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentMode === 'admin'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
            <button
              onClick={() => onModeChange('architecture')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentMode === 'architecture'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>OpenAPI</span>
            </button>
          </div>
        </div>

        {/* Zone 3: Actions & Android APK Download Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Prominent Android APK Download Button */}
          <button
            onClick={onOpenDownloadApk}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get Android APK</span>
            <span className="sm:hidden">APK</span>
          </button>

          <button
            onClick={onOpenSearch}
            aria-label="Global Search"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center relative transition-colors border border-slate-700 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
          </button>
          <button
            onClick={onOpenProfile}
            aria-label="Profile Avatar"
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow">
              {userInitial}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-slate-200 font-mono">
              FIN8829104
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
