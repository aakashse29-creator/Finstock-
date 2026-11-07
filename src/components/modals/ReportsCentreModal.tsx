import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Mail,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Lock,
  ArrowRight,
  Filter,
  Eye,
  FileSpreadsheet,
  Archive,
  Clock,
} from 'lucide-react';
import { ContractNote, LedgerEntry, UserProfile } from '../../types';
import { formatCurrency, derivePdfPassword } from '../../utils/formatters';

interface ReportsCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  contractNotes: ContractNote[];
  ledgerEntries: LedgerEntry[];
}

export const ReportsCentreModal: React.FC<ReportsCentreModalProps> = ({
  isOpen,
  onClose,
  profile,
  contractNotes,
  ledgerEntries,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<
    'CONTRACT_NOTES' | 'LEDGER' | 'PNL' | 'TRADEBOOK' | 'HOLDINGS_DP' | 'TAX_ZIP' | 'MY_DOWNLOADS'
  >('CONTRACT_NOTES');

  const [selectedNote, setSelectedNote] = useState<ContractNote | null>(contractNotes[0] || null);
  const [emailSentToast, setEmailSentToast] = useState('');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');

  if (!isOpen) return null;

  const pdfPassword = derivePdfPassword(profile.pan, profile.dob);

  const handleSendEmail = (reportName: string) => {
    setEmailSentToast(`Dispatched ${reportName} to ${profile.email}`);
    setTimeout(() => setEmailSentToast(''), 3000);
  };

  const handleDownload = (format: 'PDF' | 'CSV', name: string) => {
    setDownloadSuccessToast(`Downloaded ${name}.${format.toLowerCase()} successfully`);
    setTimeout(() => setDownloadSuccessToast(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Reports & Statements Centre</h2>
              <p className="text-xs text-slate-400">SEBI-compliant contract notes, tax packages & ledger audits</p>
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

        {/* PDF Password Banner */}
        <div className="bg-slate-800/80 px-6 py-2.5 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>PDF Password Hint:</strong> PAN in uppercase + Date of Birth (DDMMYYYY)
            </span>
          </div>
          <div className="bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700 font-mono text-[11px] text-emerald-400">
            {pdfPassword}
          </div>
        </div>

        {/* Toast Notifier */}
        {(emailSentToast || downloadSuccessToast) && (
          <div className="bg-emerald-950/90 border-b border-emerald-800 px-6 py-2 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{emailSentToast || downloadSuccessToast}</span>
          </div>
        )}

        {/* Sub-Tabs Nav */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 overflow-x-auto text-xs whitespace-nowrap scrollbar-none shrink-0">
          {[
            { id: 'CONTRACT_NOTES', label: 'Daily Contract Notes' },
            { id: 'LEDGER', label: 'Ledger Statement' },
            { id: 'PNL', label: 'P&L Statement' },
            { id: 'TRADEBOOK', label: 'Trade Book' },
            { id: 'HOLDINGS_DP', label: 'DP Holdings Statement' },
            { id: 'TAX_ZIP', label: 'Tax P&L Package' },
            { id: 'MY_DOWNLOADS', label: 'My Downloads' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`py-3 px-3.5 font-semibold border-b-2 transition-all ${
                activeReportTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: CONTRACT NOTES */}
          {activeReportTab === 'CONTRACT_NOTES' && (
            <div className="space-y-4">
              {/* Note Selector and Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">Select Note Date:</span>
                  <select
                    value={selectedNote?.noteNumber || ''}
                    onChange={(e) => {
                      const found = contractNotes.find((n) => n.noteNumber === e.target.value);
                      if (found) setSelectedNote(found);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {contractNotes.map((note) => (
                      <option key={note.noteNumber} value={note.noteNumber}>
                        {note.date} ({note.noteNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload('PDF', selectedNote?.noteNumber || 'Contract_Note')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownload('CSV', selectedNote?.noteNumber || 'Contract_Note')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => handleSendEmail(selectedNote?.noteNumber || 'Contract Note')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-medium flex items-center gap-1.5 border border-emerald-500/30 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email to Me</span>
                  </button>
                </div>
              </div>

              {/* Digital Signature Badge */}
              {selectedNote && (
                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">Digitally Signed Contract Note</span>
                      <span className="text-[11px] text-slate-400">
                        Signer: {selectedNote.digitalSignature.signedBy} • Timestamp: {new Date(selectedNote.digitalSignature.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    eMudhra Class 3 DSC Validated
                  </span>
                </div>
              )}

              {/* Legal Regulatory Header Info */}
              {selectedNote && (
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contract Note No</span>
                    <span className="text-white font-mono font-semibold">{selectedNote.noteNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Trade Settlement Date</span>
                    <span className="text-white font-medium">{selectedNote.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Client UCC & PAN</span>
                    <span className="text-white font-mono">{selectedNote.clientUcc} / {selectedNote.clientPan}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Exchange Settlement No</span>
                    <span className="text-white font-mono">{selectedNote.settlementNo}</span>
                  </div>
                </div>
              )}

              {/* Detailed Trades Table */}
              {selectedNote && (
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase border-b border-slate-700/60 font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">Trade / Order ID</th>
                          <th className="py-2.5 px-3">Symbol</th>
                          <th className="py-2.5 px-3">B/S</th>
                          <th className="py-2.5 px-3 text-right">Qty</th>
                          <th className="py-2.5 px-3 text-right">Price</th>
                          <th className="py-2.5 px-3 text-right">Gross Amount</th>
                          <th className="py-2.5 px-3 text-right">STT</th>
                          <th className="py-2.5 px-3 text-right">Net Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        {selectedNote.trades.map((t) => (
                          <tr key={t.tradeId} className="hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                              {t.tradeId}
                              <span className="block text-[10px] text-slate-500">{t.orderId}</span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-white">
                              {t.symbol}
                              <span className="text-[10px] text-slate-400 block font-normal">{t.exchange} • {t.segment}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  t.buyOrSell === 'BUY'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-rose-500/20 text-rose-400'
                                }`}
                              >
                                {t.buyOrSell}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono">{t.quantity}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(t.price)}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(t.grossAmount)}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-400">{formatCurrency(t.stt)}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                              {formatCurrency(t.netAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer Breakdown */}
                  <div className="bg-slate-800/60 p-4 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Brokerage:</span>
                      <span className="text-white font-mono font-semibold">{formatCurrency(selectedNote.totalBrokerage)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total STT / CTT:</span>
                      <span className="text-white font-mono font-semibold">{formatCurrency(selectedNote.totalStt)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Exchange & SEBI Charges:</span>
                      <span className="text-white font-mono font-semibold">
                        {formatCurrency(selectedNote.totalExchangeCharges + selectedNote.totalSebiFees)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Net Payable / (Receivable):</span>
                      <span className="text-emerald-400 font-mono text-sm font-bold">
                        {formatCurrency(selectedNote.netPayableOrReceivable)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LEDGER */}
          {activeReportTab === 'LEDGER' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">Financial Year:</span>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    <option value="ALL">FY 2026-27 (Current)</option>
                    <option value="PREV">FY 2025-26</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload('PDF', 'Ledger_Statement_FY26')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownload('CSV', 'Ledger_Statement_FY26')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => handleSendEmail('Ledger Statement')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-medium flex items-center gap-1.5 border border-emerald-500/30"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Statement</span>
                  </button>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase border-b border-slate-700/60 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Narration / Particulars</th>
                        <th className="py-2.5 px-3">Voucher Ref</th>
                        <th className="py-2.5 px-3 text-right">Debit (Dr)</th>
                        <th className="py-2.5 px-3 text-right">Credit (Cr)</th>
                        <th className="py-2.5 px-3 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {ledgerEntries.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-white max-w-xs">{item.narration}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{item.referenceId}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-rose-400">
                            {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-400">
                            {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                            {formatCurrency(item.runningBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PNL STATEMENT */}
          {activeReportTab === 'PNL' && (
            <div className="space-y-4">
              <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-3 text-xs text-amber-200/90">
                <strong>Statutory Tax Disclaimer:</strong> This statement is provided solely for informational and record-keeping purposes under SEBI guidelines. It does not constitute tax advice. Please consult a Chartered Accountant for ITR filing.
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 block mb-1">Realised Net Profit / (Loss)</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">+₹38,450.00</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Across 18 closed trades</span>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 block mb-1">Unrealised Open MTM</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">+₹14,200.00</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Based on latest live CMP</span>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 block mb-1">Total Trading Turnover</span>
                  <span className="text-lg font-bold text-white font-mono">₹8,20,450.00</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Section 44AB tax audit threshold</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleDownload('PDF', 'PNL_Summary_FY26')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download P&L Report</span>
                </button>
                <button
                  onClick={() => handleSendEmail('P&L Statement')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-medium flex items-center gap-1.5 border border-emerald-500/30"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send to Email</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TRADE BOOK */}
          {activeReportTab === 'TRADEBOOK' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 text-xs">
                <span className="text-slate-300">Historical trade logs retained up to 5 regulatory years.</span>
                <button
                  onClick={() => handleDownload('CSV', 'Trade_Book_5Years')}
                  className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-emerald-400 font-medium flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export All (CSV)
                </button>
              </div>
              <div className="p-8 text-center bg-slate-800/20 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">All 142 Trades Fully Reconciled</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Exchange trade execution confirmation IDs with millisecond timestamps available for immediate CSV download.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: HOLDINGS & DP */}
          {activeReportTab === 'HOLDINGS_DP' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Depository Participant Details</span>
                  <span className="text-sm font-bold text-white">Central Depository Services (India) Ltd (CDSL)</span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    DP ID: <strong>{profile.dpId}</strong> • Client ID: <strong>{profile.boId}</strong>
                  </span>
                </div>
                <button
                  onClick={() => handleDownload('PDF', 'CDSL_Demat_Statement')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download DP Statement
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: TAX P&L PACKAGE (ZIP) */}
          {activeReportTab === 'TAX_ZIP' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Archive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Comprehensive Tax P&L Package (.zip)</h3>
                    <p className="text-xs text-slate-400">Everything your CA or Tax Filing portal requires in one download</p>
                  </div>
                </div>

                <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
                  <li>Short-Term Capital Gains (STCG) Schedule with Section 111A breakdown</li>
                  <li>Long-Term Capital Gains (LTCG) Schedule with grandfathering formula</li>
                  <li>Business Income: Equity Intraday (Speculative) & F&O (Non-speculative turnover)</li>
                  <li>Complete Dividend Income Ledger schedule with TDS deductions</li>
                  <li>Full Transaction charges and brokerage ledger export</li>
                </ul>

                <button
                  onClick={() => handleDownload('ZIP' as any, 'Finstock_Tax_Package_FY26')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete Tax Package (ZIP)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: MY DOWNLOADS */}
          {activeReportTab === 'MY_DOWNLOADS' && (
            <div className="space-y-3">
              {[
                { name: 'Contract_Note_20261106.pdf', size: '280 KB', date: '06 Nov 2026, 06:45 PM', status: 'Ready' },
                { name: 'Tax_PNL_Package_FY2025_26.zip', size: '2.4 MB', date: '04 Nov 2026, 11:30 AM', status: 'Ready' },
                { name: 'Ledger_Statement_Oct2026.csv', size: '48 KB', date: '01 Nov 2026, 09:15 AM', status: 'Ready' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {item.size} • Generated {item.date} • Retained for 90 days
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload('PDF', item.name.replace(/\.[^/.]+$/, ''))}
                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
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
