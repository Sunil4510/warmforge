# WarmForge — Project Instructions & Agentic Mandates

## Core Mandates
* **Role-Based Execution**: All significant tasks must be delegated to specialized agent personas to ensure separation of concerns and high-quality output.
* **Architecture First**: No code implementation should start without an Architect-approved design pattern.
* **Security-By-Design**: SMTP credentials must be encrypted at the application level. Secrets must NEVER be logged or committed.
* **Test-Driven Delivery**: Features are not "complete" until a Tester agent verifies them with integration tests.
* **GitHub Protocol**: Maintain a clean git history. You MUST ask for and receive explicit user permission before performing a `git push`. Always ensure `.gitignore` is correctly configured to prevent leaking secrets or `node_modules`.

## Agent Orchestration Framework
We use a multi-agent workflow by invoking the `generalist` or `codebase_investigator` with specific persona prompts.

### 1. Architect Agent
* **Role**: System design, pattern enforcement, and relational modeling.
* **Invoked for**: Schema design, API routing structure, and service boundaries.
* **Standard**: Ensures adherence to `docs/architecture-hld.md`.

### 2. Planner Agent
* **Role**: Decomposing high-level goals into surgical task lists.
* **Invoked for**: Updating `docs/task-plan.md` and setting the next 3-5 steps.

### 3. Builder Agent
* **Role**: Pure implementation and coding.
* **Invoked for**: Writing controllers, services, and frontend components.
* **Standard**: Must follow `docs/engineering-guidelines.md`.

### 4. Security Agent
* **Role**: Vulnerability assessment and secret protection.
* **Invoked for**: Auditing encryption logic, CORS settings, and env-var handling.

### 5. Tester Agent
* **Role**: Verification and validation.
* **Invoked for**: Writing unit/integration tests and verifying PRs.

### 6. Optimization Agent (Reviewer)
* **Role**: Refactoring, performance tuning, and code quality.
* **Invoked for**: PR reviews, query optimization, and UI responsiveness.

## Operational Workflow
1. **Orchestrator (Main Agent)** receives user instruction.
2. **Planner** updates the task list.
3. **Architect** designs the implementation detail.
4. **Builder** writes the code.
5. **Security** audits the change (if sensitive).
6. **Tester** verifies the implementation.
7. **Optimizer** refines and finalizes.

## Tech Stack Specifics
* **Backend**: Express (TS), Prisma (PostgreSQL), Nodemailer, node-cron.
* **Frontend**: React (TS), Vite, MUI.
* **Monorepo**: npm workspaces.
