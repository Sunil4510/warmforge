# Database Design

# Overview

WarmForge uses PostgreSQL as the primary relational database.

The database is designed to support:

* mailbox onboarding,
* domain validation,
* warmup scheduling,
* SMTP-based email sending,
* activity tracking,
* and operational visibility.

The schema intentionally prioritizes:

* simplicity,
* relational clarity,
* maintainability,
* and explainability

over distributed-scale complexity or premature optimization.

---

# Database Design Principles

* Keep schema relational and normalized
* Model real business entities clearly
* Avoid overlapping responsibilities between entities
* Optimize for operational querying and dashboard visibility
* Keep relationships easy to reason about
* Prioritize MVP simplicity over excessive abstraction

---

# Core Entities

The primary entities are:

* User
* Domain
* Mailbox
* WarmupCampaign
* WarmupActivity

---

# Entity Relationships

User
├── Domains
└── Mailboxes

Domain
└── Mailboxes

Mailbox
├── WarmupCampaign
└── WarmupActivities

---

# 1. User Entity

# Purpose

Represents platform users/customers.

A user:

* owns domains,
* manages mailboxes,
* and monitors warmup activity.

---

# Fields

| Field     | Type     | Notes                 |
| --------- | -------- | --------------------- |
| id        | UUID     | Primary key           |
| name      | String   | User name             |
| email     | String   | Unique user email     |
| createdAt | DateTime | Creation timestamp    |
| updatedAt | DateTime | Last update timestamp |

---

# Notes

Authentication is intentionally simplified for MVP scope.

---

# 2. Domain Entity

# Purpose

Represents a sending domain and its deliverability-related configuration health.

Example:

* acme.com

Domain health validation is one of the core MVP requirements.

---

# Fields

| Field         | Type        | Notes                        |
| ------------- | ----------- | ---------------------------- |
| id            | UUID        | Primary key                  |
| userId        | UUID        | Owner reference              |
| domainName    | String      | Unique domain                |
| spfStatus     | Enum/String | SPF validation result        |
| dkimStatus    | Enum/String | DKIM validation result       |
| dmarcStatus   | Enum/String | DMARC validation result      |
| mxStatus      | Enum/String | MX validation result         |
| healthStatus  | Enum/String | HEALTHY / WARNING / CRITICAL |
| lastCheckedAt | DateTime    | Last validation timestamp    |
| createdAt     | DateTime    | Creation timestamp           |
| updatedAt     | DateTime    | Last update timestamp        |

---

# Constraints

* domainName should be UNIQUE

---

# Why Separate Domain Entity?

Domain configuration exists independently from individual mailboxes.

Example:

* [sales@acme.com](mailto:sales@acme.com)
* [founder@acme.com](mailto:founder@acme.com)

both belong to:

* acme.com

Separating Domain from Mailbox:

* avoids duplication,
* improves normalization,
* and simplifies domain health tracking.

---

# Health Status Logic

The health status is intentionally simple for MVP scope.

Example:

* HEALTHY → most records configured correctly
* WARNING → some records missing/misconfigured
* CRITICAL → major configuration issues

The goal is operational visibility rather than advanced reputation scoring.

---

# 3. Mailbox Entity

# Purpose

Represents an SMTP-connected outbound mailbox.

Example:

* [sales@acme.com](mailto:sales@acme.com)

Mailbox is intentionally focused on:

* SMTP configuration,
* mailbox ownership,
* and outbound sending identity.

Warmup progression state is intentionally separated into WarmupCampaign.

---

# Fields

| Field                 | Type     | Notes                 |
| --------------------- | -------- | --------------------- |
| id                    | UUID     | Primary key           |
| userId                | UUID     | Owner reference       |
| domainId              | UUID     | Domain reference      |
| email                 | String   | Unique mailbox email  |
| smtpHost              | String   | SMTP host             |
| smtpPort              | Integer  | SMTP port             |
| smtpUsername          | String   | SMTP username         |
| encryptedSmtpPassword | String   | Encrypted credential  |
| createdAt             | DateTime | Creation timestamp    |
| updatedAt             | DateTime | Last update timestamp |

---

# Constraints

* email should be UNIQUE

---

# Security Considerations

SMTP credentials:

* must never be exposed to frontend clients,
* and must be encrypted before persistence.

---

# Why Warmup State Is NOT Stored Here

Mailbox represents:

* the SMTP-connected sending account.

Warmup state represents:

* campaign lifecycle and progression.

Separating these concerns:

* improves modeling clarity,
* avoids overlapping responsibilities,
* and simplifies orchestration logic.

---

# 4. WarmupCampaign Entity

# Purpose

Represents warmup lifecycle, progression state, and scheduling configuration.

This entity controls:

* warmup progression,
* sending limits,
* and campaign lifecycle state.

---

# Fields

| Field             | Type        | Notes                          |
| ----------------- | ----------- | ------------------------------ |
| id                | UUID        | Primary key                    |
| mailboxId         | UUID        | Mailbox reference              |
| status            | Enum/String | ACTIVE / PAUSED / COMPLETED    |
| currentDay        | Integer     | Current warmup progression day |
| currentDailyLimit | Integer     | Current send limit             |
| startingVolume    | Integer     | Initial send count             |
| dailyIncrement    | Integer     | Daily volume increment         |
| maxDailyVolume    | Integer     | Maximum send limit             |
| lastExecutedAt    | DateTime    | Last scheduler execution       |
| startedAt         | DateTime    | Campaign start timestamp       |
| createdAt         | DateTime    | Creation timestamp             |
| updatedAt         | DateTime    | Last update timestamp          |

---

# Constraints

* mailboxId should be UNIQUE

Reason:

* one mailbox should only have one active warmup campaign in MVP scope.

---

# Example Warmup Progression

* Day 1 → 5 emails
* Day 2 → 8 emails
* Day 3 → 12 emails

---

# Why Separate WarmupCampaign?

Warmup behavior represents:

* operational progression state,
* not mailbox identity.

Separating warmup state:

* improves normalization,
* keeps responsibilities clean,
* and simplifies future extensibility.

---

# 5. WarmupActivity Entity

# Purpose

Tracks operational activity and system events.

This entity powers:

* dashboard timelines,
* monitoring,
* warnings,
* operational visibility,
* and debugging.

---

# Why WarmupActivity Instead of EmailLog?

The system tracks more than email sends.

Examples:

* SMTP failures
* bounce warnings
* spam warnings
* campaign lifecycle events

WarmupActivity provides a more flexible operational event model.

---

# Fields

| Field          | Type        | Notes                  |
| -------------- | ----------- | ---------------------- |
| id             | UUID        | Primary key            |
| mailboxId      | UUID        | Mailbox reference      |
| activityType   | Enum/String | Event type             |
| message        | String      | Human-readable details |
| recipientEmail | String      | Optional recipient     |
| createdAt      | DateTime    | Event timestamp        |

---

# Example Activity Types

* EMAIL_SENT
* SMTP_FAILURE
* BOUNCE_WARNING
* SPAM_WARNING
* WARMUP_STARTED

---

# Indexing Strategy

For MVP scope, lightweight indexing is sufficient.

Recommended indexes:

* mailboxId
* domainName
* createdAt
* activityType

These improve:

* dashboard queries,
* timeline rendering,
* and operational filtering.

---

# Persistence Workflows

# Mailbox Onboarding

User submits SMTP credentials
↓
Mailbox entity created
↓
Domain validated/stored

---

# Warmup Execution

Scheduler processes campaign
↓
Emails dispatched
↓
WarmupActivity events persisted

---

# Domain Validation Persistence

DNS validation executed
↓
Domain health fields updated
↓
Dashboard refreshed

---

# Data Lifecycle Considerations

# WarmupActivity Growth

WarmupActivity may grow rapidly over time.

For MVP:

* simple relational persistence is sufficient.

Potential future optimizations:

* archival strategies
* partitioning
* event streaming

These are intentionally outside MVP scope.

---

# Tradeoffs & Design Decisions

# Why PostgreSQL?

The system is naturally relational:

* users own domains,
* domains own mailboxes,
* mailboxes own campaigns and activities.

PostgreSQL supports these relationships cleanly.

---

# Why Prisma?

Prisma provides:

* fast schema modeling,
* strong TypeScript support,
* easy migrations,
* and clean developer experience.

---

# Why Keep Schema Simple?

The assignment prioritizes:

* workflow clarity,
* explainability,
* operational reasoning,
* and implementation quality

over enterprise-scale data architecture.

The schema intentionally avoids:

* event sourcing,
* CQRS,
* excessive normalization,
* and distributed persistence complexity.

---

# Database Design Philosophy

The database design focuses on:

* operational clarity,
* clean relational modeling,
* maintainability,
* and explainability.

The goal is to support:

* believable workflows,
* clean architecture,
* and fast MVP implementation

within the assignment scope.
