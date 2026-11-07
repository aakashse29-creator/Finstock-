import React, { useState } from 'react';
import {
  X,
  Shield,
  Download,
  AlertTriangle,
  Lock,
  CheckCircle2,
  FileText,
  UserX,
  Clock,
  ArrowRight,
  Database,
} from 'lucide-react';
import { PrivacyConsent, ClosurePreCheck } from '../../types';

interface PrivacyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  consents: PrivacyConsent[];
  onToggleConsent: (id: string, granted: boolean) => void;
  closureChecks: ClosurePreCheck[];
}

export const PrivacyDataModal: React.FC<PrivacyDataModalProps> = ({
  isOpen,
  onClose,
  consents,
  onToggleConsent,
  closureChecks,
}) => {
  const [activeTab, setActiveTab] = useState<'CONSENTS' | 'DOWNLOAD_DATA' | 'FREEZE' | 'ACCOUNT_CLOSURE'>('CONSENTS');
  const [dataExportStatus, setDataExportStatus] = useState<'IDLE' | 'PROCESSING' | 'READY'>('IDLE');
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeToast, setFreezeToast] = useState('');

  if (!isOpen) return null;

  const handleRequestDataExport = () => {
    setDataExportStatus('PROCESSING');
    setTimeout(() => {
      setDataExportStatus('READY');
    }, 1500);
  };

  const handleToggleFreeze = () => {
    const next = !isFrozen;
    setIsFrozen(next);
    setFreezeToast(
      next
        ? 'Account Frozen! All trading, orders, and active sessions blocked until MPIN/OTP unfreeze.'
        : 'Account unfrozen successfully. Normal trading resumed.'
    );
    setTimeout(() => setFreezeToast(''), 3000);
  };

  const allChecksPassed = closureChecks.every((c) => c.passed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Data Privacy & Rights (DPDP Act)</h2>
              <p className="text-xs text-slate-400">Consent dashboard, data portability & statutory closure rules</p>
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 overflow-x-auto text-xs whitespace-nowrap scrollbar-none shrink-0">
          {[
            { id: 'CONSENTS', label: 'Consent Dashboard' },
            { id: 'DOWNLOAD_DATA', label: 'Download My Data' },
            { id: 'FREEZE', label: 'Emergency Freeze' },
            { id: 'ACCOUNT_CLOSURE', label: 'Account Closure' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {freezeToast && (
            <div className="p-3 bg-amber-950/60 border border-amber-800 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{freezeToast}</span>
            </div>
          )}

          {/* TAB 1: CONSENTS */}
          {activeTab === 'CONSENTS' && (
            <div className="space-y-3">
              <p className="text-slate-300 leading-relaxed">
                Under India's Digital Personal Data Protection (DPDP) Act, you have granular control over non-mandatory data processing consents. Withdrawing consent takes immediate effect.
              </p>

              <div className="space-y-3">
                {consents.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-xs">{c.title}</span>
                        {c.isMandatory ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-400 font-semibold">
                            Regulatory Requirement
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold">
                            Optional Consent
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{c.description}</p>
                      <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                        Version: {c.version} • Recorded: {c.grantedAt}
                      </span>
                    </div>

                    <div className="shrink-0 pt-1">
                      {c.isMandatory ? (
                        <span className="text-[11px] text-slate-500 font-medium">Locked</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={c.granted}
                          onChange={(e) => onToggleConsent(c.id, e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOAD MY DATA */}
          {activeTab === 'DOWNLOAD_DATA' && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-sm">Right to Data Portability (JSON & CSV Archive)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Request a machine-readable export of all your profile, order history, trades, ledger journals, nominee records, and consent audit trails.
                </p>

                {dataExportStatus === 'READY' ? (
                  <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Export Archive Ready (finstock_userdata_8829104.zip)
                      </span>
                      <span className="text-[10px] text-slate-400">Expires in 24 hours</span>
                    </div>
                    <a
                      href="#download-bundle"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Downloading encrypted user data archive (JSON + CSV)...');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Data Archive</span>
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={handleRequestDataExport}
                    disabled={dataExportStatus === 'PROCESSING'}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{dataExportStatus === 'PROCESSING' ? 'Compiling Archive...' : 'Generate My Data Export'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EMERGENCY FREEZE */}
          {activeTab === 'FREEZE' && (
            <div className="space-y-4">
              <div className="bg-rose-950/20 border border-rose-800/60 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Instant Account Emergency Freeze</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Suspect unauthorized access, lost your mobile phone, or received suspicious OTP requests? You can immediately freeze your trading and login credentials.
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/80 text-[11px] text-slate-400 space-y-1">
                  <span>• Blocks all new order placements immediately.</span>
                  <span>• Terminates active sessions across all devices.</span>
                  <span>• Account can be unfrozen via Aadhaar OTP and MPIN verification.</span>
                </div>

                <button
                  onClick={handleToggleFreeze}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    isFrozen
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-rose-600 text-white hover:bg-rose-500'
                  }`}
                >
                  {isFrozen ? 'Unfreeze Account (Resume Access)' : 'Freeze My Account Immediately'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT CLOSURE */}
          {activeTab === 'ACCOUNT_CLOSURE' && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-3">
                <h3 className="font-bold text-white text-sm">Guided Account Closure Pre-Checks</h3>
                <p className="text-slate-400 text-xs">
                  Per SEBI depository regulations, all open commitments must be settled prior to initiating account closure.
                </p>

                <div className="space-y-2">
                  {closureChecks.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3"
                    >
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`font-semibold block ${item.passed ? 'text-white' : 'text-amber-300'}`}>
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                          {item.details}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Statutory Retention Note */}
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-[11px] text-slate-400 leading-relaxed">
                  <strong>Statutory Retention Disclosure:</strong> Under the Prevention of Money Laundering Act (PMLA) and SEBI regulations, client KYC records, contract notes, and trade logs are legally retained for a mandatory 8-year period following account closure. All other non-mandatory personal data is erased.
                </div>

                <button
                  disabled={!allChecksPassed}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>
                    {allChecksPassed
                      ? 'Proceed to e-Sign Account Closure Request'
                      : 'Resolve Blocking Conditions to Close Account'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end shrink-0">
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
