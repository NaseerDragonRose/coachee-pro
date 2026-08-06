# CoacheePro

An AI-assisted Technology Career Planning Platform for Class 11 & 12 students.

Students who are unsure which technology career fits them take a structured assessment and get an AI-generated, mentor-reviewable **Tech Career Blueprint** — career matches and why they fit, required skills, a learning path, college guidance, salary trajectory, and future outlook.

**Live at:** [coacheepro.com](https://coacheepro.com)

## Status

**Phase 1 (marketing website) is largely built**, with parts of later phases prototyped ahead of the roadmap to validate the end-to-end flow.

Built and styled: Home, About, Technology Careers, Contact, FAQ, Privacy, Terms — mobile-first, with dark/light theming (`next-themes`) and smooth scroll (Lenis). Blog and newsletter signup were dropped from Phase 1 scope; the Career Blueprint isn't a standalone page but the output of the assessment flow. Book Consultation is the one Phase 1 page still outstanding.

Running ahead of the phase plan, all functional but not production-wired:

- **Google sign-in first** — AWS Cognito via NextAuth. Marketing CTAs open a sign-in dialog explaining why an account is needed; marketing pages are unauthenticated-only, so a signed-in visitor is redirected to their assessments. Sessions are JWT-only, and the account is created from the Google profile on sign-in. A dismissible prompt asks for a phone number and contact consent — optional, and nothing is blocked on it.
- **Career assessment** — 18 questions with conditional branching, opening as a modal from `/assessments`. Every assessment belongs to a user from its first question and autosaves to PostgreSQL, so it resumes on any device. Its step never appears in the URL.
- **Blueprint generation** — a mock AI service produces the full career-match data contract, generated server-side from the stored snapshot. Real AI generation is Phase 4.
- **Blueprint view** — auth-gated, served from the database. `/assessments` lists an in-progress draft alongside completed results; `/assessments/[id]` shows one blueprint, with a tabbed career switcher and a mock premium unlock. Discarding a draft deletes it.

**Not yet wired:** assessment submissions are stored but not emailed (SES pending). The database runs locally only — no RDS instance is provisioned. The premium unlock is still mocked in `localStorage`; Razorpay is deliberately last, immediately before launch.

Roadmap and phase definitions: [`reference/PRODUCT.md`](reference/PRODUCT.md).

## Local setup

Requires Node 20+ and Docker.

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

```bash
cp .env.local.example .env.local
```

Fill in the Cognito values from the `infra/` CDK stack outputs (see [`infra/README.md`](infra/README.md)) and generate a `NEXTAUTH_SECRET` with `openssl rand -base64 32`. The `DATABASE_URL` default matches the container in the next step and needs no change.

**3. Start PostgreSQL**

```bash
docker run -d \
  --name coacheepro-db \
  --restart unless-stopped \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=coacheepro \
  -p 5432:5432 \
  -v coacheepro-pg17:/var/lib/postgresql/data \
  postgres:17
```

Match PostgreSQL 17 — the RDS instance uses the same major version, and cross-major differences are what pass locally and fail on deploy. If something already holds port 5432, publish on another host port and update `DATABASE_URL` to match.

**4. Generate the Prisma client**

```bash
npx prisma generate
```

**Required, and easy to miss.** The generated client is written to `lib/generated/prisma`, which is gitignored build output, so a fresh clone has no client and `next build` will fail on the first import. There is deliberately no `postinstall` hook doing this for you.

Re-run it after any change to `prisma/schema.prisma` — `prisma migrate dev` does **not** generate the client in Prisma 7.

**5. Apply migrations**

```bash
npx prisma migrate dev
```

**6. Run the app**

```bash
npm run dev
```

Schema rationale, JSONB shapes, and the local database's design choices are in [`reference/DATABASE_DECISIONS.md`](reference/DATABASE_DECISIONS.md).

## Documentation

Detailed product and architecture docs live in [`/reference`](reference):

- [`reference/PRODUCT.md`](reference/PRODUCT.md) — vision, target users, MVP scope, product flow, phased roadmap
- [`reference/ARCHITECTURE.md`](reference/ARCHITECTURE.md) — tech stack, database design, folder structure, module boundaries, security
- [`reference/ADRS.md`](reference/ADRS.md) — pending technology decisions with pros/cons/cost
- [`reference/DATABASE_DECISIONS.md`](reference/DATABASE_DECISIONS.md) — why the Prisma schema looks the way it does, deferred models, local database setup

Engineering principles and operating rules for anyone (or any agent) working in this repo are in [`CLAUDE.md`](CLAUDE.md).

## Tech stack

Next.js (TypeScript), Tailwind, shadcn/ui, AWS Amplify, AWS Cognito, PostgreSQL on Amazon RDS, Prisma, AWS S3, AWS SES, Razorpay, OpenAI, AWS CDK. Full rationale and pending decisions in [`reference/ARCHITECTURE.md`](reference/ARCHITECTURE.md).
