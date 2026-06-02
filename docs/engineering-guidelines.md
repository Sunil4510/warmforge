# Engineering Guidelines

# General Principles

* Prioritize simplicity and explainability over overengineering.
* Build for MVP scope, not production-scale infrastructure.
* Keep workflows operationally believable and easy to reason about.
* Prefer maintainability and readability over premature optimization.
* Avoid unnecessary abstractions and architectural complexity.

---

# Architecture Principles

* Keep architecture modular but simple.
* Separate business logic from infrastructure logic.
* Separate SMTP sending logic from warmup orchestration.
* Separate DNS validation logic from scheduling logic.
* Keep services independently understandable.
* Prefer clear service boundaries over deep abstraction layers.

---

# Backend Architecture Guidelines

## Structure

The backend should follow a modular feature-oriented structure.

Example modules:

* mailbox
* domain
* warmup
* activity

Each module should contain:

* routes
* controllers
* services
* validations
* types

---

## Service Separation

Infrastructure-level services should remain reusable and isolated.

Examples:

* smtp.service.ts
* dns-validation.service.ts

Business modules should consume services rather than directly implementing infrastructure logic.

Example flow:
Controller → Business Service → SMTP Service

---

## API Guidelines

* Use REST APIs.
* Keep request/response structures consistent.
* Validate request payloads.
* Return meaningful error messages.
* Avoid leaking internal implementation details to clients.

---

## Error Handling

* Handle SMTP failures gracefully.
* Handle invalid DNS lookup results safely.
* Use centralized error middleware.
* Avoid exposing sensitive information in errors.

---

## Scheduling Guidelines

* Use node-cron for periodic warmup processing.
* Keep scheduling logic simple and explainable.
* Scheduler should process active warmup campaigns incrementally.
* Avoid distributed scheduling complexity for MVP scope.

---

## Retry Handling

* Failed SMTP sends should support limited retry attempts.
* Avoid infinite retry loops.
* Failed attempts should be logged for operational visibility.

---

## Logging Guidelines

The system should log:

* SMTP failures
* DNS validation results
* warmup execution events
* warning events
* activity tracking events

Logs should support debugging and demo visibility.

---

# Database Guidelines

## Relational Modeling

Use relational modeling for:

* users,
* domains,
* mailboxes,
* campaigns,
* and activities.

Relationships should remain clear and normalized.

---

## Prisma Guidelines

* Use Prisma schema as the source of truth.
* Use migrations for schema evolution.
* Keep entity relationships explicit.
* Avoid unnecessary database complexity.

---

## Security

* SMTP credentials must never be exposed to frontend clients.
* SMTP credentials should be encrypted before persistence.
* Sensitive configuration should remain server-side only.
* Environment variables must be used for secrets and configuration.

---

# Frontend Guidelines

## Frontend Philosophy

The frontend should prioritize:

* operational visibility,
* clarity,
* and fast interaction flows.

This is an operational dashboard system, not a marketing website.

---

## UI Guidelines

Use Material UI components for:

* forms,
* cards,
* alerts,
* tables,
* dialogs,
* and status indicators.

The UI should remain:

* clean,
* minimal,
* and functional.

---

## Frontend Structure

Organize frontend by:

* pages
* features
* reusable components
* API layer
* hooks
* shared types

Avoid deeply nested frontend architectures.

---

# Warmup Logic Guidelines

* Warmup progression should remain gradual and configurable.
* Sending volume should increase incrementally over time.
* Daily limits should be enforced during scheduling.
* Warmup logic should remain deterministic and explainable.

Example:

* Day 1 → 5 emails
* Day 2 → 8 emails
* Day 3 → 12 emails

---

# Domain Validation Guidelines

The system should validate:

* SPF
* DKIM
* DMARC
* MX

Validation should focus on:

* existence,
* basic correctness,
* and operational visibility.

The MVP does not require enterprise-grade DNS analysis.

---

# Monitoring & Warning Guidelines

The system should surface:

* SMTP failures,
* bounce warnings,
* spam-risk warnings,
* and operational issues.

For MVP scope:

* bounce/spam-risk events may be simulated,
* but workflows should remain operationally believable.

---

# Non-Goals

The system intentionally avoids:

* microservices architecture,
* distributed orchestration,
* real inbox placement tracking,
* AI-based spam scoring,
* production-scale infrastructure,
* multi-region deployments,
* advanced deliverability analytics.

These are intentionally excluded from MVP scope.

---

# Engineering Philosophy

WarmForge should feel:

* operationally realistic,
* technically clean,
* modular,
* understandable,
* and explainable during demonstrations/interviews.

The primary goal is:

* strong workflow design,
* good engineering reasoning,
* and clear architecture decisions

rather than enterprise-scale complexity.
