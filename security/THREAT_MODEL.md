# STRIDE Threat Model & Penetration-Test Pack

## 1. System Threat Model (STRIDE Methodology)

| Component | Threat Category | Threat Scenario | Implemented Mitigation | Residual Risk |
|---|---|---|---|---|
| **Android App** | Spoofing | Attacker clones device ID or uses emulator to impersonate authentic client. | Play Integrity API verifies genuine device hardware; StrongBox binds session key. | Low |
| **Android App** | Tampering | Attacker instruments APK via Frida or Xposed to bypass MPIN check. | Multi-tier anti-hooking checks; server re-verifies cryptographic MPIN hash. | Low |
| **API Gateway** | Repudiation | Client claims they did not place an executed derivative order. | Nonce, client timestamp, and IP logged in tamper-evident hash-chained audit table. | Zero |
| **OMS / RMS** | Information Disclosure | Unauthorized user intercepts internal exchange FIX/OUCH market-data feed. | Colocation private cross-connects with TLS encryption on all internal broker lines. | Zero |
| **Ledger Engine** | Denial of Service | Malicious actor spams high-frequency order requests at 9:15 AM open. | Redis token-bucket rate limiter throttles to 30 orders/sec per user; global circuit breaker. | Low |
| **Admin Console** | Elevation of Privilege | Operations Maker attempts to self-approve a client address or mobile change. | Strict Maker-Checker rule: `makerId !== checkerId` enforced at controller layer. | Zero |

---

## 2. CERT-In 6-Hour Incident Reporting Procedure
*Pursuant to CERT-In Directions under Section 70B(6) of Information Technology Act, 2000.*

### Mandatory Reporting Timeline
```
[T + 00:00] Incident Identified (Alert triggered / breach detected)
     │
[T + 00:30] Severity Assessment & SIRT Activation
     │      - Severity 1 (Critical): Active data exfiltration, unauthorized funds movement, outage > 15m.
     │      - Severity 2 (High): Phishing attack, attempted DDoS, unauthorized privilege escalation.
     │
[T + 02:00] Containment & Incident Triage
     │      - Quarantine affected pods, revoke API keys, freeze user sessions if needed.
     │
[T + 06:00] MANDATORY FORMAL REPORT TO CERT-In
            - Email: incident@cert-in.org.in
            - Phone: 1800-11-4949 / +91-11-24669949
            - Format: Standard CERT-In Incident Reporting Form (Annexure 1).
```

### Report Information Fields
1. **Reporter Details**: Finstock Broking Pvt. Ltd., CISO Emergency Desk.
2. **Incident Details**: Date & time of detection (IST), Incident type (e.g. Unauthorized access, DDoS).
3. **Affected Infrastructure**: IP addresses, domain names, service components involved.
4. **Impact Assessment**: Number of affected accounts, financial/trading impact (if any).
5. **Mitigation Actions**: Immediate containment actions executed, forensic logs preserved.

---

## 3. SEBI Cybersecurity & Cyber Resilience Framework Mapping

| Clause | SEBI Framework Requirement | Finstock Broking Compliance Evidence | Status |
|---|---|---|---|
| **Section 4.1** | Role-Based Access Control (RBAC) | Least-privilege roles (`OPERATIONS_MAKER`, `OPERATIONS_CHECKER`, `COMPLIANCE_OFFICER`). | Verified in code |
| **Section 4.2** | Password & Credential Security | BCrypt / Argon2id hashing, 6-digit MPIN, hardware biometric binding, TOTP 2FA. | Verified in code |
| **Section 4.3** | Data Security & Encryption | AES-256 at rest for KYC docs, TLS 1.3 in transit, PII masking in UI and logs. | Verified in code |
| **Section 4.4** | Network Security & Isolation | Multi-tier VPC: Public subnets (WAF), Private subnets (EKS/RDS), Bastion-free. | Verified in Terraform |
| **Section 4.6** | Audit Trail Maintenance | Cryptographic SHA-256 hash-chained audit logging, immutable ledger entries. | Verified in code |
| **Section 5.1** | Business Continuity & Disaster Recovery | Automated point-in-time recovery (PITR), cross-region replication, RPO < 5m, RTO < 1h. | Verified in runbooks |
| **Section 6.1** | Annual System Audit | System audit ready: immutable log export, ROPA data inventory, findings register. | Verified for auditor |
