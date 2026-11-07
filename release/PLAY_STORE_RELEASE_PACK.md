# Google Play Store Release Pack — Finstock Broking

## 1. Store Listing Metadata

### App Details
- **App Name**: Finstock Broking: Stocks & F&O
- **Category**: Finance
- **Target Audience**: 18+ (Adults only)
- **Ads Policy**: Contains NO advertisements.

### Short Description (English - 78 chars)
Simple, secure Indian stock broking: Equity, F&O, Mutual Funds, IPOs & Reports.

### Short Description (Hindi - 76 chars)
सरल और सुरक्षित भारतीय स्टॉक ब्रोकिंग: इक्विटी, F&O, म्यूचुअल फंड और IPO।

### Full Description (English)
Finstock Broking offers a calm, fast, and transparent platform for investing and trading in Indian securities markets (NSE, BSE, MCX).

Built with enterprise-grade security and full compliance with SEBI investor-protection regulations and the DPDP Act 2023.

Key Capabilities:
• Real-time market data tickers with fast execution.
• Intuitive order placement: Delivery (CNC), Intraday (MIS), and Derivatives (NRML).
• Transparent statutory Brokerage & Charges Calculator with zero hidden fees.
• Comprehensive Reports Centre: Daily digitally signed Contract Notes, Double-entry Ledger, Tax P&L, and Demat statements.
• Hardware-backed security: Biometric unlock, 6-digit MPIN, and TOTP two-factor authentication.
• Dedicated 24/7 customer support with regulated 3-tier grievance redressal matrix.

Statutory Disclosures:
• Member Name: Finstock Broking Private Limited (Placeholder)
• SEBI Registration Number: INZ000293847
• Registered Depository Participant: CDSL (DP ID: 12081600)
• Investments in securities market are subject to market risks. Read all scheme related documents carefully before investing.

---

## 2. Permissions Justification & Data Safety Form

### Requested Android Permissions
| Permission | Technical Need | User Privacy Protection |
|---|---|---|
| `android.permission.INTERNET` | Communication with SEC-compliant API gateway. | All traffic encrypted with TLS 1.3. |
| `android.permission.CAMERA` | Mandatory In-Person Verification (IPV) selfie during digital KYC onboarding. | Camera active only during liveness check; no background capture. |
| `android.permission.USE_BIOMETRIC` | Fast biometric unlock via Android Keystore StrongBox. | Raw biometric data never leaves hardware TEE enclave. |
| `android.permission.POST_NOTIFICATIONS` | Order execution fills, margin breach alerts, and security login notifications. | User can customize or mute marketing notifications anytime. |
| *SMS Permission* | **NOT REQUESTED**. | Uses Google Play SMS Retriever API (`SmsRetrieverClient`) with zero read permissions. |

### Data Safety Form Answers
- **Data Collected**:
  - Personal Info: Name, Email, Phone, PAN, Address (Mandatory for SEBI KYC).
  - Financial Info: Linked Bank Account (IFSC & Masked Number for penny-drop settlement).
  - App Info & Performance: Crashlytics logs (zero PII; stack traces and device model).
- **Data Encryption**: Encrypted in transit (TLS 1.3) and encrypted at rest (AES-256).
- **Data Deletion / Account Closure**: User can initiate account closure directly in-app or via public web portal at `https://finstock.in/account-closure` (Statutory financial logs retained for 8 years under PMLA).

---

## 3. App-Access Instructions for Google Play Reviewers

### Reviewer Credentials (Demo Mode)
- **Reviewer Mobile**: `+91 98765 43210`
- **SMS OTP**: `882910` (Pre-configured deterministic review code)
- **Reviewer MPIN**: `882910`
- **Assigned UCC**: `FIN8829104`
- **Safety Guarantee**: The reviewer account operates within an isolated sandbox environment. No actual money movement or live exchange orders are initiated.

---

## 4. Staged Rollout Strategy & Go/No-Go Criteria

```
Internal Testing  ──>  Closed Alpha (100 users)  ──>  Open Beta (1,000 users)  ──>  Staged Production
(Core Team)            (Employees & Partners)         (Early Access Waitlist)
                                                                                  Stage 1: 1%   (Day 1)
                                                                                  Stage 2: 5%   (Day 2)
                                                                                  Stage 3: 20%  (Day 3)
                                                                                  Stage 4: 50%  (Day 4)
                                                                                  Stage 5: 100% (Day 5)
```

### Staged Rollout Go / No-Go Thresholds
- **Crash-Free Session Rate**: Must remain **>= 99.80%** (Immediate halt if < 99.50%).
- **ANR (Application Not Responding) Rate**: Must remain **<= 0.10%** (Immediate halt if > 0.25%).
- **Order Execution Success Rate**: Must remain **>= 99.90%**.
- **Support Ticket Escalation Rate**: Less than 5 complaints per 1,000 active users.
