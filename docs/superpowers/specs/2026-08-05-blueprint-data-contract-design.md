# Blueprint AI mock + data contract — design

**Status:** Approved 2026-08-05, ready for planning.

## Context

This is sub-project #1 of a larger effort (see decomposition below). The assessment flow
(`components/assessment/*`) already captures 18 questions of student answers and a lead
(name/email/phone). Today, `assessment-flow.tsx`'s `submit()` just `console.log`s the raw
submission and shows a "an advisor will email you in 24 hours" confirmation screen — there's no
career recommendation or Blueprint generation yet.

The eventual real flow (see "Not in this spec" below) is: assessment → sign up (Cognito Google
SSO) → redacted/free preview of the Blueprint → pay → full Blueprint + PDF. Before any of that can
be built, we need to know: what does "the AI" actually return? This spec finalizes that data
contract and builds a rules-based mock that produces it, so downstream UI/auth/payment work has a
stable shape to build against instead of guessing.

### Decomposition (agreed 2026-08-05)

1. **This spec** — AI processing mock + finalized Blueprint data contract
2. Auth + header login state (Cognito Google SSO)
3. Redacted/free-preview Blueprint view for logged-in users
4. Payment gate + full Blueprint/PDF unlock

Each is its own spec/plan. This spec only covers #1.

### Reference material

A third-party demo product (generic career-roadmap tool, not tech-career or India specific) was
reviewed for UI/content patterns and cataloged in `reference/BLUEPRINT_UI_REFERENCE.md`. Section
numbers below (§1, §2, ...) refer to that document. That doc is for later UI-building — this spec
only borrows it to decide what *data* the contract needs to support.

## Scope decisions

- **Full detail for all top-3 careers, not just the recommended one** — the reference's tab
  switcher (§3) shows skills/salary/plan for whichever of the 3 careers is selected, defaulting to
  the recommended one. The mock generates full `CareerMatch` data for all 3, not just #1.
- **Included from the reference beyond PRODUCT.md's existing field list:** persona archetype +
  strengths/watch-outs + signal map (§1–2), and match% + AI-risk label per career (§3).
- **Explicitly deferred (not in this contract):** named learning resources with cost/duration
  (§6) and the "Next 7 days" checklist (§7) — both are really separate problems (a curated
  resource database; a gating/UX decision for a later sub-project) rather than data the mock can
  meaningfully fabricate now.
- **Currency:** INR lakh only, no USD conversion (target market is Indian students; the reference's
  dual-currency display doesn't apply here).
- **Mock is deterministic and rules-based**, not random — same answers always produce the same
  Blueprint. This matters for eyeballing/demoing and for anyone reasoning about the output later.
- **`CareerId` and `SignalCategory` are plain `string` in the contract, not TS union types** —
  Phase 6 of the roadmap (`PRODUCT.md`) explicitly plans an admin-manageable career catalog, so
  locking `CareerId` to a compile-time union would mean every new career needs a code deploy,
  defeating that. `SignalCategory` is loosened to match for consistency, in case signal categories
  ever become configurable per assessment type or role family. The mock's own seed data (the
  current 10 careers, the current 6 signal categories) still lives as typed internal constants in
  `services/ai/mock-blueprint-service.ts` — only the public contract type is loosened, not the
  mock's internal scoring code.
- **No unit tests for the mock's scoring logic** — it's throwaway, replaced when the real AI call
  is wired in later. (User preference, recorded 2026-08-05.)
- **No simulated loading delay** — the mock resolves instantly. The service returns a `Promise` so
  swapping in a real, slower AI call later doesn't require an interface change, but building
  loading-state UI now is premature (YAGNI) since the results aren't even shown to the user until
  sub-project #3.

## Data contract

```ts
// lib/blueprint/types.ts

export type CareerId = string        // seeded from the 10 careers in PRODUCT.md today; admin-managed later (Phase 6)
export type SignalCategory = string  // seeded from 6 categories today; loosened to match CareerId

export type AiRisk = "low" | "medium" | "high"

export type ProfileSummary = {
  archetype: string                                  // "The Systems Builder"
  narrative: string                                  // synthesis paragraph
  strengths: { title: string; detail: string }[]      // exactly 3
  watchOuts: { title: string; detail: string }[]      // exactly 2 (detail includes the mitigation)
  signalMap: Record<SignalCategory, number>           // 0–100 each
}

export type LearningStage = { title: string; actions: string[]; milestone?: string }

export type CareerMatch = {
  careerId: CareerId
  name: string
  matchPercent: number                                // 0–100
  isRecommended: boolean                              // exactly one `true` across the 3
  aiRisk: AiRisk
  streamFit: string                                   // "12th with PCM preferred; BCA, BSc CS..."
  whyItFits: string
  dayInTheLife: string
  skillsToBuild: string[]
  learningPath: {
    months1to3: LearningStage
    months4to6: LearningStage
    months7to12: LearningStage
  }
  collegeGuidance: {
    smartMoneyRoute: string
    estimatedCostInrLakh: [number, number]
    expensiveAlternative: string
  }
  salaryProgressionInrLakh: { entry: number; year3: number; year5: number; year10: number }
  futureOutlook: string                               // demand / remote / automation narrative
  commonMistakes: string[]
}

export type Blueprint = {
  version: 1
  generatedAt: string                                 // ISO timestamp
  studentName: string
  profile: ProfileSummary
  careers: CareerMatch[]                               // exactly 3
}
```

## Mock generation strategy

A deterministic, rules-based scorer in `services/ai/mock-blueprint-service.ts`:

1. Read relevant answers from `Answers` (`tech_interests`, `coding_comfort`, `logic_confidence`,
   `help_with`, `job_values`, `work_setting`, `company_type`, `stream`, etc.).
2. Compute the 6-category `signalMap` (0–100 each) from those answers — e.g. `coding_comfort` +
   `logic_confidence` feed `technical`; `help_with` options like "making things look good" feed
   `creative`; ranking position of "helping" in `job_values` feeds `empathy`; etc.
3. Score all 10 catalog careers against the signal map + `tech_interests` (which maps close to
   1:1 onto the career list already), rank them, take the top 3, flag #1 `isRecommended: true`.
4. Fill in an archetype name + narrative + strengths/watch-outs from the dominant signal(s).
5. Template-fill each `CareerMatch`'s prose fields (`whyItFits`, `dayInTheLife`, `futureOutlook`,
   etc.) per `careerId` from a small per-career content table, parameterized by the student's name
   and top signals — not hand-written per student, but not static across all students either.

## Integration point

- `services/ai/blueprint-service.ts` — a `BlueprintService` interface
  (`generate(input: BlueprintInput): Promise<Blueprint>`), per CLAUDE.md's module-boundary rule
  (business logic talks to an internal interface, not a vendor SDK directly). Swappable later for
  a real OpenAI-backed implementation without touching callers.
- `services/ai/mock-blueprint-service.ts` — the only implementation for now, exported as the
  service to use.
- `lib/blueprint/storage.ts` — new module mirroring the existing `lib/assessment/storage.ts`
  localStorage pattern, to persist the generated `Blueprint` so it survives a page refresh and is
  ready for sub-project #2/#3 to read. There's no backend/DB yet (ADR-001 auth and ADR-005 DB
  hosting are both still Pending), so localStorage is the only option available at this stage —
  not a long-term choice, just what's available before Phase 2 wiring exists.
- `assessment-flow.tsx`'s `submit()` calls the service after lead capture, stores the result, then
  proceeds to the `"done"` stage as today.
- `confirmation-screen.tsx` copy currently claims *"a career advisor will send your matches within
  24 hours"* — inaccurate once a result is computed immediately (even mocked). Update to a neutral
  message that doesn't promise a signup CTA yet (that's sub-project #2's job) — e.g. acknowledging
  the matches are ready without describing how to see them.

## Error handling

The mock itself can't fail (pure function over already-validated `Answers`), so no error states to
design here. The real AI implementation will need its own error handling (timeouts, malformed
responses) when it's built — out of scope for this spec.

## Testing

None for the mock's scoring logic (see Scope decisions above — deferred until the real
implementation replaces it). If any part of this scoring math is expected to survive into the real
implementation, that's a call to make at that time, not now.

## Not in this spec

Deferred to later sub-projects: auth/signup, the actual Blueprint dashboard UI, free/paid gating,
payment, PDF export, named learning resources, and the "Next 7 days" checklist.
