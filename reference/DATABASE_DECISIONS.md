# CoacheePro — Database decisions

Why `prisma/schema.prisma` looks the way it does. The schema file itself stays comment-free; every rationale, JSONB shape, deferred model, and open question lives here.

Hosting is Amazon RDS for PostgreSQL — see ADR-005 in `reference/ADRS.md`. ORM is Prisma. High-level table relationships are sketched in `reference/ARCHITECTURE.md`.

## What's in the schema today, and why only this

The schema holds the four tables the product actually needs now. Everything else is designed but deferred, because building a table before the product collects the data it holds means inventing the shape.

| Table | What it replaces |
| --- | --- |
| `users` | Nothing — needed to own the rows below. Cognito `sub` is the primary key. |
| `assessments` | The `console.log` in `components/assessment/assessment-flow.tsx` |
| `blueprints` | The localStorage blueprint in `lib/blueprint/storage.ts` |
| `career_matches` | The per-career detail inside that same blob |

### Deliberately deferred

| Model | Why not yet | Add when |
| --- | --- | --- |
| `Profile` | The student/parent attribute `PRODUCT.md` describes isn't captured anywhere in the product — no onboarding step, no question in `questions.ts`. A table with a required `type` enum would be inventing data. | The onboarding step that collects it |
| `Payment` | Razorpay is the last piece before launch. `blueprints.paid_at` models the current mock unlock without it. | Razorpay integration |
| `Consultation`, `Mentor` | Phase 5 | Mentor platform |
| `Career`, `AssessmentQuestion` | Phase 6 admin catalogs. Today these are static files (`services/ai/mock/career-catalog.ts`, `lib/assessment/questions.ts`). | Admin portal |

Designs for the deferred models are at the bottom of this doc.

## Design decisions

### `users` has no role column

Student/Parent/Mentor/Admin access control reads from Cognito Groups in the JWT. Duplicating it in Postgres creates a second source of truth that will drift from the one that actually gates access. Sessions stay JWT-only (ADR-001); this table exists to *own* data, not to authenticate.

### An assessment is a row from its first *answer*

Sign-in comes *before* the questionnaire (see `ARCHITECTURE.md`, "Auth routing"), so a `User` always exists by the time an assessment starts. `assessments.user_id` is therefore NOT NULL and an in-progress assessment is a real row with `status = DRAFT`, `started_at`, and a live `answers` map that autosaves roughly every second.

**The row is created by the first autosave that has something to save, not by opening the modal.** A student who opens the assessment and closes it again leaves nothing behind — otherwise every idle click would cost a row, and `started_at` would record curiosity rather than intent. `ensureAssessmentId()` in `assessment-provider.tsx` creates it on demand and guards re-entry with a ref, since the autosave timer and Finish can both reach it and two `startAssessment()` calls would race for the one draft slot.

That is what makes "pause and come back" true on a different device, and it is where `/assessments` gets the status and started-at it shows.

**The alternative was to let the assessment run anonymously and link it to the account afterwards**, so the login wall sits after the questions instead of before them. It's the better funnel, and it was rejected anyway: it needs a nullable `user_id`, an atomic claim guarded by `WHERE user_id IS NULL`, an assessment id carried across the OAuth redirect in `localStorage`, and a marketing URL that stays reachable while authenticated — and it still can't resume on a second device, which is the thing students actually need. Requiring sign-in first removes all of that machinery rather than managing it.

### `answers` and `questionnaire` are separate columns

`answers` is the live map, rewritten on every autosave. `questionnaire` is the presentation snapshot, written once at completion and never again.

They are not merged because `questionnaire IS NULL` is exactly equivalent to "not completed". A single column would force a draft to carry a half-built snapshot that a later reader could mistake for a finished one.

### Discarding deletes

`discard()` is a `deleteMany`, filtered to `status = DRAFT` so it can never take a completed assessment (and its blueprint) with it. There is no `DISCARDED` state.

Archiving to a `DISCARDED` state is the obvious alternative, on the theory that abandoned attempts are worth keeping for drop-off analysis. Three things argue against it:

- **The storage saving is not the reason.** An assessment row is a few KB; even a hundred thousand of them is noise against an RDS bill. Anyone justifying this on cost is solving the wrong problem.
- **Funnel analysis belongs in the analytics tool, not the transactional database.** Which question loses students is a product question, and ADR-004 is where it gets answered. Keeping dead rows in Postgres is a worse version of that, permanently.
- **A student who discards expects it gone.** Retaining it silently is exactly the kind of thing DPDP's erasure right is about, and "we kept it for analytics" is a weak defence for data nobody is analysing yet.

The practical payoff is that `DRAFT` and `COMPLETED` are now the only states, so no read path needs a status filter — every row that exists is one the student should see. A filter that's easy to forget is a filter that eventually leaks someone's discarded answers into a list.

### At most one active draft per user

Enforced by a partial unique index that Prisma cannot express, declared by hand in the migration (see "Constraints Prisma can't express" below — it is one of three that a regenerated migration would silently drop):

```sql
CREATE UNIQUE INDEX assessments_one_active_draft
  ON assessments (user_id) WHERE status = 'DRAFT';
```

`createDraft()` also archives any existing draft inside the same transaction that inserts the new one. The index is the guarantee that survives two concurrent calls; the transaction is the behaviour. Both are needed — neither subsumes the other.

### `questionnaire` is a snapshot, not an answer map

This is the most consequential decision in the schema.

A flat `Record<questionId, answer>` map is a *reference* into a mutable question set. Change an option label in Phase 6 and every historical assessment silently reinterprets — which breaks the outcome-data moat `PRODUCT.md` describes ("which profiles map to which careers") and feeds the AI opaque ids (`"pcm"`) instead of meaning (`"Stream: PCM"`).

So `questionnaire` captures what was actually asked, at the moment it was asked. Same principle as an invoice storing price-at-purchase rather than joining to a live product table.

**`questionnaire` is the single source of truth. Do not also persist a flat answer map** — two copies drift. `services/ai/mock/signal-scoring.ts` reads `answers[id]`, so give it a `toAnswerMap(questionnaire)` projection in code instead.

`question_set_version` records which generation of the question set produced the snapshot, so analytics can bucket by version instead of mixing incomparable cohorts. It's a constant from `lib/assessment/questions.ts` until the Phase 6 admin catalog makes it dynamic.

### What's a column vs. what's JSONB

The rule: **anything aggregated across users is a column; narrative display data is JSONB.**

Real columns in `career_matches` — `career_id`, `match_percent`, `is_recommended` — are exactly what the outcome-data moat needs to query ("average match % per career", "matches above 80", "score distribution among converters"). In JSONB they'd lose their index, their type (Prisma types `Json` as effectively `any`), and any range constraint.

Everything else has no query use case and stays in `content`.

`metadata` on `career_matches` exists for open-ended future additions, so growth doesn't require demoting a queryable column into JSONB.

### `ai_risk` lives in `content`, not its own column

It's copied verbatim from the catalog (`services/ai/mock-blueprint-service.ts`), so it's career-level data — identical for every student, never computed per user. It's snapshotted into `content` so a delivered blueprint stays immutable if the rating is later edited. The canonical, admin-editable value moves to the `Career` table in Phase 6.

### `blueprints.paid_at` is a real column

It's the payment gate, currently mocked by `isBlueprintPaid()` in localStorage. It stays even though `Payment` is deferred — the dashboard already has a premium unlock, and a nullable timestamp models it without needing Razorpay.

### No `pdf_url`

PDFs render on demand from `profile_summary` plus the `career_matches` rows (ADR-006), never generated once and stored. Nothing in this flow depends on S3.

### `content_version`, not `version`

It's the version of the JSON contract in `lib/blueprint/types.ts` (`Blueprint.version`), not a revision counter for regenerated blueprints. The old name read like the latter.

### `career_matches.career_id` is a natural key

It holds the snake_case code already used throughout the code (`"software_engineer"` … `"game_developer"`). This keeps the column readable without a join and matches the existing convention.

The hazard with natural keys is renaming — changing a code means updating every historical row. So: **the code is immutable by policy. Rename the display `name`, never the id.** When `Career` lands in Phase 6, add the FK with `onDelete: Restrict` and use `is_active` for soft deletes, so retiring a career never orphans a historical blueprint.

### UUIDv7 primary keys

Time-ordered, so inserts append to the B-tree instead of scattering like UUIDv4. Free to choose now, mildly painful to migrate later. Requires Prisma ≥ 5.14.

## JSONB shapes

These are contracts. Changing them is a data migration even though Postgres won't stop you.

### `assessments.questionnaire`

One entry per answered question, in presentation order:

```jsonc
[{
  "questionId": "stream",         // Question["id"]
  "area":       "identification", // AreaId
  "type":       "choice",         // "text" | "choice" | "multi" | "scale" | "ranking"
  "prompt":     "Which stream are you in?",
  "options":    [{ "id": "pcm", "label": "PCM" }], // as presented; omitted for text/scale
  "answer":     { "raw": "pcm", "labels": ["PCM"] }
}]
```

Built by `toQuestionnaire()` in `lib/assessment/questionnaire.ts`, which walks the *visible* questions in presentation order — so unreachable branches and unanswered optionals are absent, and a key that doesn't match a real question can never reach the column.

`raw` is what the flow held (option ids, text, or a number); `labels` is the same value rendered readably, which is what makes the snapshot useful without the question set beside it. An option id with no matching option — possible from a resumed draft after the set changed — keeps the id as its own label rather than dropping the answer.

**`scale` questions also carry a `scale` object** (`min`, `max`, `minLabel`, `maxLabel`). This is an addition to the shape sketched above, where scales had neither `options` nor anything else. Without it a stored `4` is meaningless: the endpoints ("Never tried it" → "I build my own projects") are the entire content of a scale question, and they're exactly as mutable as an option label.

### `assessments.answers`

A flat `Record<questionId, AnswerValue>` — the same shape the flow holds in memory. Deliberately *not* a snapshot: it is working state, replaced wholesale on each autosave, and it stops being read the moment `questionnaire` is written.

There is no `lead` column. Name and email come from Google at sign-in and live on `users`.

`users.phone` and `users.consented_at` are both nullable and **expected to stay null for many accounts**: they're asked for by a dismissible prompt, not a gate. Anything that later needs a phone number or contact consent — SES email, a mentor callback — has to treat absence as the normal case and check before sending, not assume the column is populated. This is also why consent can't be inferred from the existence of a user row.

### `blueprints.profile_summary`

Mirrors `ProfileSummary` in `lib/blueprint/types.ts`: `archetype`, `narrative`, `strengths[]`, `watchOuts[]`, `signalMap`.

### `career_matches.content`

Mirrors the narrative half of `CareerMatch` in `lib/blueprint/types.ts`: `aiRisk`, `streamFit`, `whyItFits`, `dayInTheLife`, `skillsToBuild`, `learningPath`, `collegeGuidance`, `salaryProgressionInrLakh`, `futureOutlook`, `commonMistakes` — **and `name`**.

`name` wasn't in that list originally, on the reasoning that a display name should be renameable (see "career_id is a natural key" above). It's stored anyway, because resolving it live is worse on both counts: reading a blueprint would have to reach into `services/ai/mock/career-catalog.ts` from the persistence layer, and a delivered paid artifact would silently change wording under the student who bought it. Snapshotting it is the same argument already made for `ai_risk`. The rename policy still holds for the *id*, which is what the hazard was actually about; a rename that must reach historical blueprints is a data migration, and that's the honest cost.

`content` is written as a subtraction (`Omit<CareerMatch, "careerId" | "matchPercent" | "isRecommended">`) rather than a field list, so a field added to `CareerMatch` is stored automatically instead of being silently dropped.

**Key order is not preserved.** Postgres `jsonb` sorts object keys by length, then bytewise — so a round-tripped `learningPath` comes back with its keys reordered. Values are unaffected; only byte-for-byte JSON comparison of a stored blueprint is meaningless.

## Constraints Prisma can't express

**All three of these live only in hand-written SQL.** They are invisible to `schema.prisma`, so nothing regenerates them — a squashed or rebuilt migration drops them silently and the application keeps compiling. Carry them across by hand, then verify against `pg_indexes` and `pg_constraint` rather than trusting that the migration applied.

```sql
-- At most one active draft per user. createDraft() also clears the previous
-- draft inside the same transaction that inserts the new one; this index is
-- the guarantee that survives two concurrent calls, that transaction is the
-- behaviour.
CREATE UNIQUE INDEX assessments_one_active_draft
  ON assessments (user_id) WHERE status = 'DRAFT';

-- PRODUCT.md promises exactly one recommended career per blueprint.
CREATE UNIQUE INDEX career_matches_one_recommended
  ON career_matches (blueprint_id) WHERE is_recommended;

-- match_percent otherwise has no domain constraint.
ALTER TABLE career_matches
  ADD CONSTRAINT match_percent_range CHECK (match_percent BETWEEN 0 AND 100);
```

## Open questions

None of these is resolved, and all are decisions rather than code.

### A Cognito `sub` that changes under a stable email

`users.id` is the Cognito `sub` and `users.email` is `@unique`, so one person can only ever hold one row — correct, and the constraint should stay. But it means a *new* `sub` arriving for an *existing* email fails the upsert on the unique index.

**The upsert runs in the `signIn` callback** (`services/auth/auth-options.ts`), so this fails the sign-in outright. That is the safe direction — silently merging two accounts is unrecoverable, a refused sign-in is not — but it is a user-facing lockout with no self-service fix, and it surfaces at the least convenient moment.

This isn't hypothetical: rebuilding the user pool reissues subs for the same Google accounts, which is exactly what happened while `infra/` was being iterated on. Recovering means deciding whether to re-point the old row's id at the new `sub` (a cascade across `assessments` and `blueprints`) or to treat it as a genuinely new account. Worth answering before the pool is ever recreated with real users in it.

### Deletion policy

No `onDelete` is set on any relation, so Prisma defaults apply — `RESTRICT` throughout, since every FK is non-nullable and none can be set null. Under DPDP right-to-erasure this needs a deliberate answer, and cascade-delete is probably the wrong one: financial records generally must outlive a deletion request. Likely shape is anonymize-in-place (scrub the identifying columns on `users`, keep the rows).

Note this is a *different* question from `DISCARDED`. Archiving a discarded assessment is a product behaviour and says nothing about how long the row may be retained once its owner asks to be forgotten. **Decide before payments land.**

### Minors' data

DPDP Act 2023 treats under-18s as children, requiring verifiable parental consent and restricting behavioural tracking and targeted ads. Target users are 16–19, so a real share are minors. Nothing in the schema captures date of birth, a minor flag, or parental consent.

Those columns aren't added because the shape depends on a legal answer *and* on ADR-004 — behavioural analytics on minors is exactly the restricted category, so the analytics decision and this one should be resolved together.

## Prisma 7 notes

Five things differ from the v6 form most examples show:

1. `datasource` takes no `url`. The connection string lives in `prisma.config.ts` at the repo root.
2. The generator is `prisma-client` (not the legacy `prisma-client-js`) and `output` is required. It points at `lib/generated/prisma`, so the client imports as `@/lib/generated/prisma` under the repo's `@/* → ./*` alias. That directory is gitignored — it's build output.
3. `.env` is not auto-loaded. `prisma.config.ts` imports `dotenv/config` explicitly, and `dotenv` is a devDependency.

4. Querying at runtime requires a driver adapter — the built-in query engine is gone. `@prisma/adapter-pg` is installed and must stay version-locked to `@prisma/client` (both `7.9.1`). It bundles `pg` as a direct dependency, so there is no separate `pg` install and no peer-dependency to satisfy. The client is constructed as:

```ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

5. `prisma generate` emits TypeScript source, not compiled JS, and `migrate dev` does **not** run it — generate explicitly after schema changes.

## Local development

**PostgreSQL 17**, in Docker. Match this major version on RDS — cross-major differences are exactly what passes locally and fails on deploy. PostgreSQL has no LTS line; each major gets five years of community support, so 17 runs to Nov 2029.

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

Notes worth keeping:

- **Port 5432**, the default. This machine had a native PostgreSQL 13 install (`/Library/PostgreSQL/13`, launch daemon `postgresql-13.plist`) holding that port; it was stopped to free it. If a future machine has something else on 5432, publish on another host port instead — only the left-hand side of `-p` and the `DATABASE_URL` port change.
- **Volume named `coacheepro-pg17`** — data directories are major-version-locked, so moving to 18 means a new volume, never reusing this one. Changing the image tag against an existing volume fails at startup. The `POSTGRES_*` variables only take effect on a *fresh* volume; against an existing one they're silently ignored, so changing credentials means removing the volume.
- **`admin`/`admin` is local-only** and deliberately trivial. It must never become the template for dev/prod, which draw credentials from Secrets Manager via the CDK stack.

The image creates `POSTGRES_USER` as a superuser owning `POSTGRES_DB`, which avoids two things that otherwise bite: PostgreSQL 15+ no longer grants `CREATE` on the `public` schema to non-owners, and `prisma migrate dev` needs `CREATEDB` for its shadow database. Neither applies on RDS, where `migrate deploy` is used instead.

pgAdmin connects on `localhost:5432` (or `host.docker.internal:5432` if pgAdmin is itself containerized). Set a per-connection background colour and keep local/dev/prod in separate server groups — with three environments in one client, and the local database sharing the name `coacheepro` with them, the colour is the guard against running a destructive statement in the wrong place.

## Current state

A single migration — `20260806170554_init` — builds the whole schema on the local PostgreSQL 17 container. The client is generated to `lib/generated/prisma`, and the singleton lives at `services/db/prisma.ts` (see below).

**If you ever regenerate or squash this migration, it will silently lose SQL.** A migration generated from the schema contains only what Prisma can express, which excludes all three constraints in "Constraints Prisma can't express" below — two partial unique indexes and a `CHECK`. Nothing fails when they go missing: the app compiles, queries run, and the guarantees are simply gone. Carry them across by hand and verify against `pg_indexes` and `pg_constraint` rather than trusting that the migration applied them.

**The assessment flow reads and writes the database from its first question.** Three stores sit behind it, each an interface plus a Prisma implementation, so nothing outside `services/` touches the client:

| Module | Owns |
| --- | --- |
| `services/user/` | The sign-in upsert, the profile step's write, and reading a user back |
| `services/assessment/` | The draft lifecycle — create, autosave, discard, complete — and both read paths |
| `services/blueprint/` | Writing a blueprint with its career matches, and reading one back for a user |

`app/actions/assessment.ts` exposes `startAssessment`, `saveAssessmentDraft`, `discardAssessment` and `completeAssessment`; `app/actions/profile.ts` exposes `completeProfile`. Every one is session-gated and validates its input server-side.

Blueprints are addressed by assessment id: `app/(app)/assessments/` lists them and `app/(app)/assessments/[id]/` is the canonical view. Both are server components, and both fold `userId` into the `WHERE` rather than checking it afterwards, so another student's blueprint and a nonexistent one are indistinguishable from outside.

The list now shows a real status and start time, because a draft is a real row. An in-progress assessment renders as its own card with a `Question N of M` counter derived on the server via `progressOf()`; completed assessments keep the paid/free split.

`listForUser` never selects `questionnaire` — it's the largest column in the schema and worthless in a list. It does select `answers` for drafts, which is what lets the page seed the resume modal without a second query, and it reads `content.name` for the recommended career, the concrete payoff of storing `name` in `content`.

Verified against the local database by exercising the real stores through a temporary route: draft creation, autosave, the archive-on-restart transaction, ownership filtering on both reads and writes (a stranger's id returns null and a stranger's save is a no-op), idempotent discard, the double-submit guard on completion, `studentName` resolving through the user relation, and recommended-first career ordering surviving the round trip.

**Still on `localStorage`:** only the mock premium unlock, and the dismissal flag for the profile prompt. Everything else about an assessment lives in Postgres — the in-progress draft included, which is what makes it resumable on another device. `paid_at` is read as authoritative when set, but nothing writes it until Razorpay lands.

**Not wired:** no RDS instance is provisioned, and submissions still aren't emailed (ADR-003).

## The client singleton

`services/db/prisma.ts`, not the conventional `lib/prisma.ts`. `lib/` in this repo is shared pure logic — types, questions, storage helpers — while `services/` is where vendor SDKs are allowed to live, and Prisma is a vendor SDK. Putting it under `services/db/` keeps the module boundary in `CLAUDE.md` honest: nothing outside `services/` imports it, and business logic goes through the service interfaces instead.

Three things it does that a bare `new PrismaClient()` doesn't:

- **`import "server-only"`** — turns an accidental import from a client component into a build error instead of a confusing runtime failure. Without it, the first mistake of this kind surfaces as a bundling error deep in the generated client.
- **The `globalThis` cache in development.** Next.js re-evaluates server modules on every edit; a module-scoped client would open a fresh connection pool per hot reload until Postgres starts refusing connections. Production skips the global and uses a plain instance.
- **Fails fast on a missing `DATABASE_URL`** with a message that names the fix, rather than letting the adapter fail obscurely at first query.

**No RDS instance is provisioned.** That needs a CDK stack (ADR-002), and the prod access path — SSM Session Manager port forwarding vs. a bastion — is an open infra decision. Dev/prod apply migrations with `migrate deploy`, never `migrate dev`.

## Deferred model designs

Kept here so the shape isn't re-derived from scratch later.

**`Profile`** — `id`, `user_id` (unique FK), `type` (student | parent), `phone`, `marketing_consent`, `consent_at`. Separate from `User` so it can grow (school, grade, city) without bloating the identity table.

**`Payment`** — `id`, `user_id`, `item_type` (blueprint | consultation), `blueprint_id?`, `consultation_id?`, `amount` (paise), `currency`, `provider`, `provider_order_id` (unique), `provider_payment_id` (unique, nullable), `status`, timestamps. Index `user_id` for the purchase history Phase 2 promises.

Razorpay's flow is `orders.create()` → `order_id` → checkout → *only then* a `payment_id`, so the row is persisted at order time and a non-nullable `provider_payment_id` would be unwritable. The unique constraint on `provider_payment_id` is what makes webhook replay idempotent. The polymorphic `item_type` needs a CHECK constraint that Prisma can't express:

```sql
ALTER TABLE payments ADD CONSTRAINT payment_item_exclusive CHECK (
  (item_type = 'blueprint'    AND blueprint_id IS NOT NULL AND consultation_id IS NULL)
  OR
  (item_type = 'consultation' AND consultation_id IS NOT NULL AND blueprint_id IS NULL)
);
```

**`Consultation`** — `id`, `user_id`, `mentor_id?`, `blueprint_id`, `scheduled_at`, `status` (requested | confirmed | completed | cancelled), `notes`, timestamps. Index `user_id` and `mentor_id` — both sides query it. Named for `PRODUCT.md`'s "Career Strategy Call", not a generic booking system.

**`Mentor`** — `id`, `name`, `email`, `bio`, `created_at`. Open question for Phase 5: mentors get a dashboard, which means they log in. Either `Mentor` gains a `user_id` pointing at a Cognito-backed `User` (plus a Mentor group for RBAC), or you maintain a second auth path. A standalone `email` field quietly assumes the latter.

**`Career`** — `id` (the immutable code), `name`, `description`, `ai_risk`, `is_active`, timestamps. Replaces `services/ai/mock/career-catalog.ts`. `lib/blueprint/types.ts` already types `CareerId` as `string` rather than a union specifically so this can become admin-managed without a deploy per career.

**`AssessmentQuestion`** — `id`, `area`, `prompt`, `config` (type-specific: options, min/max, `showIf`), `sort_order`, `version`, `is_active`, `created_at`. Replaces `lib/assessment/questions.ts`. `version` is what `assessments.question_set_version` records; `sort_order` because an admin-managed set needs an explicit order once array position in a source file no longer provides one. Editing a question here never rewrites history — `assessments.questionnaire` already snapshotted it.
