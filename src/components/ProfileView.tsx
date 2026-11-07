import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Building2,
  Users,
  Layers,
  FileCheck2,
  FileText,
  Calculator,
  HelpCircle,
  Gift,
  Settings,
  Shield,
  Scale,
  LogOut,
  Copy,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Smartphone,
} from 'lucide-react';
import { UserProfile, UserSettings, BankAccount, Nominee, ProfileChangeRequest, ContractNote, LedgerEntry, HelpArticle, FAQItem, SupportTicket, ReferralData, PrivacyConsent, ClosurePreCheck, SegmentType } from '../types';
import { translations } from '../utils/i18n';
import { maskMobile, maskEmail } from '../utils/formatters';

interface ProfileViewProps {
  profile: UserProfile;
  settings: UserSettings;
  bankAccounts: BankAccount[];
  nominees: Nominee[];
  changeRequests: ProfileChangeRequest[];
  contractNotes: ContractNote[];
  ledgerEntries: LedgerEntry[];
  helpArticles: HelpArticle[];
  faqs: FAQItem[];
  tickets: SupportTicket[];
  referralData: ReferralData;
  privacyConsents: PrivacyConsent[];
  closureChecks: ClosurePreCheck[];
  onOpenModal: (modalName: string, extraData?: any) => void;
  onLogout: () => void;
  privacyMode: boolean;
  onTogglePrivacyMode: () => void;
  onOpenDownloadApk?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  settings,
  bankAccounts,
  nominees,
  changeRequests,
  contractNotes,
  ledgerEntries,
  helpArticles,
  faqs,
  tickets,
  referralData,
  privacyConsents,
  closureChecks,
  onOpenModal,
  onLogout,
  privacyMode,
  onTogglePrivacyMode,
  onOpenDownloadApk,
}) => {
  const [copiedUcc, setCopiedUcc] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const t = translations[settings.language].profile;

  const handleCopyUcc = () => {
    navigator.clipboard?.writeText(profile.ucc);
    setCopiedUcc(true);
    setTimeout(() => setCopiedUcc(false), 2000);
  };

  const menuItems = [
    {
      id: 'ACCOUNT_DETAILS',
      title: t.accountPersonal,
      desc: t.accountPersonalDesc,
      icon: User,
      badge: `${profile.kycStatus === 'VERIFIED' ? 'Verified' : 'Pending'}`,
      badgeColor: 'emerald',
    },
    {
      id: 'BANK_ACCOUNTS',
      title: t.bankAccounts,
      desc: `${bankAccounts.length} Linked Accounts (Primary: ${bankAccounts.find((b) => b.isPrimary)?.bankName || 'HDFC'})`,
      icon: Building2,
      badge: `${bankAccounts.length} Verified`,
      badgeColor: 'emerald',
    },
    {
      id: 'NOMINEES',
      title: t.nominees,
      desc: `${nominees.length} Nominees registered (100% allocated)`,
      icon: Users,
      badge: `${nominees.length} Registered`,
      badgeColor: 'indigo',
    },
    {
      id: 'SEGMENTS',
      title: t.segments,
      desc: `Active: ${profile.activeSegments.join(', ')}`,
      icon: Layers,
      badge: 'Equity + F&O',
      badgeColor: 'emerald',
    },
    {
      id: 'DDPI',
      title: t.ddpi,
      desc: t.ddpiDesc,
      icon: FileCheck2,
      badge: 'Active (No TPIN)',
      badgeColor: 'cyan',
    },
    {
      id: 'REPORTS',
      title: t.reportsCentre,
      desc: t.reportsCentreDesc,
      icon: FileText,
      badge: 'FY 2026-27',
      badgeColor: 'indigo',
    },
    {
      id: 'CALCULATOR',
      title: t.brokerageCalculator,
      desc: t.brokerageCalculatorDesc,
      icon: Calculator,
      badge: '₹0 Delivery',
      badgeColor: 'emerald',
    },
    {
      id: 'SUPPORT',
      title: t.supportHelp,
      desc: t.supportHelpDesc,
      icon: HelpCircle,
      badge: 'Live Chat Active',
      badgeColor: 'emerald',
    },
    {
      id: 'REFERRAL',
      title: t.referral,
      desc: `₹${referralData.totalEarned} earned • ${referralData.activeInvitesCount} invites`,
      icon: Gift,
      badge: '₹500 / Referral',
      badgeColor: 'amber',
    },
    {
      id: 'SETTINGS',
      title: t.appSettings,
      desc: t.appSettingsDesc,
      icon: Settings,
      badge: `${settings.language.toUpperCase()} • 2FA`,
      badgeColor: 'indigo',
    },
    {
      id: 'PRIVACY_DATA',
      title: t.privacyData,
      desc: t.privacyDataDesc,
      icon: Shield,
      badge: 'DPDP Aligned',
      badgeColor: 'emerald',
    },
    {
      id: 'LEGAL',
      title: t.legalCompliance,
      desc: t.legalComplianceDesc,
      icon: Scale,
      badge: 'SEBI INZ000293438',
      badgeColor: 'slate',
    },
  ];

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto px-4 pt-3">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 border border-slate-700/80 p-5 shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* User Avatar with Initials */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg ring-2 ring-emerald-500/40">
                AS
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-slate-900"
                title="Active Account"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">{profile.fullName}</h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> Active
                </span>
              </div>

              {/* UCC and Copy */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400 font-mono font-medium">
                  {t.ucc}: <strong className="text-slate-200">{profile.ucc}</strong>
                </span>
                <button
                  onClick={handleCopyUcc}
                  aria-label="Copy UCC"
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedUcc ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Masked Contact Details */}
              <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span>{privacyMode ? '••••••••••' : maskMobile(profile.mobile)}</span>
                <span className="text-slate-600">•</span>
                <span>{privacyMode ? '••••••••••' : maskEmail(profile.email)}</span>
              </div>
            </div>
          </div>

          {/* Privacy Mode Toggle Button */}
          <button
            onClick={onTogglePrivacyMode}
            aria-label="Toggle Privacy Mode"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
            title="Privacy Mode: Hide or Show Sensitive Figures"
          >
            {privacyMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-slate-300" />}
          </button>
        </div>

        {/* Demat Details Footer inside card */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>
            CDSL DP ID: <strong className="text-slate-300 font-mono">{profile.dpId}</strong>
          </span>
          <span>
            Beneficiary ID: <strong className="text-slate-300 font-mono">{profile.boId}</strong>
          </span>
          <span className="text-emerald-400 font-medium">DigiLocker e-KYC Verified</span>
        </div>
      </div>

      {/* Profile Completeness Card (Neutral non-coercive framing) */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">{t.completeness}</span>
          </div>
          <span className="font-bold text-emerald-400 font-mono">{profile.completenessScore}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${profile.completenessScore}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {profile.pendingItems[0] || 'Your profile is fully configured for seamless trading.'}
        </p>
      </div>

      {/* Profile Menu Items List */}
      <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-800/30 border border-slate-800 overflow-hidden shadow-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onOpenModal(item.id)}
              className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-800/60 transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 group-hover:text-emerald-400 group-hover:bg-slate-700/80 flex items-center justify-center shrink-0 border border-slate-700/60 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors truncate">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate mt-0.5">{item.desc}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.badge && (
                  <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Android APK Download Card */}
      <div className="pt-1">
        <button
          onClick={onOpenDownloadApk}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-850 to-slate-900 hover:from-emerald-950/60 border border-emerald-500/30 text-white text-xs font-bold flex items-center justify-between gap-3 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/finstock_app_logo_1794047284102.jpg"
              alt="Finstock Broking App Logo"
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-emerald-400/40 shadow shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <span className="font-extrabold text-white text-xs block group-hover:text-emerald-300 transition-colors">
                Download Finstock Android App (APK)
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                v10.0.0-PROD · 18.4 MB · 60fps Native Jetpack Compose
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-[11px] shadow-sm shrink-0">
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </div>
        </button>
      </div>

      {/* Logout Row */}
      <div className="pt-1">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full p-3.5 rounded-2xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-300 hover:text-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Version & Build info footer */}
      <div className="text-center text-[10px] text-slate-500 space-y-0.5 pt-2">
        <div>Finstock Broking v10.0.0 (RC-1.0.0-PROD) • Indian Production API 26+</div>
        <div>SEBI Reg: INZ000293438 • CDSL DP ID: 12081600 • CIN: U67120KA2024PTC189201</div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">{t.logout}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{t.logoutConfirm}</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
