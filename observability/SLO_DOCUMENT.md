# Observability, Telemetry & Service Level Objectives (SLO)

## 1. Production SLO & Error Budget Matrix

| Service Component | Target SLO (Market Hours 9:00 AM - 4:00 PM) | Measured SLI (30-Day Rolling) | Error Budget (Monthly) | Burn Rate Alert Trigger |
|---|---|---|---|---|
| **OMS Order Gateway** | **99.95% Availability** | 99.98% | 21.6 minutes of downtime | Burn > 2% in 1 hour (Page On-Call) |
| **Order Placement Latency** | **p99 < 300 ms** | 118 ms | 1% of total daily orders | Latency > 350ms for > 2 mins |
| **Market Data Streaming** | **p99 < 500 ms** (Tick-to-Screen) | 210 ms | 0.05% dropped packets | Packet loss > 0.1% |
| **Double-Entry Ledger** | **100.00% Balance Continuity** | 100.00% (0 paise drift) | 0 minutes | Discrepancy > 0 paise (Immediate SEV-1) |
| **Contract Note Batch** | Delivered before **10:00 PM IST** | 8:15 PM average | 0 missed trading days | Generation delay > 30 mins |
| **Android Crash-Free Rate** | **> 99.50%** of sessions | 99.98% | 0.5% crash rate | Crash spike > 0.2% in any release cohort |

---

## 2. Prometheus Alertmanager Rules Configuration (Sample)

```yaml
groups:
  - name: finstock_trading_alerts
    rules:
      - alert: HighOrderRejectionRate
        expr: rate(oms_orders_rejected_total[1m]) / rate(oms_orders_received_total[1m]) > 0.015
        for: 60s
        labels:
          severity: critical
          tier: trading_engine
        annotations:
          summary: "Order rejection rate exceeded 1.5% during market hours"
          description: "Rejections running at {{ $value | humanizePercentage }}. Investigate exchange connectivity or RMS margin limits."
          runbook_url: "https://wiki.finstock.internal/runbooks/exchange-connectivity-loss"

      - alert: LedgerImbalanceDetected
        expr: finstock_ledger_discrepancy_paise != 0
        for: 10s
        labels:
          severity: page
          tier: accounting
        annotations:
          summary: "CRITICAL: Ledger double-entry balance continuity violated"
          description: "Computed discrepancy is {{ $value }} paise. Audit journal halted."
          runbook_url: "https://wiki.finstock.internal/runbooks/ledger-imbalance"

      - alert: PlayIntegrityFailureSpike
        expr: rate(security_play_integrity_rejected_total[5m]) > 20
        for: 2m
        labels:
          severity: warning
          tier: client_security
        annotations:
          summary: "Abnormal surge in Play Integrity attestation failures"
          description: "Potential credential stuffing or bot attack. Rate: {{ $value }} failures/sec."
```
