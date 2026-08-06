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

This repo stays minimal, adding each `.claude/` piece only when there's real content for it, not as empty placeholders. So far that's `CLAUDE.md`, `CLAUDE.local.md` (gitignored, personal overrides), `.gitignore`, `/reference`, and `.claude/rules/` (`component-conventions.md` — hand-written component shape; `ui-conventions.md` — mobile-first, accessibility, theming, and the card/button/interaction reference for all UI). The rest of the fuller Claude Code project layout — `commands/`, `skills/`, `agents/`, `hooks/`, `memory/`, `workflows/`, `mcp.json`, `AGENTS.md` — is still **not** scaffolded:

| Add when... | Piece |
| --- | --- |
| We have actual dev commands worth automating (deploy, scaffold) | `.claude/commands/*.md` |
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
| `/reference/DATABASE_DECISIONS.md` | Why `prisma/schema.prisma` looks the way it does — table scope, JSONB shapes, deferred models, open questions. The schema file itself stays comment-free |

## Current status

Phase 1 (marketing website) is underway. The Next.js scaffold is live with dark/light theming (`next-themes`) and smooth scroll (Lenis); Home, About, Technology Careers, Contact, FAQ, Privacy, and Terms pages are built and styled. Submissions are stored but not emailed, until ADR-003 is wired. See `/reference/PRODUCT.md` roadmap section for the full Phase 1 page list and what's still outstanding.

**Sign-in comes before the assessment.** Marketing is the unauthenticated half of the site — `proxy.ts` redirects any signed-in visitor to `/assessments` (except `/privacy` and `/terms`), and marketing CTAs open a Google sign-in dialog rather than the questionnaire. The `signIn` callback creates the user from the Google profile, so the account is complete on arrival; a **dismissible** prompt then asks for phone and contact consent, which Google can't supply. It is a nudge, never a gate — nothing in the app is blocked on it, and `users.phone` / `users.consented_at` stay null until a student chooses to fill them in. The 18-question assessment then runs as a modal on `/assessments`, autosaving to PostgreSQL so it resumes on any device. A mock AI service (`lib/blueprint/`, `services/ai/mock/`) generates the blueprint server-side from the stored snapshot.

Three rules from that design are easy to break by accident: **the assessment modal's step must never appear in the URL** (deliberate deviation from deep-linking guidance); **the row is created on the first answer, not when the modal opens**, so opening and closing costs nothing; and **discarding deletes** — there is no archived state, and `DRAFT`/`COMPLETED` being the only two is what lets every read path skip a status filter.

`app/actions/assessment.ts` and `app/actions/profile.ts` hold the server actions, backed by `services/user/`, `services/assessment/` and `services/blueprint/`. Components never query — they call a server action, which composes services, which alone import `services/db/prisma.ts`. Read `/reference/DATABASE_DECISIONS.md` before changing anything that touches a JSONB column; those shapes are contracts.

## Tech stack at a glance

| Layer | Choice | Status |
| --- | --- | --- |
| Frontend | Next.js (TypeScript) + Tailwind + shadcn/ui | Confirmed |
| Hosting | AWS Amplify | Confirmed |
| Auth | AWS Cognito + NextAuth v4 | Confirmed — ADR-001 |
| Database | PostgreSQL on Amazon RDS | Confirmed — ADR-005 |
| ORM | Prisma | Confirmed |
| File storage | Amazon S3 | Confirmed |
| Payments | Razorpay | Confirmed |
| AI | OpenAI, wrapped behind an internal AI service interface | Confirmed (provider swappable) |
| Email | AWS SES | Confirmed — ADR-003 |
| Analytics | Google Analytics + PostHog | Pending — ADR-004 |
| Monitoring | CloudWatch | Confirmed |
| IaC | AWS CDK | Confirmed — ADR-002 |

Full detail and rationale: `/reference/ARCHITECTURE.md`.
