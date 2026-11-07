import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { BankAccount } from '../../types';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryBank: BankAccount;
  availableFunds: number;
  onAddFundsSuccess: (amount: number, method: string, referenceId: string) => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  primaryBank,
  availableFunds,
  onAddFundsSuccess,
}) => {
  const [amount, setAmount] = useState<number>(10000);
  const [paymentMethod, setPaymentMethod] = useState<'UPI_INTENT' | 'UPI_ID' | 'NET_BANKING'>('UPI_INTENT');
  const [upiApp, setUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM'>('GPAY');
  const [customUpiId, setCustomUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnRef, setTxnRef] = useState('');

  if (!isOpen) return null;

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    const ref = `TXN${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTxnRef(ref);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);

      const methodLabel =
        paymentMethod === 'UPI_INTENT'
          ? `UPI (${upiApp})`
          : paymentMethod === 'UPI_ID'
          ? `UPI ID (${customUpiId || 'user@upi'})`
          : `Net Banking (${primaryBank.bankName})`;

      onAddFundsSuccess(amount, methodLabel, ref);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Add Funds (Instant Payin)</h2>
              <p className="text-[11px] text-slate-400">Zero charges on UPI and Net Banking deposits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDeposit} className="p-5 space-y-4 text-xs">
          {success ? (
            <div className="p-6 text-center space-y-2 bg-emerald-950/40 rounded-xl border border-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Funds Deposited Successfully!</h3>
              <p className="text-xs text-slate-300">
                {formatCurrency(amount)} credited instantly to trading balance.
              </p>
              <span className="font-mono text-[11px] text-slate-400 block mt-1">
                Bank Ref: {txnRef}
              </span>
            </div>
          ) : (
            <>
              {/* Linked Bank Verification Indicator */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white block text-xs">{primaryBank.bankName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      A/C: {primaryBank.accountNumberMasked} · IFSC: {primaryBank.ifsc}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified
                </span>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-slate-400 block mb-1.5 font-medium">Enter Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="200000"
                    step="100"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                </div>

                {/* Quick Amount Chips */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors border shrink-0 ${
                        amount === q
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      +{formatCurrency(q)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-slate-400 block font-medium">Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI_INTENT')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === 'UPI_INTENT'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="font-bold block text-[11px]">UPI App</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI_ID')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === 'UPI_ID'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span className="font-bold block text-[11px]">UPI ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NET_BANKING')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === 'NET_BANKING'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                    <span className="font-bold block text-[11px]">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* UPI App Specific Choices */}
              {paymentMethod === 'UPI_INTENT' && (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'GPAY', label: 'GPay' },
                    { id: 'PHONEPE', label: 'PhonePe' },
                    { id: 'PAYTM', label: 'Paytm' },
                    { id: 'BHIM', label: 'BHIM' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id as any)}
                      className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                        upiApp === app.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>
              )}

              {paymentMethod === 'UPI_ID' && (
                <div>
                  <label className="text-slate-400 block mb-1">Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    placeholder="e.g. mobile@okhdfcbank"
                    value={customUpiId}
                    onChange={(e) => setCustomUpiId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* SEBI Compliance Notice */}
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Per SEBI rules, payins from unlinked or third-party bank accounts will be automatically rejected by the clearing corporation and refunded within 48 hours.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <span>{isProcessing ? 'Verifying with NPCI / Bank...' : `Pay ${formatCurrency(amount)} Instantly`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
