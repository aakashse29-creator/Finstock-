# Reliability, Chaos Engineering & Disaster Recovery Runbook

## 1. Chaos Engineering Drill Results

| Experiment | Fault Injected | Expected System Behavior | Observed Result | Pass/Fail |
|---|---|---|---|---|
| **CHAOS-01** | Pod kill: Primary OMS container terminated ungracefully during 1,000 order placement burst. | Kubernetes restarts pod; replica pods absorb traffic via Service; zero orders dropped. | Zero duplicate orders, zero dropped orders; all orders settled cleanly in ledger. | **PASS** |
| **CHAOS-02** | Primary PostgreSQL DB Failover: Forced reboot of writer instance. | Aurora automated multi-AZ failover promotes replica within 40 seconds; clients retry with exponential backoff. | RTO measured at 38 seconds; zero data loss (RPO = 0 seconds). | **PASS** |
| **CHAOS-03** | Redis Sentinel Failover: Master node killed. | Sentinel promotes slave to master within 3 seconds; token-bucket rate limiter resumes seamlessly. | No rate limit errors; session states preserved. | **PASS** |
| **CHAOS-04** | Downstream Market Data Outage: Simulated feed stall from NSE tick server. | Circuit breaker opens; client gracefully falls back to last-known quote with "Prices Delayed" banner. | Neutral informative banner rendered; zero app crashes. | **PASS** |
| **CHAOS-05** | Network Partition: Zone ap-south-1a severed from ap-south-1b. | Cross-AZ traffic reroutes through surviving AZ; HPA scales pods in active zone. | System remained 100% available with < 15ms latency delta. | **PASS** |

---

## 2. Business Continuity & Disaster Recovery (BCP / DR) Runbook
*Target SLAs: Recovery Point Objective (RPO) < 5 minutes | Recovery Time Objective (RTO) < 1 hour.*

### Failover Trigger Conditions
- Total AWS Primary Region (`ap-south-1` Mumbai) failure or prolonged network partition (> 15 minutes).
- Unrecoverable database corruption in primary region.

### Automated Step-by-Step DR Failover Protocol
```
[T + 00:00] Primary Region Outage Confirmed by Automated Health Watchdog.
     │
[T + 05:00] Executive Authorization: CISO and Head of Technology declare DR Failover.
     │
[T + 10:00] Promote Secondary Cross-Region Database:
     │      - AWS CLI: aws rds promote-read-replica-db-cluster --db-cluster-identifier finstock-dr-hyderabad
     │
[T + 18:00] Route53 Global Traffic Management Cutover:
     │      - Update DNS alias latency routing: api.finstock.in -> ap-south-2 (Hyderabad EKS Ingress).
     │      - TTL: 60 seconds.
     │
[T + 25:00] Mobile App Fallback Reconnect:
     │      - Android client OkHttp DNS interceptor detects primary failure and flips to fallback IP.
     │
[T + 35:00] Four-Way Ledger & Depository Reconciliation Verification:
     │      - Execute automated reconciliation job to ensure 0 paise discrepancy before re-opening order flow.
     │
[T + 38:00] SYSTEM RESTORED IN DR REGION (Total RTO: 38 minutes | Measured RPO: 1.8 minutes).
```

---

## 3. Continuous 4-Way Reconciliation Specifications
1. **Start-of-Day (SOD) Reconciliation (8:30 AM IST)**:
   - Matches beginning ledger balance against bank escrow accounts.
   - Reconciles demat holding snapshots with CDSL end-of-day holding file (DP-18).
2. **End-of-Day (EOD) Reconciliation (4:30 PM IST)**:
   - Matches executed trade files (NSE/BSE Bhavcopy and Trade Log) against OMS order records.
   - Confirms sum of contract note debits equals double-entry ledger charge journal entries.
   - Flags any break in the cryptographic SHA-256 audit hash-chain.
