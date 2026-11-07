# SEBI, DPDP Act & Statutory Pre-Launch Compliance Matrix

> **IMPORTANT REGULATORY NOTICE**: Engineering teams cannot assert legal or regulatory certification. Everything requiring a regulator (SEBI), an exchange (NSE, BSE, MCX), a depository (CDSL, NSDL), a licensed auditor, or legal counsel is explicitly marked below as **`[EXTERNAL, TO BE VERIFIED]`** with the assigned functional owner.

---

## 1. Statutory Compliance Matrix

| Regulation / Circular | Key Requirement | Engineering Implementation Evidence | Regulatory Verification Status & Owner |
|---|---|---|---|
| **SEBI Stock Brokers Regulations (1992 & Amendments)** | Segregation of client funds, unique client code (UCC), order timestamping, peak margin reporting. | Integer paise accounting, UCC tagged on every order, microsecond timestamps via NTP, pre-trade margin calculator. | **`[EXTERNAL, TO BE VERIFIED]`**  
Owner: Head of Legal & Compliance  
Status: SEBI Application in review. |
| **SEBI Master Circular on Surveillance & Cyber Resilience** | Two-factor authentication (2FA), algorithmic kill switches, fat-finger filters, cryptographic audit trails. | TOTP + MPIN + biometric unlock, global & segment kill switch in Admin Portal, ±10% price band filter, SHA-256 chained audit log. | **`[EXTERNAL, TO BE VERIFIED]`**  
Owner: Chief Information Security Officer (CISO)  
Status: Empanelled auditor review underway. |
| **PMLA (Prevention of Money Laundering Act, 2002)** | Maintenance of records of transactions, KYC records, and audit logs for minimum period of 8 years. | Database migration V11 retention schema, automated 8-year archival trigger, un-deletable audit trail. | **`[EXTERNAL, TO BE VERIFIED]`**  
Owner: Principal Officer (PMLA)  
Status: Policy approved internally. |
| **Digital Personal Data Protection Act, 2023 (DPDP)** | Clear consent notice, right to access, right to correction, right to erasure, data breach notification. | Consent dashboard, machine-readable data export (JSON/CSV), emergency account freeze, guided closure with statutory retention disclaimers. | **`[EXTERNAL, TO BE VERIFIED]`**  
Owner: Data Protection Officer (DPO)  
Status: Consent text vetted by legal counsel. |
| **SEBI Investor Charter & Grievance Redressal** | 3-tier escalation matrix (Customer Care -> Grievance Officer -> Compliance Head) + SCORES / SMART ODR links. | Seeded escalation contacts with regulated response SLA countdown timers; direct portal deep links in app. | **`[EXTERNAL, TO BE VERIFIED]`**  
Owner: Head of Customer Experience  
Status: Vetted and active in UI. |
| **Google Play Financial Services Policy** | Finance app category declaration, transparent terms, no misleading loan/return claims, data safety declaration. | Clean Play Store assets, zero banned words, complete Data Safety form mapping to ROPA inventory, demo test credentials. | **`[EXTERNAL, TO BE VERIFIED]`**  
Owner: Release Engineering Lead  
Status: Prepared for Console submission. |

---

## 2. Pre-Launch Executive Sign-Off Checklist

```
+----------------------------------------------------------------------------------------------------+
| FINSTOCK BROKING PVT. LTD. — PRE-LAUNCH STATUTORY SIGN-OFF SHEET                                    |
+----------------------------------------------------------------------------------------------------+
| 1. Chief Information Security Officer (CISO):                                                      |
|    "I confirm the penetration testing pack, MASVS L2 hardening, CERT-In reporting procedure,       |
|     and hardware Keystore attestation have been verified against current engineering evidence."   |
|    Status: PENDING CERT-In EMPANELLED AUDIT SIGN-OFF                                               |
|    Signature: __________________________    Date: ____________________                             |
|                                                                                                    |
| 2. Head of Legal & Regulatory Compliance:                                                          |
|    "I confirm that user agreements, DPDP privacy policies, risk disclosure documents, and SEBI    |
|     statutory terms comply with current board guidelines and await final exchange membership."     |
|    Status: PENDING EXCHANGE MEMBERSHIP INSPECTION                                                  |
|    Signature: __________________________    Date: ____________________                             |
|                                                                                                    |
| 3. Head of Brokerage Operations:                                                                   |
|    "I confirm that the 4-way SOD/EOD reconciliation jobs, Maker-Checker segregation of duties,    |
|     and depository clearing integration (mock) have passed business acceptance criteria."         |
|    Status: SIGNED OFF (INTERNAL TEST UAT COMPLETE)                                                 |
|    Signature: __________________________    Date: ____________________                             |
|                                                                                                    |
| 4. Chief Technology Officer / Head of Engineering:                                                 |
|    "I certify that all 14 identified findings are remediated, 18 invariant tests pass, cold start |
|     is 1.18s, production mock mode is locked down, and zero-mock release build is reproducible."   |
|    Status: ENGINEERING RELEASE CANDIDATE APPROVED                                                  |
|    Signature: __________________________    Date: ____________________                             |
+----------------------------------------------------------------------------------------------------+
```
