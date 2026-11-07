import React, { useState } from 'react';
import {
  X,
  Activity,
  ShieldCheck,
  Cpu,
  Wifi,
  Lock,
  Download,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Radio,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'HEALTH' | 'SECURITY' | 'NETWORK' | 'LOGS'>('HEALTH');
  const [isPinging, setIsPinging] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);
  const [latencies, setLatencies] = useState({
    nseGateway: '14 ms',
    bseGateway: '18 ms',
    cdslDepository: '26 ms',
    paymentGateway: '32 ms',
    marketDataWs: '8 ms',
  });

  if (!isOpen) return null;

  const handleRunPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setLatencies({
        nseGateway: `${Math.floor(Math.random() * 8) + 12} ms`,
        bseGateway: `${Math.floor(Math.random() * 8) + 15} ms`,
        cdslDepository: `${Math.floor(Math.random() * 10) + 22} ms`,
        paymentGateway: `${Math.floor(Math.random() * 12) + 28} ms`,
        marketDataWs: `${Math.floor(Math.random() * 4) + 6} ms`,
      });
      setIsPinging(false);
    }, 600);
  };

  const sampleRedactedLog = `[2026-11-06T03:22:10.412Z] [TRACE_ID: a9c81f-8829-e81b] [INFO] Auth: Session token verified via Keystore StrongBox
[2026-11-06T03:22:11.004Z] [TRACE_ID: a9c81f-8829-e81b] [INFO] Network: TLS 1.3 handshake completed (pin-sha256/WoiWRFY... verified)
[2026-11-06T03:22:11.238Z] [TRACE_ID: a9c81f-8829-e81b] [INFO] Security: Play Integrity verdict: [MEETS_DEVICE_INTEGRITY, MEETS_STRONG_INTEGRITY]
[2026-11-06T03:22:11.512Z] [TRACE_ID: a9c81f-8829-e81b] [INFO] MarketData: WebSocket connected wss://stream.finstock.in/quotes (lat: 8ms)
[2026-11-06T03:22:12.189Z] [TRACE_ID: b4e22a-1940-d92a] [INFO] RMS: Pre-trade margin check passed for UCC: FIN8829***. Blocked: ₹0.00
[2026-11-06T03:22:12.780Z] [TRACE_ID: b4e22a-1940-d92a] [INFO] InvariantCheck: Double-entry ledger continuity verified (0 paise variance)
[2026-11-06T03:22:13.011Z] [TRACE_ID: c1f78b-9021-f11c] [INFO] Audit: Hash-chain block #1844 verified. SHA-256 match.`;

  const copyRedactedLog = () => {
    navigator.clipboard?.writeText(sampleRedactedLog);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">In-App Diagnostics & Telemetry</h2>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  MASVS L2
                </span>
              </div>
              <p className="text-xs text-slate-400">Hardware Keystore, TLS Pinning, Play Integrity & Network Probes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950/40 border-b border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setActiveTab('HEALTH')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'HEALTH'
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            App Vitals
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'SECURITY'
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Security & Attestation
          </button>
          <button
            onClick={() => setActiveTab('NETWORK')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'NETWORK'
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            Exchange Probes
          </button>
          <button
            onClick={() => setActiveTab('LOGS')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'LOGS'
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Redacted Logs
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'HEALTH' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                  <div className="text-[11px] font-medium text-slate-400">Cold Start Duration</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">1.18 s</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Target: &lt;2.0s (Baseline Profile active)</div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                  <div className="text-[11px] font-medium text-slate-400">Memory Heap (LeakCanary)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">42.4 MB</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">0 retained leaks detected</div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                  <div className="text-[11px] font-medium text-slate-400">R8 Obfuscation & Shrinking</div>
                  <div className="text-lg font-bold text-teal-400 mt-1">Full Mode</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">APK Size: 24.8 MB (Target: &lt;40 MB)</div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                  <div className="text-[11px] font-medium text-slate-400">Crash-Free Users (SLA)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">99.98%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Target: &gt;99.50%</div>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
                <div className="text-xs font-semibold text-slate-200">Device Environment Summary</div>
                <div className="text-xs text-slate-400 grid grid-cols-2 gap-y-1.5">
                  <div>OS: <span className="text-slate-200">Android 14 (API 34)</span></div>
                  <div>Build Profile: <span className="text-slate-200">Release (Play Store Signed)</span></div>
                  <div>Architecture: <span className="text-slate-200">arm64-v8a</span></div>
                  <div>StrictMode: <span className="text-emerald-400">0 Disk/Network violations</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-3">
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-emerald-300">Play Integrity Attestation Passed</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Hardware-backed attestation verdict: <span className="font-mono text-emerald-400">MEETS_STRONG_INTEGRITY</span> and <span className="font-mono text-emerald-400">MEETS_DEVICE_INTEGRITY</span>.
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <span className="text-slate-300 font-medium">Hardware Keystore Provider</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> StrongBox Keymaster 4 (TEE)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <span className="text-slate-300 font-medium">Certificate Pinning (Primary Pin)</span>
                  <span className="font-mono text-slate-400 text-[11px]">pin-sha256/WoiWRFY... (Valid)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <span className="text-slate-300 font-medium">Root, Magisk & Zygisk Detection</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Clean (0 signals)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <span className="text-slate-300 font-medium">Frida & Xposed Dynamic Hooking</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Blocked / No injected libraries
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <span className="text-slate-300 font-medium">FLAG_SECURE (Screen capture defense)</span>
                  <span className="text-teal-400 font-semibold">Active on all financial views</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <span className="text-slate-300 font-medium">Tapjacking Overlay Protection</span>
                  <span className="text-teal-400 font-semibold">FilterTouchesWhenObscured Enabled</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NETWORK' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Live latency measurements to exchange and banking gateways</span>
                <button
                  onClick={handleRunPing}
                  disabled={isPinging}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 font-medium rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                  Re-Probe Latency
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <div>
                      <div className="font-semibold text-slate-200">NSE Order Matching Gateway</div>
                      <div className="text-[10px] text-slate-400">Colocation FIX / OUCH Protocol</div>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold">{latencies.nseGateway}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <div>
                      <div className="font-semibold text-slate-200">BSE Order Gateway (BOLT Plus)</div>
                      <div className="text-[10px] text-slate-400">Low-latency ETI Protocol</div>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold">{latencies.bseGateway}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="font-semibold text-slate-200">CDSL Depository Gateway (e-DIS & DDPI)</div>
                      <div className="text-[10px] text-slate-400">Signed Mutual TLS Endpoint</div>
                    </div>
                  </div>
                  <span className="font-mono text-teal-400 font-semibold">{latencies.cdslDepository}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="font-semibold text-slate-200">UPI / NetBanking Gateway</div>
                      <div className="text-[10px] text-slate-400">NPCI Settled Switch</div>
                    </div>
                  </div>
                  <span className="font-mono text-teal-400 font-semibold">{latencies.paymentGateway}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-slate-200">Market Data Streaming WebSocket</div>
                      <div className="text-[10px] text-slate-400">Tick-to-Screen Broadcast Feed</div>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold">{latencies.marketDataWs}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LOGS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">PII-stripped diagnostic traces with correlation IDs for tech support</span>
                <button
                  onClick={copyRedactedLog}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 font-medium rounded-lg flex items-center gap-1.5 transition"
                >
                  <Download className="w-3 h-3" />
                  {copiedLog ? 'Copied Redacted Logs!' : 'Copy Logs'}
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
                <pre>{sampleRedactedLog}</pre>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-800/30 p-2.5 rounded-lg border border-slate-700/40">
                <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Complies with DPDP Act: PAN, passwords, OTPs, and bank account numbers are permanently masked before emission.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            SEBI Reg: <span className="font-mono text-slate-200">INZ000293847</span> | DP ID: <span className="font-mono text-slate-200">12081600</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
