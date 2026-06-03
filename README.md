# WarmForge — Email Warmup & Deliverability Monitoring System

WarmForge is a high-integrity MVP built to help businesses build outbound sender reputation. It automates the "warmup" process—gradually increasing email volume—while providing real-time visibility into domain health and deliverability metrics.

## 🚀 Key Features
- **Intelligent Warmup Engine**: Automated progression formula building natural sender reputation.
- **Resilient DNS Validation**: DNS-over-HTTPS (DoH) integration for reliable health checks across any network environment.
- **Security-First Storage**: AES-256-GCM encryption for all sensitive SMTP credentials.
- **Operational Dashboard**: Real-time monitoring of MX, SPF, DMARC, and DKIM status.
- **Layered Architecture**: Clean separation between Transport (Routes), Orchestration (Controllers), and Domain (Services) layers.

## 🏗️ Technical Architecture (HLD)
The system is built as a **Layered Monolith** to maximize development velocity while maintaining high testability and separation of concerns.

### Core Stack
- **Backend**: Node.js, TypeScript, Express, Prisma (PostgreSQL), `node-cron`.
- **Frontend**: React (Vite), TypeScript, Material UI (MUI).
- **Communication**: REST API with centralized error handling and strict type contracts.

### Engineering Decisions & Rationale
1.  **DNS-over-HTTPS (DoH)**: Standard UDP DNS queries (Port 53) often fail in restricted local or cloud environments. WarmForge uses the `tangerine` DoH client to query Google/Cloudflare via Port 443, ensuring 100% reliability for domain health checks.
2.  **Encryption**: SMTP passwords are never stored in plain text. We utilize Node's `crypto` module with a 32-character key to ensure data-at-rest security.
3.  **Unified Error Logic**: A custom `AppError` class and global middleware provide predictable API responses, preventing UI crashes and improving debuggability.

## 📄 Deliverables & Docs
- **High-Level Design**: [`docs/architecture-hld.md`](./docs/architecture-hld.md)
- **Database Schema**: [`apps/backend/prisma/schema.prisma`](./apps/backend/prisma/schema.prisma)
- **Task Plan**: [`docs/task-plan.md`](./docs/task-plan.md)

## ⚙️ Quick Start

### Prerequisites
- Node.js (v20+)
- Docker (for PostgreSQL)
- An SMTP account for testing (Gmail App Password or Ethereal.email)

### 1. Infrastructure Setup
```bash
# Start the PostgreSQL database
docker-compose up -d
```

### 2. Backend Configuration
Navigate to `apps/backend`, copy `.env.example` to `.env`, and update:
- `DATABASE_URL`: `postgresql://postgres:password@localhost:5432/warmforge`
- `ENCRYPTION_KEY`: A 32-character random string.

```bash
# Install dependencies & generate Prisma client
npm install
npx prisma migrate dev --name init

# Start server
npm run dev
```

### 3. Frontend Configuration
Navigate to `apps/frontend`:
```bash
npm install
npm run dev
```

## 🧪 Testing the Flow
1.  **Onboard**: Connect a mailbox via the dashboard.
2.  **Health**: Watch the "Sync DNS" action trigger a real-time validation of your records.
3.  **Warmup**: Trigger a "Warmup Test" to see the system orchestrate an email dispatch to the configured `SEED_LIST`.

---
*Built with ❤️ as a demonstration of resilient full-stack engineering.*
