import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Smartphone,
  Mail,
  MapPin,
  TrendingUp,
  FileSignature,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { ProfileChangeRequest, ChangeRequestType } from '../../types';

interface ChangeRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
  changeRequests: ProfileChangeRequest[];
  onSubmitRequest: (request: Omit<ProfileChangeRequest, 'id' | 'submittedAt' | 'updatedAt' | 'status'>) => void;
}

export const ChangeRequestsModal: React.FC<ChangeRequestsModalProps> = ({
  isOpen,
  onClose,
  initialType = 'MOBILE',
  changeRequests,
  onSubmitRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY'>('NEW');
  const [selectedType, setSelectedType] = useState<ChangeRequestType>(
    (initialType as ChangeRequestType) || 'MOBILE'
  );

  // Form states
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [oldOtp, setOldOtp] = useState('');
  const [newOtp, setNewOtp] = useState('');
  const [mpin, setMpin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType as ChangeRequestType);
    }
  }, [initialType]);

  // Set default placeholder old values based on selected type
  useEffect(() => {
    if (selectedType === 'MOBILE') setOldValue('+91 98765 43421');
    else if (selectedType === 'EMAIL') setOldValue('aakashse29@gmail.com');
    else if (selectedType === 'ADDRESS') setOldValue('Flat 402, Shivalik Residency, Indiranagar, Bengaluru');
    else if (selectedType === 'INCOME_OCCUPATION') setOldValue('₹10 Lakh - ₹25 Lakh');
    else setOldValue('Current on file');
    setNewValue('');
    setSuccessMessage('');
  }, [selectedType]);

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      let title = 'Profile Update';
      if (selectedType === 'MOBILE') title = 'Mobile Number Update';
      if (selectedType === 'EMAIL') title = 'Email Address Update';
      if (selectedType === 'ADDRESS') title = 'Permanent Address Update';
      if (selectedType === 'INCOME_OCCUPATION') title = 'Income Slab Upgrade (F&O)';
      if (selectedType === 'SIGNATURE') title = 'Specimen Signature Update';

      onSubmitRequest({
        type: selectedType,
        title,
        oldValue: oldValue || 'Previous Record',
        newValue: selectedType === 'SIGNATURE' ? 'Digital Signature Captured' : newValue,
        requiresCoolingOff: selectedType === 'MOBILE' || selectedType === 'EMAIL',
        documents: selectedFile ? [{ name: selectedFile.name, url: '#', size: '1.2 MB' }] : [],
      });

      setIsSubmitting(false);
      setSuccessMessage('Change request submitted successfully! It is now pending back-office maker/checker review.');
      setTimeout(() => {
        setActiveTab('HISTORY');
        setSuccessMessage('');
      }, 1500);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div>
            <h2 className="text-base font-bold text-white">Profile Modification & Change Requests</h2>
            <p className="text-xs text-slate-400">Maker-Checker audit workflow with cooling-off protection</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch (New Request vs History) */}
        <div className="flex border-b border-slate-800 px-6 pt-3 bg-slate-900/60">
          <button
            onClick={() => setActiveTab('NEW')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'NEW'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            New Change Request
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'HISTORY'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Request History & Tracker</span>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center font-bold">
              {changeRequests.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {activeTab === 'NEW' ? (
            <div className="space-y-5">
              {/* Type Selector Pills */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Select Request Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'MOBILE', label: 'Mobile Number', icon: Smartphone },
                    { id: 'EMAIL', label: 'Email ID', icon: Mail },
                    { id: 'ADDRESS', label: 'Address Proof', icon: MapPin },
                    { id: 'INCOME_OCCUPATION', label: 'Income Slab (F&O)', icon: TrendingUp },
                    { id: 'SIGNATURE', label: 'Draw Signature', icon: FileSignature },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedType(item.id as ChangeRequestType)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Success Notification */}
              {successMessage && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Cooling-off Notice for sensitive modifications */}
              {(selectedType === 'MOBILE' || selectedType === 'EMAIL') && (
                <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200/90">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Mandatory SEBI Security Rule:</strong> In accordance with investor protection norms, a 24-hour cooling-off window applies after changing contact details before large funds withdrawals can be processed.
                  </p>
                </div>
              )}

              {/* Interactive Form based on type */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Value Display */}
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-xs">
                  <span className="text-slate-400 block mb-0.5">Current Record on File:</span>
                  <span className="text-slate-200 font-medium">{oldValue}</span>
                </div>

                {/* Specific Fields */}
                {selectedType === 'MOBILE' && (
                  <>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">New 10-Digit Mobile Number</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-700 bg-slate-800 text-slate-400 text-xs font-mono">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="9811223344"
                          className="flex-1 bg-slate-800/80 border border-slate-700 rounded-r-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">OTP on Current Number</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={oldOtp}
                          onChange={(e) => setOldOtp(e.target.value)}
                          placeholder="6-digit OTP"
                          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">OTP on New Number</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newOtp}
                          onChange={(e) => setNewOtp(e.target.value)}
                          placeholder="6-digit OTP"
                          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedType === 'EMAIL' && (
                  <>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">New Email Address</label>
                      <input
                        type="email"
                        required
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="newemail@domain.com"
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Verification OTP sent to new email</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newOtp}
                        onChange={(e) => setNewOtp(e.target.value)}
                        placeholder="Enter 6-digit email OTP"
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </>
                )}

                {selectedType === 'ADDRESS' && (
                  <>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">New Address (as per official proof)</label>
                      <textarea
                        required
                        rows={2}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="House/Flat No, Street, Landmark, City, State, PIN code"
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">Upload Valid Address Document (Aadhaar / Passport / Utility Bill)</label>
                      <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-800/30">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                        <span className="text-xs text-slate-300 block font-medium">
                          {selectedFile ? selectedFile.name : 'Tap to select document (PDF, JPG, PNG up to 5MB)'}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">Image quality check automatically verified</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="address-proof-file"
                        />
                        <label htmlFor="address-proof-file" className="inline-block mt-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[11px] text-emerald-400 font-medium cursor-pointer">
                          Browse File
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {selectedType === 'INCOME_OCCUPATION' && (
                  <>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">Select Updated Income Range</label>
                      <select
                        required
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">-- Select Annual Gross Income --</option>
                        <option value="Below ₹1 Lakh">Below ₹1 Lakh</option>
                        <option value="₹1 Lakh - ₹5 Lakh">₹1 Lakh - ₹5 Lakh</option>
                        <option value="₹5 Lakh - ₹10 Lakh">₹5 Lakh - ₹10 Lakh</option>
                        <option value="₹10 Lakh - ₹25 Lakh">₹10 Lakh - ₹25 Lakh</option>
                        <option value="₹25 Lakh - ₹1 Crore">₹25 Lakh - ₹1 Crore</option>
                        <option value="Above ₹1 Crore">Above ₹1 Crore</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">Upload Income Proof (ITR-V / 6 Months Bank Statement / Form 16)</label>
                      <div className="border border-slate-700 rounded-xl p-3 bg-slate-800/30 flex items-center justify-between">
                        <span className="text-xs text-slate-400 truncate max-w-xs">
                          {selectedFile ? selectedFile.name : 'ITR_V_Acknowledgement_2025_26.pdf'}
                        </span>
                        <input
                          type="file"
                          id="income-doc-file"
                          className="hidden"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                        <label htmlFor="income-doc-file" className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-emerald-400 font-medium cursor-pointer">
                          Upload
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {selectedType === 'SIGNATURE' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-300 font-medium">Draw Specimen Signature on Screen</label>
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Clear Canvas
                      </button>
                    </div>
                    <div className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden touch-none relative">
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={180}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-44 cursor-crosshair block"
                      />
                      {!hasSignature && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs font-mono">
                          Sign with finger or stylus inside box
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Matches against bank specimen and depository KYC records.
                    </span>
                  </div>
                )}

                {/* Second Factor Security MPIN */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Authorize with 6-Digit MPIN</label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting || (selectedType === 'SIGNATURE' && !hasSignature)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit for Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* History & Status Tracker */
            <div className="space-y-3">
              {changeRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{req.title}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'UNDER_REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {req.status === 'UNDER_REVIEW' ? 'Under Review (Maker/Checker)' : req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Previous Value</span>
                      <span className="text-slate-300 truncate block">{req.oldValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Updated Value</span>
                      <span className="text-emerald-300 font-medium truncate block">{req.newValue}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Submitted: {new Date(req.submittedAt).toLocaleDateString()}
                    </span>
                    {req.checkerId ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                        <ShieldCheck className="w-3 h-3" />
                        Audited by {req.checkerId}
                      </span>
                    ) : (
                      <span className="text-amber-400 text-[10px]">Awaiting Checker Sign-off</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
