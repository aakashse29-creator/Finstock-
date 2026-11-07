import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface DdpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDdpiActive: boolean;
  onToggleDdpi: (active: boolean) => void;
}

export const DdpiModal: React.FC<DdpiModalProps> = ({
  isOpen,
  onClose,
  isDdpiActive,
  onToggleDdpi,
}) => {
  const [active, setActive] = useState(isDdpiActive);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleToggle = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const next = !active;
      setActive(next);
      onToggleDdpi(next);
      setIsProcessing(false);
      setSuccess(
        next
          ? 'DDPI successfully activated via electronic depository authentication!'
          : 'DDPI authorisation revoked. Demat sales will now require CDSL TPIN verification.'
      );
      setTimeout(() => setSuccess(''), 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">DDPI & Demat Authorisation</h2>
              <p className="text-xs text-slate-400">Demat Debit and Pledge Instruction (replaces POA)</p>
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
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {success && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Current Status Card */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Current DDPI Status</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {active ? 'Active & Authorised' : 'Inactive (TPIN Required)'}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {active ? 'No TPIN Needed' : 'Manual TPIN'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggle}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                active
                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isProcessing
                ? 'Processing...'
                : active
                ? 'Revoke Authorisation'
                : 'Activate DDPI'}
            </button>
          </div>

          {/* Detailed Regulatory Explanation */}
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <h3 className="font-bold text-white text-sm">What is DDPI?</h3>
            <p>
              In accordance with SEBI circular SEBI/HO/MIRSD/DoP/P/CIR/2022/44, the Demat Debit and Pledge Instruction (DDPI) replaced the Power of Attorney (POA).
              It is an explicit, limited authorisation given by the client to the stock broker.
            </p>

            <h4 className="font-semibold text-slate-200 mt-2">Permitted Uses of DDPI:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong>Settlement of Trades:</strong> Transfer of securities from your demat account to the clearing corporation towards stock sell obligations executed by you.
              </li>
              <li>
                <strong>Margin Pledging:</strong> Pledging or re-pledging of securities in favour of the clearing corporation to avail margin trading benefits.
              </li>
              <li>
                <strong>Mutual Fund Redemptions:</strong> Settlement of mutual fund transactions executed on the exchange platform.
              </li>
            </ul>

            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 flex items-start gap-2 text-slate-400 text-[11px]">
              <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                DDPI strictly cannot be used for any transfer between client accounts or third-party transfers. You can revoke it at any time with immediate effect.
              </span>
            </div>
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
