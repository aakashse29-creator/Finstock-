/**
 * Finstock Broking - TypeScript Type Definitions
 * Phase 1 through Phase 9 Complete Spec
 */

export type AppTab = 'watchlist' | 'orders' | 'portfolio' | 'explore' | 'profile';

export type ExperienceMode = 'simple' | 'pro';

export type AppLanguage = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'bn';

export type ThemeMode = 'light' | 'dark' | 'oled' | 'system';

export type NumberFormatType = 'indian' | 'international';

export type SegmentType = 'EQUITY' | 'FNO' | 'CURRENCY' | 'COMMODITY';

export interface DepthRow {
  orders: number;
  quantity: number;
  price: number;
}

export interface MarketDepth {
  bids: DepthRow[];
  asks: DepthRow[];
  totalBuyQty: number;
  totalSellQty: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CommodityContract {
  symbol: string;
  underlying: string;
  exchange: 'MCX';
  lotSize: number;
  tickSize: number;
  expiryDate: string;
  marginRequired: number;
  tradingUnit: string;
  ltp: number;
  change: number;
  pChange: number;
  dayHigh: number;
  dayLow: number;
  volume: string;
  openInterest: string;
}

export interface Position {
  id: string;
  symbol: string;
  exchange: 'NSE' | 'BSE' | 'MCX';
  product: 'MIS' | 'NRML' | 'CNC';
  side: 'BUY' | 'SELL';
  quantity: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pChange: number;
}

export interface UserProfile {
  id: string;
  ucc: string; // Unique Client Code (e.g. FIN8829104)
  fullName: string;
  email: string;
  mobile: string;
  avatarUrl?: string;
  accountStatus: 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'SUSPENDED';
  pan: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  annualIncome: string;
  tradingExperience: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  maskedAadhaar: string;
  dpId: string; // CDSL / NSDL
  boId: string;
  dematStatus: 'ACTIVE' | 'SUSPENDED';
  kycStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'REJECTED';
  kycVerifiedDate: string;
  activeSegments: SegmentType[];
  completenessScore: number; // percentage 0-100
  pendingItems: string[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  accountType: 'SAVINGS' | 'CURRENT';
  ifsc: string;
  branch: string;
  isPrimary: boolean;
  status: 'VERIFIED' | 'PENDING' | 'FAILED';
  coolingOffUntil?: string; // ISO string if primary changed recently
  addedAt: string;
}

export interface Nominee {
  id: string;
  name: string;
  relationship: string;
  sharePercentage: number;
  dob: string;
  isMinor: boolean;
  guardianName?: string;
  guardianRelationship?: string;
  guardianPan?: string;
  panOrIdMasked?: string;
  status: 'VERIFIED' | 'PENDING';
  addedAt: string;
}

export type ChangeRequestType =
  | 'MOBILE'
  | 'EMAIL'
  | 'ADDRESS'
  | 'INCOME_OCCUPATION'
  | 'SIGNATURE'
  | 'BANK_ACCOUNT'
  | 'NAME_DOB_CORRECTION';

export type ChangeRequestStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface ProfileChangeRequest {
  id: string;
  type: ChangeRequestType;
  title: string;
  oldValue: string;
  newValue: string;
  submittedAt: string;
  updatedAt: string;
  status: ChangeRequestStatus;
  makerId?: string;
  checkerId?: string;
  rejectionReason?: string;
  documents: { name: string; url: string; size: string }[];
  requiresCoolingOff?: boolean;
}

export interface ContractNoteTrade {
  tradeId: string;
  orderId: string;
  tradeTime: string;
  symbol: string;
  exchange: 'NSE' | 'BSE';
  segment: SegmentType;
  buyOrSell: 'BUY' | 'SELL';
  quantity: number;
  price: number; // in INR
  grossAmount: number;
  brokerage: number;
  stt: number;
  exchangeCharges: number;
  sebiTurnover: number;
  gst: number;
  stampDuty: number;
  netAmount: number;
}

export interface ContractNote {
  noteNumber: string; // e.g. CN/2026/02/06-8829
  date: string; // YYYY-MM-DD
  settlementNo: string;
  clientUcc: string;
  clientPan: string;
  segment: string;
  trades: ContractNoteTrade[];
  totalGrossPayableOrReceivable: number;
  totalBrokerage: number;
  totalStt: number;
  totalExchangeCharges: number;
  totalSebiFees: number;
  totalGst: number;
  totalStampDuty: number;
  netPayableOrReceivable: number;
  digitalSignature: {
    signedBy: string;
    certificateIssuer: string;
    timestamp: string;
    isSimulated: boolean;
  };
}

export interface LedgerEntry {
  id: string;
  date: string;
  narration: string;
  voucherType: 'TRADE' | 'PAYIN' | 'PAYOUT' | 'CHARGES' | 'DIVIDEND' | 'DP_CHARGES';
  referenceId: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface HelpArticle {
  id: string;
  category: 'KYC' | 'FUNDS' | 'ORDERS' | 'FNO' | 'MF_IPO' | 'REPORTS' | 'SECURITY' | 'CHARGES';
  title: string;
  summary: string;
  content: string;
  readTime: string;
  views: number;
  helpfulCount: number;
  tags: string[];
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  category: string;
  subCategory: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  referenceId?: string; // order or txn id
  messages: {
    id: string;
    sender: 'USER' | 'AGENT' | 'SYSTEM';
    senderName: string;
    timestamp: string;
    text: string;
    attachments?: { name: string; url: string; size: string }[];
  }[];
  csatRating?: number; // 1-5
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
  attachments?: { name: string; size: string }[];
  isRead?: boolean;
}

export interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalEarned: number; // in INR
  activeInvitesCount: number;
  convertedCount: number;
  invites: {
    id: string;
    name: string;
    maskedMobile: string;
    date: string;
    status: 'INVITED' | 'SIGNED_UP' | 'KYC_DONE' | 'REWARD_CREDITED';
    rewardAmount: number;
  }[];
}

export interface UserSettings {
  theme: ThemeMode;
  colorBlindMode: boolean;
  language: AppLanguage;
  numberFormat: NumberFormatType;
  fontSize: 'small' | 'medium' | 'large';
  orderConfirmationThreshold: number; // e.g. 50000
  defaultProductType: 'CNC' | 'MIS' | 'NRML';
  defaultOrderType: 'LIMIT' | 'MARKET';
  slideConfirmDefault: boolean;
  defaultExchange: 'NSE' | 'BSE';
  soundHapticsEnabled: boolean;
  showChargesBeforeOrdering: boolean;
  biometricUnlockEnabled: boolean;
  autoLockMinutes: number; // 0 for immediate, 1, 5, 15
  twoFactorMethod: 'TOTP' | 'SMS_OTP';
  dataSaverMode: boolean;
}

export interface PrivacyConsent {
  id: string;
  type: string;
  title: string;
  description: string;
  isMandatory: boolean;
  granted: boolean;
  version: string;
  grantedAt: string;
}

export interface ClosurePreCheck {
  id: string;
  label: string;
  passed: boolean;
  details: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPPORT_AGENT' | 'OPERATIONS_MAKER' | 'OPERATIONS_CHECKER' | 'COMPLIANCE_OFFICER' | 'ADMIN';
}
