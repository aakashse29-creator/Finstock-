# Finstock Broking — Master PRD, SRS & Implementation Architecture

**Application Name:** Finstock Broking  
**Document Classification:** Product Requirements Document (PRD), Software Requirements Specification (SRS), System Architecture & Master Release Blueprint  
**Design Inspiration:** Clean trading precision of **Zerodha**, simple investor onboarding of **Groww**, advanced trading speed of **Kotak Neo**, and comprehensive multi-asset coverage of **Bajaj Broking**.  
**Philosophy:** *"Simple Outside. Powerful Inside."* A genuine SEBI-registered stockbroking platform with its own exchange memberships (NSE, BSE, MCX), proprietary OMS/RMS, and in-house clearing/depository interfaces.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The platform is built around a **Dual-Experience Model** sharing a single unified backend ledger and customer account:
> 
> 1. **Simple Mode (Default for Beginners & Investors)**:
>    - Inspired by Groww's visual calm and minimal clutter.
>    - Plain-English card layouts, single-tap equity delivery (`CNC`), curated mutual funds, IPO applications, and clean portfolio return tracking.
>    - Hidden advanced derivatives plumbing by default to prevent beginner cognitive overload.
> 
> 2. **Pro Mode (For Active Intraday, F&O & Commodity Traders)**:
>    - Inspired by Zerodha Kite and Kotak Neo.
>    - Live 5-level market depth ladders (bids/asks), full-screen candlestick charts with technical indicators (RSI, MACD, Bollinger Bands, VWAP), rapid multi-leg order sheets (`MIS`, `NRML`), and dedicated MCX Commodity trading.
>    - Instant 1-tap switcher in the top bar and profile allows toggling between Simple and Pro modes with zero re-login or account switching.
> 
> 3. **Luxury Fintech Visual Identity**:
>    - Deep Navy (`#101B33`), Electric Blue (`#2864FF`), Emerald Green (`#00B887`), Light Canvas (`#F5F7FB`), and Midnight Dark (`#0B1220`).
>    - Three distinct themes: **Light Mode**, **Dark Mode**, and **OLED Pure Black Mode**.
>    - Strict anti-AI-slop discipline: unboxed metadata typography separated by subtle mid-dots (`·`), tabular numerals (`font-mono tabular-nums`), and single-elevation cards.

---

## 1. Product Requirements Document (PRD)

### 1.1 Customer Registration, Authentication & Device Security
- **Mobile Number Registration**: 10-digit Indian mobile entry with automated SMS OTP verification via Android SMS Retriever API.
- **Email Verification**: Instant OTP verification to registered email.
- **App PIN & Biometrics**: Secure 6-digit MPIN hashed with Argon2id; hardware biometric unlock via Android `BiometricPrompt` bound to Android Keystore `StrongBoxKeymaster4` / TEE.
- **Session & Device Governance**:
  - Rotating JWT access tokens (15 min) + secure refresh token families.
  - Active login history showing device model, OS, IP address, and last activity time.
  - One-tap "Log out of all other devices" remote invalidation.
  - Auto-lock timer (Immediate, 1 min, 5 min, 15 min) on backgrounding.
  - Mandatory 24-hour fund withdrawal cooling-off period triggered on mobile number or primary bank account modification.
  - Emergency user-initiated "Freeze My Account" button to block unauthorized trading immediately.

### 1.2 Digital KYC & Account Opening (SEBI & PMLA Compliant)
- **PAN Verification**: Instant name match and Aadhaar-PAN link status check.
- **DigiLocker / Aadhaar eKYC**: Direct government consent flow fetching legally verified name, DOB, and address.
- **Bank Account Penny-Drop Verification**: ₹1 automated IMPS/UPI penny drop to verify account holder name matching PAN.
- **In-Person Verification (IPV) & Liveness**: Real-time camera selfie with active liveness check (head-turn and blink detection) to prevent spoofing.
- **Nominee Management**: Add up to 3 nominees with percentage allocation strictly validated to equal 100%, or an explicit statutory opt-out declaration.
- **Segment Selection & Activation**:
  - Equity Cash & Delivery activated by default.
  - F&O, Currency, and MCX Commodity segments activated via income proof upload (salary slip, ITR acknowledgment, or 6-month bank statement).
- **Aadhaar E-Sign**: Digital execution of KYC contract note and account opening document via eMudhra / NSDL e-sign gateway.
- **Real-Time Application Tracker**: Step-by-step status tracker (`SUBMITTED` -> `UNDER_REVIEW` -> `APPROVED` / `REJECTED_WITH_REASON`).

### 1.3 Home Dashboard & Market Overview
- **Header Indices Ticker**: Sticky real-time ticking indices: NIFTY 50, SENSEX, and BANK NIFTY with color-blind safe percentage change indicators (`[▲ +]`, `[▼ -]`).
- **Unified Portfolio Card**: Total portfolio valuation, Today's P&L, Overall P&L, Available Margin, and Used Margin with privacy-masking toggle (`Eye` icon).
- **Market Movers**: Top Gainers, Top Losers, 52-Week High/Low discovery filters.
- **Quick Action Dock**: Add Funds, Option Chain, Commodity Hub, IPOs, Brokerage Calculator, and Research Reports.
- **Market News Feed**: Verified regulatory announcements and exchange market circulars.

### 1.4 Multi-Exchange Trading (NSE, BSE & MCX)
- **NSE & BSE Equities**: Delivery (`CNC`) with ₹0 brokerage; Intraday (`MIS`) with up to 5x leverage and automated 3:15 PM square-off.
- **Index & Stock Derivatives (F&O)**: Weekly and monthly options and futures contracts with strike picker.
- **MCX Commodities Section (Dedicated)**:
  - Direct commodity trading across Gold, Silver, Crude Oil, Natural Gas, Copper, Aluminium, Zinc, and Lead.
  - Dynamic contract specifications fetched live from exchange feeds: Lot size, Tick size, Expiry date, Margin multiplier, Trading hours (9:00 AM - 11:30/11:55 PM IST), and physical delivery/cash settlement rules.
- **5-Level Market Depth Ladder**: Real-time top 5 bid and top 5 ask quantities and prices, order count, and total buy/sell pressure bar.
- **Interactive Candlestick & Technical Charts**:
  - Candlestick, Line, and Heikin-Ashi chart types.
  - Multiple timeframes: 1m, 5m, 15m, 1D, 1W.
  - Built-in indicators: Moving Averages (20/50/200 EMA), RSI (14), MACD, Bollinger Bands, and VWAP.
  - Interactive crosshair, volume histogram, and full-screen view.

### 1.5 Order Placement & Execution Engine
- **Order Types**: Market, Limit, Stop Loss (SL), Stop Loss Market (SL-M), Immediate-or-Cancel (IOC), and After-Market Order (AMO).
- **Product Codes**: `CNC` (Cash & Carry), `MIS` (Margin Intraday Square-off), `NRML` (Normal Derivatives Carry).
- **Pre-Trade Transparency & Margin Engine**:
  - Real-time calculation of required margin vs available margin balance.
  - Itemized live statutory charge breakdown before execution (Brokerage, STT/CTT, Exchange turnover charges, SEBI charges, GST 18%, Stamp Duty, and DP charges).
- **Fast Order Confirmation**: Smooth slide-to-confirm order placement with anti-fat-finger price band filters (±10% from LTP).
- **Order State Machine**: `SUBMITTED` -> `EXCHANGE_ACK` -> `OPEN` -> `PARTIALLY_FILLED` -> `FILLED` -> `REJECTED` -> `CANCELLED`. Duplicate order submission prevention via client idempotency keys.

### 1.6 Portfolio, Holdings & Live Positions
- **Holdings**: Stock name, ISIN, quantity, average buy price, current LTP, invested value, current market value, P&L, and returns. Includes TPIN / DDPI authorization status badge.
- **Positions**: Intraday MIS, F&O, and MCX positions with live ticking mark-to-market (MTM) P&L, breakdown of realized vs unrealized returns, and 1-tap "Square Off Position".

### 1.7 Funds, Banking & Double-Entry Ledger
- **Funds Summary**: Available Cash, Collateral from Pledged Stocks, Used Margin, and Withdrawable Balance.
- **Add Funds**: Instant UPI intent, Google Pay/PhonePe deep linking, and Netbanking IMPS integration simulation.
- **Withdraw Funds**: Bank payout request with automated balance hold, cooling-off verification, and transfer tracking.
- **Double-Entry Ledger**: Immutable financial journal recording every credit, debit, trade settlement, and statutory tax entry with integer paise arithmetic (`₹1 = 100 paise`).

### 1.8 Reports, Tax & Compliance Statements
- **Daily Contract Notes**: Legally compliant contract notes generated for every trading day with eMudhra Class 3 Digital Signature Certificate badge, trade-by-trade regulatory charge breakdown, and password-protected PDF (`PAN + DDMMYYYY`).
- **Ledger Statement**: Downloadable PDF and CSV financial ledger for arbitrary date ranges and financial years.
- **Tax P&L Package**: Consolidated bundle of realized P&L, charges, turnover, and capital gains schedules for ITR filing.
- **Statutory Retention**: Minimum 8-year record retention pursuant to PMLA and SEBI master circulars.

### 1.9 Customer Support & Grievance Redressal
- **Help Centre**: 60+ categorized articles with markdown formatting and 100+ FAQ accordion.
- **Interactive Live Chat**: Real-time support simulation with queue position, typing indicators, FAQ bot resolution, and human specialist handoff.
- **Official Communication Verifier**: Verification tool allowing clients to validate official Finstock phone numbers and sender IDs (e.g. `FINSTK`) against phishing.
- **Grievance Escalation Matrix**: Level 1 (Customer Care) -> Level 2 (Grievance Officer) -> Level 3 (Compliance Head) with direct links to SEBI SCORES and SMART ODR portals.

### 1.10 Internal Administration Console (Maker-Checker)
- **Role-Based Access Control**: `OPERATIONS_MAKER`, `OPERATIONS_CHECKER`, `COMPLIANCE_OFFICER`, and `SUPPORT_AGENT`.
- **Enforced Maker-Checker Rule**: The staff member who drafts or creates a profile/bank/KYC change cannot act as checker to authorize it.
- **Emergency Safeguards & Kill Switches**:
  - Global Trading Kill Switch (halts all inbound order matching).
  - F&O Derivatives Segment Circuit Breaker.
  - Inbound order rate throttling (30 orders/sec per user).
  - High-value withdrawal step-up authentication threshold (₹50,000).
- **Automated 4-Way Reconciliation**: Start-of-Day (SOD) and End-of-Day (EOD) automated reconciliation across trades, ledger, CDSL holding snapshots, and banking balances.
- **Cryptographic Audit Log**: SHA-256 hash-chaining linking every administrative, financial, and KYC action.

---

## 2. Software Requirements Specification (SRS)

### 2.1 Functional Requirements Matrix

| Module | Requirement ID | Functional Specification |
|---|---|---|
| **Auth** | `FR-AUTH-01` | Mobile OTP verification with 30s resend timer and 5-failure lockout. |
| **Auth** | `FR-AUTH-02` | Argon2id 6-digit MPIN validation and biometric crypto-binding. |
| **KYC** | `FR-KYC-01` | Automated DigiLocker Aadhaar eKYC name, DOB, and address ingestion. |
| **KYC** | `FR-KYC-02` | IMPS/UPI penny drop verifying account title against PAN. |
| **KYC** | `FR-KYC-03` | Nominee allocation share validation strictly enforcing $\sum = 100\%$. |
| **OMS** | `FR-OMS-01` | Multi-exchange order routing across NSE, BSE, and MCX. |
| **OMS** | `FR-OMS-02` | Pre-trade RMS margin check preventing negative account balances. |
| **OMS** | `FR-OMS-03` | Fat-finger circuit bounds rejecting orders outside $\pm 10\%$ from LTP. |
| **RMS** | `FR-RMS-01` | Automated intraday MIS square-off at 3:15 PM IST. |
| **RMS** | `FR-RMS-02` | Emergency kill switch rejecting inbound orders within 50ms of activation. |
| **Ledger** | `FR-LED-01` | Double-entry bookkeeping where $\text{Opening} + \sum \text{Credits} - \sum \text{Debits} = \text{Closing}$. |
| **Ledger** | `FR-LED-02` | Monetary storage in integer paise (`BigInt`) to prevent float rounding errors. |
| **MCX** | `FR-MCX-01` | Dynamic commodity contract specs (lot size, tick size, expiry, margins). |
| **Reports** | `FR-REP-01` | Automated daily contract note PDF generation with digital signature badge. |
| **Reports** | `FR-REP-02` | Encrypted PDF protection with standard password convention (`PAN + DDMMYYYY`). |
| **Admin** | `FR-ADM-01` | Segregation of duties: Maker ID cannot equal Checker ID on approvals. |
| **Admin** | `FR-ADM-02` | Tamper-evident cryptographic SHA-256 hash-chaining across all audit rows. |

### 2.2 Non-Functional Requirements & Performance Budgets

| Dimension | Metric Target | Verification Mechanism |
|---|---|---|
| **Android Cold Start** | $< 2.0\text{ s}$ on mid-range devices | Android Macrobenchmark Baseline Profiles |
| **Android Memory Heap** | $< 60\text{ MB}$ baseline, zero leaks | LeakCanary automated integration tests |
| **Frame Rate** | $\ge 58\text{ fps}$ (Jank rate $< 1\%$) | Android FrameMetrics & Compose rendering |
| **Order Placement Latency** | $\text{p99} < 300\text{ ms}$ | k6 load tests under 10x market-open surge |
| **Quote Fan-Out Latency** | $\text{p99} < 500\text{ ms}$ tick-to-screen | WebSocket streaming benchmarks |
| **Disaster Recovery (RPO)** | $< 5\text{ minutes}$ | PostgreSQL continuous WAL archiving |
| **Disaster Recovery (RTO)** | $< 1\text{ hour}$ | Automated cross-region failover drill |
| **Accessibility** | WCAG 2.1 AA Compliance | TalkBack labels, 48dp touch targets, color-blind tags |

---

## 3. System Architecture & Component Design

### 3.1 Multi-Tier Architecture Blueprint

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FINSTOCK ANDROID MOBILE APP                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              PRESENTATION LAYER                                  │  │
│  │  • Simple Mode Dashboard (Groww Style)    • Pro Mode Trading View (Zerodha Style)│  │
│  │  • Real-Time Market Depth (5-Level)       • Interactive Candlestick Charts (VWAP)│  │
│  │  • Slide-to-Confirm Order Sheets          • Dual Theme Engine (Light / Dark/OLED)│  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
│                                           │                                            │
│  ┌────────────────────────────────────────┴─────────────────────────────────────────┐  │
│  │                               DOMAIN & CORE LOGIC                                │  │
│  │  • Invariants & Verification Engine       • Integer Paise Ledger & Charges Math  │  │
│  │  • StrongBox Hardware Keystore Auth       • Android BiometricPrompt L2 Security  │  │
│  │  • Offline State & DataStore Caching      • OkHttp TLS 1.3 Pinning Interceptor   │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            │ HTTPS REST & WSS Streaming
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY & REVERSE PROXY                               │
│  • Redis Token-Bucket Rate Limiter (30 req/s user, 50k global)                         │
│  • Play Integrity Hardware Attestation Verifier                                        │
│  • JWT Rotating Refresh Token Validator & Step-Up Auth Gateway                         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│   OMS & RMS      │               │ FUNDS & LEDGER   │               │ MARKET DATA FEED │
│ • Order Matching │               │ • Double-Entry   │               │ • NSE Feed (FIX) │
│ • Margin Checks  │               │ • UPI/IMPS IMPS  │               │ • BSE BOLT Plus  │
│ • Circuit Bands  │               │ • 8-Yr PMLA Log  │               │ • MCX Tick Engine│
└────────┬─────────┘               └────────┬─────────┘               └────────┬─────────┘
         │                                  │                                  │
         └──────────────────────────────────┼──────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               PERSISTENT STORAGE TIER                                  │
│  • PostgreSQL 16 (Multi-AZ Cluster with Append-Only Ledger & Flyway Migrations)        │
│  • Redis 7 Cluster (Session Cache, OTP Store, Ticker Depth & Rate Limiter)             │
│  • S3 Encrypted Storage (AES-256 for KYC Docs, Invoices & Signed Contract Notes)       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema Design (Flyway PostgreSQL)

```sql
-- Core User Master
CREATE TABLE users (
    ucc VARCHAR(12) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    masked_mobile VARCHAR(20) NOT NULL,
    masked_email VARCHAR(80) NOT NULL,
    mpin_hash VARCHAR(128) NOT NULL,
    account_status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, FROZEN, CLOSED
    experience_mode VARCHAR(10) DEFAULT 'SIMPLE', -- SIMPLE, PRO
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cooling_off_until TIMESTAMP WITH TIME ZONE
);

-- Linked Bank Accounts
CREATE TABLE bank_accounts (
    id VARCHAR(36) PRIMARY KEY,
    ucc VARCHAR(12) REFERENCES users(ucc),
    account_number_masked VARCHAR(30) NOT NULL,
    ifsc_code VARCHAR(15) NOT NULL,
    bank_name VARCHAR(80) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'VERIFIED',
    penny_drop_reference VARCHAR(64)
);

-- Nominee Allocations
CREATE TABLE user_nominees (
    id VARCHAR(36) PRIMARY KEY,
    ucc VARCHAR(12) REFERENCES users(ucc),
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(30) NOT NULL,
    date_of_birth DATE NOT NULL,
    share_percentage NUMERIC(5,2) NOT NULL, -- Total must equal 100.00
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MCX Commodity Contract Specifications
CREATE TABLE commodity_contracts (
    symbol VARCHAR(30) PRIMARY KEY,
    underlying VARCHAR(50) NOT NULL,
    lot_size INT NOT NULL,
    tick_size NUMERIC(8,4) NOT NULL,
    expiry_date DATE NOT NULL,
    margin_multiplier NUMERIC(5,2) NOT NULL,
    trading_unit VARCHAR(20) NOT NULL
);

-- Orders Master
CREATE TABLE orders (
    order_id VARCHAR(36) PRIMARY KEY,
    ucc VARCHAR(12) REFERENCES users(ucc),
    exchange VARCHAR(10) NOT NULL, -- NSE, BSE, MCX
    symbol VARCHAR(30) NOT NULL,
    side VARCHAR(10) NOT NULL, -- BUY, SELL
    product VARCHAR(10) NOT NULL, -- CNC, MIS, NRML
    order_type VARCHAR(10) NOT NULL, -- MARKET, LIMIT, SL, SL_M
    quantity INT NOT NULL,
    price_paise BIGINT NOT NULL,
    trigger_price_paise BIGINT DEFAULT 0,
    status VARCHAR(25) NOT NULL, -- SUBMITTED, ACK, OPEN, FILLED, REJECTED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Immutable Double-Entry Ledger
CREATE TABLE ledger_entries (
    journal_id VARCHAR(36) PRIMARY KEY,
    ucc VARCHAR(12) REFERENCES users(ucc),
    entry_type VARCHAR(10) NOT NULL, -- CREDIT, DEBIT
    amount_paise BIGINT NOT NULL,
    balance_paise BIGINT NOT NULL,
    reference_type VARCHAR(30) NOT NULL, -- TRADE_SETTLEMENT, CHARGES, PAYIN, PAYOUT
    narrative TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cryptographic Tamper-Evident Audit Log
CREATE TABLE admin_audit_log (
    block_id BIGSERIAL PRIMARY KEY,
    prev_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    staff_id VARCHAR(36) NOT NULL,
    staff_role VARCHAR(30) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    payload_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Screen Designs & Interface Layouts

### 5.1 Simple Mode Screen Layout (Groww Style)
- **Top Navigation**: Finstock brand wordmark, quick mode toggle (`[⚡ Simple | Pro]`), balance eye-mask toggle, and Profile avatar.
- **Hero Valuation Card**: Calm, elevated dark navy card showing Total Value (`₹2,48,520.00`), Today's Return (`+₹3,420.50 (+1.40%)`), and 1-tap "Add Funds" button.
- **Indices Snapshot**: Clean horizontal scroll chip showing NIFTY 50 and SENSEX.
- **Invest Section**: Big friendly discovery cards for Stocks (NSE/BSE), Mutual Funds, Commodities, and IPOs.
- **Top Gainers & Watchlist**: Simplified cards with company name, symbol, LTP, and change badge without dense technical indicators.

### 5.2 Pro Mode Screen Layout (Zerodha Style)
- **Compact Header**: Dual-index ticking strip (Nifty 50 and Bank Nifty) running live at the top.
- **5-Level Market Depth Panel**:
  - Live bid ladder (5 rows: Buy Orders, Quantity, Bid Price in Emerald Green).
  - Live ask ladder (5 rows: Ask Price in Crimson Red, Quantity, Sell Orders).
  - Total Buy / Sell volume pressure gauge.
- **Full-Screen Candlestick Chart View**:
  - Timeframe selector buttons: `1m`, `5m`, `15m`, `1D`, `1W`.
  - Indicator toggles: `EMA 20/50`, `RSI 14`, `MACD`, `Bollinger Bands`, and `VWAP`.
  - Real-time crosshair cursor displaying Open, High, Low, Close, and Volume.
- **Active Orders & Positions Strip**: Quick bottom drawer displaying open orders and mark-to-market live position P&L with 1-tap "Square Off All".

### 5.3 MCX Commodity Trading Section
- **Commodity Instruments Showcase**: Gold (`GOLDM`), Silver (`SILVERM`), Crude Oil (`CRUDEOIL`), Natural Gas (`NATURALGAS`), Copper (`COPPER`), and Zinc (`ZINC`).
- **Dynamic Contract Spec Card**: Lot size (e.g. 100 Barrels for Crude, 1 kg for Silver), tick size (₹1.00 / ₹0.10), expiry date countdown, margin multiplier (e.g. ₹1,85,000 required), and settlement type.
- **Dedicated Commodity Order Sheet**: Commodity lot calculator, tick-based limit price stepper, and statutory CTT (Commodities Transaction Tax) calculation.

---

## 6. End-to-End Customer Journey (18 Mandatory Steps)

```
[01. Register Mobile]  ──>  [02. Verify OTP & Email]  ──>  [03. Set 6-Digit MPIN]
         │
         ▼
[04. DigiLocker KYC]   ──>  [05. Bank Penny Drop]     ──>  [06. Nominee & Segment Setup]
         │
         ▼
[07. UCC Allotment]    ──>  [08. Add Funds (UPI)]     ──>  [09. Search NSE/BSE/MCX]
         │
         ▼
[10. View Depth/Chart] ──>  [11. Calculate Charges]   ──>  [12. Place Buy/Sell Order]
         │
         ▼
[13. Order Fill Notice]──>  [14. View in Trade Book]  ──>  [15. Monitor Position / P&L]
         │
         ▼
[16. Reconcile Ledger] ──>  [17. Request Withdrawal]  ──>  [18. Secure Logout / Auto-Lock]
```

---

## 7. Phased Implementation Roadmap

### Phase 1: Core Shell, Dual-Mode Switcher & Market Engine (Current Target)
1. **Interactive Shell**: Implement the unified responsive mobile app with Top Header, Indices Tickers, and persistent mode toggle (**Simple Mode** vs **Pro Mode**).
2. **Dedicated MCX Commodity Hub**: Implement dynamic contract specifications for Gold, Silver, Crude Oil, Natural Gas, and Copper with lot calculators.
3. **5-Level Market Depth & Candlestick Charts**: Real-time bid/ask order book ladder and interactive charting view with selectable indicators (RSI, MACD, VWAP).
4. **Order Placement Sheet**: Multi-segment order sheet supporting `CNC`, `MIS`, `NRML`, Limit, Market, SL, and live statutory charges estimator.
5. **State Synchronization**: Wire live state transitions across Watchlist -> Order Sheet -> Executed Trades -> Positions -> Holdings -> Funds -> Ledger.
6. **Master Blueprint & Architecture Modal**: Interactive in-app viewer allowing full inspection of the PRD, SRS, architecture diagrams, database schemas, and release runbooks.

### Phase 2: Verification, Fast-Feedback Testing & Visual Inspection
1. **Fast-Feedback Unit Tests**: Execute all 18+ invariant and statutory charge tests using `npx --yes tsx --test`.
2. **Visual Inspection**: Capture desktop (1440x900) and mobile (390x844) screenshots across Simple Mode, Pro Mode, and MCX Commodity views to verify aesthetic polish.
3. **Compilation & Linting**: Final clean build check via `compile_applet` and `lint_applet`.
