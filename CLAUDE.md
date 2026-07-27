# CoacheePro — Engineering Context

**An AI-assisted Technology Career Planning Platform for Class 11 & 12 students.** Domain: coacheepro.com. Full product and architecture detail lives in `/reference` — this file is the always-loaded operating context: what governs every session working in this repo.

## Operating rules

- **Never commit anything until explicitly told to.** Not even small or "obviously fine" changes. Wait for an explicit instruction each time.
- **Never switch tech stack choices later without being asked.** Plan ahead, but build for today — don't second-guess or swap a confirmed decision (see stack table below) mid-implementation.
- **Don't decide a Pending item early.** Anything marked Pending in `/reference/ADRS.md` gets resolved at the phase where it's actually implemented, with pros/cons/cost documented first — not guessed in code.
- **AWS-first.** Prefer AWS managed services unless there's a compelling technical or financial reason not to.
- **Price-sensitive.** Optimize for low MVP operating cost without boxing in future scale.
- **Avoid vendor lock-in.** Business logic talks to an internal interface (`services/`), not directly to a vendor SDK — see Module boundaries in `/reference/ARCHITECTURE.md`.

## Repo structure conventions

This repo intentionally stays minimal: `CLAUDE.md`, `CLAUDE.local.md` (gitignored, personal overrides), `.gitignore`, and `/reference`. The fuller Claude Code project layout — `.claude/settings.json`, `rules/`, `commands/`, `skills/`, `agents/`, `hooks/`, `memory/`, `workflows/`, `mcp.json`, `AGENTS.md` — is deliberately **not** scaffolded yet. Add each piece only when there's real content for it, not as empty placeholders:

| Add when... | Piece |
| --- | --- |
| We have actual dev commands worth automating (deploy, scaffold) | `.claude/commands/*.md` |
| We have code-style/API/testing conventions worth enforcing on demand | `.claude/rules/*.md` |
| We need deterministic enforcement (lint/format on save, blocked writes) | `.claude/hooks/*.sh` |
| We define specialized subagents for this repo specifically | `.claude/agents/*.md`, `AGENTS.md` |
| We need repeatable multi-step blueprints (feature-build, bug-fix cycle) | `.claude/workflows/*.md` |
| We know what commands need pre-approval or what hooks to wire | `.claude/settings.json` |
| We actually integrate an external tool (GitHub, Jira, Postgres, etc.) | `mcp.json` |
| The team grows beyond one person and needs shared, git-committed context | `memory/*.md` (distinct from personal cross-session memory, which isn't portable to other machines/engineers) |

## Documentation map

| File | Contents |
| --- | --- |
| `/reference/PRODUCT.md` | Vision, target users, MVP scope, what's explicitly out of scope, product flow, phased roadmap |
| `/reference/ARCHITECTURE.md` | Tech stack, database design, folder structure, module boundaries, security baseline |
| `/reference/ADRS.md` | Pending technology decisions (auth, IaC, email, analytics, DB hosting) with pros/cons/cost — check before touching any Pending area |

## Current status

Documentation phase complete. No application code yet. Next build target is Phase 1 (marketing website) — see `/reference/PRODUCT.md` roadmap section.

## Tech stack at a glance

| Layer | Choice | Status |
| --- | --- | --- |
| Frontend | Next.js (TypeScript) + Tailwind + shadcn/ui | Confirmed |
| Hosting | AWS Amplify | Confirmed |
| Auth | AWS Cognito (leaning) vs Clerk vs Auth.js | Pending — ADR-001 |
| Database | PostgreSQL | Confirmed (hosting choice pending — ADR-005) |
| ORM | Prisma | Confirmed |
| File storage | Amazon S3 | Confirmed |
| Payments | Razorpay | Confirmed |
| AI | OpenAI, wrapped behind an internal AI service interface | Confirmed (provider swappable) |
| Email | AWS SES | Confirmed — ADR-003 |
| Analytics | Google Analytics + PostHog | Pending — ADR-004 |
| Monitoring | CloudWatch | Confirmed |
| IaC | AWS CDK | Confirmed — ADR-002 |

Full detail and rationale: `/reference/ARCHITECTURE.md`.
