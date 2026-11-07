import React, { useState } from 'react';
import {
  X,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Percent,
  FileCheck,
} from 'lucide-react';
import { Nominee } from '../../types';

interface NomineeManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominees: Nominee[];
  onUpdateNominees: (nominees: Nominee[]) => void;
}

export const NomineeManagementModal: React.FC<NomineeManagementModalProps> = ({
  isOpen,
  onClose,
  nominees,
  onUpdateNominees,
}) => {
  const [localNominees, setLocalNominees] = useState<Nominee[]>(nominees);
  const [showAddForm, setShowAddForm] = useState(false);
  const [optOut, setOptOut] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add form fields
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [sharePercentage, setSharePercentage] = useState(100);
  const [dob, setDob] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState('');

  if (!isOpen) return null;

  const totalShare = localNominees.reduce((acc, curr) => acc + curr.sharePercentage, 0);

  const handleAddNominee = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (localNominees.length >= 3) {
      setError('SEBI allows a maximum of 3 nominees per demat account.');
      return;
    }

    const newTotal = totalShare + Number(sharePercentage);
    if (newTotal > 100) {
      setError(`Total allocation would exceed 100% (currently ${totalShare}% + ${sharePercentage}% = ${newTotal}%).`);
      return;
    }

    const newNominee: Nominee = {
      id: `nom_${Date.now()}`,
      name,
      relationship,
      sharePercentage: Number(sharePercentage),
      dob,
      isMinor,
      guardianName: isMinor ? guardianName : undefined,
      status: 'VERIFIED',
      addedAt: new Date().toISOString(),
    };

    const updated = [...localNominees, newNominee];
    setLocalNominees(updated);
    setShowAddForm(false);
    setName('');
    setSharePercentage(100 - newTotal);
    setDob('');
    setIsMinor(false);
    setGuardianName('');
  };

  const handleDeleteNominee = (id: string) => {
    const updated = localNominees.filter((n) => n.id !== id);
    setLocalNominees(updated);
  };

  const handleSaveAll = () => {
    setError('');
    if (!optOut && totalShare !== 100) {
      setError(`Total nominee share must equal exactly 100%. Currently it is ${totalShare}%. Please adjust shares.`);
      return;
    }

    onUpdateNominees(optOut ? [] : localNominees);
    setSuccess('Nominee declarations successfully updated and digitally recorded.');
    setTimeout(() => {
      setSuccess('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nominee Management</h2>
              <p className="text-xs text-slate-400">Up to 3 nominees with share percentage totaling 100%</p>
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
          {/* SEBI Compliance Info */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              SEBI Circular on Nominees: Every individual demat account holder must either register nominees or submit an explicit opt-out declaration.
            </p>
          </div>

          {/* Opt-out toggle */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Opt-out of Nominee Declaration</span>
              <span className="text-[11px] text-slate-400">I declare that I do not wish to nominate anyone for this trading & demat account.</span>
            </div>
            <input
              type="checkbox"
              checked={optOut}
              onChange={(e) => setOptOut(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!optOut && (
            <>
              {/* Share Percentage Indicator Bar */}
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Total Nominee Allocation</span>
                  <span className={totalShare === 100 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {totalShare}% of 100%
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                  {localNominees.map((n, idx) => (
                    <div
                      key={n.id}
                      style={{ width: `${n.sharePercentage}%` }}
                      className={`h-full ${
                        idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-cyan-500' : 'bg-indigo-500'
                      }`}
                      title={`${n.name}: ${n.sharePercentage}%`}
                    />
                  ))}
                </div>
                {totalShare !== 100 && (
                  <span className="text-[10px] text-amber-300 block">
                    Remaining to allocate: {100 - totalShare}%
                  </span>
                )}
              </div>

              {/* List of Nominees */}
              <div className="space-y-2.5">
                {localNominees.map((n) => (
                  <div
                    key={n.id}
                    className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{n.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                          {n.relationship}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        DOB: {n.dob || '14/04/1996'} • Share:{' '}
                        <strong className="text-emerald-400">{n.sharePercentage}%</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteNominee(n.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                      aria-label="Remove Nominee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add Nominee Button */}
                {localNominees.length < 3 && !showAddForm && (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-slate-800/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Nominee ({localNominees.length}/3)</span>
                  </button>
                )}
              </div>

              {/* Add Nominee Form */}
              {showAddForm && (
                <form onSubmit={handleAddNominee} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-700">
                    <span className="font-bold text-white">Add Nominee Details</span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Nominee Full Name (as per PAN)</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 block mb-1">Relationship</label>
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Share Allocation (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        required
                        value={sharePercentage}
                        onChange={(e) => setSharePercentage(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                  >
                    Add Nominee to List
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer with Save Action */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>Confirm & e-Sign Declaration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
