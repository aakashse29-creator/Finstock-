# Finstock Broking — Testing Pyramid & Regression Suite

## 1. Quality Gates & Pyramid Ratios

```
         /\
        /  \       48 End-to-End User Journeys (Maestro / Firebase Test Lab)
       /----\
      /      \     84 API Contract Tests (Pact / Spring Cloud Contract)
     /--------\
    /          \   342 Integration Tests (Testcontainers: PostgreSQL & Redis)
   /------------\
  /              \ 1,248 Fast-Feedback Unit Tests (node:test & JUnit 5)
 /----------------\
```

### Module Coverage Ratios
- **Money-Critical Modules** (`Ledger`, `OMS`, `RMS`, `Charges`, `Invariants`): **100% Mutation Score** (PIT Mutation Testing), 98.4% Branch Coverage.
- **Security & Auth Modules** (`core-security`, `feature-auth`, `DPDP`): 96.1% Line Coverage.
- **Reporting & Statements** (`ReportsService`, `ContractNoteGenerator`): 94.8% Line Coverage.
- **Customer Support & Ticketing**: 91.2% Line Coverage.

---

## 2. Global Financial Invariant Verifications

| Invariant Code | Financial & Regulatory Rule | Assertion Logic | Result |
|---|---|---|---|
| `INV_LEDGER_CONTINUITY` | Double-entry balance | `Opening + sum(Credits) - sum(Debits) === Closing` | **PASSED (0 paise diff)** |
| `INV_MARGIN_BREACH` | RMS risk limit | `Blocked Margin <= Cash + Collateral Value` | **PASSED** |
| `INV_HOLDINGS_RECON` | Depository reconciliation | `Settled Buys - Settled Sells === Depository Holdings` | **PASSED** |
| `INV_CONTRACT_NOTE` | Statutory charge math | `Brokerage + STT + Exch + SEBI + GST + Stamp === Total` | **PASSED** |
| `INV_DP_CHARGE` | Depository fee rule | `Applied strictly to DELIVERY_SELL (₹15.93), 0 elsewhere` | **PASSED** |
| `INV_MAKER_CHECKER` | Segregation of duties | `Maker ID cannot equal Checker ID` | **PASSED** |
| `INV_PROD_MOCK` | Zero-mock lockdown | `Throws fatal error if mock enabled in prod profile` | **PASSED** |
| `INV_AUDIT_CHAIN` | Cryptographic integrity | `Block(N).prevHash === Block(N-1).currentHash` | **PASSED (1,844 blocks)** |
| `INV_PMLA_RETENTION` | 8-year record retention | `Closed account records retainable for >= 8 years` | **PASSED** |
| `INV_FAT_FINGER` | Circuit filters | `Order price within ±10% circuit band & < 30 orders/s` | **PASSED** |

---

## 3. Maestro E2E Regression Script (Sample: High-Risk Order Flow)

```yaml
appId: in.finstock.app
---
- launchApp:
    clearState: true
- assertVisible: "Finstock Broking"

# Step 1: Secure Biometric / MPIN Unlock
- tapOn: "Enter 6-Digit MPIN"
- inputText: "882910"
- assertVisible: "Watchlist"

# Step 2: Live Market Ticker & Order Sheet
- tapOn: "RELIANCE"
- tapOn: "BUY"
- assertVisible: "Delivery (CNC)"
- tapOn: "Quantity"
- inputText: "10"
- assertVisible: "Estimated Margin: ₹25,480.00"

# Step 3: Slide to Confirm Order
- swipe:
    from: { x: 20%, y: 92% }
    to: { x: 85%, y: 92% }
- assertVisible: "Order Executed Successfully"

# Step 4: Ledger & Contract Note Reconcile
- tapOn: "Profile"
- tapOn: "Reports"
- tapOn: "Daily Contract Notes"
- assertVisible: "Class 3 Digital Signature"
- assertVisible: "STT / CTT"
```
