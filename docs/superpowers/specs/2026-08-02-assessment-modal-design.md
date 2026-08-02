# Free Assessment Modal — Design

**Date:** 2026-08-02
**Status:** Approved (design), not yet implemented
**Phase:** 1 (marketing website)
**Source brief:** `tmp/assesment-prompt.md`

## Summary

Clicking any "Free Assessment" CTA on the marketing site opens a modal containing a multi-step
career questionnaire. The student answers 18 core questions (plus up to 5 conditional follow-ups),
sees a teaser, submits their contact details, and gets a confirmation. No results are computed and
nothing is persisted server-side.

## Scope decisions

The source brief describes a complete product — questionnaire, SWOT results engine, career matching,
PDF export, response storage, parent portal. That is more than one project and more than Phase 1
supports. This spec covers only the first slice.

**In scope**

- Modal that opens from any marketing page
- Welcome screen with resume support
- 18 core questions + up to 5 conditional follow-ups, one per screen
- Client-side answer state, persisted to `localStorage` for resume
- Teaser screen, lead capture form, confirmation screen

**Out of scope (deferred)**

| Deferred | Why |
| --- | --- |
| Results / SWOT engine, career matching | Needs a recommendation framework; PRODUCT.md puts it in Phase 3 |
| Server-side persistence of responses | Would force ADR-005 (DB hosting), still Pending |
| Accounts, save-across-devices | Phase 2, ADR-001 still Pending |
| PDF export, parent export | Phase 4, ADR-006 still Pending |
| Real lead delivery (email/CRM) | ADR-003 (SES) decided but not wired; see Submission below |

**Content authority.** Question *content* follows `reference/PRODUCT.md` (tech-career-specific,
Class 11/12 India: stream, coding experience, the ten named tech careers). Question *tone, structure,
and coverage areas* follow the brief. Where they conflict, PRODUCT.md wins.

**Career count.** The product will surface **at most 3 career matches, exactly 1 of which is flagged
as our recommendation.** This overrides the brief's "Top 3-5 recommended career paths". The teaser
copy and any future matching engine must honour this. `reference/PRODUCT.md` is to be updated during
implementation to record the "1 recommended" detail alongside its existing "top 3" wording.

## Screen sequence

```
Welcome ──> Q1 ... Q18 (follow-ups inline after their trigger) ──> Teaser ──> Lead capture ──> Confirmation
```

**Welcome.** Purpose, "about 10–15 minutes", free, no signup needed, one line on privacy linking
`/privacy`. If a partial save exists (< 30 days old), shows *Resume* and *Start over*; otherwise a
single *Start* button.

**Teaser.** Makes no computed claim, because nothing is computed:

> Your profile is ready. We'll match you to 3 tech careers that fit it — and tell you which one we'd
> back for you.

**Lead capture.** Name, email, phone, plus a required consent checkbox. Under-18 students are told a
parent or guardian may be contacted.

**Confirmation.** Thanks, what happens next, close button. Clears the saved draft.

## Question set

18 core questions across the brief's 7 coverage areas, plus conditional follow-ups. `optional: true`
questions render a *Skip* control beside *Next*; everything else blocks *Next* until answered.

**Counting.** The numbering below counts *screens*, not data entries. Q1 and Q13 each render two
controls on one screen, and seven follow-up entries exist of which at most five can ever show (the two
`coding_comfort` branches are mutually exclusive, as are the two `career_idea` branches). So: **18 core
screens, max 23 screens total, 27 entries in `questions.ts`.**

### Area 1 — Identification

**Q1 · `identity`** — "First, tell us a bit about you." — `text` (name) + `choice` (class)
Options: Class 11 · Class 12 · Just finished Class 12 · Other

**Q2 · `stream`** — "Which stream are you in?" — `choice`
Options: PCM · PCB · PCMB · Commerce with Maths · Commerce without Maths · Arts / Humanities · Other

### Area 2 — Academic & skill strengths

**Q3 · `subjects`** — "Which subjects do you enjoy *and* do well in?" — `multi`
Options: Maths · Physics · Chemistry · Biology · Computer Science / IT · English · Economics ·
Art & Design · Other

**Q4 · `help_with`** — "What do people usually ask you for help with?" — `multi`
Options: Fixing gadgets or computers · Explaining tough topics · Organising things · Making things
look good · Solving puzzles and problems · Convincing or leading people · Honestly, none of these

**Q5 · `coding_comfort`** — "How comfortable are you with coding right now?" — `scale` 1–5
Labels: 1 "Never tried it" → 5 "I build my own projects"

> **Q5a (branch)**
> if `coding_comfort >= 4` → "Nice — what have you built or tried so far?" (`text`, `optional`)
> if `coding_comfort <= 2` → "Would you be up for learning to code if a career needed it?" (`choice`:
> Yes, definitely · Maybe, if it's taught well · I'd rather not)

**Q6 · `logic_confidence`** — "How confident are you with step-by-step logic problems?" — `scale` 1–5
Labels: 1 "I find them hard" → 5 "I really enjoy them"

**Q7 · `english_comfort`** — "How comfortable are you explaining your ideas in English, spoken or
written?" — `scale` 1–5
Labels: 1 "Not comfortable yet" → 5 "Very comfortable"

### Area 3 — Interests & passions

**Q8 · `tech_interests`** — "Which of these actually sound interesting to you?" — `multi`
Options: Building apps and websites · AI and machine learning · Cybersecurity and hacking · Robotics
and electronics · Games · Data and statistics · Design and how things look and feel · Cloud and
large systems · Leading a product or team

**Q9 · `free_weekend`** — "A whole free weekend, no school work. What do you actually spend it on?"
— `text`, `optional`

**Q10 · `wish_better`** — "What's one thing in the world you wish worked better?" — `text`, `optional`

### Area 4 — Learning style & work environment

**Q11 · `learning_style`** — "How do you learn best?" — `choice`
Options: Building or trying things myself · Watching and listening · Reading and taking notes · A mix

**Q12 · `job_values`** — "Put these in order — what matters most to you in a job?" — `ranking`
Items: Good salary · Job security and stability · Freedom to be creative · Helping people ·
Working with cutting-edge tech

**Q13 · `work_setting`** — "Where would you rather spend your working day?" — two `choice` controls
on one screen
13a: Deep in code or systems on my own · In a small close team · Around lots of different people
13b: A fast-moving startup · A big established company · Not sure yet

### Area 5 — Challenges, barriers & support

**Q14 · `struggles`** — "What do you find hardest right now?" — `multi`
Options: Maths · Staying focused · Exam pressure · English · Not knowing what I'm good at · Deciding
what to do next · Nothing much right now

> **Q14a (branch)** if `struggles.length >= 3` → "Who could help you work through these?" (`multi`:
> Parents · A teacher · Friends · An older sibling or cousin · Someone outside my circle · Not sure)

**Q15 · `support_network`** — "Who helps you make big decisions?" — `multi`
Options: Parents · Teachers · Friends · Older sibling or cousin · I mostly figure it out myself

**Q16 · `worries`** — "What worries you most about your future?" — `multi`
Options: Cost of college · Family expectations · AI taking away jobs · Picking the wrong path ·
Marks and entrance exams · Nothing much

> **Q16a (branch)** if `worries` includes `cost_of_college` → "Are there money constraints we should
> build into your roadmap?" (`text`, `optional`)

### Area 6 — Career awareness

**Q17 · `career_idea`** — "Do you have a career in mind already?" — `choice`
Options: Yes, I'm fairly sure · I have a few ideas · No idea yet

> **Q17a (branch)**
> if `career_idea` is `sure` or `few` → "Which one(s), and what appeals to you about it?" (`text`)
> if `career_idea` is `none` → "What would help you feel more confident?" (`multi`: Seeing what the
> job is like day to day · Knowing which degree leads where · Talking to someone doing it · Knowing
> realistic salaries · Knowing what to learn first)

### Area 7 — Family influence

**Q18 · `family_expectation`** — "Do your parents have a specific career in mind for you?" — `choice`
Options: Yes, and it matches what I want · Yes, but it's different from what I want · They're open to
whatever I choose · We haven't really discussed it

> **Q18a (branch)** if `family_expectation` is `different` → "How would you like to balance what they
> want with what you want?" (`text`, `optional`)

### Language rules

Enforced from the brief, on every string:

- Everyday language, 8th–10th grade reading level, direct address ("you")
- No career jargon (competencies, paradigm, ROI)
- No assumptions about family structure, wealth, or resources
- No leading questions, no judging any interest
- Every multi-select and scale screen carries "There's no right or wrong answer here"

## Architecture

### Wiring

An `AssessmentProvider` wraps `app/(marketing)/layout.tsx`. It holds `isOpen`, exposes `open()` and
`close()` via context, renders `<AssessmentDialog />` once, and opens automatically when the URL
carries `?assessment=1` (for ad and email campaign links). No navigation occurs when the modal opens.

Rejected alternatives: search-param-driven modal (every open becomes an RSC navigation and fights
Lenis scroll restoration); parallel route interception (routing machinery with no server data to
justify it).

### Files

Reusable primitives go in `components/ui/` as generic atoms. Nothing in `components/assessment/` is a
control — that directory holds only assessment-specific composition.

**`components/ui/` — new atoms** (thin wrappers over base-ui, which already ships every primitive we
need, so no new packages):

```
dialog.tsx          Dialog.Root/Backdrop/Popup/Title/Description/Close
field.tsx           Field.Root/Label/Description/Error — the label + control + error atom
input.tsx           text input
textarea.tsx        multi-line input
checkbox.tsx        single checkbox (used for consent)
checkbox-group.tsx  multi-select group
radio-group.tsx     single-select group, exports RadioGroup + RadioGroupItem
scale-input.tsx     1–n rating row, built on RadioGroup (min/max/minLabel/maxLabel)
rank-list.tsx       tap-to-order ranking list
progress.tsx        progress bar
```

`scale-input` and `rank-list` are generic controls parameterised by props, not assessment components —
they live in `ui/` for the same reason `input` does.

**`rank-list` interaction.** Drag-and-drop reordering is poor on touch, so ranking is tap-to-order:
tapping an item assigns it the next rank and shows a numbered badge; tapping a ranked item clears it
and renumbers the rest. Keyboard-operable as a list of buttons, no drag library.

**`components/assessment/` — composition only:**

```
assessment-provider.tsx  context + ?assessment=1 handling
assessment-cta.tsx       client trigger leaf, usable from server components
assessment-dialog.tsx    composes ui/dialog: sheet below sm, centered panel at sm and up
assessment-flow.tsx      step machine, answers state, persistence
question-screen.tsx      maps a Screen's questions onto ui atoms by type
welcome-screen.tsx
teaser-screen.tsx
lead-capture-form.tsx    RHF + Zod over ui/field + ui/input + ui/checkbox
confirmation-screen.tsx
```

```
lib/assessment/types.ts
lib/assessment/questions.ts   all entries as data, with showIf predicates
lib/assessment/flow.ts        visibleScreens(answers), grouping, progress
lib/assessment/storage.ts     versioned localStorage read/write/clear
```

`question-screen.tsx` is the single mapping point from question `type` to atom:
`text` → `Textarea`/`Input`, `choice` → `RadioGroup`, `multi` → `CheckboxGroup`, `scale` →
`ScaleInput`, `ranking` → `RankList`; each wrapped in `Field` for its prompt, helper text, and error.

**Conventions.** Files in `components/ui/` follow the shadcn/base-nova output shape (`function`
declarations, `cn()`, `data-slot` attributes) to stay consistent with `button.tsx` and any future
shadcn-CLI output. Files in `components/assessment/` follow
`.claude/rules/component-conventions.md`: named `const` arrow export, props destructured inline,
`Props` declared after the component.

### Data model

```ts
type AnswerValue = string | string[] | number
type Answers = Record<string, AnswerValue>

type AreaId =
  | "identification" | "strengths" | "interests"
  | "learning" | "challenges" | "careers" | "family"

type Option = { id: string; label: string }

type BaseQuestion = {
  id: string
  area: AreaId
  prompt: string
  helper?: string
  optional?: boolean
  /** Render on the same screen as the referenced question instead of its own. */
  groupWith?: string
  showIf?: (answers: Answers) => boolean
}

type Question =
  | BaseQuestion & { type: "text"; placeholder?: string }
  | BaseQuestion & { type: "choice"; options: Option[] }
  | BaseQuestion & { type: "multi"; options: Option[] }
  | BaseQuestion & { type: "scale"; min: 1; max: 5; minLabel: string; maxLabel: string }
  | BaseQuestion & { type: "ranking"; items: Option[] }

type AssessmentSubmission = {
  answers: Answers
  lead: { name: string; email: string; phone: string; consent: true }
  completedAt: string
}
```

Option ids are the values stored in `Answers` (`"cost_of_college"`, `"sure"`, `"different"`), never the
display labels — branch predicates and any future matching engine depend on them being stable.

### Branching and screens

Branching lives entirely in `questions.ts` as `showIf` predicates, colocated directly after the
question that triggers them. `lib/assessment/flow.ts` is the only module that knows about ordering and
grouping:

```ts
type Screen = Question[] // one or more questions rendered together

export const visibleScreens = (answers: Answers): Screen[] => {
  const visible = QUESTIONS.filter((q) => !q.showIf || q.showIf(answers))
  return visible.reduce<Screen[]>((screens, q) => {
    const last = screens.at(-1)
    if (q.groupWith && last?.some((prev) => prev.id === q.groupWith)) last.push(q)
    else screens.push([q])
    return screens
  }, [])
}
```

Everything downstream — navigation, progress, "Question n of m" — counts **screens**, so a grouped
screen like Q1 (name + class) reads as one question to the student. Adding, removing, or retuning a
branch is a data edit. No component changes.

**Stale answers.** If a student answers a branch and then goes Back and changes the trigger, the branch
disappears from `visibleScreens` but its answer remains in state. Orphaned answers are pruned on submit
by filtering `answers` against the ids still visible.

### Progress

Denominator is `visibleScreens(answers).length`, recomputed after each answer. A newly triggered
branch grows the denominator and can move the raw percentage backwards, which reads as a bug. The
displayed value is therefore clamped: `displayed = Math.max(previousDisplayed, computed)`.

### Persistence

Key `coacheepro.assessment.v1`, value `{ version, answers, stepId, savedAt }`, written after every
answer. All reads and writes are wrapped in try/catch — Safari private mode throws on write and the
flow must continue working in memory.

On open, a draft newer than 30 days puts the welcome screen into resume mode. Anything older is
discarded. A version mismatch discards the draft rather than attempting migration.

The draft is cleared on successful submit. Because state is always saved, closing the modal is
lossless: Escape and the close button dismiss immediately with no confirmation prompt.

### Validation

Required questions block *Next* with an inline message rendered by `Field.Error`; `optional` questions
show *Skip*. The lead capture form reuses the `contact-form.tsx` pattern — React Hook Form with a Zod v4
resolver, `noValidate` — with `name`, `email`, `phone`, and a `consent` boolean that must be `true`.
Per-field `aria-invalid` / `aria-describedby` wiring moves into `ui/field.tsx` so it is written once
rather than repeated per input.

### Submission

`onSubmit` logs the `AssessmentSubmission` and shows the confirmation screen, behind a
`TODO(ADR-003)` comment — exactly as `contact-form.tsx` does today.

No API route is added. The endpoint contract depends on where leads actually land, which depends on
ADR-003 being wired and ADR-005 being decided. Inventing a route now would mean designing that
contract blind and rewriting it later.

### CTA call sites

| File | Line | Element | Change |
| --- | --- | --- | --- |
| `components/marketing/header.tsx` | 59 | announcement ticker link | `Link href="/"` → `AssessmentCta` |
| `components/marketing/header.tsx` | 141 | desktop "Start Free Test" | drop `render={<Link/>}`, add `onClick` |
| `components/marketing/header.tsx` | 209 | mobile drawer CTA | same, and still closes the drawer |
| `components/marketing/hero.tsx` | 40 | "Start free assessment" | drop `render={<Link/>}`, add `onClick` |
| `components/marketing/final-cta.tsx` | 45 | "Start Free Assessment" | drop `render={<Link/>}`, add `onClick` |
| `components/marketing/footer.tsx` | 6 | "10-Min Assessment" in `PLATFORM_LINKS` | render via `AssessmentCta` |

`footer.tsx` is a server component. It imports `AssessmentCta` (a client leaf) for that one link rather
than becoming a client component itself. `hero.tsx`, `header.tsx`, and `final-cta.tsx` are already
client components.

Nav links to `/` that are genuinely "Home" (header desktop nav, header mobile drawer, logo) are left
alone.

## Mobile-first and accessibility

Governed by `.claude/rules/ui-conventions.md`.

- Base styles target ~375px. Below `sm:` the dialog is a full-height sheet using `dvh` units; at `sm:`
  and up it becomes a centered panel with `max-w-lg`.
- The sheet's Back/Next footer sits inside the scroll container, not `fixed`, so the on-screen keyboard
  cannot bury the primary action on short viewports.
- Option rows are full-width and at least 44px tall.
- Focus is trapped by base-ui's Dialog. On each step change, focus moves to the question heading
  (`tabIndex={-1}`) and the progress text is announced via `aria-live="polite"`.
- Step transitions are a short fade plus 8px slide, suppressed under `prefers-reduced-motion`.
- Every surface is styled for light and dark at the point it's written.

## Risks

**Lenis vs. scroll lock.** Lenis drives scrolling on the root element. base-ui's body scroll lock may
not stop it, leaving the page scrolling behind the open sheet. Mitigation: `useLenis()` from
`lenis/react` → `stop()` on open, `start()` on close. Verify on a real device, not just a desktop
browser at narrow width.

**Length and drop-off.** 18 core questions plus branches sits above the brief's 15–20 ceiling. This was
an explicit decision to cover all 7 areas with tech-specific content. If completion looks weak once
live, Q15 (`support_network`) and Q10 (`wish_better`) are the first cuts — both are single data-file
deletions.

**Teaser honesty.** The teaser must never imply a computed result. Any future copy edit that adds
specificity ("your top match is…") is a lie until the matching engine ships.

## Verification

No test runner exists in this repo, and adding one for a Phase 1 marketing site is out of scope.
Verification is `npm run lint`, `npm run build`, and this manual checklist:

- [ ] Modal opens from all six CTA call sites, on every marketing page
- [ ] `?assessment=1` opens it on load
- [ ] All 5 branches trigger and, when the trigger is changed via Back, disappear
- [ ] Orphaned branch answers are absent from the submitted payload
- [ ] Progress never moves backwards, and reaches 100% on the last question
- [ ] Required questions block *Next*; optional ones skip
- [ ] Refresh mid-flow, reopen, resume lands on the same question with answers intact
- [ ] *Start over* discards the draft
- [ ] Submit clears the draft; reopening starts fresh
- [ ] 375px: no horizontal overflow, Next reachable with the keyboard open, sheet fills the height
- [ ] Desktop: centered panel, backdrop click and Escape close it
- [ ] Light and dark both correct on every screen
- [ ] Keyboard-only: full traversal, visible focus, focus trapped in the dialog
- [ ] Page does not scroll behind the open modal (Lenis check, real device)
- [ ] `prefers-reduced-motion` suppresses step animation

## Follow-on work

1. **Migrate `contact-form.tsx` onto the new `ui/` atoms** — as its own change, after this ships. It
   currently hand-rolls inputs with a shared `inputClassName` and repeats `aria-invalid` /
   `aria-describedby` wiring per field, and its "I am a" role selector is a row of plain buttons rather
   than a keyboard-navigable radio group. Until then the two forms have separate styling sources and any
   field-level fix must be made twice; this is accepted deliberately to keep the assessment change
   reviewable on its own.
2. Update `reference/PRODUCT.md` to record "max 3 matches, 1 recommended" in the free preview
3. Wire real lead delivery once ADR-003 is implemented
4. Career matching engine (Phase 3)
5. Server-side response storage once ADR-005 is decided (Phase 2/3)
