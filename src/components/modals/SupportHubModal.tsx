import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Search,
  MessageSquare,
  FileQuestion,
  PhoneCall,
  ShieldAlert,
  Send,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Clock,
  User,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { HelpArticle, FAQItem, SupportTicket, ChatMessage } from '../../types';
import { officialSenderIds, officialPhoneNumbers, officialEmails } from '../../data/mockData';

interface SupportHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: HelpArticle[];
  faqs: FAQItem[];
  tickets: SupportTicket[];
  onCreateTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'slaDeadline'>) => void;
}

export const SupportHubModal: React.FC<SupportHubModalProps> = ({
  isOpen,
  onClose,
  articles,
  faqs,
  tickets,
  onCreateTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'ARTICLES' | 'FAQS' | 'TICKETS' | 'CHAT' | 'VERIFY_SENDER' | 'GRIEVANCE'>('ARTICLES');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, boolean>>({});

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'bot',
      senderName: 'Finstock Assist (Bot)',
      text: 'Namaste Aakash! I am Finstock automated assistant. How can I help you today? You can choose a quick question or type below to connect with a support agent.',
      timestamp: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Ticket creation form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('REPORTS');
  const [ticketSubCategory, setTicketSubCategory] = useState('Contract Notes');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Sender verification
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ checked: boolean; isOfficial: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  // Filter articles and FAQs
  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `c_${Date.now()}`,
      sender: 'user',
      senderName: 'Aakash Sharma',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const query = chatInput;
    setChatInput('');
    setIsAgentTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsAgentTyping(false);
      let replyText =
        'Thank you for reaching out. Our support agent Vikram Joshi has received your query and is reviewing your account records.';
      if (query.toLowerCase().includes('password') || query.toLowerCase().includes('contract note')) {
        replyText =
          'Regarding Contract Notes: Your PDF password is your PAN in UPPERCASE + Date of Birth in DDMMYYYY (e.g. ABCDE1234F15081995).';
      } else if (query.toLowerCase().includes('charges') || query.toLowerCase().includes('brokerage')) {
        replyText =
          'Finstock offers ₹0 delivery brokerage. For F&O and intraday trades, it is flat ₹20 per executed order.';
      }

      const agentMsg: ChatMessage = {
        id: `c_${Date.now() + 1}`,
        sender: 'agent',
        senderName: 'Vikram Joshi (Support Specialist)',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, agentMsg]);
    }, 1200);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTicket({
      category: ticketCategory,
      subCategory: ticketSubCategory,
      subject: ticketSubject,
      status: 'OPEN',
      priority: 'MEDIUM',
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'USER',
          senderName: 'Aakash Sharma',
          timestamp: new Date().toLocaleString(),
          text: ticketMessage,
        },
      ],
    });

    setTicketSuccess('Ticket raised successfully! SLA commitment: response within 4 hours.');
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => {
      setTicketSuccess('');
      setActiveTab('TICKETS');
    }, 1500);
  };

  const handleVerifySender = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = verifyInput.trim().toUpperCase();

    const isSenderId = officialSenderIds.some((s) => s.toUpperCase() === clean);
    const isPhone = officialPhoneNumbers.some((p) => p.replace(/\s+/g, '') === verifyInput.replace(/\s+/g, ''));
    const isEmail = officialEmails.some((m) => m.toLowerCase() === verifyInput.trim().toLowerCase());

    if (isSenderId || isPhone || isEmail) {
      setVerifyResult({
        checked: true,
        isOfficial: true,
        message: `Verified: "${verifyInput}" is an official Finstock communication channel.`,
      });
    } else {
      setVerifyResult({
        checked: true,
        isOfficial: false,
        message: `Warning: "${verifyInput}" is NOT in our verified list. Beware of phishing! Never share OTP or MPIN.`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Help & Customer Support Hub</h2>
              <p className="text-xs text-slate-400">Knowledge base, Live Chat, Tickets & SCORES grievance redressal</p>
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

        {/* Security Warning Banner */}
        <div className="bg-amber-950/40 border-b border-amber-800/60 px-6 py-2 flex items-center gap-2 text-xs text-amber-300 shrink-0">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Finstock Security Notice:</strong> Our staff will NEVER ask for your OTP, MPIN, password or ask you to install remote access apps.
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 overflow-x-auto text-xs whitespace-nowrap scrollbar-none shrink-0">
          {[
            { id: 'ARTICLES', label: 'Help Articles' },
            { id: 'FAQS', label: '100+ FAQs' },
            { id: 'CHAT', label: 'Live Chat (Online)' },
            { id: 'TICKETS', label: 'My Tickets' },
            { id: 'VERIFY_SENDER', label: 'Verify Sender ID' },
            { id: 'GRIEVANCE', label: 'SCORES & Grievance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedArticle(null);
              }}
              className={`py-3 px-3.5 font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: HELP ARTICLES */}
          {activeTab === 'ARTICLES' && (
            <div className="space-y-4">
              {!selectedArticle ? (
                <>
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search knowledge base (e.g. mobile update, STT, contract notes)..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Articles Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredArticles.map((article) => (
                      <div
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="bg-slate-800/40 hover:bg-slate-800/70 p-4 rounded-xl border border-slate-700/60 cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                            {article.category}
                          </span>
                          <span className="text-slate-500">{article.readTime}</span>
                        </div>
                        <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{article.summary}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Article Reader View */
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    ← Back to All Articles
                  </button>

                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
                        {selectedArticle.category}
                      </span>
                      <span className="text-slate-400">• {selectedArticle.readTime}</span>
                      <span className="text-slate-400">• {selectedArticle.views} views</span>
                    </div>

                    <h2 className="text-base font-bold text-white">{selectedArticle.title}</h2>

                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-700/50 pt-3">
                      {selectedArticle.content}
                    </div>

                    {/* Was this helpful? */}
                    <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Was this article helpful to you?</span>
                      <button
                        onClick={() =>
                          setHelpfulFeedback((prev) => ({ ...prev, [selectedArticle.id]: true }))
                        }
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                          helpfulFeedback[selectedArticle.id]
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{helpfulFeedback[selectedArticle.id] ? 'Thank You!' : 'Yes, Helpful'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAQS */}
          {activeTab === 'FAQS' && (
            <div className="space-y-3">
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter frequently asked questions..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                {filteredFaqs.map((faq) => {
                  const isOpen = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                        className="w-full p-3.5 text-left text-xs font-bold text-white flex items-center justify-between gap-3 hover:bg-slate-800/60"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 text-xs text-slate-300 leading-relaxed border-t border-slate-700/40 pt-2.5">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE CHAT */}
          {activeTab === 'CHAT' && (
            <div className="flex flex-col h-[52vh] bg-slate-950/60 rounded-2xl border border-slate-800 overflow-hidden">
              {/* Chat Sub-Header */}
              <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-semibold text-white">Live Support Queue: #1 (Immediate response)</span>
                </div>
                <span className="text-[11px] text-slate-400">Agent: Vikram Joshi</span>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {msg.sender !== 'user' && <Bot className="w-3 h-3 text-emerald-400" />}
                      <span className="text-[10px] text-slate-500">{msg.senderName} • {msg.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAgentTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"></span>
                    <span>Support agent is typing...</span>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question or query..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: MY TICKETS */}
          {activeTab === 'TICKETS' && (
            <div className="space-y-4">
              {ticketSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{ticketSuccess}</span>
                </div>
              )}

              {/* Tickets List */}
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-emerald-400 font-bold">{t.ticketNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white">{t.subject}</h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-4">
                      <span>Category: {t.category}</span>
                      <span>SLA: {new Date(t.slaDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Raise New Ticket Form */}
              <form onSubmit={handleCreateTicketSubmit} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                <span className="font-bold text-white block">Raise a New Support Ticket</span>
                <div>
                  <label className="text-slate-300 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of the issue"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="REPORTS">Reports & Tax</option>
                      <option value="FUNDS">Funds & Pay-in</option>
                      <option value="ORDERS">Orders & Execution</option>
                      <option value="KYC">KYC & Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Sub-Category</label>
                    <input
                      type="text"
                      value={ticketSubCategory}
                      onChange={(e) => setTicketSubCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Detailed Message</label>
                  <textarea
                    rows={3}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide details and reference transaction IDs..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: VERIFY SENDER */}
          {activeTab === 'VERIFY_SENDER' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Official Communication Channel Verifier</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Received an SMS, call, or email claiming to be Finstock? Test the Sender ID or phone number here against our official registered registry.
                </p>

                <form onSubmit={handleVerifySender} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    required
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="e.g. FINSTK or +91 80 4718 1888 or support@finstock.in"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors"
                  >
                    Verify
                  </button>
                </form>

                {verifyResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                      verifyResult.isOfficial
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/60 border-rose-800 text-rose-300'
                    }`}
                  >
                    {verifyResult.isOfficial ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    )}
                    <span>{verifyResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: GRIEVANCE & SCORES */}
          {activeTab === 'GRIEVANCE' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
                <h3 className="font-bold text-white text-sm">SEBI Investor Grievance Escalation Matrix</h3>
                <p>
                  If your issue remains unresolved through our standard support channels within the SLA timeline, you can escalate through our regulatory matrix:
                </p>
                <div className="space-y-2 border-t border-slate-700/60 pt-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <strong>Level 1: Customer Support Desk</strong>
                    <div className="text-slate-400">Response SLA: 24 Hours • Email: support@finstock.in • Tel: +91 80 4718 1888</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <strong>Level 2: Principal Grievance Officer</strong>
                    <div className="text-slate-400">Response SLA: 48 Hours • Email: grievance@finstock.in • Contact Person: Harish Mehta</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <strong>Level 3: Head of Compliance</strong>
                    <div className="text-slate-400">Response SLA: 7 Working Days • Email: compliance.head@finstock.in</div>
                  </div>
                </div>
              </div>

              {/* External Regulators Links */}
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="font-bold text-white">External Redressal Portals (SEBI & Exchanges)</h4>
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="https://scores.sebi.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold flex items-center justify-between border border-slate-700"
                  >
                    <span>SEBI SCORES Portal (Securities and Exchange Board of India)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://smartodr.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold flex items-center justify-between border border-slate-700"
                  >
                    <span>SMART ODR Portal (Online Dispute Resolution)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close Support Hub
          </button>
        </div>
      </div>
    </div>
  );
};
