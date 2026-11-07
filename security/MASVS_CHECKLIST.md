# OWASP MASVS L2 & ASVS L2 Security Verification Pack

## Part 1: OWASP MASVS L2 Verification (Android Client)

| MASVS Category | MASVS Requirement | Technical Implementation in Finstock Broking | Verification Evidence | Residual Risk / Status |
|---|---|---|---|---|
| **MASVS-STORAGE-1** | System credential storage | Android Keystore StrongBoxKeymaster4 hardware-backed crypto used for storing master encryption keys. | Tested on API 28+ hardware with StrongBox. | Clean / Verified |
| **MASVS-STORAGE-2** | No sensitive data in logs | Logcat stripped in release builds (`proguard-rules.pro`); all diagnostic logs redact PII, tokens, and bank details. | Automated CI logcat grep test for PAN/Aadhaar/OTP. | Clean / Verified |
| **MASVS-CRYPTO-1** | Cryptographic primitives | AES-256-GCM for files, Argon2id for MPIN hashing, TLS 1.3 ECDHE-RSA-AES256-GCM-SHA384. | Unit tests in `core-security` test suite. | Clean / Verified |
| **MASVS-AUTH-1** | Biometric authentication | Android BiometricPrompt API with `BIOMETRIC_STRONG` crypto-object bound to Keystore key. | Verified on physical biometric hardware. | Clean / Verified |
| **MASVS-NETWORK-1** | TLS & Cleartext traffic | `android:usesCleartextTraffic="false"`, TLS 1.3 enforced, network_security_config.xml active. | OWASP ZAP network baseline scan. | Clean / Verified |
| **MASVS-NETWORK-2** | Certificate Pinning | Primary Pin (`pin-sha256/WoiWRFY9KCYTUmrUspEKLgMETuTBQikkORas5ndS58g=`) + Backup Pin configured. | Pin failure test disconnects immediately. | Clean / Verified |
| **MASVS-PLATFORM-1** | WebView lockdown | WebViews have JavaScript disabled by default, file access blocked, origin allowlist strictly enforced. | Static AST analysis in Detekt custom rules. | Clean / Verified |
| **MASVS-PLATFORM-2** | Overlay / Tapjacking | `filterTouchesWhenObscured="true"` set on MPIN, order placement, and fund withdrawal buttons. | Touch injection test fails when overlay active. | Clean / Verified |
| **MASVS-CODE-1** | Obfuscation & R8 | R8 full-mode enabled with dictionary renaming, dead-code elimination, and resource shrinking. | Decompilation analysis with JADX-GUI. | Clean / Verified |
| **MASVS-RESILIENCE** | Tamper & Root detection | Native C++ integrity checks for Magisk, Zygisk, Frida, Xposed, and Play Integrity API attestation. | Server-side hardware attestation check. | Clean / Verified |

---

## Part 2: OWASP ASVS L2 & API Top 10 Verification (Backend & Admin)

| Category | Control Description | Technical Implementation | Verification Evidence |
|---|---|---|---|
| **API1:2023** | Broken Object Level Authorization (BOLA) | Every request validates user tenancy against JWT subject; `/reports/{id}` checks `userId === auth.uid`. | Automated BOLA test iterates over OpenAPI spec with ID tampering. |
| **API2:2023** | Broken Authentication | Rotating refresh token families; reuse of an old refresh token instantly invalidates the entire family. | Refresh token replay unit test in `AuthServiceTest`. |
| **API3:2023** | Broken Object Property Authorization | DTOs use `@JsonIgnoreProperties(ignoreUnknown = false)` and strict Kotlin data class validation. | Mass-assignment injection tests reject extra fields. |
| **API4:2023** | Unrestricted Resource Consumption | Redis Token-Bucket rate limiting on all public and authenticated endpoints (30 req/s per user). | k6 load tests trigger HTTP 429 upon threshold breach. |
| **API5:2023** | Broken Function Level Authorization | Spring Security `@PreAuthorize("hasRole('OPERATIONS_CHECKER')")` on all back-office approvals. | Role boundary matrix tests verify least privilege. |
| **API6:2023** | Unrestricted Access to Sensitive Business Flows | Step-up authentication (MPIN/TOTP) required for fund withdrawals > ₹50,000 and primary bank changes. | Automated test requires step-up challenge resolution. |
| **API7:2023** | Server-Side Request Forgery (SSRF) | Outbound webhooks/downloads restricted to strict IP and domain allowlist; RFC 1918 IPs blocked. | SSRF payload test against internal metadata endpoints (169.254.169.254) blocked. |
| **API8:2023** | Security Misconfiguration | HSTS (max-age=63072000), CSP, X-Content-Type-Options: nosniff, X-Frame-Options: DENY. | SecurityHeaders.com grade A+ automated scan. |
| **API9:2023** | Improper Inventory Management | OpenAPI 3.1 contract synchronized with Spring Boot code; deprecated v0 endpoints decommissioned. | OpenAPI linting passes without unversioned routes. |
| **API10:2023** | Unsafe Consumption of APIs | Third-party responses (DigiLocker, BSE StAR, NSE) validated with JSON Schema before deserialization. | Schema validation tests reject malformed external payloads. |
