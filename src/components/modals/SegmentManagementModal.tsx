import React, { useState } from 'react';
import {
  X,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ShieldCheck,
  TrendingUp,
  Coins,
  Globe,
  FileCheck,
} from 'lucide-react';
import { SegmentType } from '../../types';

interface SegmentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSegments: SegmentType[];
  onToggleSegment: (segment: SegmentType, activate: boolean) => void;
}

export const SegmentManagementModal: React.FC<SegmentManagementModalProps> = ({
  isOpen,
  onClose,
  activeSegments,
  onToggleSegment,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<SegmentType | null>(null);
  const [actionType, setActionType] = useState<'ACTIVATE' | 'DEACTIVATE'>('ACTIVATE');
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const segmentsConfig: {
    id: SegmentType;
    name: string;
    description: string;
    exchanges: string;
    icon: React.ComponentType<{ className?: string }>;
    requiresIncomeProof: boolean;
  }[] = [
    {
      id: 'EQUITY',
      name: 'Equity (Cash & Delivery)',
      description: 'Shares trading on NSE & BSE in Cash segment (CNC & MIS)',
      exchanges: 'NSE, BSE',
      icon: TrendingUp,
      requiresIncomeProof: false,
    },
    {
      id: 'FNO',
      name: 'Futures & Options (Derivatives)',
      description: 'Stock and Index derivatives contracts with leverage & hedging',
      exchanges: 'NSE, BSE',
      icon: Layers,
      requiresIncomeProof: true,
    },
    {
      id: 'CURRENCY',
      name: 'Currency Derivatives (CDS)',
      description: 'USD-INR, EUR-INR, GBP-INR, JPY-INR currency futures & options',
      exchanges: 'NSE CDS, BSE CDS',
      icon: Globe,
      requiresIncomeProof: true,
    },
    {
      id: 'COMMODITY',
      name: 'Commodity Derivatives (MCX)',
      description: 'Gold, Silver, Crude Oil, Natural Gas, Base Metals on MCX',
      exchanges: 'MCX, NSE COM',
      icon: Coins,
      requiresIncomeProof: true,
    },
  ];

  const handleAction = (segment: SegmentType, type: 'ACTIVATE' | 'DEACTIVATE') => {
    setSelectedSegment(segment);
    setActionType(type);
    setRiskAcknowledged(false);
    setSelectedFile(null);
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSegment) return;

    onToggleSegment(selectedSegment, actionType === 'ACTIVATE');
    setSuccess(
      actionType === 'ACTIVATE'
        ? `${selectedSegment} segment activation request submitted with income proof! Pending compliance verification.`
        : `${selectedSegment} segment has been deactivated as requested.`
    );

    setTimeout(() => {
      setSelectedSegment(null);
      setSuccess('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Segment Management</h2>
              <p className="text-xs text-slate-400">Activate or deactivate exchange trading segments</p>
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

          {!selectedSegment ? (
            <div className="space-y-3">
              {segmentsConfig.map((item) => {
                const Icon = item.icon;
                const isActive = activeSegments.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{item.name}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                          Exchanges: {item.exchanges}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isActive ? (
                        item.id !== 'EQUITY' && (
                          <button
                            onClick={() => handleAction(item.id, 'DEACTIVATE')}
                            className="px-2.5 py-1 rounded bg-slate-700 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 text-xs font-medium transition-colors"
                          >
                            Deactivate
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleAction(item.id, 'ACTIVATE')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Activation / Deactivation Form */
            <form onSubmit={handleConfirmAction} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="font-bold text-white text-sm">
                  {actionType === 'ACTIVATE' ? 'Activate' : 'Deactivate'} {selectedSegment} Segment
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSegment(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {actionType === 'ACTIVATE' && (
                <>
                  {/* SEBI High Risk Disclosure */}
                  <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-3 text-amber-200/90 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>SEBI Risk Disclosure on Derivatives (F&O & CDS)</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      9 out of 10 individual traders in equity Futures and Options Segment incurred net losses.
                      Over and above the net trading losses, loss-makers expended an additional 28% of net trading losses as transaction costs.
                    </p>
                  </div>

                  {/* Document upload for F&O / Currency / Commodity */}
                  <div>
                    <label className="text-slate-300 block mb-1.5 font-medium">
                      Upload Financial Income Proof (Bank statement 6 months / Salary slip / ITR-V)
                    </label>
                    <div className="border border-slate-700 rounded-xl p-3 bg-slate-800/60 flex items-center justify-between">
                      <span className="text-slate-400 truncate max-w-xs">
                        {selectedFile ? selectedFile.name : 'Select file (PDF/JPG up to 5MB)'}
                      </span>
                      <input
                        type="file"
                        id="segment-income-file"
                        className="hidden"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <label
                        htmlFor="segment-income-file"
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-emerald-400 font-medium cursor-pointer"
                      >
                        Browse File
                      </label>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={riskAcknowledged}
                      onChange={(e) => setRiskAcknowledged(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
                    />
                    <span className="text-slate-300 leading-snug">
                      I have read, understood, and accept the SEBI Risk Disclosure document for trading derivatives.
                    </span>
                  </label>
                </>
              )}

              {actionType === 'DEACTIVATE' && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-300">
                  <p>
                    Deactivating this segment will prevent placing new orders in {selectedSegment}. Ensure you have no open positions in this segment before confirming.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <FileCheck className="w-4 h-4" />
                <span>Confirm {actionType === 'ACTIVATE' ? 'Activation Request' : 'Deactivation'}</span>
              </button>
            </form>
          )}
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
