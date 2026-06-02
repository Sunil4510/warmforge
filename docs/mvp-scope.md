# MVP Scope

# Overview

WarmForge is intentionally designed as an MVP (Minimum Viable Product) focused on:

* operational workflows,
* deliverability visibility,
* warmup orchestration,
* and explainable architecture decisions.

The system prioritizes:

* simplicity,
* modularity,
* and practical implementation

over production-scale infrastructure complexity.

This document clearly defines:

* what is included in the MVP,
* what is intentionally excluded,
* and what functionality may be simulated for demonstration purposes.

---

# MVP Goals

The MVP should demonstrate the ability to:

* connect outbound mailboxes via SMTP,
* validate domain health/configuration,
* gradually warm up email accounts,
* send real emails,
* track operational activity,
* and surface deliverability-related signals.

The primary goal is to showcase:

* workflow design,
* system thinking,
* operational reasoning,
* and clean architecture.

---

# Included Features

# 1. SMTP Mailbox Connection

Users should be able to:

* add outbound mailboxes,
* configure SMTP credentials,
* and validate SMTP connectivity.

### Included

* SMTP host/port configuration
* SMTP credential validation
* SMTP transport verification
* mailbox persistence

### Notes

* real SMTP integration is required
* SMTP credentials will be encrypted before persistence

---

# 2. Domain Health Validation

The system should validate:

* SPF records
* DKIM records
* DMARC records
* MX records

### Included

* DNS lookups
* record existence checks
* basic validation logic
* domain health status visibility

### Dashboard Visibility

Users should be able to see:

* valid/missing records,
* warnings,
* and health indicators.

---

# 3. Warmup Scheduling

The system should support gradual email warmup progression.

### Included

* warmup campaign creation
* periodic scheduler execution
* incremental sending limits
* configurable warmup progression

### Example

* Day 1 → 5 emails
* Day 2 → 8 emails
* Day 3 → 12 emails

---

# 4. Real Email Sending

The system should:

* send real emails via SMTP,
* and track sending activity.

### Included

* SMTP email dispatch
* warmup send execution
* activity tracking
* send status logging

### MVP Simplification

Warmup emails will be sent to:

* predefined seed/test accounts.

---

# 5. Operational Dashboard

The frontend dashboard should provide visibility into:

* connected mailboxes,
* warmup progress,
* domain health,
* activity logs,
* and warning events.

### Included UI Areas

* mailbox onboarding
* domain health view
* activity timeline
* warmup progress monitoring

---

# 6. Activity Tracking

The system should track:

* email sends,
* SMTP failures,
* warning events,
* and warmup execution activity.

### Example Activity Types

* EMAIL_SENT
* SMTP_FAILURE
* WARMUP_STARTED
* BOUNCE_WARNING
* SPAM_WARNING

---

# 7. Simulated Warning Events

The MVP may simulate:

* bounce warnings,
* spam-risk warnings,
* and related operational alerts.

### Why Simulated?

The assignment does not require:

* provider-side deliverability integrations,
* real spam-detection systems,
* or inbox placement infrastructure.

Simulation allows:

* believable workflows,
* operational visibility,
* and demonstration of safeguard concepts.

---

# Optional Bonus Features

These are considered enhancements and not strict MVP requirements.

Potential optional features:

* automatic warmup pause
* sending slowdown logic
* risk scoring
* configurable safeguard thresholds
* retry dashboards

These should only be implemented if time permits.

---

# Excluded Features

The following are intentionally excluded from MVP scope.

---

# 1. Real Inbox Placement Tracking

The system will NOT:

* measure whether emails land in inbox/spam/promotions tabs,
* or integrate with real deliverability monitoring providers.

Reason:

* high infrastructure complexity,
* outside MVP scope.

---

# 2. Advanced Spam Detection

The system will NOT implement:

* AI-based spam analysis,
* content scanning,
* or provider-level reputation analysis.

Reason:

* unnecessary complexity for assignment scope.

---

# 3. OAuth Provider Integrations

The system will NOT implement:

* Google OAuth,
* Microsoft OAuth,
* or provider-specific APIs.

Reason:

* SMTP-based integration is sufficient for MVP requirements.

---

# 4. Distributed Infrastructure

The system will NOT include:

* Kubernetes,
* distributed schedulers,
* multi-region deployments,
* or microservices architecture.

Reason:

* assignment prioritizes explainability and workflows over infrastructure scale.

---

# 5. Queue-Based Distributed Processing

The MVP will use:

* simple cron-based scheduling.

It will NOT implement:

* Kafka,
* RabbitMQ,
* or distributed queue orchestration.

Reason:

* unnecessary for MVP scale.

---

# 6. Advanced Analytics

The MVP will NOT include:

* deep deliverability analytics,
* predictive reputation scoring,
* or complex reporting systems.

Reason:

* outside core workflow scope.

---

# MVP Philosophy

The MVP is intentionally designed to be:

* operationally believable,
* technically clean,
* easy to explain,
* and practical to implement within the assignment timeline.

The focus is:

* workflow quality,
* system reasoning,
* architecture clarity,
* and operational thinking

rather than production-scale infrastructure sophistication.
