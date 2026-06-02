# WarmForge — System Context

# Overview

WarmForge is an Email Warmup & Deliverability Monitoring System designed to help businesses safely prepare outbound email accounts for cold-email outreach.

Businesses performing outbound sales often create new domains and email accounts for outreach campaigns. However, email providers such as Gmail and Outlook treat newly created sending accounts as low-trust.

If these accounts immediately begin sending large volumes of emails, providers may classify the behavior as suspicious or spam-like, which can negatively impact deliverability and sender reputation.

WarmForge helps businesses:

* gradually warm up outbound email accounts,
* validate domain/email configuration health,
* monitor deliverability-related activity,
* and improve operational visibility into outbound email systems.

The system is intentionally designed as an MVP focused on:

* clear workflows,
* operational reasoning,
* modular architecture,
* and explainable engineering decisions,

rather than production-scale infrastructure complexity.

---

# Business Problem

Outbound email deliverability is heavily influenced by sender reputation and domain trust.

Newly created email accounts and domains often lack reputation with providers such as:

* Gmail
* Outlook
* Google Workspace

Aggressive sending behavior from new accounts can result in:

* emails landing in spam folders,
* temporary provider throttling,
* domain reputation degradation,
* or email rejection.

In addition, many businesses misconfigure email-related DNS records such as:

* SPF,
* DKIM,
* DMARC,
* and MX records,

which further reduces sender trust and deliverability.

Most non-technical users lack visibility into:

* whether their domain is configured correctly,
* whether warmup is progressing safely,
* or whether operational risks are emerging.

WarmForge aims to solve these problems through controlled warmup workflows and deliverability monitoring.

---

# Core Concepts

## Domain Health

Domain health refers to whether a domain is properly configured for email deliverability.

The system validates:

* SPF records
* DKIM records
* DMARC records
* MX records

These records help providers verify:

* sender legitimacy,
* domain authenticity,
* and email trustworthiness.

Incorrect or missing DNS records may negatively impact deliverability.

---

## Email Warmup

Warmup is the process of gradually increasing outbound email activity over time in order to build sender trust safely.

Instead of sending hundreds of emails immediately, warmup progressively ramps sending volume.

Example:

* Day 1 → 5 emails
* Day 2 → 8 emails
* Day 3 → 12 emails

The goal is to mimic safer and more natural sending behavior.

---

## SMTP-Based Sending

WarmForge sends real emails using SMTP-connected mailboxes.

Users provide SMTP credentials for outbound mailboxes, and the system uses those credentials to:

* validate mailbox connectivity,
* dispatch warmup emails,
* and track sending activity.

SMTP is intentionally chosen because:

* it is universally supported,
* aligns with assignment requirements,
* and keeps integrations simple for MVP scope.

---

## Operational Visibility

The system provides users with visibility into:

* warmup progress,
* domain health,
* sending activity,
* and warning/risk events.

Users should be able to quickly identify:

* configuration issues,
* SMTP failures,
* or deliverability-related warnings.

---

# System Responsibilities

WarmForge is responsible for:

* validating domain configuration health,
* managing SMTP-connected mailboxes,
* scheduling warmup activity,
* sending real emails,
* tracking operational activity,
* and surfacing deliverability-related signals.

The system is NOT responsible for:

* real inbox placement tracking,
* advanced spam-detection systems,
* provider-side deliverability analytics,
* or production-scale email infrastructure.

---

# MVP Goals

The MVP focuses on:

* believable operational workflows,
* clean architecture,
* modular implementation,
* and explainable engineering decisions.

The system prioritizes:

* simplicity,
* maintainability,
* and workflow clarity

over:

* distributed systems complexity,
* large-scale orchestration,
* or advanced deliverability infrastructure.

---

# Core User Workflow

User connects mailbox via SMTP
↓
System validates SMTP credentials
↓
System validates domain health
↓
Warmup campaign started
↓
Scheduler dispatches warmup emails
↓
Activity tracked and displayed
↓
Warnings/health signals surfaced to user

---

# Architecture Philosophy

WarmForge follows a simple modular architecture:

* frontend dashboard,
* backend API,
* SMTP service,
* DNS validation service,
* scheduler,
* and activity tracking.

The architecture intentionally avoids:

* unnecessary microservices,
* excessive abstractions,
* or production-scale distributed infrastructure.

The focus is:

* operational clarity,
* clean workflows,
* and explainable implementation decisions.
