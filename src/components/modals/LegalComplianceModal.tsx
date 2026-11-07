import React from 'react';
import { X, ShieldCheck, FileText, ExternalLink, AlertTriangle, Building, Scale } from 'lucide-react';

interface LegalComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Legal & Regulatory Compliance</h2>
              <p className="text-xs text-slate-400">SEBI Registration, exchange memberships & statutory disclosures</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-300">
          {/* Statutory Risk Disclaimer Banner */}
          <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-3.5 text-amber-200/90 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Mandatory Statutory Market Risk Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              "Investments in securities market are subject to market risks, read all the related documents carefully before investing."
            </p>
          </div>

          {/* Brokerage & Depository Registration Credentials */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2.5">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              Corporate & Regulatory Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SEBI Registration No:</span>
                <span className="font-mono text-emerald-400 font-bold">INZ000293438</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">(NSE / BSE / MCX Multi-Segment)</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CDSL Depository Participant (DP ID):</span>
                <span className="font-mono text-emerald-400 font-bold">12081600</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">(SEBI Reg: IN-DP-CDSL-688-2022)</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Corporate Identity Number (CIN):</span>
                <span className="font-mono text-white">U67120KA2024PTC189201</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Registered Office:</span>
                <span className="text-white">Finstock Broking Pvt Ltd, Indiranagar, Bengaluru - 560038</span>
              </div>
            </div>
          </div>

          {/* Versioned Regulatory Policies */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              Legal Documents & Policies (Versioned)
            </h3>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-800/30">
              {[
                { title: 'Privacy Policy (DPDP Act Aligned)', version: 'v2.4', updated: 'October 2026' },
                { title: 'Terms and Conditions of Broking Services', version: 'v3.1', updated: 'August 2026' },
                { title: 'Risk Disclosure Document (RDD) for Capital & F&O Markets', version: 'v2.0', updated: 'May 2026' },
                { title: 'Rights and Obligations of Stock Brokers and Clients', version: 'v1.8', updated: 'January 2026' },
                { title: 'Investor Charter for Stock Brokers (SEBI Format)', version: 'v1.2', updated: 'June 2026' },
                { title: 'Anti-Money Laundering (PMLA) Policy & KYC Guidelines', version: 'v2.1', updated: 'September 2026' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div>
                    <span className="font-semibold text-white block text-xs">{doc.title}</span>
                    <span className="text-[10px] text-slate-500">
                      Version: {doc.version} • Effective: {doc.updated}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Viewing ${doc.title} (${doc.version})`)}
                    className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
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
