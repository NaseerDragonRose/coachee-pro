# CoacheePro — Architecture

## Principle

One website is the product. Marketing pages and the application (assessment, blueprint, dashboard) share the same domain, branding, login, and database from day one — never a separate product bolted on and linked from the homepage. See `reference/PRODUCT.md` for why (trust + avoiding a "two companies stitched together" feel).

## High-level flow

```
Internet
  ↓
AWS Amplify (hosting + CDN)
  ↓
Next.js (marketing pages + app, same codebase)
  ↓
API layer (Next.js API routes initially)
  ↓
Internal service modules (Auth, Assessment, AI, Payment, Booking, Admin)
  ↓
Prisma
  ↓
PostgreSQL
  ↓
Amazon S3 (reports, PDFs, images)
```

Supporting services: OpenAI (behind an internal AI service interface), Razorpay, CloudWatch (monitoring), plus whichever email and analytics providers are chosen per the ADRs.

## Tech stack

| Layer | Choice | Status | Rationale |
| --- | --- | --- | --- |
| Frontend | Next.js (TypeScript), Tailwind CSS, shadcn/ui | Confirmed | SEO for organic traffic, one codebase for marketing + app, fast dev velocity |
| Hosting | AWS Amplify | Confirmed (explicit AWS-first decision) | Managed CI/CD + CDN for Next.js, stays in the AWS ecosystem |
| Backend | Next.js API routes | Confirmed for MVP | No separate backend service needed until load/complexity demands it; can extract to NestJS or a Lambda-based service later without changing the frontend |
| Auth | AWS Cognito (leaning) vs. Clerk vs. Auth.js | **Pending** | See ADR-001 — deliberately not locked until Phase 2 implementation |
| Database | PostgreSQL | Confirmed | Relational data (users, assessments, blueprints, bookings, payments) fits relational modeling; never revisit this |
| DB hosting | RDS vs. Aurora Serverless vs. self-managed | **Pending** | See ADR-005 |
| ORM | Prisma | Confirmed | Type-safe schema evolution, database-agnostic if we ever needed to move off Postgres (we won't, but keeps the option) |
| File storage | Amazon S3 | Confirmed | Reports/PDFs/images, accessed via an internal storage interface (not direct SDK calls from business logic) |
| Payments | Razorpay | Confirmed | Best fit for India-first launch; Stripe considered later for international |
| AI | OpenAI initially | Confirmed approach | Called through an internal AI service interface so the provider (OpenAI/Anthropic/Gemini) can be swapped without touching callers |
| Email | AWS SES vs. Resend | **Pending** | See ADR-003 |
| Analytics | Google Analytics + PostHog | **Pending evaluation** | See ADR-004 |
| Monitoring | CloudWatch | Confirmed | Native AWS, no added vendor |
| Secrets | AWS Secrets Manager | Deferred | Introduce when multiple environments require it — not needed for a single-environment MVP |
| IaC | AWS CDK vs. Terraform | **Pending** | See ADR-002 |

## Database design (high level)

```
Users
  id, name, email, role, auth_provider_id, created_at
    ↓
Profiles
  id, user_id, type (student | parent)
    ↓
Assessments
  id, user_id, status, started_at, completed_at
    ↓
Assessment Responses
  id, assessment_id, question_id, answer
    ↓
Career Matches
  id, assessment_id, career, rank, rationale
    ↓
Blueprints
  id, user_id, assessment_id, content, pdf_url, paid_at
    ↓
Bookings
  id, user_id, mentor_id, blueprint_id, scheduled_at, status
    ↓
Payments
  id, user_id, item_type, item_id, amount, provider, status
```

This schema supports Phase 1 through Phase 6 (mentor platform, admin) without a redesign. `auth_provider_id` on `Users` is deliberately provider-agnostic — whichever auth service wins ADR-001, we store only its identifier, never business data in the auth provider itself.

## Folder structure

```
coachee-pro/
├── CLAUDE.md                 # always-loaded engineering context and principles
├── reference/                # detailed product & architecture docs
├── app/
│   ├── (marketing)/         # Home, About, Blog, Career Blueprint landing, etc. — no auth required
│   ├── (app)/                # Assessment, Blueprint, Dashboard — auth required (Phase 2+)
│   └── (admin)/              # Admin portal (Phase 6)
├── components/
├── lib/                      # shared utilities
├── services/                 # internal service interfaces: auth, ai, storage, payment, email
├── prisma/                   # schema + migrations
├── public/
└── types/
```

## Module boundaries

```
Auth Module → Assessment Module → AI Module → Payment Module → Booking Module → Admin Module
```

Each module is independent and talks to external vendors only through its own interface (e.g. `services/storage` wraps S3, `services/ai` wraps OpenAI). Swapping a vendor later means changing one module, not chasing SDK calls scattered across the app.

## Security (MVP baseline)

- JWT-based auth (whichever provider wins ADR-001)
- Role/group-based access control (Student, Parent, Mentor, Admin groups defined structurally now even though only Student/Parent are used in v1)
- No business data stored in the auth provider — only email, name, and the auth identifier; everything else lives in PostgreSQL
- Secrets management deferred to AWS Secrets Manager once multiple environments exist

## What's deliberately not decided yet

Every row marked **Pending** above has a corresponding ADR in `reference/ADRS.md` with pros/cons/cost/exit-strategy. These get resolved at the phase where they're actually implemented (e.g. auth gets decided at the start of Phase 2), not guessed now.
