# WarmForge — Email Warmup & Deliverability Monitoring System

WarmForge is an MVP system built as part of a full-stack engineering assessment. It is designed to help businesses safely prepare outbound email accounts for cold outreach by gradually warming them up, validating domain health, and monitoring deliverability.

## 🚀 Overview
New email accounts and domains often have low reputation with providers like Gmail and Outlook. WarmForge solves this by:
- **Gradual Warmup**: Increasing sending volume over time to build trust.
- **Domain Health Checks**: Validating SPF, DKIM, DMARC, and MX records.
- **Operational Monitoring**: Providing visibility into deliverability health and activity.

## 📄 Deliverables
As per the assessment brief, this repository includes:
1.  **Scoping Document**: Located in the [`/docs`](./docs) folder (specifically [`mvp-scope.md`](./docs/mvp-scope.md) and [`architecture-hld.md`](./docs/architecture-hld.md)).
2.  **Implementation**: A full-stack monorepo with `apps/backend` and `apps/frontend`.
3.  **Documentation**: Detailed workflows, database design, and task plans.

## 🛠️ Tech Stack
- **Backend**: Node.js (Express), TypeScript, Prisma (PostgreSQL), Nodemailer, node-cron.
- **Frontend**: React (Vite), TypeScript, Material UI (MUI).
- **Orchestration**: Multi-agent framework (Architect, Planner, Builder, Security, Tester).

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- SMTP test account (e.g., Mailtrap, Gmail App Password, or Ethereal)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Sunil4510/warmforge.git
    cd warmforge
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Create `.env` files in `apps/backend`:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/warmforge"
    ENCRYPTION_KEY="your-32-character-secret-key"
    ```
4.  **Database Migration**:
    ```bash
    cd apps/backend
    npx prisma migrate dev
    ```
5.  **Run the application**:
    From the root directory:
    ```bash
    npm run dev:backend
    npm run dev:frontend
    ```

## 🧪 Connecting Test Email Accounts
To connect a test account:
1.  Navigate to the Onboarding section in the UI.
2.  Enter your SMTP credentials (Host, Port, User, Pass).
3.  The system will validate the connection and trigger an initial domain health check.

## 🧠 Design Philosophy
This project prioritizes **clear thinking** and **operational reasoning** over production-scale complexity. We focus on:
- **Relational Integrity**: Managing domains, mailboxes, and activities in a structured schema.
- **Explainability**: Using simple scheduling (`node-cron`) and standard SMTP protocols.
- **Visibility**: Surfacing deliverability signals (DNS status, Warmup progress) directly to the user.
