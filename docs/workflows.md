# Workflows

# Overview

This document defines the core operational workflows of WarmForge.

The system primarily revolves around:

* mailbox onboarding,
* domain validation,
* warmup orchestration,
* email sending,
* and operational monitoring.

The workflows are intentionally designed to remain:

* simple,
* operationally believable,
* modular,
* and easy to explain.

---

# 1. Mailbox Onboarding Workflow

# Goal

Allow users to connect outbound mailboxes using SMTP credentials and validate deliverability-related configuration.

---

# Workflow

User submits SMTP credentials
↓
Backend validates SMTP connection
↓
Extract domain from mailbox email
↓
Perform DNS validation
↓
Persist mailbox + domain
↓
Return onboarding status
↓
Dashboard updated

---

# Detailed Steps

## Step 1 — User Inputs Mailbox Details

The user submits:

* email address
* SMTP host
* SMTP port
* SMTP username
* SMTP password/app password

Example:

* [sales@acme.com](mailto:sales@acme.com)
* smtp.gmail.com

---

## Step 2 — SMTP Validation

The backend:

* creates SMTP transport using Nodemailer,
* verifies connectivity,
* validates credentials.

### Possible Failures

* invalid credentials
* authentication failure
* network timeout
* unsupported SMTP configuration

---

## Step 3 — Domain Extraction

The system extracts:

* acme.com

from:

* [sales@acme.com](mailto:sales@acme.com)

---

## Step 4 — DNS Validation

The DNS validation service checks:

* SPF
* DKIM
* DMARC
* MX

Results are converted into:

* health indicators,
* warnings,
* and domain health score.

---

## Step 5 — Persistence

The system stores:

* mailbox configuration
* encrypted SMTP credentials
* domain validation results

---

## Step 6 — Dashboard Update

The frontend dashboard displays:

* mailbox status
* domain health
* onboarding success/failure

---

# 2. Domain Validation Workflow

# Goal

Validate whether a domain is correctly configured for outbound email deliverability.

---

# Workflow

Domain submitted
↓
DNS lookup initiated
↓
SPF validation
↓
DKIM validation
↓
DMARC validation
↓
MX validation
↓
Health score generated
↓
Results persisted

---

# Detailed Validation

## SPF Validation

Checks whether:

* authorized mail servers are configured.

Example:

* TXT record contains valid SPF configuration.

---

## DKIM Validation

Checks whether:

* DKIM-related records exist.

For MVP:

* existence/basic validation is sufficient.

---

## DMARC Validation

Checks whether:

* DMARC policy exists.

Example:

* quarantine
* reject
* none

---

## MX Validation

Checks whether:

* domain has valid mail exchange records.

---

# Result Example

* SPF → VALID
* DKIM → MISSING
* DMARC → VALID
* MX → VALID

---

# 3. Warmup Campaign Workflow

# Goal

Gradually increase outbound email activity over time to build sender trust safely.

---

# Workflow

Warmup campaign started
↓
Scheduler periodically processes campaign
↓
Daily send limit calculated
↓
Warmup emails generated
↓
Emails dispatched via SMTP
↓
Activity tracked
↓
Dashboard updated

---

# Detailed Steps

## Step 1 — Warmup Campaign Creation

User activates warmup for mailbox.

Campaign settings may include:

* starting volume
* daily increment
* max volume

---

## Step 2 — Scheduler Execution

node-cron periodically executes:

* active warmup campaigns.

Example:

* hourly
* daily

---

## Step 3 — Daily Volume Calculation

The system calculates:

* how many emails should be sent for the current warmup day.

Example:

* Day 1 → 5
* Day 2 → 8
* Day 3 → 12

---

## Step 4 — Email Dispatch

SMTP service:

* establishes transport,
* sends emails,
* records send results.

---

## Step 5 — Activity Tracking

Each operation generates:

* WarmupActivity events.

Examples:

* EMAIL_SENT
* SMTP_FAILURE
* WARMUP_STARTED

---

## Step 6 — Dashboard Refresh

The frontend displays:

* progress
* send counts
* recent activity
* warnings

---

# 4. Monitoring Workflow

# Goal

Provide operational visibility into warmup execution and deliverability-related issues.

---

# Workflow

SMTP failures or warnings generated
↓
Activity event created
↓
Dashboard timeline updated
↓
Warnings surfaced to user

---

# Monitoring Events

The system tracks:

* SMTP failures
* bounce warnings
* spam-risk warnings
* warmup execution failures

---

# Warning Events

For MVP:

* bounce and spam warnings may be simulated.

Reason:

* real provider-side integrations are outside assignment scope.

---

# Example Warning Events

* BOUNCE_WARNING
* SPAM_WARNING
* SMTP_FAILURE

---

# 5. Retry Workflow

# Goal

Handle temporary SMTP failures safely.

---

# Workflow

SMTP send fails
↓
Retry eligibility checked
↓
Retry scheduled
↓
Retry attempts exhausted
↓
Failure logged

---

# Retry Rules

* limited retry attempts
* avoid infinite retries
* persist failure activity

---

# 6. Optional Safeguard Workflow (Bonus)

# Goal

Reduce risk when suspicious behavior is detected.

---

# Potential Workflow

High failure/warning rate detected
↓
Warmup campaign flagged
↓
Sending slowed or paused
↓
Warning surfaced to user

---

# MVP Note

This workflow is considered:

* optional,
* and may remain conceptual unless time permits.

---

# Workflow Design Philosophy

The workflows intentionally prioritize:

* operational clarity,
* explainability,
* modularity,
* and believable deliverability behavior.

The system is designed to demonstrate:

* strong engineering reasoning,
* clean orchestration logic,
* and workflow-focused architecture

rather than enterprise-scale infrastructure sophistication.
