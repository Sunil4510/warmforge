# Task Plan

# Overview

This document defines the implementation roadmap for WarmForge.

The plan is intentionally optimized for:

* a 2-day assignment timeline,
* fast MVP delivery,
* operational workflow completeness,
* and explainable architecture decisions.

The implementation strategy prioritizes:

* backend-first development,
* iterative workflow completion,
* and rapid operational visibility.

---

# Implementation Philosophy

The implementation should prioritize:

* completing believable end-to-end workflows,
* avoiding overengineering,
* and building explainable operational systems.

Focus areas:

* SMTP integration
* domain validation
* warmup orchestration
* activity tracking
* dashboard visibility

Non-goals:

* production-scale infrastructure
* advanced analytics
* distributed orchestration complexity

---

# Recommended Execution Order

1. Project Setup
2. Database & Prisma
3. SMTP Integration
4. Domain Validation
5. Warmup Engine
6. Activity Tracking
7. Frontend Dashboard
8. Testing & Polish
9. README & Demo Preparation

---

# Phase 1 — Project Initialization

# Goal

Establish project structure and development environment.

---

# Tasks

## Repository Structure

Create monorepo structure:

```txt id="jlvwps9"
apps/
  frontend/
  backend/

docs/
```

---

## Backend Setup

Setup:

* Node.js
* Express
* TypeScript
* ESLint
* Prettier

---

## Frontend Setup

Setup:

* React
* Vite
* TypeScript
* Material UI
* Routing

---

## Environment Setup

Configure:

* .env files
* environment variable loading
* shared configuration strategy

---

## PostgreSQL Setup

Setup:

* PostgreSQL database
* Prisma ORM
* initial Prisma schema

---

# Deliverables

* running frontend app
* running backend server
* working database connection
* clean repository structure

---

# Phase 2 — Database & Core Models

# Goal

Implement relational data model and Prisma schema.

---

# Tasks

## Prisma Schema

Implement entities:

* User
* Domain
* Mailbox
* WarmupCampaign
* WarmupActivity

---

## Relationships

Configure:

* user → domains
* user → mailboxes
* mailbox → campaign
* mailbox → activities

---

## Migrations

Generate:

* Prisma migrations
* initial database schema

---

## Prisma Client

Setup:

* reusable Prisma client
* database service layer

---

# Deliverables

* working schema
* migrated database
* Prisma integration complete

---

# Phase 3 — SMTP Integration

# Goal

Implement real SMTP connectivity and email sending.

---

# Tasks

## SMTP Service

Build reusable SMTP service:

* transporter creation
* SMTP verification
* email dispatch

---

## Mailbox Onboarding

Implement:

* mailbox creation API
* SMTP validation workflow
* encrypted credential persistence

---

## SMTP Error Handling

Handle:

* invalid credentials
* auth failures
* network timeouts
* provider errors

---

## Encryption Utility

Implement:

* SMTP password encryption/decryption utility

---

# Deliverables

* working SMTP validation
* real email sending
* mailbox onboarding flow complete

---

# Phase 4 — Domain Validation

# Goal

Validate deliverability-related DNS configuration.

---

# Tasks

## DNS Validation Service

Implement:

* SPF validation
* DKIM validation
* DMARC validation
* MX validation

---

## Domain Health Logic

Implement:

* HEALTHY
* WARNING
* CRITICAL

status generation.

---

## Domain APIs

Implement:

* POST /domains/validate
* GET /domains/:id

---

## Persistence

Persist:

* validation results
* timestamps
* domain status

---

# Deliverables

* working DNS validation
* persisted domain health
* operational visibility for configuration issues

---

# Phase 5 — Warmup Engine

# Goal

Implement warmup scheduling and progression workflows.

---

# Tasks

## Warmup Campaign APIs

Implement:

* start campaign
* pause/resume campaign
* fetch campaign status

---

## Scheduler

Setup:

* node-cron scheduler
* periodic campaign processing

---

## Warmup Logic

Implement:

* incremental send progression
* current daily limit calculation
* campaign execution flow

---

# Warmup Formula

\text{currentDailyLimit} = \text{startingVolume} + ((\text{currentDay}-1) \times \text{dailyIncrement})

---

## Email Dispatch Workflow

Scheduler
↓
Fetch active campaigns
↓
Calculate send volume
↓
Send warmup emails
↓
Persist activities

---

## Seed Accounts

Configure:

* predefined seed/test email accounts for warmup sending

---

## Retry Logic

Implement:

* limited SMTP retry attempts
* failure logging

---

# Deliverables

* functional warmup scheduler
* automated email dispatch
* working warmup progression

---

# Phase 6 — Activity Tracking & Monitoring

# Goal

Provide operational visibility into system behavior.

---

# Tasks

## WarmupActivity Persistence

Persist:

* EMAIL_SENT
* SMTP_FAILURE
* WARMUP_STARTED
* BOUNCE_WARNING
* SPAM_WARNING

---

## Activity APIs

Implement:

* mailbox activity timeline
* pagination support
* filtering support

---

## Simulated Warning Events

Implement:

* bounce warning simulation
* spam-risk warning simulation

---

## Logging

Add:

* SMTP logs
* scheduler logs
* validation logs

---

# Deliverables

* operational activity tracking
* monitoring visibility
* warning event support

---

# Phase 7 — Frontend Dashboard

# Goal

Build operational UI for system visibility and workflows.

---

# Tasks

## Dashboard Layout

Build:

* navigation
* dashboard layout
* operational overview cards

---

## Mailbox Onboarding UI

Implement:

* SMTP form
* onboarding workflow
* validation states

---

## Domain Health View

Display:

* SPF
* DKIM
* DMARC
* MX
* health status

---

## Warmup Campaign View

Display:

* campaign status
* current day
* current limit
* execution timestamps

---

## Activity Timeline

Display:

* activity events
* warnings
* SMTP failures

---

## Error States

Handle:

* onboarding failures
* SMTP errors
* validation errors

---

# Deliverables

* operational dashboard
* onboarding workflows
* warmup visibility
* activity monitoring UI

---

# Phase 8 — Testing & Verification

# Goal

Verify operational workflows and improve reliability.

---

# Tasks

## Integration Testing

Test:

* SMTP workflows
* DNS validation
* warmup progression

---

## Manual E2E Testing

Verify:

* onboarding flow
* warmup flow
* activity tracking
* dashboard updates

---

## Error Scenario Testing

Validate:

* invalid SMTP credentials
* DNS failures
* scheduler failures

---

# Deliverables

* validated workflows
* stable MVP behavior

---

# Phase 9 — Polish & Demo Preparation

# Goal

Prepare project for submission and explanation.

---

# Tasks

## Cleanup

Refactor:

* duplicated logic
* naming inconsistencies
* unused code

---

## README

Document:

* setup instructions
* architecture overview
* workflows
* API overview

---

## Architecture Notes

Prepare:

* HLD explanation
* tradeoffs
* design decisions
* operational reasoning

---

## Demo Preparation

Prepare demo flow:

1. Connect mailbox
2. Validate domain
3. Start warmup
4. Show activity tracking
5. Show warning events

---

# Deliverables

* polished MVP
* clean repository
* explainable architecture
* demo-ready submission

---

# Time Allocation Strategy

Suggested focus split:

| Area                 | Priority |
| -------------------- | -------- |
| Backend workflows    | Highest  |
| SMTP integration     | Highest  |
| Warmup engine        | Highest  |
| Dashboard visibility | High     |
| UI polish            | Medium   |
| Advanced features    | Low      |

---

# Important MVP Reminder

The goal is NOT:

* production-scale infrastructure
* distributed systems sophistication
* advanced deliverability analytics

The goal IS:

* believable workflows
* operational clarity
* clean architecture
* explainable engineering reasoning
* functional MVP delivery
