# Blueprint Dashboard (Sub-project #3) — Design Spec

## Goal

After a student completes the Free Career Assessment and signs up (sub-projects #1 and #2), they land on a logged-in dashboard showing their AI-generated Blueprint: the free preview (careers, match %, one recommended, why-it-fits, profile summary) fully visible, and the paid sections (skills, learning path, college guidance, salary progression, future outlook, common mistakes) visibly present but locked behind an "Unlock Full Blueprint" CTA.

Real payment (Razorpay) is **out of scope** for this sub-project. The unlock CTA sets a local "paid" flag directly — a placeholder for the real checkout flow, which becomes sub-project #4.

## Non-goals

- Razorpay checkout / real payment processing
- Server-side persistence of the Blueprint or paid status (no DB yet — ADR-005 still pending)
- PDF export
- Mentor call booking

## Routing & auth gating

New route group, matching the layout `reference/ARCHITECTURE.md` already reserves for auth-required pages:

- `app/(app)/layout.tsx` — server component. Calls NextAuth v4's `getServerSession(authOptions)`. No session → `redirect("/")`. This gates the whole `(app)` group server-side, with no flash of protected content before the redirect fires. Future Phase 3/4 pages (Assessment, Blueprint) can share this group.
- `app/(app)/dashboard/page.tsx` — thin page, renders a client `DashboardView` component (the page itself needs no client logic beyond mounting that component).

## Data model & the mock-premium mechanism

The Blueprint itself already persists client-side only, via `lib/blueprint/storage.ts` (`localStorage`, key `coacheepro.blueprint.v1`). This sub-project adds a sibling "paid" flag to the same file, not to the `Blueprint` type — payment status isn't AI-generated data and shouldn't live in that data contract:

```ts
// lib/blueprint/storage.ts additions
export const isBlueprintPaid = (): boolean => { /* reads a new localStorage key */ }
export const setBlueprintPaid = (paid: boolean): void => { /* writes it */ }
```

- New key: `coacheepro.blueprint.paid.v1`, boolean-ish (`"1"` / absent), same try/catch-and-degrade pattern as the existing functions (private-mode/quota-exceeded browsers just don't persist it — the session still works, it just won't survive a reload).
- `clearBlueprint()` also clears the paid flag — payment status is meaningless without a blueprint.
- The dashboard's "Unlock Full Blueprint" button calls `setBlueprintPaid(true)` directly and re-renders — no fake payment modal, since it's a direct stand-in for the real Razorpay flow later.
- A small "Reset to free preview" text link (dev/QA convenience) calls `setBlueprintPaid(false)`.

## Components

New `components/dashboard/` folder, following `component-conventions.md` (named `const` arrow-function exports, `Props` type after the component):

- **`dashboard-view.tsx`** — orchestrator. On mount (client-only, matching the existing SSR-safe pattern in `assessment-flow.tsx`/`header.tsx`), loads the blueprint via `loadBlueprint()` and the paid flag via `isBlueprintPaid()`. Renders `EmptyState` if no blueprint, otherwise the full dashboard: `ProfileSummaryCard`, a list of `CareerMatchCard`s, and the unlock/reset controls.
- **`profile-summary-card.tsx`** — renders `Blueprint.profile` (archetype, narrative, strengths, watch-outs). Always free/unlocked — it's self-insight framing, not the career-specific paid deliverable.
- **`career-match-card.tsx`** — renders one `CareerMatch`. Always visible: `name`, `matchPercent`, `isRecommended` badge, `aiRisk` badge, `streamFit`, `whyItFits`. Wrapped in `LockedSection` when `!isPaid`: `dayInTheLife`, `skillsToBuild`, `learningPath`, `collegeGuidance`, `salaryProgressionInrLakh`, `futureOutlook`, `commonMistakes`.
- **`locked-section.tsx`** — reusable wrapper: blurred content + a centered lock icon + "Unlock Full Blueprint" button overlay. Takes `isLocked: boolean`, `onUnlock: () => void`, and `children`. One implementation shared by every gated block rather than repeating the overlay markup per section.
- **`empty-state.tsx`** — shown when a signed-in user has no blueprint on this device (never completed the assessment here, cleared storage, or is on a different browser). Explains that plainly and offers a button that calls `useAssessment().open()` to start the assessment.

All components follow `ui-conventions.md`: mobile-first stacked layout (cards, not a multi-column grid, below `sm:`), `dark:` variant paired on every class as written, locked overlays are tap-reachable (not hover-only) with 44px+ touch targets on the unlock button, and color is never the only signal for "locked" (icon + label, not just a dimmed treatment).

## Flow changes

**Signup now auto-redirects instead of showing a confirmation screen**, so the post-signup path simplifies:

- `assessment-provider.tsx`: in the existing `?assessment=done` handler, once a session is confirmed present, `router.replace("/dashboard")` (via `useRouter` from `next/navigation`) instead of reopening the modal at a `"done"` stage. If no session (signup was denied or failed mid-flow), it still reopens the modal at `"signup"` to retry — this branch is unchanged.
- Because the `"done"` stage becomes unreachable, delete `confirmation-screen.tsx` entirely, and remove `"done"` from the `Stage` union in `assessment-flow.tsx`. This also removes now-dead code: the `useSession` import and `lead` state in `assessment-flow.tsx` (both existed only to pass a name into `ConfirmationScreen`), and the `onClose` prop threaded from `assessment-dialog.tsx` into `AssessmentFlow` (was only ever used by `ConfirmationScreen`'s Close button — the dialog's own header X button calls `close` directly and is unaffected).

**Header (`components/marketing/header.tsx`):**

- Both "Log in" buttons (desktop and mobile) get `callbackUrl: "/dashboard"` instead of `"/"`.
- The signed-in name/greeting becomes a link to `/dashboard`, so a user who's already authenticated (no fresh sign-in click needed) still has a way back to their results from anywhere on the site.

## Error / edge-case handling

- **Signed-out visit to `/dashboard`:** server-side redirect to `/`, no protected content ever renders client-side.
- **Signed-in, no blueprint on this device:** `EmptyState` with a CTA into the assessment modal — never a broken/blank dashboard.
- **`localStorage` unavailable (private mode, quota exceeded):** matches the existing degrade-gracefully pattern in `lib/blueprint/storage.ts` — reads return `null`/`false`, so the dashboard falls back to `EmptyState` rather than throwing.
- **Corrupt/stale blueprint JSON:** already handled by `loadBlueprint()` (`version !== 1` or parse failure → `null`), same fallback as above.

## Testing approach

Per established project convention, no automated tests for the mock-premium toggle itself — it's throwaway scaffolding standing in for a real payment integration that will replace it in sub-project #4. Verification is manual, in-browser, covering: signed-out access to `/dashboard` redirects home; signed-in with no blueprint shows the empty state; signed-in with a blueprint shows free content unlocked and paid sections blurred; clicking unlock reveals paid content and survives a reload; the full assessment → signup → auto-redirect → dashboard path end-to-end; and the header's sign-in and signed-in-name-link paths.
