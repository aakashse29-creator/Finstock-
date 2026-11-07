import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Plus,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Trash2,
  Star,
  RefreshCw,
  Coins,
} from 'lucide-react';
import { BankAccount } from '../../types';
import { maskBankAccount } from '../../utils/formatters';

interface BankAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccounts: BankAccount[];
  onSetPrimary: (id: string) => void;
  onAddAccount: (account: Omit<BankAccount, 'id' | 'addedAt' | 'status'>) => void;
  onDeleteAccount: (id: string) => void;
}

export const BankAccountsModal: React.FC<BankAccountsModalProps> = ({
  isOpen,
  onClose,
  bankAccounts,
  onSetPrimary,
  onAddAccount,
  onDeleteAccount,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountType, setAccountType] = useState<'SAVINGS' | 'CURRENT'>('SAVINGS');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState<'IDLE' | 'PENNY_DROP' | 'VERIFIED'>('IDLE');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerifyAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accountNumber !== confirmAccountNumber) {
      setError('Account numbers do not match.');
      return;
    }

    if (ifsc.length !== 11) {
      setError('Please enter a valid 11-character IFSC code.');
      return;
    }

    setIsVerifying(true);
    setVerifyStep('PENNY_DROP');

    // Simulate Penny Drop verification via NPCI / IMPS
    setTimeout(() => {
      setVerifyStep('VERIFIED');
      setTimeout(() => {
        onAddAccount({
          bankName: ifsc.startsWith('HDFC') ? 'HDFC Bank Ltd' : ifsc.startsWith('SBIN') ? 'State Bank of India' : 'Axis Bank Ltd',
          accountNumberMasked: accountNumber,
          accountType,
          ifsc: ifsc.toUpperCase(),
          branch: 'Main Financial Branch',
          isPrimary: bankAccounts.length === 0,
        });
        setIsVerifying(false);
        setShowAddForm(false);
        setVerifyStep('IDLE');
        setAccountNumber('');
        setConfirmAccountNumber('');
        setIfsc('');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Linked Bank Accounts</h2>
              <p className="text-xs text-slate-400">Verified for seamless pay-ins and payout transfers</p>
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
          {/* Important Notice */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              SEBI third-party payment prohibition applies: Funds can only be added or withdrawn from bank accounts registered in your name matching your PAN.
            </p>
          </div>

          {/* Accounts List */}
          {!showAddForm ? (
            <div className="space-y-3">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 rounded-xl border transition-all ${
                    account.isPrimary
                      ? 'bg-slate-800/80 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-bold text-white">{account.bankName}</span>
                      {account.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" /> Primary Account
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {account.accountType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Account Number</span>
                      <span className="text-white font-mono">{maskBankAccount(account.accountNumberMasked)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">IFSC Code</span>
                      <span className="text-slate-300 font-mono">{account.ifsc}</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-700/40 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Penny Drop Verified
                    </span>

                    <div className="flex items-center gap-2">
                      {!account.isPrimary && (
                        <button
                          onClick={() => onSetPrimary(account.id)}
                          className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
                        >
                          Make Primary
                        </button>
                      )}
                      {!account.isPrimary && bankAccounts.length > 1 && (
                        <button
                          onClick={() => onDeleteAccount(account.id)}
                          aria-label="Delete Bank Account"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Bank Account Trigger */}
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-slate-800/20"
              >
                <Plus className="w-4 h-4" />
                <span>Link Another Bank Account</span>
              </button>
            </div>
          ) : (
            /* Add Account Form with Penny-Drop */
            <form onSubmit={handleVerifyAndAdd} className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <span className="text-xs font-bold text-white">Add Bank Account Details</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Bank IFSC Code</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0000240"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Account Number</label>
                  <input
                    type="password"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter full account number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Confirm Account Number</label>
                  <input
                    type="text"
                    required
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    placeholder="Re-enter full account number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Account Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['SAVINGS', 'CURRENT'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAccountType(type)}
                        className={`py-2 rounded-lg border text-xs font-semibold ${
                          accountType === type
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verification Process Notice */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 flex items-start gap-2">
                  <Coins className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Automated Penny-Drop Verification:</span>
                    <span>₹1 will be credited to your account via IMPS to verify your registered name matches your PAN KYC before linking.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        {verifyStep === 'PENNY_DROP'
                          ? 'Depositing ₹1 via IMPS & Checking Name...'
                          : 'Account Verified! Saving...'}
                      </span>
                    </>
                  ) : (
                    <span>Verify with Penny Drop & Link Account</span>
                  )}
                </button>
              </div>
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
