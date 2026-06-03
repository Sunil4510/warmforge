# WarmForge — MVP Scoping Document

## 🎯 What we are building
WarmForge is a specialized infrastructure tool designed to build and monitor sender reputation for outbound email domains.
- **Automated Warmup Engine**: Gradually increases sending volume to mimic natural human behavior and build trust with ESPs (Gmail/Outlook).
- **DNS Health Monitoring**: Real-time validation of SPF, DKIM, DMARC, and MX records using a resilient DNS-over-HTTPS (DoH) architecture.
- **Secure Credential Management**: Encrypted storage for SMTP credentials to allow background orchestration.
- **Operational Dashboard**: A high-visibility interface to monitor deliverability health across an entire fleet of mailboxes.

## 🛑 What we are NOT building (and why)
- **Email Content Templating**: Out of scope. We focus on infrastructure reputation, not marketing copy.
- **Advanced Analytics (Open/Click rates)**: Not needed for an MVP. Reputation is built on successful delivery and "Not Spam" signals, which we simulate via our Seed List.
- **Multi-tenant Auth**: For the MVP, we use a single mock user system to prioritize the core "engine" and "validation" logic.
- **Cloud DNS Management**: We monitor DNS, we don't manage it. Users should manage records in their own providers (Cloudflare/Route53).

## 📊 Data Model (Prisma)
- **User**: The identity owning the infrastructure.
- **Domain**: Represents the sending domain and its current health status (MX, SPF, DMARC, etc.).
- **Mailbox**: Individual SMTP accounts associated with a domain.
- **WarmupCampaign**: Configuration for the volume progression strategy.
- **WarmupActivity**: A detailed log of sent emails, SMTP failures, and deliverability warnings.

## 🛣️ Key API Endpoints
- `POST /api/v1/mailboxes`: Onboard a new mailbox with live SMTP validation.
- `GET /api/v1/mailboxes/:id`: Fetch real-time health metrics and activity logs.
- `POST /api/v1/domains/:id/validate`: Trigger an on-demand DNS-over-HTTPS health scan.
- `POST /api/v1/mailboxes/:id/warmup/toggle`: Pause or resume the automated engine.

## ⚙️ How the system works
1. **Onboarding**: A user connects a mailbox. The system performs a "Pre-flight" check (verifying SMTP connectivity) and encrypts credentials.
2. **Health Check**: The system uses **Tangerine (DoH)** to bypass local DNS blocks, ensuring accurate MX/SPF/DMARC detection.
3. **Orchestration**: A `node-cron` scheduler triggers daily. It calculates the `targetVolume` for the day and dispatches emails via the `WarmupService`.
4. **Visibility**: Every action (Sent, Failed, Warning) is logged to the database and surfaced on the dashboard via the "Operational Log."
