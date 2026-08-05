# Cognito Google SSO Authentication — Design Spec

Sub-project #2 of the assessment → signup → blueprint decomposition (sub-project #1, the AI mock and Blueprint data contract, is done — see `2026-08-05-blueprint-data-contract-design.md`). This resolves ADR-001 (Authentication) and gives returning users a way to log back in.

## Goal

Let a student sign up with their Google account, via AWS Cognito, immediately after finishing the free assessment — and let returning users log back in from the header. This is real infrastructure and a real login, not a mock: unlike sub-project #1's AI call, the user chose to wire up actual Cognito + Google now rather than stub it.

## Scope

**In scope:**
- Cognito User Pool + Google federation, provisioned via a new CDK stack
- `services/auth` internal interface + a Cognito/NextAuth v4 implementation
- A new "signup" step in the assessment flow, after lead capture, before the confirmation screen
- Header login state (Log in / Signed in as {name} + Sign out) for both desktop and mobile
- Resolving ADR-001 (Decided: Cognito) and documenting why ADR-005 remains deferred

**Out of scope (later sub-projects / later phases):**
- Redacted/free-preview blueprint dashboard view (sub-project #3)
- Paid unlock, PDF export (sub-project #4)
- Any database (Users table, ADR-005) — sessions are JWT-only, nothing persisted server-side
- Student/Parent role attribute (PRODUCT.md treats this as a profile field, not an auth concept — no Users table to attach it to yet)
- A dashboard or profile page — the header's logged-in state only shows name + sign out, no links to pages that don't exist yet
- Reconciling the lead captured by `LeadCaptureForm` with the authenticated Cognito identity (no DB to link them in)

## Decisions locked

| Question | Decision | Why |
|---|---|---|
| Where does signup happen? | After the existing `LeadCaptureForm`, before the confirmation screen — required, not skippable | Matches the original request ("sign up after they're done with the questions"); lead capture still logs a fallback record even if signup is abandoned |
| Do we need a database now? | No — JWT-only sessions, no Users table (ADR-005 stays Pending) | Nothing in this sub-project's scope needs to look up a user by ID; forcing ADR-005 now would be deciding it before it's needed, against the project's own "don't decide Pending items early" rule |
| Mock or real Cognito/Google? | Real — actual Cognito User Pool + Google OAuth client, not a mock like sub-project #1's AI call | Explicit user choice; auth is the thing being built this round, not stood in for |
| How is Cognito provisioned? | AWS CDK stack (new `infra/` folder) | ADR-002 already confirmed CDK as this project's IaC tool; provisioning by hand in the console would need porting to CDK later anyway |
| Next.js ↔ Cognito integration layer | NextAuth **v4** (`next-auth@4.24.15`, latest stable) with its built-in Cognito provider | Mature Next.js App Router support, handles redirect/callback/JWT/cookie complexity; Cognito remains the actual identity provider — this does not reopen ADR-001, NextAuth is purely the integration layer. v5 ("Auth.js") is still beta-only (`5.0.0-beta.32`, no stable release) — project convention is LTS/stable dependencies only, so v4 is used despite v5's cleaner App Router API |
| OAuth UX: redirect vs. popup | Full-page redirect, auto-reopen the assessment modal on return | Google's consent screen refuses to render in an iframe, so a top-level navigation is unavoidable somewhere; a popup flow would need hand-rolled `postMessage` handling and is unreliable on mobile browsers (the product's primary audience is phone-first per `ui-conventions.md`) |

## Architecture

```
Google Cloud Console (OAuth client)          [user creates — external, manual]
        ↓ (client ID/secret)
infra/cognito-stack.ts (CDK)                 [Claude writes, user deploys]
  └─ Cognito User Pool + App Client + Google IdP federation
        ↓ (User Pool ID, App Client ID/secret, issuer URL)
services/auth/                               [internal interface — vendor-agnostic]
  ├─ auth-service.ts            (interface: getSession)
  └─ cognito-auth-service.ts    (NextAuth v4 config + Cognito provider)
        ↓
Next.js App Router — NextAuth v4 route handler, JWT session cookie (no DB adapter)
        ↓
components/marketing/header.tsx        — login state (desktop + mobile)
components/assessment/signup-screen.tsx — new assessment stage
```

`services/auth/` mirrors the `services/ai/` pattern from sub-project #1: business logic (header, assessment flow) talks to `getSession()` for session reads, never to Cognito directly. `signIn`/`signOut`/`useSession` are used directly from `next-auth/react` per the simplification in the Session Contract section above.

## Session contract

```ts
// services/auth/auth-service.ts
export type Session = {
  id: string        // Cognito `sub`
  email: string
  name: string
}

export interface AuthService {
  getSession(): Promise<Session | null>
}
```

`signIn`/`signOut` are called directly from client components via NextAuth v4's `next-auth/react` exports (`signIn('cognito', { callbackUrl })`, `signOut({ callbackUrl })`) — these are already thin, stateless wrappers with no vendor-specific behavior to hide, so wrapping them in the interface would just be indirection. `getSession()` is the one piece worth abstracting, since callers (header, assessment deep-link) genuinely only care about "who's logged in," not how NextAuth represents that.

No `role` field — PRODUCT.md treats Student/Parent as a personalization attribute, not an auth concept, and there is no Users table to store it against yet.

## Assessment flow changes

New stage order: `welcome → questions → teaser → capture → signup → done`

- `capture` (`LeadCaptureForm`) is unchanged.
- `submit()` still runs immediately after capture, exactly as it does today: generates the mock blueprint and calls `saveBlueprint()` to localStorage — **before** any redirect, so the blueprint survives regardless of what happens to React state next.
- New `signup` stage renders `SignupScreen` (visual style matches `TeaserScreen`): explains the value prop and shows one "Continue with Google" button. No skip option.
- "Continue with Google" calls `signIn('cognito', { callbackUrl: '/?assessment=done' })` — a full top-level navigation to Google/Cognito and back.
- `assessment-provider.tsx`'s existing deep-link effect (currently handles `?assessment=1` to auto-open the modal fresh) gains a second case: `?assessment=done` → open the modal directly into the `done` stage, reading the already-saved blueprint from localStorage and the now-active session for the confirmation screen's name.

Nothing is actually lost across the redirect — answers, lead, and blueprint are already in localStorage before it happens. Only the modal's open/closed UI state needs restoring, and the URL param + localStorage check does that automatically.

## Header login state

**Desktop** — between the theme toggle and the "Start Free Test" CTA:
- Logged out: plain-text "Log in" button → `signIn('cognito', { callbackUrl: '/' })`
- Logged in: first name + a small "Sign out" button (no avatar, no dropdown — nothing to link to yet)

**Mobile drawer** — in the bottom section, above the existing "Start Free Assessment" CTA:
- Logged out: full-width "Log in" row
- Logged in: "Signed in as {name}" text + "Sign out" button in the same slot

Both read session state via NextAuth v4's own `useSession()` from `next-auth/react` directly — a thin, already-stateless hook with nothing vendor-specific to abstract, consistent with the interface simplification above.

## Routes & wiring

- `app/api/auth/[...nextauth]/route.ts` — NextAuth v4 catch-all route handler; serves `/api/auth/signin`, `/api/auth/callback/cognito`, `/api/auth/signout`, `/api/auth/session` automatically. No custom sign-in page — the app calls `signIn('cognito', {...})` directly since there's only one provider.
- `app/layout.tsx` gets wrapped with a `SessionProvider` client component, same pattern as the existing `ThemeProvider`/`AssessmentProvider` wrapping.
- No dashboard or profile page in this sub-project.

## Environment & secrets

- `.env.local` (gitignored) holds `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `COGNITO_CLIENT_ID`, `COGNITO_CLIENT_SECRET`, `COGNITO_ISSUER` (v4's naming convention — the provider config reads these explicitly rather than v5's auto-inferred `AUTH_*` names) — the Cognito values copied from CDK stack outputs after deploy.
- No AWS Secrets Manager — `ARCHITECTURE.md` already defers that until multiple environments exist; still single-environment.
- Production: same vars added to Amplify Console's environment variables (hosting is already Amplify).

## ADR / doc updates required

- `reference/ADRS.md` — ADR-001 status flips from Pending to **Decided (2026-08-05) — AWS Cognito**, decision text records Cognito + NextAuth v4 as the integration layer.
- `reference/ADRS.md` — ADR-005 stays **Pending**, with an added note that this phase's first pass deliberately avoided needing it (JWT-only sessions, no Users table), so whoever revisits it later knows why it wasn't forced.
- `reference/ARCHITECTURE.md` — Auth row updates from "Pending" to "Confirmed — AWS Cognito + NextAuth v4."
- `CLAUDE.md` — current-status paragraph updated once this ships.

## Error handling

- Google/Cognito returns an OAuth error (user denies consent, misconfiguration) → NextAuth v4's default error handling redirects to `/api/auth/error`; this sub-project accepts NextAuth's default error page rather than building a custom one, since there's no design requirement calling for one.
- Assessment flow: if the user lands back at `?assessment=done` without a valid session (e.g. they refreshed mid-flow or denied consent), the deep-link effect falls back to opening the modal at the `signup` stage again rather than `done`, so they can retry.

## Verification & division of labor

Not everything here can be verified from this environment:

- **Google Cloud OAuth client creation** — external, manual, tied to the user's Google account. Claude provides exact step-by-step instructions; the user performs it.
- **`cdk deploy`** — Claude writes the CDK stack; the user deploys it against their personal coachee-pro AWS profile (per the project's credentials-isolation preference), since this provisions real, billed AWS resources.
- **End-to-end OAuth click-through** — no browser automation tooling and no Google account available in this environment. Claude verifies everything up to that boundary (build passes, routes resolve, `services/auth` compiles and is wired correctly, dev server serves the new screens); the live click-through against real Cognito + Google is done by the user after both external setups are complete.

No automated tests are introduced for this work, consistent with the project's stance so far (no test framework in the repo).
