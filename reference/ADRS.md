# CoacheePro — Architecture Decision Records

Format per decision: requirements, options with pros/cons/cost/exit-strategy, and a final decision made **at the phase where it's actually implemented** — not guessed in advance. This log exists so no decision is made blindly, and so re-reading it later explains *why*, not just *what*.

---

## ADR-001 — Authentication

**Status:** Decided (2026-08-05) — AWS Cognito

**Requirements:** Google login, email login, future MFA, JWT/OAuth2, role-based access (Student/Parent now; Mentor/Admin later), fits an AWS-first stack.

### Option 1 — AWS Cognito (current lean)
- **Pros:** Generous free tier; scales to millions of users; Google/Apple/Microsoft login; email verification, forgot-password, MFA, JWT/OAuth2/OIDC out of the box; role-based access via Groups; native AWS ecosystem fit (pairs with Amplify).
- **Cons:** Steeper setup than Clerk (User Pools, Identity Pools, OAuth config, callback URLs, IAM); Hosted UI customization is limited; more AWS concepts to learn upfront.
- **Cost (MVP scale):** Free tier covers early usage; pay-as-you-scale beyond that — cheapest at scale among the three options.
- **Exit strategy:** Store only `email`, `name`, and the Cognito `sub` in our own `Users` table (see `ARCHITECTURE.md`); no business data in Cognito. Migrating off later means re-pointing the auth interface, not a data migration.

### Option 2 — Clerk
- **Pros:** Fastest setup (~15 min); polished UI out of the box; excellent Next.js integration and docs.
- **Cons:** Vendor lock-in; per-user SaaS pricing grows with the user base and can exceed Cognito's cost at scale; less control over internals; not AWS-native.
- **Cost (MVP scale):** Free tier for early usage; recurring per-MAU cost kicks in as the user base grows.
- **Exit strategy:** Moderate — would need to re-implement the login UI and migrate user records.

### Option 3 — Auth.js (NextAuth)
- **Pros:** Open source, no per-user fees, full control, flexible provider support.
- **Cons:** More code to write and maintain; fewer managed security features (MFA, hosted verification flows) out of the box; operational burden shifts to us.
- **Cost (MVP scale):** No vendor fee; cost is engineering time.
- **Exit strategy:** Easiest to swap out since it's already "just our code," but the most work to keep secure over time.

**Decision:** Decided (2026-08-05) — AWS Cognito, with a Cognito User Pool federated to Google as the only identity provider for v1 (no native Cognito email/password sign-in yet — that's a separate future decision if needed). Next.js integrates via NextAuth v4 (`next-auth@4.24.15`; v5/"Auth.js" was considered but is still beta-only, and this project only takes stable dependencies) as a thin integration layer — Cognito remains the actual identity provider. Provisioned via a CDK stack (`infra/`), consistent with ADR-002. Sessions are JWT-only; no database was introduced for this (see ADR-005 note below) since nothing in this phase's scope needs to look up a user by ID yet.

**Known limitation (deferred, 2026-08-05):** Users with multiple Google accounts aren't shown Google's account picker on repeat "Log in" clicks — Google silently reuses whichever account is already active in the browser. Root cause: our deployed Cognito Hosted UI is the "classic" mode, which doesn't forward OAuth `prompt` parameters through to federated IdPs. Cognito's newer **Managed Login** branding (GA May 2025) does support this, but switching requires real infra changes, not a config tweak:
- CDK: `managedLoginVersion: ManagedLoginVersion.NEWER_MANAGED_LOGIN` on the User Pool's `addDomain()`, plus an associated `CfnManagedLoginBranding` resource (L1 construct — no L2 shortcut yet) tied to the User Pool + Client.
- NextAuth: add `identity_provider: "Google"` and `prompt: "select_account"` to the Cognito provider's `authorization.params` in `services/auth/auth-options.ts`.
- Redeploying changes the Hosted UI domain's behavior, so this needs a real test pass afterward, not a drive-by change.

Not blocking — sign-in itself works correctly for whichever Google account is active. Pick this up when multi-account support actually matters to users, not before.

---

## ADR-002 — Infrastructure as Code

**Status:** Decided (2026-07-27) — AWS CDK

**Requirements:** Reproducible AWS provisioning (Amplify app, RDS/Cognito/S3 when added), maintainable by a solo developer initially.

### Option 1 — AWS CDK
- **Pros:** Define infrastructure in TypeScript — same language as the app; tight AWS integration; good L2 constructs for common patterns.
- **Cons:** AWS-only; smaller community than Terraform.
- **Cost:** Free (tooling); pay only for provisioned AWS resources.

### Option 2 — Terraform
- **Pros:** Cloud-agnostic (relevant only if we ever go multi-cloud, which is not planned); very large community and module ecosystem.
- **Cons:** Separate HCL language to learn/maintain alongside the TypeScript app; AWS provider sometimes lags new AWS features.
- **Cost:** Free (tooling); pay only for provisioned AWS resources.

**Decision:** AWS CDK. Confirmed at Phase 1 kickoff given the AWS-only, TypeScript-first stack.

---

## ADR-003 — Transactional / marketing email

**Status:** Decided (2026-07-27) — AWS SES

**Requirements:** Transactional email (signup confirmation, booking confirmation), reasonably deliverable, low cost at MVP volume.

### Option 1 — AWS SES
- **Pros:** Very low cost at volume; native AWS integration (CloudWatch, IAM); fits AWS-first principle.
- **Cons:** Requires domain/DKIM/SPF setup and sending-limit approval ("production access") before general use; more manual deliverability management than a dedicated ESP.
- **Cost:** Among the cheapest options per email at any real volume.

### Option 2 — Resend
- **Pros:** Much faster setup, React-email templating, good developer experience, generous free tier for MVP volume.
- **Cons:** Third-party SaaS (not AWS); cost per email is higher than SES once volume grows.
- **Cost:** Free tier likely sufficient through Phase 1–2; becomes a recurring SaaS line item at scale.

**Decision:** AWS SES. Confirmed at Phase 1, prioritizing AWS-native fit and lowest cost at volume over Resend's faster initial setup.

---

## ADR-004 — Analytics

**Status:** Pending — decide at Phase 1 launch

**Requirements:** Marketing funnel visibility (traffic, conversion) and product analytics (assessment completion, blueprint conversion) once Phase 3+ exists.

### Option 1 — Google Analytics
- **Pros:** Free; standard for marketing/SEO reporting; easy to wire into Next.js.
- **Cons:** Not designed for in-product funnel/event analytics; privacy/consent considerations.
- **Cost:** Free.

### Option 2 — PostHog
- **Pros:** Product analytics (funnels, session replay, feature flags); generous free tier; self-hostable later if needed.
- **Cons:** Another vendor to wire up; overlaps partially with GA for basic traffic reporting.
- **Cost:** Free tier likely sufficient through MVP; usage-based beyond that.

**Decision:** TBD at Phase 1 launch. Likely both — GA for marketing/SEO reporting, PostHog for in-product funnel events once there's a product to instrument (Phase 3+) — but not locked, and PostHog can be deferred until Phase 3 since there's no in-product funnel before then.

---

## ADR-005 — Database hosting

**Status:** Pending — decide before Phase 2 (first persistent user data)

**Requirements:** Managed PostgreSQL, low idle cost at MVP scale, room to scale without a migration.

### Option 1 — Amazon RDS for PostgreSQL
- **Pros:** Fully managed, mature, native AWS/Amplify/Cognito integration, predictable performance.
- **Cons:** Pays for provisioned capacity even at low/idle traffic — no free scale-to-zero.
- **Cost:** Smallest instance class runs as a modest fixed monthly cost even with near-zero traffic.

### Option 2 — Aurora Serverless v2 (PostgreSQL-compatible)
- **Pros:** Scales capacity with load; can be cheaper than a fixed RDS instance if traffic is spiky/low in early MVP.
- **Cons:** Has a minimum capacity floor (not true scale-to-zero); slightly more moving parts than plain RDS.
- **Cost:** Can undercut RDS at very low, spiky traffic; converges toward RDS cost as load becomes steady.

**Decision:** TBD before Phase 2. Given MVP traffic will start near zero, Aurora Serverless v2 is worth pricing out against a small RDS instance at implementation time rather than assuming either now.

**Note (2026-08-05):** ADR-001's Cognito integration deliberately avoided needing this — sessions are JWT-only with no Users table. This ADR is still genuinely pending; it wasn't resolved by the auth work, just not forced by it. It'll actually be needed once a Users table, Blueprint persistence, or payments require server-side storage.

---

## ADR-006 — PDF generation (Blueprint export)

**Status:** Pending — decide at start of Phase 4 (Blueprint Generator)

**Requirements:** Render the paid Tech Career Blueprint (career summary, skills, learning path, college guidance, salary progression, future outlook — see `reference/PRODUCT.md`) as a downloadable PDF from the same dashboard-view data, reasonably fast at MVP volume, output good enough for a paid deliverable (not a raw HTML print).

### Option 1 — React PDF (`@react-pdf/renderer`)
- **Pros:** Pure React component model — one source of truth for layout logic close to the dashboard view; runs in a Node process without a headless browser; lighter memory/CPU footprint per render; easy to run inside a Next.js API route or Lambda.
- **Cons:** Its own layout primitives (not real CSS/Flexbox parity with the web view) — the PDF and dashboard view will diverge in markup even if visually similar; more constrained styling than HTML.
- **Cost:** No extra infra — runs in the existing app/API compute; cheapest option at MVP scale.
- **Exit strategy:** Swappable behind a `services/pdf` interface; re-implement templates against a new renderer if replaced.

### Option 2 — Puppeteer (headless Chrome, HTML → PDF)
- **Pros:** Renders the actual dashboard HTML/CSS — visual parity between web view and PDF is close to guaranteed; full CSS support (flexbox, grid, web fonts).
- **Cons:** Headless Chrome is heavy (memory, cold-start time) — awkward to run on Amplify/Lambda-style compute without a dedicated container or layer; higher operational cost and complexity than a pure-JS renderer.
- **Cost:** Needs more compute (memory-heavy runtime) than React PDF at the same volume; likely requires a container-based runtime rather than a lightweight function.
- **Exit strategy:** Swappable behind the same `services/pdf` interface; templates are plain HTML/CSS, easy to port to another HTML-to-PDF tool.

**Decision:** TBD at Phase 4 kickoff. Current lean is React PDF given the AWS-first, low-operational-overhead principle and Amplify-friendly compute footprint, but not locked — worth revisiting if the Blueprint's visual design ends up needing full CSS fidelity.

---

## Adding new ADRs

New pending decisions (e.g. Stripe for international payments, a future queue/worker service) should follow this same format: requirements → options with pros/cons/cost/exit-strategy → decision, appended to this file.
