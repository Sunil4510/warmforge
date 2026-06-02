# Architecture HLD (High-Level Design)

# Overview

WarmForge is an Email Warmup & Deliverability Monitoring System that helps businesses safely warm up outbound email accounts and monitor deliverability-related health.

The system allows users to:

* connect outbound mailboxes via SMTP,
* validate domain configuration health,
* schedule gradual warmup activity,
* send real emails,
* and monitor operational activity through a dashboard.

The architecture intentionally prioritizes:

* modularity,
* explainability,
* operational clarity,
* and MVP simplicity

over production-scale infrastructure complexity.

---

# High-Level Architecture

```
                ┌──────────────────────┐
                │   React Frontend     │
                │ Dashboard / UI Layer │
                └──────────┬───────────┘
                           │ REST APIs
                           ▼
             ┌───────────────────────────┐
             │   Node.js Backend API     │
             │ Express + TypeScript      │
             └──────────┬────────────────┘
                        │
    ┌───────────────────┼────────────────────┐
    ▼                   ▼                    ▼
```

┌────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ SMTP Service   │  │ DNS Validator   │  │ Warmup Scheduler│
│ Nodemailer     │  │ SPF/DKIM/MX     │  │ node-cron       │
└────────┬───────┘  └────────┬────────┘  └────────┬────────┘
│                   │                    │
▼                   ▼                    ▼

SMTP Providers         DNS Lookup         Warmup Jobs
(Gmail/Workspace)

```
                        │
                        ▼

               ┌─────────────────┐
               │ PostgreSQL DB   │
               │ Prisma ORM      │
               └─────────────────┘
```

---

# Core Components

# 1. Frontend Dashboard

## Responsibilities

The frontend provides operational visibility and user interaction.

Users should be able to:

* connect mailboxes,
* validate domain health,
* start warmup campaigns,
* monitor sending activity,
* and view warning events.

---

## Main Views

### Dashboard

Displays:

* connected mailboxes,
* warmup progress,
* domain health summary,
* and operational statistics.

---

### Mailbox Onboarding

Allows users to:

* input SMTP credentials,
* test SMTP connectivity,
* and initiate onboarding.

---

### Domain Health View

Displays:

* SPF status,
* DKIM status,
* DMARC status,
* MX status,
* and health indicators.

---

### Activity Timeline

Displays:

* email sending events,
* warning events,
* and SMTP failures.

---

# 2. Backend API

The backend acts as the orchestration layer of the system.

---

## Responsibilities

* mailbox management
* SMTP validation
* domain validation
* warmup orchestration
* activity tracking
* dashboard APIs

---

## API Style

* REST APIs
* modular route structure
* centralized error handling

---

# 3. SMTP Service

The SMTP service handles all outbound email operations.

---

## Responsibilities

* validate SMTP credentials
* establish SMTP transport
* send real emails
* handle SMTP failures

---

## Technology

* Nodemailer
* SMTP protocol

---

## Workflow

Warmup Scheduler
↓
Warmup Service
↓
SMTP Service
↓
SMTP Provider
↓
Recipient Inbox

---

# 4. DNS Validation Service

The DNS validation service validates domain health configuration.

---

## Responsibilities

Validate:

* SPF records
* DKIM records
* DMARC records
* MX records

---

## Technology

* Native Node.js dns module

---

## Workflow

Domain Added
↓
DNS Lookup
↓
Record Validation
↓
Health Status Calculation
↓
Persist Results

---

# 5. Warmup Scheduler

The scheduler drives warmup progression and periodic sending.

---

## Responsibilities

* process active warmup campaigns
* calculate daily send limits
* dispatch warmup emails
* update activity tracking

---

## Technology

* node-cron

---

## Why node-cron?

node-cron is intentionally chosen because:

* it is simple,
* easy to explain,
* operationally sufficient for MVP scope,
* and avoids unnecessary distributed scheduling complexity.

---

# 6. Activity Tracking

Activity tracking provides operational visibility into the system.

---

## Responsibilities

Track:

* email sends,
* SMTP failures,
* warning events,
* and warmup activity.

---

## Example Activity Types

* EMAIL_SENT
* SMTP_FAILURE
* BOUNCE_WARNING
* SPAM_WARNING
* WARMUP_STARTED

---

# 7. PostgreSQL Database

The database stores:

* users,
* domains,
* mailboxes,
* campaigns,
* and activity logs.

---

## Why PostgreSQL?

The system is highly relational:

* users own domains,
* domains own mailboxes,
* mailboxes generate activities and schedules.

PostgreSQL supports these relationships naturally and simplifies operational querying.

---

# Core Workflows

# Mailbox Onboarding Flow

User submits SMTP credentials
↓
Backend validates SMTP connection
↓
Domain extracted from mailbox
↓
DNS validation executed
↓
Mailbox + Domain stored
↓
Dashboard updated

---

# Domain Validation Flow

Domain submitted
↓
DNS lookup performed
↓
SPF/DKIM/DMARC/MX validated
↓
Health score generated
↓
Results persisted

---

# Warmup Flow

Warmup campaign activated
↓
Scheduler processes active campaigns
↓
Send limits calculated
↓
Emails dispatched via SMTP
↓
Activity recorded
↓
Dashboard updated

---

# Monitoring Flow

SMTP failures or warnings generated
↓
Activity event created
↓
Dashboard/timeline updated

---

# Hot Path / Critical Flow

The most critical operational workflow is the warmup sending pipeline.

Warmup Scheduler
↓
Fetch active warmup campaigns
↓
Calculate target send volume
↓
Dispatch emails via SMTP
↓
Persist activity logs
↓
Update monitoring/dashboard state

This flow directly impacts:

* warmup progression,
* operational visibility,
* and deliverability workflows.

---

# Operational Considerations

# Gradual Warmup

Sending volume increases incrementally over time to avoid spam-like behavior.

---

# Retry Handling

SMTP failures should support limited retry attempts.

---

# Warning Simulation

Bounce and spam-risk warnings may be simulated for MVP scope.

---

# Optional Safeguards

Potential future enhancement:

* auto pause campaigns,
* reduce sending rate,
* or flag risky accounts.

---

# Bottlenecks & Risks

## SMTP Rate Limits

SMTP providers may throttle excessive sending.

---

## Invalid Credentials

Incorrect SMTP credentials may block sending.

---

## DNS Propagation Delays

Recent DNS changes may not appear immediately.

---

## Scheduler Spikes

Large numbers of simultaneous warmup jobs may increase load.

---

## Queue Backlog (Future)

Future scaling may require queue-based processing.

---

# Scaling Strategy (MVP-Level)

The MVP intentionally keeps scaling simple.

Potential lightweight scaling strategies:

* asynchronous background processing,
* horizontally scalable workers,
* indexed activity tables,
* background DNS validation tasks.

The system intentionally avoids:

* distributed orchestration,
* multi-region deployments,
* and complex infrastructure patterns.

---

# Tradeoffs & Design Decisions

## Why SMTP?

SMTP is universally supported and aligns with assignment requirements.

---

## Why node-cron?

Simple and explainable scheduling for MVP workflows.

---

## Why Simulated Warning Events?

Avoids building complex provider-side infrastructure while still demonstrating operational workflows.

---

## Why Avoid Overengineering?

The assignment prioritizes:

* workflow design,
* operational reasoning,
* architecture clarity,
* and explainability

over production-scale distributed systems complexity.

---

# Architecture Philosophy

WarmForge is intentionally designed as:

* modular,
* operationally realistic,
* understandable,
* and easy to explain.

The system prioritizes:

* workflow clarity,
* maintainability,
* and engineering reasoning

over:

* infrastructure complexity,
* excessive abstraction,
* or distributed systems sophistication.
