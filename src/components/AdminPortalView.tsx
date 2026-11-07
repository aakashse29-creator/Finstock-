import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  UserCheck,
  FileText,
  AlertTriangle,
  Clock,
  Search,
  Users,
  MessageSquare,
  Lock,
  ChevronRight,
  RefreshCw,
  Archive,
  ArrowRight,
} from 'lucide-react';
import { ProfileChangeRequest, SupportTicket, AdminUser } from '../types';
import { adminUsers } from '../data/mockData';

interface AdminPortalViewProps {
  changeRequests: ProfileChangeRequest[];
  onApproveChangeRequest: (id: string, checkerId: string) => void;
  onRejectChangeRequest: (id: string, checkerId: string, reason: string) => void;
  tickets: SupportTicket[];
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  changeRequests,
  onApproveChangeRequest,
  onRejectChangeRequest,
  tickets,
}) => {
  const [selectedRole, setSelectedRole] = useState<AdminUser>(adminUsers[1]); // Default to Operations Checker
  const [activeQueue, setActiveQueue] = useState<
    'CHANGE_REQUESTS' | 'KYC_QUEUE' | 'SUPPORT_TICKETS' | 'COMPLAINTS_SLA' | 'REPORT_JOBS' | 'USER_LOOKUP' | 'KILL_SWITCH' | 'RECON_AUDIT'
  >('CHANGE_REQUESTS');

  // Phase 10 Safeguards & Kill Switches
  const [globalKillSwitch, setGlobalKillSwitch] = useState(false);
  const [fnoHalt, setFnoHalt] = useState(false);
  const [equityHalt, setEquityHalt] = useState(false);
  const [killSwitchReason, setKillSwitchReason] = useState('');
  const [hashChainVerified, setHashChainVerified] = useState<boolean | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<ProfileChangeRequest | null>(changeRequests[0] || null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [revealedPii, setRevealedPii] = useState<Record<string, boolean>>({});
  const [auditLog, setAuditLog] = useState<{ id: string; user: string; action: string; time: string }[]>([
    { id: 'aud_1', user: 'Harish Mehta (Compliance)', action: 'Reviewed and certified DPDP consent audit log', time: '10:45 AM' },
    { id: 'aud_2', user: 'Ramesh K (Maker)', action: 'Drafted Mobile change request cr_001 for UCC FIN8829104', time: '09:30 AM' },
  ]);

  const handleApprove = (req: ProfileChangeRequest) => {
    // Check maker-checker rule: maker cannot approve their own change
    if (req.makerId === selectedRole.id) {
      alert(`Maker-Checker Violation: You are logged in as Maker (${selectedRole.name}). Only a distinct Checker (e.g. Operations Checker) can approve this request.`);
      return;
    }

    onApproveChangeRequest(req.id, selectedRole.id);
    setActionSuccess(`Request ${req.id} (${req.title}) approved by ${selectedRole.name}. Audit log entry recorded.`);
    setAuditLog((prev) => [
      {
        id: `aud_${Date.now()}`,
        user: selectedRole.name,
        action: `Approved change request ${req.id} for UCC FIN8829104`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleRejectConfirm = () => {
    if (!selectedRequest) return;
    if (selectedRequest.makerId === selectedRole.id) {
      alert('Maker-Checker Violation: Maker cannot sign off on rejection/approval.');
      return;
    }

    onRejectChangeRequest(selectedRequest.id, selectedRole.id, rejectReason || 'Documents mismatch');
    setShowRejectModal(false);
    setActionSuccess(`Request ${selectedRequest.id} rejected. Reason logged: ${rejectReason || 'Documents mismatch'}`);
    setRejectReason('');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const toggleRevealPii = (key: string) => {
    const next = !revealedPii[key];
    setRevealedPii((prev) => ({ ...prev, [key]: next }));
    if (next) {
      setAuditLog((prev) => [
        {
          id: `aud_${Date.now()}`,
          user: selectedRole.name,
          action: `REVEAL_PII: Viewed unmasked personal details for ${key} (Reason: KYC Verification Audit)`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5 pb-24 text-xs">
      {/* Admin Top Bar */}
      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Finstock Back-Office Admin Console</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Maker-Checker Enforced
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Role-based access control, statutory document inspector & audit trailing
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Active Staff Role:</span>
          <select
            value={selectedRole.id}
            onChange={(e) => {
              const found = adminUsers.find((u) => u.id === e.target.value);
              if (found) setSelectedRole(found);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-emerald-400 focus:outline-none"
          >
            {adminUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Queue Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-xl px-4 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
        {[
          { id: 'CHANGE_REQUESTS', label: `Profile Changes (${changeRequests.filter((c) => c.status === 'UNDER_REVIEW').length})` },
          { id: 'KYC_QUEUE', label: 'KYC Verification Queue (0)' },
          { id: 'SUPPORT_TICKETS', label: `Support Tickets (${tickets.length})` },
          { id: 'COMPLAINTS_SLA', label: 'Grievance SLA Monitor' },
          { id: 'REPORT_JOBS', label: 'Report Generation Jobs' },
          { id: 'USER_LOOKUP', label: 'User Lookup & Masked PII' },
          { id: 'KILL_SWITCH', label: 'Emergency Kill Switches' },
          { id: 'RECON_AUDIT', label: 'Reconciliation & Invariants' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveQueue(tab.id as any)}
            className={`py-3 px-3.5 font-semibold border-b-2 transition-all ${
              activeQueue === tab.id
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* QUEUE 1: CHANGE REQUESTS (MAKER-CHECKER) */}
      {activeQueue === 'CHANGE_REQUESTS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* List of Requests */}
          <div className="md:col-span-1 space-y-2.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Pending Authorization Queue
            </span>
            {changeRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedRequest?.id === req.id
                    ? 'bg-slate-800 border-cyan-500/60 shadow'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">{req.title}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                      req.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : req.status === 'UNDER_REVIEW'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span>Req ID: <strong className="text-slate-300 font-mono">{req.id}</strong></span>
                  <span className="block mt-0.5 truncate text-slate-300">New: {req.newValue}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Request Inspector & Decision Panel */}
          {selectedRequest && (
            <div className="md:col-span-2 bg-slate-800/50 p-5 rounded-2xl border border-slate-700/70 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedRequest.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Reference: {selectedRequest.id} • UCC: FIN8829104 (Aakash Sharma)
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedRequest.status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>

              {/* Comparison Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                    Existing Record in Master DB
                  </span>
                  <span className="text-slate-300 font-mono break-all">{selectedRequest.oldValue}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80">
                  <span className="text-emerald-400 text-[10px] uppercase font-bold block mb-1">
                    Requested New Value
                  </span>
                  <span className="text-emerald-300 font-mono font-semibold break-all">
                    {selectedRequest.newValue}
                  </span>
                </div>
              </div>

              {/* Attached Supporting Documents */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300 block text-xs">Uploaded KYC Proof Document:</span>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-white">
                      {selectedRequest.documents[0]?.name || 'Supporting_Proof.pdf'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({selectedRequest.documents[0]?.size || '480 KB'})
                    </span>
                  </div>
                  <button
                    onClick={() => alert('Opening encrypted document viewer (AES-256 decrypted in-memory stream)...')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 text-xs font-semibold"
                  >
                    View Document
                  </button>
                </div>
              </div>

              {/* Maker-Checker Workflow Audit */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 text-[11px] text-slate-400 space-y-1">
                <div>
                  Maker Staff ID: <strong className="text-slate-200">{selectedRequest.makerId || 'Not Assigned'}</strong>
                </div>
                <div>
                  Checker Staff ID: <strong className="text-slate-200">{selectedRequest.checkerId || 'Pending Checker'}</strong>
                </div>
                {selectedRequest.requiresCoolingOff && (
                  <div className="text-amber-400 font-medium">
                    • 24-Hour statutory cooling-off rule will be triggered automatically upon checker approval.
                  </div>
                )}
              </div>

              {/* Decision Actions */}
              {selectedRequest.status === 'UNDER_REVIEW' && (
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/60">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 bg-rose-900/30 hover:bg-rose-900/50 border border-rose-700/50 text-rose-300 font-bold rounded-xl text-xs transition-colors"
                  >
                    Reject with Reason
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize as Checker</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* QUEUE 2: SUPPORT TICKETS & CHAT */}
      {activeQueue === 'SUPPORT_TICKETS' && (
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Customer Support Queue (Active Tickets)</span>
            <span className="text-slate-400 text-xs">Assigned Agent: Vikram Joshi</span>
          </div>
          <div className="space-y-2">
            {tickets.map((t) => (
              <div key={t.id} className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{t.ticketNumber}</span>
                    <span className="text-white font-semibold">{t.subject}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Category: {t.category} • Client: FIN8829104 • SLA: {new Date(t.slaDeadline).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Opening ticket reply thread for ${t.ticketNumber}`)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-emerald-400 text-xs font-semibold"
                >
                  Reply & Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUEUE 3: USER LOOKUP & AUDIT TRAIL */}
      {activeQueue === 'USER_LOOKUP' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
            <h3 className="font-bold text-white text-sm">User Lookup with PII Protection & Reasoned Reveal</h3>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Client UCC: FIN8829104 • Name: Aakash Sharma</span>
                <button
                  onClick={() => toggleRevealPii('Aakash Sharma')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 text-xs font-medium flex items-center gap-1.5"
                >
                  {revealedPii['Aakash Sharma'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{revealedPii['Aakash Sharma'] ? 'Mask PII' : 'Reveal Unmasked (Audit Logged)'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Mobile</span>
                  <span className="font-mono text-white">
                    {revealedPii['Aakash Sharma'] ? '+91 98765 43421' : '+91 98*** **421'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Email</span>
                  <span className="text-white">
                    {revealedPii['Aakash Sharma'] ? 'aakashse29@gmail.com' : 'aa****@gmail.com'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PAN</span>
                  <span className="font-mono text-white">
                    {revealedPii['Aakash Sharma'] ? 'ABCDE1234F' : 'ABCDE****F'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Aadhaar</span>
                  <span className="font-mono text-white">
                    {revealedPii['Aakash Sharma'] ? '1234 5678 8921' : 'XXXX-XXXX-8921'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <span className="font-bold text-white text-xs block uppercase tracking-wider">
              Immutable Admin Action Audit Log
            </span>
            <div className="divide-y divide-slate-800 text-[11px] text-slate-300">
              {auditLog.map((log) => (
                <div key={log.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-cyan-400">{log.user}: </span>
                    <span>{log.action}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUEUE 7: EMERGENCY KILL SWITCHES & SAFEGUARDS */}
      {activeQueue === 'KILL_SWITCH' && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">Emergency OMS/RMS Safeguards & Kill Switches</h3>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Regulated breaker mechanisms to instantly halt trade routing, trip segment circuits, or throttle rogue order velocities. Every state change requires authorized dual-signature logging.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Global Kill Switch */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-sm">Global Trading Kill Switch</span>
                  <span className="text-xs text-slate-400">Rejects all new inbound orders across all clients and segments</span>
                </div>
                <button
                  onClick={() => {
                    if (!globalKillSwitch) {
                      const reason = prompt('Provide mandatory incident / audit justification for tripping Global Kill Switch:');
                      if (!reason) return;
                      setGlobalKillSwitch(true);
                      setAuditLog((prev) => [
                        { id: `aud_${Date.now()}`, user: selectedRole.name, action: `GLOBAL KILL SWITCH TRIPPED: "${reason}"`, time: new Date().toLocaleTimeString() },
                        ...prev,
                      ]);
                      setActionSuccess(`CRITICAL: Global Kill Switch ACTIVATED by ${selectedRole.name}. Inbound orders halted.`);
                    } else {
                      setGlobalKillSwitch(false);
                      setAuditLog((prev) => [
                        { id: `aud_${Date.now()}`, user: selectedRole.name, action: `Global Kill Switch disengaged after post-incident review`, time: new Date().toLocaleTimeString() },
                        ...prev,
                      ]);
                      setActionSuccess('Global Kill Switch DISENGAGED. Normal trading resumed.');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    globalKillSwitch
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-700 text-slate-300 hover:bg-rose-900 hover:text-white'
                  }`}
                >
                  {globalKillSwitch ? 'TRIPPED (ACTIVE)' : 'STANDBY (OFF)'}
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                Status: {globalKillSwitch ? <span className="text-rose-400 font-bold">ALL EXCHANGES HALTED</span> : <span className="text-emerald-400">NORMAL ROUTING ACTIVE</span>}
              </div>
            </div>

            {/* F&O Segment Circuit Breaker */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-sm">F&O Derivatives Breaker</span>
                  <span className="text-xs text-slate-400">Halts Nifty/BankNifty index and stock option order flow</span>
                </div>
                <button
                  onClick={() => {
                    setFnoHalt(!fnoHalt);
                    setAuditLog((prev) => [
                      { id: `aud_${Date.now()}`, user: selectedRole.name, action: `F&O segment breaker toggled to ${!fnoHalt}`, time: new Date().toLocaleTimeString() },
                      ...prev,
                    ]);
                    setActionSuccess(`F&O segment breaker updated.`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    fnoHalt ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-amber-900'
                  }`}
                >
                  {fnoHalt ? 'HALTED' : 'ACTIVE'}
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                Segment State: {fnoHalt ? <span className="text-amber-400 font-bold">F&O TRADING SUSPENDED</span> : <span className="text-emerald-400">DERIVATIVES ORDER ROUTING OK</span>}
              </div>
            </div>

            {/* Fat-Finger & Velocity Parameters */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <span className="font-bold text-white text-xs block uppercase tracking-wider">Automated Safeguard Limits</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Max Inbound Rate Limit:</span>
                  <span className="font-mono text-emerald-400 font-bold">30 orders/sec / user</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Fat-Finger Circuit Filter:</span>
                  <span className="font-mono text-emerald-400 font-bold">±10% from LTP</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>High-Value Withdrawal Step-Up:</span>
                  <span className="font-mono text-emerald-400 font-bold">₹50,000 (Requires TOTP/MPIN)</span>
                </div>
              </div>
            </div>

            {/* Mock Mode Production Lockdown */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <span className="font-bold text-white text-xs block uppercase tracking-wider">Production Environment Lockdown</span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Active Profile:</span>
                  <span className="font-mono text-cyan-400 font-bold">Development / Staging Demo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Production Mock Blocker:</span>
                  <span className="font-mono text-emerald-400 font-bold">Armed (Fails boot if prod)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE 8: RECONCILIATION & INVARIANTS AUDIT */}
      {activeQueue === 'RECON_AUDIT' && (
        <div className="space-y-4">
          <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">Start-of-Day & End-of-Day Reconciliation Dashboard</h3>
              <p className="text-xs text-cyan-200/80 mt-0.5">
                Automated continuous reconciliation between Exchange Trade Files, Double-Entry Ledger, CDSL Depository Holding Snapshots, and Banking Penny-Drop settlement balances.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">Ledger Double-Entry Balance</div>
              <div className="text-base font-bold text-emerald-400 mt-1">₹0.00 Discrepancy</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Debits equal Credits across 2,419 journal entries</div>
            </div>
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">CDSL DP Holding Reconciliation</div>
              <div className="text-base font-bold text-emerald-400 mt-1">100% Reconciled</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Settled lots match CDSL point-in-time snapshot</div>
            </div>
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">Contract Note Charges Audit</div>
              <div className="text-base font-bold text-emerald-400 mt-1">100% Matched</div>
              <div className="text-[10px] text-slate-400 mt-0.5">STT, Stamp Duty, GST match ledger postings</div>
            </div>
          </div>

          {/* Cryptographic Hash Chain Verifier */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-xs block uppercase tracking-wider">
                  Tamper-Evident Audit Log Cryptographic Hash-Chain
                </span>
                <span className="text-slate-400 text-[11px]">
                  Verifies SHA-256 block continuity across all admin, money, and KYC actions.
                </span>
              </div>
              <button
                onClick={() => {
                  setHashChainVerified(true);
                  setActionSuccess('Audit hash-chain integrity verified: All 1,844 blocks continuous with 0 tamper detected.');
                }}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition"
              >
                Verify Hash Chain
              </button>
            </div>

            {hashChainVerified && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Verification Succeeded: Genesis block to Head block #1844 verified. SHA-256 hashes match. Zero hash mismatches.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-2xl">
            <h3 className="font-bold text-white text-sm">Reject Profile Change Request</h3>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide regulatory justification for rejection (e.g. proof document unreadable or name mismatch)..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
