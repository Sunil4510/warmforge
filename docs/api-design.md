# API Design

# Overview

WarmForge exposes REST APIs for:

* mailbox onboarding,
* SMTP validation,
* domain health validation,
* warmup campaign management,
* and operational activity tracking.

The API design intentionally prioritizes:

* simplicity,
* consistency,
* explainability,
* and MVP implementation speed.

The APIs are designed for:

* frontend dashboard integration,
* operational visibility,
* and backend orchestration workflows.

---

# API Design Principles

* Use RESTful conventions
* Keep APIs resource-oriented
* Use predictable request/response structures
* Return meaningful error responses
* Validate all request payloads
* Avoid leaking internal infrastructure details
* Keep endpoints operationally focused and easy to reason about

---

# Base URL

```txt
/api/v1
```

---

# Standard Response Structure

# Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

# Error Response

```json
{
  "success": false,
  "error": {
    "message": "SMTP authentication failed"
  }
}
```

---

# 1. Mailbox APIs

# Purpose

Manage SMTP-connected outbound mailboxes.

---

# POST /mailboxes

# Purpose

Create and onboard a mailbox.

---

# Request

```json
{
  "email": "sales@acme.com",
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUsername": "sales@acme.com",
  "smtpPassword": "app-password"
}
```

---

# Workflow

* Validate request payload
* Validate SMTP connection
* Extract domain
* Perform domain validation
* Persist mailbox + domain
* Return onboarding result

---

# Response

```json
{
  "success": true,
  "data": {
    "mailboxId": "uuid",
    "domainId": "uuid"
  }
}
```

---

# Possible Errors

* Invalid SMTP credentials
* SMTP timeout
* Unsupported SMTP configuration
* Validation failures

---

# GET /mailboxes

# Purpose

Fetch all connected mailboxes.

---

# Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "sales@acme.com"
    }
  ]
}
```

---

# GET /mailboxes/:id

# Purpose

Fetch mailbox details.

---

# Response Includes

* mailbox info
* domain info
* warmup campaign status

---

# DELETE /mailboxes/:id (Optional MVP Enhancement)

# Purpose

Remove mailbox and associated warmup configuration.

---

# 2. Domain APIs

# Purpose

Validate and retrieve domain health information.

---

# POST /domains/validate

# Purpose

Trigger domain validation manually.

Useful when:

* DNS records are updated,
* or revalidation is needed.

---

# Request

```json
{
  "domain": "acme.com"
}
```

---

# Workflow

* DNS lookup
* SPF validation
* DKIM validation
* DMARC validation
* MX validation
* Generate health status
* Persist validation results

---

# Response

```json
{
  "success": true,
  "data": {
    "domain": "acme.com",
    "spfStatus": "VALID",
    "dkimStatus": "MISSING",
    "dmarcStatus": "VALID",
    "mxStatus": "VALID",
    "healthStatus": "WARNING"
  }
}
```

---

# GET /domains/:id

# Purpose

Fetch domain health information.

---

# Response Includes

* DNS validation results
* health status
* last validation timestamp

---

# 3. Warmup Campaign APIs

# Purpose

Manage mailbox warmup lifecycle.

Warmup is modeled as:

* a mailbox-owned operational workflow.

---

# POST /mailboxes/:mailboxId/warmup

# Purpose

Start warmup campaign for mailbox.

---

# Request

```json
{
  "startingVolume": 5,
  "dailyIncrement": 3,
  "maxDailyVolume": 50
}
```

---

# Workflow

* Validate mailbox
* Create warmup campaign
* Activate scheduler processing
* Generate initial activity event

---

# Response

```json
{
  "success": true,
  "data": {
    "campaignId": "uuid",
    "status": "ACTIVE"
  }
}
```

---

# GET /mailboxes/:mailboxId/warmup

# Purpose

Fetch warmup campaign status.

---

# Response Includes

* campaign status
* current warmup day
* current send limit
* last execution timestamp

---

# Example Response

```json
{
  "success": true,
  "data": {
    "status": "ACTIVE",
    "currentDay": 5,
    "currentDailyLimit": 17,
    "lastExecutedAt": "2026-06-02T10:00:00Z"
  }
}
```

---

# PATCH /mailboxes/:mailboxId/warmup

# Purpose

Update warmup campaign state.

Example:

* pause campaign
* resume campaign

---

# Example Request

```json
{
  "status": "PAUSED"
}
```

---

# Example Response

```json
{
  "success": true
}
```

---

# 4. Activity APIs

# Purpose

Provide operational visibility into:

* sends,
* failures,
* warnings,
* and warmup activity.

---

# GET /mailboxes/:mailboxId/activities

# Purpose

Fetch mailbox-specific activity timeline.

---

# Query Parameters

Optional:

* activityType
* page
* limit

---

# Example

```txt
/mailboxes/:mailboxId/activities?page=1&limit=20
```

---

# Example Response

```json
{
  "success": true,
  "data": [
    {
      "activityType": "EMAIL_SENT",
      "message": "Warmup email sent successfully",
      "createdAt": "2026-06-02T10:00:00Z"
    },
    {
      "activityType": "SMTP_FAILURE",
      "message": "SMTP authentication failed",
      "createdAt": "2026-06-02T10:05:00Z"
    }
  ]
}
```

---

# Optional Global Activities Endpoint

# GET /activities

Useful for:

* global operational visibility,
* admin dashboards,
* or debugging.

---

# 5. Health APIs

# GET /health

# Purpose

Basic server health endpoint.

---

# Response

```json
{
  "success": true,
  "status": "OK"
}
```

---

# Internal Scheduler Workflow

These are internal workflows rather than public APIs.

---

# Scheduler Flow

Scheduler Trigger
↓
Fetch active campaigns
↓
Calculate send limits
↓
Dispatch SMTP sends
↓
Persist WarmupActivity events

---

# Validation Rules

# Mailbox Validation

Required:

* valid email
* SMTP host
* SMTP port
* SMTP username
* SMTP password

---

# Warmup Validation

Rules:

* startingVolume > 0
* dailyIncrement > 0
* maxDailyVolume >= startingVolume

---

# Domain Validation

Rules:

* valid domain format
* DNS lookup resolvable

---

# Error Handling Strategy

The API should:

* return meaningful errors,
* avoid internal stack traces,
* and provide operationally understandable messages.

---

# Example Error Types

* SMTP_AUTH_FAILED
* SMTP_TIMEOUT
* DOMAIN_VALIDATION_FAILED
* CAMPAIGN_NOT_FOUND
* INVALID_REQUEST

---

# Security Considerations

* SMTP credentials must never be returned to clients
* Sensitive configuration remains backend-only
* Input validation required on all endpoints
* Environment variables used for secrets/configuration

---

# API Philosophy

The APIs are intentionally:

* simple,
* operationally focused,
* resource-oriented,
* and easy to explain.

The design prioritizes:

* workflow clarity,
* frontend integration simplicity,
* and MVP implementation speed

over:

* enterprise-scale API sophistication,
* distributed API orchestration,
* or unnecessary abstraction complexity.
