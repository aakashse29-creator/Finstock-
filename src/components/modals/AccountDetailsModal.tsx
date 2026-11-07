import React from 'react';
import { X, CheckCircle, Shield, Copy, Edit3, Calendar, MapPin, User, FileText, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types';
import { maskAadhaar, maskMobile, maskEmail } from '../../utils/formatters';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onRequestChange: (type: string) => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onRequestChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Account & Personal Details</h2>
              <p className="text-xs text-slate-400">KYC-verified profile under SEBI & PMLA regulations</p>
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Verification Badge Banner */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-300">Full KYC Verified Account</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  SEBI Compliant
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Verified on {profile.kycVerifiedDate} via DigiLocker e-KYC. All records are encrypted at rest with AES-256.
              </p>
            </div>
          </div>

          {/* Primary Identity Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Primary Demat & Client Identity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Unique Client Code (UCC)</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white tracking-wide">{profile.ucc}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">NSE/BSE</span>
                </div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Permanent Account Number (PAN)</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white font-mono">{profile.pan}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">Verified</span>
                </div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">CDSL Depository ID (DP ID)</span>
                <span className="text-sm font-bold text-white font-mono">{profile.dpId}</span>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block mb-1">Beneficiary Owner ID (BO ID)</span>
                <span className="text-sm font-bold text-white font-mono">{profile.boId}</span>
              </div>
            </div>
          </div>

          {/* Contact Details with Modification Requests */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Contact & Authentication Credentials
            </h3>
            <div className="space-y-2.5">
              {/* Mobile */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block">Registered Mobile Number</span>
                  <span className="text-sm font-medium text-white font-mono">{maskMobile(profile.mobile)}</span>
                </div>
                <button
                  onClick={() => onRequestChange('MOBILE')}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update</span>
                </button>
              </div>

              {/* Email */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block">Registered Email Address</span>
                  <span className="text-sm font-medium text-white">{maskEmail(profile.email)}</span>
                </div>
                <button
                  onClick={() => onRequestChange('EMAIL')}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update</span>
                </button>
              </div>

              {/* Aadhaar Reference */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Masked Aadhaar Number</span>
                  <span className="text-sm font-medium text-white font-mono">{profile.maskedAadhaar}</span>
                </div>
                <span className="text-xs text-slate-400">UIDAI e-KYC Linked</span>
              </div>
            </div>
          </div>

          {/* Personal & Financial Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Personal & Regulatory Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                <span className="text-white font-medium">{profile.dob}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Gender & Marital Status</span>
                <span className="text-white font-medium">{profile.gender} • {profile.maritalStatus}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 block mb-0.5">Annual Income Slab</span>
                  <button
                    onClick={() => onRequestChange('INCOME_OCCUPATION')}
                    className="text-emerald-400 hover:underline text-[11px]"
                  >
                    Upgrade
                  </button>
                </div>
                <span className="text-white font-medium">{profile.annualIncome}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Occupation</span>
                <span className="text-white font-medium">{profile.occupation}</span>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Permanent Registered Address
                </span>
                <button
                  onClick={() => onRequestChange('ADDRESS')}
                  className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-emerald-400 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Change Address</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {profile.address.line1}, {profile.address.line2}, {profile.address.city}, {profile.address.state} - {profile.address.pincode}, {profile.address.country}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
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
