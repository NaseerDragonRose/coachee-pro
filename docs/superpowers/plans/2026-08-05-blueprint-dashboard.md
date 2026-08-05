# Blueprint Dashboard (Sub-project #3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give signed-in students an auth-gated `/dashboard` showing their AI-generated Blueprint — free preview (careers, match %, one recommended, why-it-fits, profile summary) fully visible, paid sections (skills, learning path, college guidance, salary, future outlook, common mistakes) blurred behind an "Unlock Full Blueprint" button that mocks payment by flipping a local flag.

**Architecture:** A new `app/(app)/` route group, server-auth-gated via NextAuth v4's `getServerSession`, renders a client `DashboardView` that reads the Blueprint and a new "paid" flag from `localStorage` (no DB yet). New presentational components under `components/dashboard/` render the free/locked split per career. The assessment flow's post-signup step changes from showing a confirmation screen to redirecting straight into `/dashboard`, which lets `confirmation-screen.tsx` and its now-dead plumbing be deleted.

**Tech Stack:** Next.js 16 App Router, TypeScript (strict), Tailwind, `next-auth@4.24.15`, `lucide-react` icons, `localStorage` persistence.

## Global Constraints

- Full design detail lives in `docs/superpowers/specs/2026-08-05-blueprint-dashboard-design.md` — read it first if anything below is ambiguous.
- Real Razorpay payment is **out of scope**. The "Unlock Full Blueprint" button calls `setBlueprintPaid(true)` directly — no payment modal, no server call. This is intentional placeholder scaffolding for a future sub-project, not a bug.
- No database (ADR-005 still pending). Blueprint and paid-status both live in `localStorage` only, client-side.
- Hand-written components (everything under `components/dashboard/`) follow `.claude/rules/component-conventions.md`: named `const` arrow-function export, props destructured inline, a `Props` type declared after the component (omit the `Props` type entirely for components that take no props).
- All UI follows `.claude/rules/ui-conventions.md`: mobile-first base classes (`sm:`/`lg:` only add/expand, never claw back with `max-sm:`), a `dark:` class paired at the point every light class is written, 44px+ (`h-11`/`h-12`) touch targets on anything tappable, locked/overlay content reachable without hover, color never the only signal (pair the "locked" state with an icon + text label).
- `app/**/page.tsx` and `app/**/layout.tsx` are Next.js special files — default exports, exempt from the component-conventions shape (per that file's own scope note).
- No automated test framework exists in this repo (verified: no `jest`/`vitest`/`@testing-library` in `package.json`, no `*.test.*` files anywhere). Verification is `npx tsc --noEmit`, `npm run lint`, and manual checks against the running dev server — matching how the two prior sub-projects (mock AI blueprint, Cognito SSO) were verified. Do not introduce a test framework as part of this plan.
- **Do not run `git add` / `git commit` for any task below.** This repo requires fresh, explicit authorization before every commit — a standing rule, not something this plan grants. All tasks end with a verification step, not a commit step. Committing happens together, only after the user explicitly authorizes it following the Final Verification section at the end of this plan.
- Use the `@/*` path alias (maps to repo root) for all cross-folder imports, matching every existing file in this codebase.

---

### Task 1: Blueprint storage — paid flag

**Files:**
- Modify: `lib/blueprint/storage.ts`

**Interfaces:**
- Consumes: nothing new — extends the existing `store()` helper and `KEY` constant already in this file.
- Produces: `isBlueprintPaid(): boolean`, `setBlueprintPaid(paid: boolean): void`, both exported. Modifies `clearBlueprint(): void` (existing export, same signature) to also clear the paid flag.

The current file (read in full before editing):

```ts
import type { Blueprint } from "./types.ts"

const KEY = "coacheepro.blueprint.v1"

const store = (): Storage | null => {
  try {
    return globalThis.localStorage ?? null
  } catch {
    // Blocked by browser settings.
    return null
  }
}

export const saveBlueprint = (blueprint: Blueprint): void => {
  try {
    store()?.setItem(KEY, JSON.stringify(blueprint))
  } catch {
    // Private mode or quota exceeded — the flow continues without persistence.
  }
}

export const loadBlueprint = (): Blueprint | null => {
  try {
    const raw = store()?.getItem(KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Blueprint
    if (parsed?.version !== 1) return null

    return parsed
  } catch {
    // Corrupt JSON — treat as no blueprint.
    return null
  }
}

export const clearBlueprint = (): void => {
  try {
    store()?.removeItem(KEY)
  } catch {
    // Nothing to do.
  }
}
```

- [ ] **Step 1: Add the `PAID_KEY` constant**

Add directly below the existing `KEY` constant:

```ts
const PAID_KEY = "coacheepro.blueprint.paid.v1"
```

- [ ] **Step 2: Add `isBlueprintPaid` and `setBlueprintPaid`**

Add after `saveBlueprint` (before `loadBlueprint`, so the paid-flag functions sit next to each other logically — order in the file doesn't affect behavior, this is just for readability):

```ts
export const isBlueprintPaid = (): boolean => {
  try {
    return store()?.getItem(PAID_KEY) === "1"
  } catch {
    return false
  }
}

export const setBlueprintPaid = (paid: boolean): void => {
  try {
    if (paid) {
      store()?.setItem(PAID_KEY, "1")
    } else {
      store()?.removeItem(PAID_KEY)
    }
  } catch {
    // Private mode or quota exceeded — the flow continues without persistence.
  }
}
```

- [ ] **Step 3: Clear the paid flag in `clearBlueprint`**

Change:

```ts
export const clearBlueprint = (): void => {
  try {
    store()?.removeItem(KEY)
  } catch {
    // Nothing to do.
  }
}
```

To:

```ts
export const clearBlueprint = (): void => {
  try {
    store()?.removeItem(KEY)
    store()?.removeItem(PAID_KEY)
  } catch {
    // Nothing to do.
  }
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

No automated tests exist for this file's siblings (`saveBlueprint`/`loadBlueprint`) either — manual verification happens naturally in Task 3's browser check, where `setBlueprintPaid`/`isBlueprintPaid` get exercised through the UI.

---

### Task 2: Dashboard presentational components

**Files:**
- Create: `components/dashboard/locked-section.tsx`
- Create: `components/dashboard/empty-state.tsx`
- Create: `components/dashboard/profile-summary-card.tsx`
- Create: `components/dashboard/career-match-card.tsx`

**Interfaces:**
- Consumes: `Blueprint`, `ProfileSummary`, `CareerMatch`, `AiRisk`, `LearningStage` types from `@/lib/blueprint/types` (already exist, read in full above — no changes needed to that file).
- Produces:
  - `LockedSection` — props `{ isLocked: boolean; onUnlock: () => void; children: ReactNode }`.
  - `EmptyState` — no props.
  - `ProfileSummaryCard` — props `{ profile: ProfileSummary }`.
  - `CareerMatchCard` — props `{ career: CareerMatch; isPaid: boolean; onUnlock: () => void }`.
  - All four are consumed by Task 3's `DashboardView`.

- [ ] **Step 1: Create `LockedSection`**

```tsx
"use client"

import type { ReactNode } from "react"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"

export const LockedSection = ({ isLocked, onUnlock, children }: Props) => {
  if (!isLocked) return <>{children}</>

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/80 px-4 text-center dark:bg-slate-950/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
          <Lock className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Unlock the full Blueprint to see this
        </p>
        <Button
          onClick={onUnlock}
          className="h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Unlock Full Blueprint
        </Button>
      </div>
    </div>
  )
}

type Props = {
  isLocked: boolean
  onUnlock: () => void
  children: ReactNode
}
```

Note: the blurred `children` are marked `aria-hidden="true"` and `pointer-events-none` — screen-reader users get the unlock button and its label instead of an unusable, half-legible copy of locked content. This is the accessibility requirement from `ui-conventions.md` ("nothing important behind hover," "color never the only signal") applied to a lock affordance: icon + text label + a real, focusable button, not just a blur.

- [ ] **Step 2: Create `EmptyState`**

```tsx
"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

export const EmptyState = () => (
  <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
      <Sparkles className="h-6 w-6" />
    </div>
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        No results on this device yet
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Take the free career assessment to get your personalized tech career matches.
      </p>
    </div>
    <Link
      href="/?assessment=1"
      className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
    >
      Take the Free Assessment
    </Link>
  </div>
)
```

This links to `/?assessment=1` rather than calling `useAssessment().open()` directly — the assessment modal's provider (`components/assessment/assessment-provider.tsx`) only wraps the `(marketing)` route group (see `app/(marketing)/layout.tsx`), not the new `(app)` group this component lives under. `assessment-provider.tsx` already opens the modal automatically when it sees `?assessment=1` in the URL on mount (this is the existing campaign-link deep-link mechanism — no changes needed to support this), so linking there reuses an already-built, already-tested path instead of restructuring where `AssessmentProvider` mounts.

- [ ] **Step 3: Create `ProfileSummaryCard`**

```tsx
"use client"

import type { ProfileSummary } from "@/lib/blueprint/types"

export const ProfileSummaryCard = ({ profile }: Props) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
        Your profile
      </p>
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{profile.archetype}</h2>
      <p className="text-sm text-muted-foreground">{profile.narrative}</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Strengths</p>
        <ul className="flex flex-col gap-2">
          {profile.strengths.map((strength) => (
            <li key={strength.title} className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{strength.title}</span>
              <span className="text-muted-foreground"> — {strength.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Watch-outs</p>
        <ul className="flex flex-col gap-2">
          {profile.watchOuts.map((watchOut) => (
            <li key={watchOut.title} className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{watchOut.title}</span>
              <span className="text-muted-foreground"> — {watchOut.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

type Props = {
  profile: ProfileSummary
}
```

- [ ] **Step 4: Create `CareerMatchCard`**

```tsx
"use client"

import { CheckCircle2 } from "lucide-react"

import type { AiRisk, CareerMatch } from "@/lib/blueprint/types"

import { LockedSection } from "./locked-section"

const AI_RISK_STYLES: Record<AiRisk, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
}

const AI_RISK_LABELS: Record<AiRisk, string> = {
  low: "Low AI risk",
  medium: "Medium AI risk",
  high: "High AI risk",
}

export const CareerMatchCard = ({ career, isPaid, onUnlock }: Props) => {
  const salaryRows: { label: string; value: number }[] = [
    { label: "Entry", value: career.salaryProgressionInrLakh.entry },
    { label: "3 yr", value: career.salaryProgressionInrLakh.year3 },
    { label: "5 yr", value: career.salaryProgressionInrLakh.year5 },
    { label: "10 yr", value: career.salaryProgressionInrLakh.year10 },
  ]
  const learningStages = [
    career.learningPath.months1to3,
    career.learningPath.months4to6,
    career.learningPath.months7to12,
  ]

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{career.name}</h3>
            {career.isRecommended && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                <CheckCircle2 className="h-3 w-3" />
                Our recommendation
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-muted-foreground">{career.streamFit}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${AI_RISK_STYLES[career.aiRisk]}`}>
            {AI_RISK_LABELS[career.aiRisk]}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {career.matchPercent}% match
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{career.whyItFits}</p>

      <LockedSection isLocked={!isPaid} onUnlock={onUnlock}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              A day in the life
            </p>
            <p className="text-sm text-muted-foreground">{career.dayInTheLife}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Skills to build
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {career.skillsToBuild.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Learning path
            </p>
            {learningStages.map((stage) => (
              <div key={stage.title} className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stage.title}</p>
                <ul className="ml-4 list-disc text-sm text-muted-foreground">
                  {stage.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
                {stage.milestone && (
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Milestone: {stage.milestone}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              College guidance
            </p>
            <p className="text-sm text-muted-foreground">{career.collegeGuidance.smartMoneyRoute}</p>
            <p className="text-xs text-muted-foreground">
              Typical cost: ₹{career.collegeGuidance.estimatedCostInrLakh[0]}–
              {career.collegeGuidance.estimatedCostInrLakh[1]} lakh
            </p>
            <p className="text-xs text-muted-foreground">
              Alternative: {career.collegeGuidance.expensiveAlternative}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Salary progression (₹ lakh/year, indicative)
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {salaryRows.map((row) => (
                <div key={row.label} className="rounded-xl bg-slate-50 px-2 py-2 dark:bg-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">₹{row.value}L</p>
                  <p className="text-[10px] font-medium text-muted-foreground">{row.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Future outlook
            </p>
            <p className="text-sm text-muted-foreground">{career.futureOutlook}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Common mistakes to avoid
            </p>
            <ul className="ml-4 list-disc text-sm text-muted-foreground">
              {career.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </div>
        </div>
      </LockedSection>
    </div>
  )
}

type Props = {
  career: CareerMatch
  isPaid: boolean
  onUnlock: () => void
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors. These four components aren't wired into any page yet (Task 4 does that), so there's nothing to click through in the browser until then.

---

### Task 3: DashboardView orchestrator

**Files:**
- Create: `components/dashboard/dashboard-view.tsx`

**Interfaces:**
- Consumes: `loadBlueprint`, `isBlueprintPaid`, `setBlueprintPaid` from `@/lib/blueprint/storage` (Task 1); `Blueprint` type from `@/lib/blueprint/types`; `LockedSection`/`EmptyState`/`ProfileSummaryCard`/`CareerMatchCard` from `./` (Task 2).
- Produces: `DashboardView` — no props. Consumed by Task 4's `app/(app)/dashboard/page.tsx`.

- [ ] **Step 1: Create `DashboardView`**

```tsx
"use client"

import { useEffect, useState } from "react"

import { isBlueprintPaid, loadBlueprint, setBlueprintPaid } from "@/lib/blueprint/storage"
import type { Blueprint } from "@/lib/blueprint/types"

import { CareerMatchCard } from "./career-match-card"
import { EmptyState } from "./empty-state"
import { ProfileSummaryCard } from "./profile-summary-card"

export const DashboardView = () => {
  const [mounted, setMounted] = useState(false)
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    // Blueprint and paid status live in localStorage, which isn't available
    // during SSR — this has to run after mount, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlueprint(loadBlueprint())
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPaid(isBlueprintPaid())
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const unlock = () => {
    setBlueprintPaid(true)
    setIsPaid(true)
  }

  const resetToFree = () => {
    setBlueprintPaid(false)
    setIsPaid(false)
  }

  if (!mounted) return null

  if (!blueprint) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Your Tech Career Blueprint
        </h1>
        <p className="text-sm text-muted-foreground">
          Generated {new Date(blueprint.generatedAt).toLocaleDateString()}
        </p>
      </div>

      <ProfileSummaryCard profile={blueprint.profile} />

      <div className="flex flex-col gap-5">
        {blueprint.careers.map((career) => (
          <CareerMatchCard key={career.careerId} career={career} isPaid={isPaid} onUnlock={unlock} />
        ))}
      </div>

      {isPaid && (
        <button
          type="button"
          onClick={resetToFree}
          className="self-start text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-300"
        >
          Reset to free preview
        </button>
      )}
    </div>
  )
}
```

The three `eslint-disable-next-line react-hooks/set-state-in-effect` comments match the existing pattern already used for the identical mount-gating problem in `components/marketing/header.tsx` (`setMounted(true)` in its own effect) — the rule flags synchronous `setState` calls made directly in an effect body.

"Reset to free preview" is a deliberate dev/QA affordance, not a customer-facing feature — it only appears once unlocked, as a small text link, not a prominent button.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors. Still nothing renders until Task 4 wires this into a page.

---

### Task 4: `(app)` route group — auth gate + dashboard page

**Files:**
- Create: `app/(app)/layout.tsx`
- Create: `app/(app)/dashboard/page.tsx`

**Interfaces:**
- Consumes: `authOptions` from `@/services/auth/auth-options` (already exists — see below); `DashboardView` from `@/components/dashboard/dashboard-view` (Task 3).
- Produces: the `/dashboard` route itself, and the `(app)` route group other Phase 3/4 pages (Assessment, Blueprint) can share later per `reference/ARCHITECTURE.md`'s folder structure.

`services/auth/auth-options.ts` already exists in full (no changes needed this task):

```ts
import type { NextAuthOptions } from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
      authorization: { params: { scope: "openid email profile" } },
      checks: ["state"],
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
}
```

- [ ] **Step 1: Create the `(app)` layout with server-side auth gating**

```tsx
import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/services/auth/auth-options"

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return <>{children}</>
}
```

This is a Next.js special file (default export required), exempt from `component-conventions.md`'s named-arrow-function shape per that file's own scope note. `getServerSession(authOptions)` (no request/response args) is the documented NextAuth v4 App Router usage — it reads the session from cookies via Next's request context automatically. Running this server-side means an unauthenticated visit to `/dashboard` never renders any protected content client-side before redirecting, unlike a client-side `useSession()` check which would briefly flash the page first.

- [ ] **Step 2: Create the dashboard page**

```tsx
import { DashboardView } from "@/components/dashboard/dashboard-view"

export default function DashboardPage() {
  return <DashboardView />
}
```

Also a Next.js special file (default export), same exemption. This stays a server component wrapper — all the client-only logic (localStorage, state) lives inside `DashboardView` itself.

- [ ] **Step 3: Verify — signed-out redirect**

Start the dev server (`npm run dev`), and in a private/incognito browser window (no Cognito session), visit `http://localhost:3000/dashboard`.
Expected: immediate redirect to `http://localhost:3000/`. No dashboard content visible at any point (check via view-source or network tab, not just visually — confirms the redirect happened server-side, not after a client flash).

- [ ] **Step 4: Verify — signed-in, no blueprint**

Sign in via the header's "Log in" button (existing Cognito flow) without having completed the assessment on this browser (or after running `localStorage.clear()` in devtools). Visit `/dashboard` directly.
Expected: the `EmptyState` renders — "No results on this device yet" with a "Take the Free Assessment" link. Clicking it navigates to `/` and opens the assessment modal (verifies the `/?assessment=1` deep link from Task 2 Step 2 still works).

- [ ] **Step 5: Verify — signed-in, with a blueprint**

Complete the full assessment → signup flow (this currently still lands you back at the marketing homepage with a confirmation screen — Task 5 changes that). Once signed in with a saved blueprint (check via devtools: `localStorage.getItem("coacheepro.blueprint.v1")` should be non-null), manually navigate to `/dashboard`.
Expected: profile summary and career cards render, free content visible, paid sections blurred with "Unlock Full Blueprint" overlays. Click one — its section unlocks immediately; reload the page — it's still unlocked (confirms `isBlueprintPaid()` persistence). Click "Reset to free preview" — it locks again.

---

### Task 5: Assessment flow auto-redirect + cleanup

**Files:**
- Modify: `components/assessment/assessment-provider.tsx`
- Modify: `components/assessment/assessment-flow.tsx`
- Modify: `components/assessment/assessment-dialog.tsx`
- Delete: `components/assessment/confirmation-screen.tsx`

**Interfaces:**
- Consumes: the `/dashboard` route (Task 4) as a redirect target.
- Produces: `AssessmentFlow` changes from `({ onClose }: Props)` to a zero-prop component; the `Stage` type it exports drops `"done"` — no other file consumes `Stage` outside this folder, confirmed via repo-wide search.

The full current content of all three files being modified was read in full earlier in this session (reproduced here so the diffs below are unambiguous).

`assessment-provider.tsx` (current, 82 lines):

```tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import { loadBlueprint } from "@/lib/blueprint/storage"
import { cognitoAuthService } from "@/services/auth/cognito-auth-service"

import { AssessmentDialog } from "./assessment-dialog"
import type { Stage } from "./assessment-flow"

const AssessmentContext = createContext<AssessmentContextValue | null>(null)

export const AssessmentProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [initialStage, setInitialStage] = useState<Stage | null>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const consumeInitialStage = useCallback(() => setInitialStage(null), [])

  useEffect(() => {
    const assessment = new URLSearchParams(window.location.search).get("assessment")

    if (assessment === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true)
      return
    }

    if (assessment === "done") {
      if (!loadBlueprint()) return

      cognitoAuthService.getSession().then((session) => {
        setInitialStage(session ? "done" : "signup")
        setIsOpen(true)
      })
    }
  }, [])

  const value = useMemo(
    () => ({ isOpen, open, close, initialStage, consumeInitialStage }),
    [isOpen, open, close, initialStage, consumeInitialStage]
  )

  return (
    <AssessmentContext.Provider value={value}>
      {children}
      <AssessmentDialog />
    </AssessmentContext.Provider>
  )
}

export const useAssessment = (): AssessmentContextValue => {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error("useAssessment must be used inside an AssessmentProvider")
  }
  return context
}

type AssessmentContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
  initialStage: Stage | null
  consumeInitialStage: () => void
}

type Props = {
  children: ReactNode
}
```

- [ ] **Step 1: Redirect to `/dashboard` instead of reopening the modal at `"done"`**

Add the `useRouter` import:

```tsx
import { useRouter } from "next/navigation"
```

Get the router instance inside the component, right after the two `useState` calls:

```tsx
const router = useRouter()
```

Replace the `assessment === "done"` branch:

```tsx
    if (assessment === "done") {
      if (!loadBlueprint()) return

      cognitoAuthService.getSession().then((session) => {
        setInitialStage(session ? "done" : "signup")
        setIsOpen(true)
      })
    }
```

With:

```tsx
    if (assessment === "done") {
      // No saved blueprint means this isn't a real post-assessment
      // redirect (stale/bookmarked link) — ignore it.
      if (!loadBlueprint()) return

      cognitoAuthService.getSession().then((session) => {
        // Signup can fail to complete (denied consent, refresh mid-flow);
        // land back on the signup screen to retry rather than sending an
        // unauthenticated visitor to the auth-gated dashboard.
        if (session) {
          router.replace("/dashboard")
          return
        }
        setInitialStage("signup")
        setIsOpen(true)
      })
    }
```

Add `router` to the effect's dependency array — it changes from `[]` to `[router]`.

- [ ] **Step 2: Verify with tsc**

Run: `npx tsc --noEmit`
Expected: no errors.

`assessment-flow.tsx` (current, 246 lines — the relevant excerpts):

Imports (lines 1–23):

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { isScreenComplete, pruneAnswers, screenIndexOf, visibleScreens } from "@/lib/assessment/flow"
import { clearDraft, loadDraft, saveDraft } from "@/lib/assessment/storage"
import type { AnswerValue, Answers, AssessmentSubmission, Lead } from "@/lib/assessment/types"
import { saveBlueprint } from "@/lib/blueprint/storage"
import { mockBlueprintService } from "@/services/ai/mock-blueprint-service"

import { ConfirmationScreen } from "./confirmation-screen"
import { LeadCaptureForm } from "./lead-capture-form"
import { QuestionScreen } from "./question-screen"
import { SignupScreen } from "./signup-screen"
import { TeaserScreen } from "./teaser-screen"
import { useAssessment } from "./assessment-provider"
import { WelcomeScreen } from "./welcome-screen"

export type Stage = "welcome" | "questions" | "teaser" | "capture" | "signup" | "done"
```

- [ ] **Step 3: Drop the `"done"` stage and its dead plumbing**

Replace that whole block with:

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { isScreenComplete, pruneAnswers, screenIndexOf, visibleScreens } from "@/lib/assessment/flow"
import { clearDraft, loadDraft, saveDraft } from "@/lib/assessment/storage"
import type { AnswerValue, Answers, AssessmentSubmission, Lead } from "@/lib/assessment/types"
import { saveBlueprint } from "@/lib/blueprint/storage"
import { mockBlueprintService } from "@/services/ai/mock-blueprint-service"

import { LeadCaptureForm } from "./lead-capture-form"
import { QuestionScreen } from "./question-screen"
import { SignupScreen } from "./signup-screen"
import { TeaserScreen } from "./teaser-screen"
import { useAssessment } from "./assessment-provider"
import { WelcomeScreen } from "./welcome-screen"

export type Stage = "welcome" | "questions" | "teaser" | "capture" | "signup"
```

Change the component signature from:

```tsx
export const AssessmentFlow = ({ onClose }: Props) => {
```

To:

```tsx
export const AssessmentFlow = () => {
```

Remove these two lines (the `lead` state and the session hook — both existed only to feed `ConfirmationScreen`'s name prop):

```tsx
  const [lead, setLead] = useState<Lead | null>(null)
```

```tsx
  const { data: session } = useSession()
```

In `submit`, remove the now-pointless `setLead(captured)` call:

```tsx
  const submit = async (captured: Lead) => {
    const submission: AssessmentSubmission = {
      answers: pruneAnswers(answers),
      lead: captured,
      completedAt: new Date().toISOString(),
    }
    // TODO(ADR-003): replace with a real SES or API endpoint send once configured.
    console.log("Assessment Submission:", submission)

    const blueprint = await mockBlueprintService.generate({
      answers: submission.answers,
      studentName: captured.name,
    })
    saveBlueprint(blueprint)

    clearDraft()
    setLead(captured)
    setStage("signup")
  }
```

Becomes:

```tsx
  const submit = async (captured: Lead) => {
    const submission: AssessmentSubmission = {
      answers: pruneAnswers(answers),
      lead: captured,
      completedAt: new Date().toISOString(),
    }
    // TODO(ADR-003): replace with a real SES or API endpoint send once configured.
    console.log("Assessment Submission:", submission)

    const blueprint = await mockBlueprintService.generate({
      answers: submission.answers,
      studentName: captured.name,
    })
    saveBlueprint(blueprint)

    clearDraft()
    setStage("signup")
  }
```

Delete the entire `"done"` stage render block:

```tsx
  if (stage === "done") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <ConfirmationScreen name={lead?.name ?? session?.user?.name ?? undefined} onClose={onClose} />
      </div>
    )
  }

```

Delete the trailing `Props` type (the component takes no props now):

```tsx
type Props = {
  onClose: () => void
}
```

`Lead` stays imported — `submit(captured: Lead)` still uses it.

- [ ] **Step 4: Update `assessment-dialog.tsx`**

Change:

```tsx
            <AssessmentFlow onClose={close} />
```

To:

```tsx
            <AssessmentFlow />
```

`close` stays imported/used elsewhere in the same file (the `onOpenChange` handler on `<Dialog>`).

- [ ] **Step 5: Delete `confirmation-screen.tsx`**

Delete the file: `components/assessment/confirmation-screen.tsx`. Nothing imports it anymore after Step 3.

- [ ] **Step 6: Verify with tsc and lint**

Run: `npx tsc --noEmit`
Expected: no errors — confirms no dangling references to `Stage`'s removed `"done"` member, `ConfirmationScreen`, `onClose`, `lead`, or `session` anywhere in the assessment folder.

Run: `npm run lint`
Expected: no errors (the existing `react-hooks/incompatible-library` warnings on `lead-capture-form.tsx`/`contact-form.tsx` are pre-existing and untouched by this task — don't try to fix them).

- [ ] **Step 7: Verify end-to-end in the browser**

Start the dev server, open the assessment modal from the marketing homepage, complete it through signup (a real Google sign-in against the deployed Cognito stack — same as the prior sub-project's verification). After Google redirects back with `?assessment=done`, confirm the browser lands on `/dashboard` directly — no confirmation screen, no modal reopening — showing the newly generated blueprint.

---

### Task 6: Header updates

**Files:**
- Modify: `components/marketing/header.tsx`

**Interfaces:**
- Consumes: the `/dashboard` route (Task 4).
- Produces: no new exports — this task only changes behavior inside the existing `Header` component.

The two relevant blocks, as they exist today (desktop, inside the `hidden ... md:flex` actions div; and mobile, inside the slide-down sheet):

Desktop (current):

```tsx
            {/* Login state */}
            {mounted && (
              status === "authenticated" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {session?.user?.name?.split(" ")[0]}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="h-9 rounded-xl px-2.5 text-xs font-semibold"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => signIn("cognito", { callbackUrl: "/" })}
                  className="h-9 rounded-xl px-2.5 text-xs font-semibold"
                >
                  Log in
                </Button>
              )
            )}
```

- [ ] **Step 1: Update the desktop login-state block**

Replace it with:

```tsx
            {/* Login state */}
            {mounted && (
              status === "authenticated" ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                  >
                    {session?.user?.name?.split(" ")[0]}
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="h-9 rounded-xl px-2.5 text-xs font-semibold"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => signIn("cognito", { callbackUrl: "/dashboard" })}
                  className="h-9 rounded-xl px-2.5 text-xs font-semibold"
                >
                  Log in
                </Button>
              )
            )}
```

`Link` is already imported at the top of this file (`import Link from "next/link"`, used by the logo and nav items) — no new import needed.

Mobile (current):

```tsx
                {mounted && (
                  status === "authenticated" ? (
                    <div className="flex flex-col gap-2">
                      <p className="px-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Signed in as {session?.user?.name?.split(" ")[0]}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          signOut({ callbackUrl: "/" })
                        }}
                        className="h-11 w-full rounded-xl text-sm font-semibold"
                      >
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        signIn("cognito", { callbackUrl: "/" })
                      }}
                      className="h-11 w-full rounded-xl text-sm font-semibold"
                    >
                      Log in
                    </Button>
                  )
                )}
```

- [ ] **Step 2: Update the mobile login-state block**

Replace it with:

```tsx
                {mounted && (
                  status === "authenticated" ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-1 text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                      >
                        Signed in as {session?.user?.name?.split(" ")[0]} — View Dashboard
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          signOut({ callbackUrl: "/" })
                        }}
                        className="h-11 w-full rounded-xl text-sm font-semibold"
                      >
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        signIn("cognito", { callbackUrl: "/dashboard" })
                      }}
                      className="h-11 w-full rounded-xl text-sm font-semibold"
                    >
                      Log in
                    </Button>
                  )
                )}
```

The mobile link's tap target: it's inline text, not a padded button — `px-1` alone doesn't guarantee 44px height. This is acceptable here because it sits in a `flex flex-col gap-2` stack with normal line-height text, consistent with how the same file already treats the adjacent "Signed in as..." text (previously a non-interactive `<p>` at the same size) — but if you want a stricter tap target, wrap it with `className="... block py-2"` — a scannable one-line copy tweak.

- [ ] **Step 3: Verify with tsc and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Verify in the browser**

Signed out: click "Log in" (desktop and, separately, mobile drawer) — completes the Cognito flow and lands on `/dashboard` (not `/`). Signed in: the header shows your first name (desktop) or "Signed in as [name] — View Dashboard" (mobile) as a clickable link — click it from a non-dashboard page (e.g. `/about`) and confirm it navigates to `/dashboard`. "Sign out" still works and still returns to `/`.

---

## Final Verification (after all tasks)

Do not run any of the following, and do not commit anything, until the user has explicitly reviewed the implemented work and given a fresh go-ahead — the same gate used for the prior two sub-projects.

Once authorized:

1. Run `npx tsc --noEmit` across the whole repo — expect zero errors.
2. Run `npm run lint` — expect zero errors (the two pre-existing `react-hooks/incompatible-library` warnings on `lead-capture-form.tsx`/`contact-form.tsx` are known and untouched).
3. Run `npm run build` — expect a clean production build (this is the first time `app/(app)/` and `getServerSession` get exercised through the Next.js build pipeline, not just `next dev` — worth catching any server/client boundary issue here rather than in production).
4. Re-run the manual browser checks from Tasks 4, 5, and 7 once more end-to-end, back to back, to catch any interaction between the pieces that per-task verification missed.
5. `git status` to review exactly what changed, `git add` the intended files (not `-A`), and commit — matching this repo's established commit-message style (see recent `git log`).
