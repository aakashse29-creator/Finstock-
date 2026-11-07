import React, { useState } from 'react';
import {
  X,
  Gift,
  Copy,
  CheckCircle2,
  Share2,
  Users,
  ShieldCheck,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { ReferralData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralData: ReferralData;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  referralData,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (channel: string) => {
    setShareToast(`Shared invitation link via ${channel}!`);
    setTimeout(() => setShareToast(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Referral Program</h2>
              <p className="text-xs text-slate-400">Invite friends and earn ₹500 brokerage credits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {shareToast && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{shareToast}</span>
            </div>
          )}

          {/* Earnings Overview Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-800 to-slate-900 p-5 rounded-2xl border border-emerald-800/40 space-y-3">
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
              Total Rewards Earned
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white font-mono">
                {formatCurrency(referralData.totalEarned)}
              </span>
              <span className="text-xs text-slate-300">
                {referralData.convertedCount} of {referralData.activeInvitesCount} Friends Converted
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Directly credited to your Finstock funds ledger upon successful KYC and first trade.
            </p>
          </div>

          {/* Code & Share Link */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
            <label className="text-xs text-slate-400 block font-medium">Your Unique Referral Code & Link</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 font-mono text-xs text-emerald-300 select-all truncate">
                {referralData.referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-colors"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleShare('WhatsApp')}
                className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('Telegram')}
                className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Telegram</span>
              </button>
              <button
                onClick={() => handleShare('SMS')}
                className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>SMS Invite</span>
              </button>
            </div>
          </div>

          {/* Invited Friends List */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Referral Activity & Status
            </h3>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 text-xs">
              {referralData.invites.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{item.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {item.maskedMobile} • Invited on {item.date}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'REWARD_CREDITED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.status === 'KYC_DONE'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {item.status === 'REWARD_CREDITED'
                        ? '+₹500 Credited'
                        : item.status === 'KYC_DONE'
                        ? 'KYC Completed'
                        : 'Signed Up'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Regulatory Notice */}
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">SEBI Regulatory Guidelines for Referrals:</span>
            <p>
              Rewards are issued solely as trading brokerage credits. Self-referrals and duplicate device identifiers are blocked by automated anti-fraud checks. No guaranteed earnings claims. Terms apply.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
