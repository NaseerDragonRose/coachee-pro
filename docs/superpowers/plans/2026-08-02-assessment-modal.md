# Free Assessment Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clicking any "Free Assessment" CTA on the marketing site opens a modal containing an 18-question career questionnaire that ends in a lead capture form.

**Architecture:** An `AssessmentProvider` in the marketing layout renders one dialog and exposes `open()` via context; every CTA calls it. Question content and branching live as data in `lib/assessment/questions.ts` (`showIf` predicates); `lib/assessment/flow.ts` is the only module that knows about ordering, grouping, and completeness. All controls are generic atoms in `components/ui/` wrapping base-ui; `components/assessment/` holds composition only.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind v4, `@base-ui/react` (already a dependency — no new packages), React Hook Form + Zod v4, Lenis.

**Spec:** `docs/superpowers/specs/2026-08-02-assessment-modal-design.md` — read it before starting. It contains the full question wording, which this plan reproduces in Task 2.

## Global Constraints

- **Never commit without explicit instruction from the user.** `CLAUDE.md` overrides the usual "commit frequently" habit. Every task ends with a *staging* step; the `git commit` line is written out but must NOT be run until the user says so.
- **No new dependencies.** `@base-ui/react` already ships every primitive needed (`dialog`, `field`, `input`, `checkbox`, `checkbox-group`, `radio`, `radio-group`, `progress`).
- **Mobile-first.** Per `.claude/rules/ui-conventions.md`: base classes are the mobile styles, layer up with `sm:`/`md:`/`lg:`, never claw back with `max-*`. Verify at 375px first. Touch targets ≥ 44px. No horizontal overflow at any width. Every surface styled for light *and* dark at the point it is written.
- **Component shape.** Files in `components/ui/` use the shadcn/base-nova shape: `function` declarations, `cn()`, `data-slot` attributes (match `components/ui/button.tsx`). Files in `components/assessment/` and `lib/` use `.claude/rules/component-conventions.md`: named `const` arrow export, props destructured inline, `Props` type declared *after* the component.
- **Copy rules.** Everyday language at an 8th–10th grade reading level, direct address ("you"), no career jargon, no assumptions about family structure or wealth, no judging any interest. Every multi-select and scale screen carries the line "There's no right or wrong answer here."
- **Career count.** Any copy referring to results must say **at most 3 career matches, exactly 1 recommended**. The teaser must never imply a computed result — no matching engine exists yet.
- **Answer value types are fixed:** `text` → `string`, `choice` → `string` (option id), `multi` → `string[]` (option ids), `scale` → `number`, `ranking` → `string[]` (option ids, best first). Stored answers always use option **ids**, never labels.

## Verification approach

This repo has no test runner, and adding one is out of scope (see spec § Verification). Verification is:

- **Pure logic** (`lib/assessment/*`): Node 24 strips TypeScript natively, so tasks run assertion scripts with plain `node`. No dependency, real assertions.
- **Everything else:** `npm run lint`, `npm run build`, and the explicit manual browser checks written into each task.

Scratch scripts go in the scratchpad directory, never in the repo.

## File structure

| File | Responsibility |
| --- | --- |
| `lib/assessment/types.ts` | Question/answer type vocabulary. No logic. |
| `lib/assessment/questions.ts` | All 27 question entries as data, including `showIf` branch predicates. |
| `lib/assessment/flow.ts` | Ordering, grouping into screens, completeness, orphan pruning, progress. |
| `lib/assessment/storage.ts` | Versioned localStorage draft read/write/clear. |
| `components/ui/dialog.tsx` | base-ui Dialog wrapper. |
| `components/ui/progress.tsx` | base-ui Progress wrapper. |
| `components/ui/field.tsx` | Label + control + description + error wrapper. |
| `components/ui/input.tsx`, `textarea.tsx` | Text controls. |
| `components/ui/checkbox.tsx`, `checkbox-group.tsx` | Multi-select. |
| `components/ui/radio-group.tsx` | Single-select. |
| `components/ui/scale-input.tsx` | Generic 1–n rating row, built on RadioGroup. |
| `components/ui/rank-list.tsx` | Generic tap-to-order ranking list. |
| `components/assessment/assessment-provider.tsx` | Open/close context + `?assessment=1`. |
| `components/assessment/assessment-cta.tsx` | Client trigger leaf for server components. |
| `components/assessment/assessment-dialog.tsx` | Sheet below `sm`, panel above; hosts the flow. |
| `components/assessment/assessment-flow.tsx` | Step machine, answer state, persistence, progress. |
| `components/assessment/question-screen.tsx` | Maps a screen's questions onto ui atoms. |
| `components/assessment/welcome-screen.tsx` | Intro + resume/start-over. |
| `components/assessment/teaser-screen.tsx` | Non-computed teaser. |
| `components/assessment/lead-capture-form.tsx` | RHF + Zod contact capture. |
| `components/assessment/confirmation-screen.tsx` | Thanks + close. |

---

### Task 1: Type vocabulary and flow logic

**Files:**
- Create: `lib/assessment/types.ts`
- Create: `lib/assessment/flow.ts`
- Create: `lib/assessment/questions.ts` (stub with 4 entries; Task 2 fills it in)
- Test: scratch script, not committed

**Interfaces:**
- Consumes: nothing
- Produces: `AnswerValue`, `Answers`, `AreaId`, `Option`, `Question`, `Screen`, `Lead`, `AssessmentSubmission` from `types.ts`; `visibleQuestions(answers): Question[]`, `visibleScreens(answers): Screen[]`, `isAnswered(question, answers): boolean`, `isScreenComplete(screen, answers): boolean`, `pruneAnswers(answers): Answers`, `screenIndexOf(screens, questionId): number` from `flow.ts`; `QUESTIONS: Question[]` from `questions.ts`.

- [ ] **Step 1: Create the type vocabulary**

Create `lib/assessment/types.ts`:

```ts
export type AnswerValue = string | string[] | number

export type Answers = Record<string, AnswerValue>

export type AreaId =
  | "identification"
  | "strengths"
  | "interests"
  | "learning"
  | "challenges"
  | "careers"
  | "family"

export type Option = { id: string; label: string }

type BaseQuestion = {
  id: string
  area: AreaId
  prompt: string
  helper?: string
  /** Optional questions render a Skip control and never block Next. */
  optional?: boolean
  /** Render on the same screen as the referenced question instead of its own. */
  groupWith?: string
  /** Branch predicate. Absent means always shown. */
  showIf?: (answers: Answers) => boolean
}

export type Question =
  | (BaseQuestion & { type: "text"; placeholder?: string; multiline?: boolean })
  | (BaseQuestion & { type: "choice"; options: Option[] })
  | (BaseQuestion & { type: "multi"; options: Option[] })
  | (BaseQuestion & {
      type: "scale"
      min: number
      max: number
      minLabel: string
      maxLabel: string
    })
  | (BaseQuestion & { type: "ranking"; items: Option[] })

/** One or more questions rendered together on a single screen. */
export type Screen = Question[]

export type Lead = {
  name: string
  email: string
  phone: string
  consent: true
}

export type AssessmentSubmission = {
  answers: Answers
  lead: Lead
  completedAt: string
}
```

- [ ] **Step 2: Create a minimal questions stub**

Task 2 writes the real content. Task 1 only needs enough entries to exercise grouping and branching. Create `lib/assessment/questions.ts`:

```ts
import type { Answers, Question } from "./types"

export const QUESTIONS: Question[] = [
  {
    id: "name",
    area: "identification",
    type: "text",
    prompt: "First, what should we call you?",
    placeholder: "Your first name",
  },
  {
    id: "class",
    area: "identification",
    type: "choice",
    prompt: "And which class are you in?",
    groupWith: "name",
    options: [
      { id: "class_11", label: "Class 11" },
      { id: "class_12", label: "Class 12" },
    ],
  },
  {
    id: "coding_comfort",
    area: "strengths",
    type: "scale",
    prompt: "How comfortable are you with coding right now?",
    min: 1,
    max: 5,
    minLabel: "Never tried it",
    maxLabel: "I build my own projects",
  },
  {
    id: "coding_built",
    area: "strengths",
    type: "text",
    prompt: "Nice — what have you built or tried so far?",
    optional: true,
    multiline: true,
    showIf: (answers: Answers) => Number(answers.coding_comfort) >= 4,
  },
]
```

- [ ] **Step 3: Write the flow logic**

Create `lib/assessment/flow.ts`:

```ts
import { QUESTIONS } from "./questions"
import type { Answers, Question, Screen } from "./types"

export const visibleQuestions = (answers: Answers): Question[] =>
  QUESTIONS.filter((question) => !question.showIf || question.showIf(answers))

export const visibleScreens = (answers: Answers): Screen[] =>
  visibleQuestions(answers).reduce<Screen[]>((screens, question) => {
    const last = screens.at(-1)
    const belongsToLast =
      question.groupWith !== undefined &&
      last?.some((previous) => previous.id === question.groupWith)

    if (belongsToLast && last) last.push(question)
    else screens.push([question])

    return screens
  }, [])

export const isAnswered = (question: Question, answers: Answers): boolean => {
  if (question.optional) return true

  const value = answers[question.id]
  if (value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export const isScreenComplete = (screen: Screen, answers: Answers): boolean =>
  screen.every((question) => isAnswered(question, answers))

/** Drops answers to questions that are no longer reachable after a Back-edit. */
export const pruneAnswers = (answers: Answers): Answers => {
  const reachable = new Set(visibleQuestions(answers).map((question) => question.id))
  return Object.fromEntries(
    Object.entries(answers).filter(([id]) => reachable.has(id))
  )
}

export const screenIndexOf = (screens: Screen[], questionId: string): number =>
  screens.findIndex((screen) => screen.some((question) => question.id === questionId))
```

- [ ] **Step 4: Write the failing assertion script**

Write to the scratchpad (NOT the repo) as `flow.test.ts`. Import paths are relative because plain `node` does not resolve the `@/` alias:

```ts
import assert from "node:assert/strict"
import {
  visibleScreens,
  isScreenComplete,
  pruneAnswers,
  screenIndexOf,
} from "../../lib/assessment/flow.ts"

// Grouped questions collapse into one screen.
const base = visibleScreens({})
assert.equal(base.length, 2, "name+class group into one screen, plus coding_comfort")
assert.deepEqual(base[0].map((q) => q.id), ["name", "class"])
assert.deepEqual(base[1].map((q) => q.id), ["coding_comfort"])

// A branch appears once its trigger qualifies.
const branched = visibleScreens({ coding_comfort: 5 })
assert.equal(branched.length, 3, "coding_built becomes visible at >= 4")
assert.deepEqual(branched[2].map((q) => q.id), ["coding_built"])

// ...and disappears when the trigger is edited back down.
assert.equal(visibleScreens({ coding_comfort: 2 }).length, 2)

// Optional questions never block a screen.
assert.equal(isScreenComplete(branched[2], {}), true, "coding_built is optional")

// Required questions do block, and blank strings do not count as answered.
assert.equal(isScreenComplete(base[0], { name: "Asha" }), false, "class unanswered")
assert.equal(isScreenComplete(base[0], { name: "  ", class: "class_11" }), false)
assert.equal(isScreenComplete(base[0], { name: "Asha", class: "class_11" }), true)

// Orphaned branch answers are pruned.
const orphaned = { coding_comfort: 2, coding_built: "a chess bot" }
assert.deepEqual(pruneAnswers(orphaned), { coding_comfort: 2 })
assert.deepEqual(
  pruneAnswers({ coding_comfort: 5, coding_built: "a chess bot" }),
  { coding_comfort: 5, coding_built: "a chess bot" }
)

assert.equal(screenIndexOf(base, "class"), 0)
assert.equal(screenIndexOf(base, "nope"), -1)

console.log("flow: all assertions passed")
```

- [ ] **Step 5: Run it and watch it fail**

Run: `node "$SCRATCHPAD/flow.test.ts"` (substitute the real scratchpad path).
Expected on first run, before `flow.ts` exists: `ERR_MODULE_NOT_FOUND`. If `flow.ts` was already written in Step 3, deliberately verify the test is real by temporarily returning `[]` from `visibleScreens` and confirming the first assertion fails — then restore it.

- [ ] **Step 6: Run it and watch it pass**

Run: `node "$SCRATCHPAD/flow.test.ts"`
Expected: `flow: all assertions passed`

- [ ] **Step 7: Typecheck**

Run: `npm run build`
Expected: build succeeds. Nothing imports these modules yet, but `tsc` still typechecks them.

- [ ] **Step 8: Stage (do NOT commit without explicit approval)**

```bash
git add lib/assessment/types.ts lib/assessment/flow.ts lib/assessment/questions.ts
# Only when the user explicitly approves:
# git commit -m "feat(assessment): add question types and flow logic"
```

---

### Task 2: The full question set

**Files:**
- Modify: `lib/assessment/questions.ts` (replace the Task 1 stub entirely)
- Test: scratch script, not committed

**Interfaces:**
- Consumes: `Answers`, `Question`, `Option` from `lib/assessment/types.ts`
- Produces: `QUESTIONS: Question[]` — 27 entries; 20 core (grouping into 18 screens) plus 7 branch entries of which at most 5 can show at once.

**Note on counts:** `name`+`class` share a screen, and `work_setting`+`company_type` share a screen — hence 20 core entries but 18 core screens. The two `coding_comfort` branches are mutually exclusive, as are the two `career_idea` branches, so the ceiling is 23 screens.

- [ ] **Step 1: Write the full question data**

Replace `lib/assessment/questions.ts`:

```ts
import type { Answers, Question } from "./types"

const includes = (answers: Answers, id: string, optionId: string): boolean =>
  Array.isArray(answers[id]) && (answers[id] as string[]).includes(optionId)

export const QUESTIONS: Question[] = [
  // ---------- Area 1: Identification ----------
  {
    id: "name",
    area: "identification",
    type: "text",
    prompt: "First, what should we call you?",
    placeholder: "Your first name",
  },
  {
    id: "class",
    area: "identification",
    type: "choice",
    prompt: "And which class are you in?",
    groupWith: "name",
    options: [
      { id: "class_11", label: "Class 11" },
      { id: "class_12", label: "Class 12" },
      { id: "finished_12", label: "Just finished Class 12" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "stream",
    area: "identification",
    type: "choice",
    prompt: "Which stream are you in?",
    options: [
      { id: "pcm", label: "PCM" },
      { id: "pcb", label: "PCB" },
      { id: "pcmb", label: "PCMB" },
      { id: "commerce_maths", label: "Commerce with Maths" },
      { id: "commerce_no_maths", label: "Commerce without Maths" },
      { id: "arts", label: "Arts / Humanities" },
      { id: "other", label: "Other" },
    ],
  },

  // ---------- Area 2: Academic & skill strengths ----------
  {
    id: "subjects",
    area: "strengths",
    type: "multi",
    prompt: "Which subjects do you enjoy and do well in?",
    helper: "Pick as many as you like. There's no right or wrong answer here.",
    options: [
      { id: "maths", label: "Maths" },
      { id: "physics", label: "Physics" },
      { id: "chemistry", label: "Chemistry" },
      { id: "biology", label: "Biology" },
      { id: "computer_science", label: "Computer Science / IT" },
      { id: "english", label: "English" },
      { id: "economics", label: "Economics" },
      { id: "art_design", label: "Art & Design" },
      { id: "other", label: "Something else" },
    ],
  },
  {
    id: "help_with",
    area: "strengths",
    type: "multi",
    prompt: "What do people usually ask you for help with?",
    helper: "There's no right or wrong answer here.",
    options: [
      { id: "fixing_gadgets", label: "Fixing gadgets or computers" },
      { id: "explaining", label: "Explaining tough topics" },
      { id: "organising", label: "Organising things" },
      { id: "making_look_good", label: "Making things look good" },
      { id: "puzzles", label: "Solving puzzles and problems" },
      { id: "leading", label: "Convincing or leading people" },
      { id: "none", label: "Honestly, none of these" },
    ],
  },
  {
    id: "coding_comfort",
    area: "strengths",
    type: "scale",
    prompt: "How comfortable are you with coding right now?",
    helper: "There's no right or wrong answer here.",
    min: 1,
    max: 5,
    minLabel: "Never tried it",
    maxLabel: "I build my own projects",
  },
  {
    id: "coding_built",
    area: "strengths",
    type: "text",
    prompt: "Nice — what have you built or tried so far?",
    helper: "A sentence is plenty.",
    optional: true,
    multiline: true,
    showIf: (answers) => Number(answers.coding_comfort) >= 4,
  },
  {
    id: "coding_willing",
    area: "strengths",
    type: "choice",
    prompt: "Would you be up for learning to code if a career needed it?",
    showIf: (answers) =>
      answers.coding_comfort !== undefined && Number(answers.coding_comfort) <= 2,
    options: [
      { id: "yes", label: "Yes, definitely" },
      { id: "maybe", label: "Maybe, if it's taught well" },
      { id: "no", label: "I'd rather not" },
    ],
  },
  {
    id: "logic_confidence",
    area: "strengths",
    type: "scale",
    prompt: "How confident are you with step-by-step logic problems?",
    helper: "There's no right or wrong answer here.",
    min: 1,
    max: 5,
    minLabel: "I find them hard",
    maxLabel: "I really enjoy them",
  },
  {
    id: "english_comfort",
    area: "strengths",
    type: "scale",
    prompt: "How comfortable are you explaining your ideas in English, spoken or written?",
    helper: "There's no right or wrong answer here.",
    min: 1,
    max: 5,
    minLabel: "Not comfortable yet",
    maxLabel: "Very comfortable",
  },

  // ---------- Area 3: Interests & passions ----------
  {
    id: "tech_interests",
    area: "interests",
    type: "multi",
    prompt: "Which of these actually sound interesting to you?",
    helper: "Pick as many as you like. There's no right or wrong answer here.",
    options: [
      { id: "apps_websites", label: "Building apps and websites" },
      { id: "ai_ml", label: "AI and machine learning" },
      { id: "cybersecurity", label: "Cybersecurity and hacking" },
      { id: "robotics", label: "Robotics and electronics" },
      { id: "games", label: "Games" },
      { id: "data", label: "Data and statistics" },
      { id: "design", label: "Design and how things look and feel" },
      { id: "cloud", label: "Cloud and large systems" },
      { id: "product", label: "Leading a product or team" },
    ],
  },
  {
    id: "free_weekend",
    area: "interests",
    type: "text",
    prompt: "A whole free weekend, no school work. What do you actually spend it on?",
    helper: "Be specific — it often says more than you'd think.",
    optional: true,
    multiline: true,
  },
  {
    id: "wish_better",
    area: "interests",
    type: "text",
    prompt: "What's one thing in the world you wish worked better?",
    optional: true,
    multiline: true,
  },

  // ---------- Area 4: Learning style & work environment ----------
  {
    id: "learning_style",
    area: "learning",
    type: "choice",
    prompt: "How do you learn best?",
    options: [
      { id: "building", label: "Building or trying things myself" },
      { id: "watching", label: "Watching and listening" },
      { id: "reading", label: "Reading and taking notes" },
      { id: "mix", label: "A mix of all of them" },
    ],
  },
  {
    id: "job_values",
    area: "learning",
    type: "ranking",
    prompt: "Put these in order — what matters most to you in a job?",
    helper: "Tap them in your order of preference. Tap again to undo.",
    items: [
      { id: "salary", label: "Good salary" },
      { id: "stability", label: "Job security and stability" },
      { id: "creativity", label: "Freedom to be creative" },
      { id: "helping", label: "Helping people" },
      { id: "cutting_edge", label: "Working with cutting-edge tech" },
    ],
  },
  {
    id: "work_setting",
    area: "learning",
    type: "choice",
    prompt: "Where would you rather spend your working day?",
    options: [
      { id: "alone", label: "Deep in code or systems on my own" },
      { id: "small_team", label: "In a small close team" },
      { id: "many_people", label: "Around lots of different people" },
    ],
  },
  {
    id: "company_type",
    area: "learning",
    type: "choice",
    prompt: "And what kind of place?",
    groupWith: "work_setting",
    options: [
      { id: "startup", label: "A fast-moving startup" },
      { id: "established", label: "A big established company" },
      { id: "unsure", label: "Not sure yet" },
    ],
  },

  // ---------- Area 5: Challenges, barriers & support ----------
  {
    id: "struggles",
    area: "challenges",
    type: "multi",
    prompt: "What do you find hardest right now?",
    helper: "Everyone has something. There's no right or wrong answer here.",
    options: [
      { id: "maths", label: "Maths" },
      { id: "focus", label: "Staying focused" },
      { id: "exam_pressure", label: "Exam pressure" },
      { id: "english", label: "English" },
      { id: "unsure_strengths", label: "Not knowing what I'm good at" },
      { id: "deciding", label: "Deciding what to do next" },
      { id: "none", label: "Nothing much right now" },
    ],
  },
  {
    id: "struggle_help",
    area: "challenges",
    type: "multi",
    prompt: "Who could help you work through these?",
    showIf: (answers) =>
      Array.isArray(answers.struggles) && (answers.struggles as string[]).length >= 3,
    options: [
      { id: "parents", label: "Parents" },
      { id: "teacher", label: "A teacher" },
      { id: "friends", label: "Friends" },
      { id: "sibling", label: "An older sibling or cousin" },
      { id: "outside", label: "Someone outside my circle" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "support_network",
    area: "challenges",
    type: "multi",
    prompt: "Who helps you make big decisions?",
    options: [
      { id: "parents", label: "Parents" },
      { id: "teachers", label: "Teachers" },
      { id: "friends", label: "Friends" },
      { id: "sibling", label: "Older sibling or cousin" },
      { id: "myself", label: "I mostly figure it out myself" },
    ],
  },
  {
    id: "worries",
    area: "challenges",
    type: "multi",
    prompt: "What worries you most about your future?",
    helper: "There's no right or wrong answer here.",
    options: [
      { id: "cost_of_college", label: "Cost of college" },
      { id: "family_expectations", label: "Family expectations" },
      { id: "ai_jobs", label: "AI taking away jobs" },
      { id: "wrong_path", label: "Picking the wrong path" },
      { id: "marks_exams", label: "Marks and entrance exams" },
      { id: "none", label: "Nothing much" },
    ],
  },
  {
    id: "money_constraints",
    area: "challenges",
    type: "text",
    prompt: "Are there money constraints we should build into your roadmap?",
    helper: "Only if you're comfortable sharing.",
    optional: true,
    multiline: true,
    showIf: (answers) => includes(answers, "worries", "cost_of_college"),
  },

  // ---------- Area 6: Career awareness ----------
  {
    id: "career_idea",
    area: "careers",
    type: "choice",
    prompt: "Do you have a career in mind already?",
    helper: "Plans change all the time — this is just where you are today.",
    options: [
      { id: "sure", label: "Yes, I'm fairly sure" },
      { id: "few", label: "I have a few ideas" },
      { id: "none", label: "No idea yet" },
    ],
  },
  {
    id: "career_which",
    area: "careers",
    type: "text",
    prompt: "Which one, and what appeals to you about it?",
    multiline: true,
    showIf: (answers) => answers.career_idea === "sure" || answers.career_idea === "few",
  },
  {
    id: "confidence_needs",
    area: "careers",
    type: "multi",
    prompt: "What would help you feel more confident?",
    showIf: (answers) => answers.career_idea === "none",
    options: [
      { id: "day_to_day", label: "Seeing what the job is like day to day" },
      { id: "degree_paths", label: "Knowing which degree leads where" },
      { id: "talk_to_someone", label: "Talking to someone doing it" },
      { id: "salaries", label: "Knowing realistic salaries" },
      { id: "what_to_learn", label: "Knowing what to learn first" },
    ],
  },

  // ---------- Area 7: Family influence ----------
  {
    id: "family_expectation",
    area: "family",
    type: "choice",
    prompt: "Do your parents have a specific career in mind for you?",
    options: [
      { id: "matches", label: "Yes, and it matches what I want" },
      { id: "different", label: "Yes, but it's different from what I want" },
      { id: "open", label: "They're open to whatever I choose" },
      { id: "not_discussed", label: "We haven't really discussed it" },
    ],
  },
  {
    id: "family_balance",
    area: "family",
    type: "text",
    prompt: "How would you like to balance what they want with what you want?",
    optional: true,
    multiline: true,
    showIf: (answers) => answers.family_expectation === "different",
  },
]
```

- [ ] **Step 2: Write the assertion script**

Write to the scratchpad as `questions.test.ts`:

```ts
import assert from "node:assert/strict"
import { QUESTIONS } from "../../lib/assessment/questions.ts"
import { visibleScreens } from "../../lib/assessment/flow.ts"

assert.equal(QUESTIONS.length, 27, "27 entries total")

// Ids are unique — duplicates would silently overwrite answers.
const ids = QUESTIONS.map((q) => q.id)
assert.equal(new Set(ids).size, ids.length, "question ids are unique")

// Option ids are unique within each question.
for (const q of QUESTIONS) {
  const options = q.type === "ranking" ? q.items : "options" in q ? q.options : []
  const optionIds = options.map((o) => o.id)
  assert.equal(new Set(optionIds).size, optionIds.length, `duplicate option id in ${q.id}`)
}

// groupWith always points at a real, earlier question.
for (const [index, q] of QUESTIONS.entries()) {
  if (!q.groupWith) continue
  const target = QUESTIONS.findIndex((other) => other.id === q.groupWith)
  assert.ok(target >= 0, `${q.id} groupWith targets a missing question`)
  assert.ok(target < index, `${q.id} groupWith must point backwards`)
}

// Baseline: 18 core screens with nothing answered.
assert.equal(visibleScreens({}).length, 18, "18 core screens")

// Ceiling: every branch that can co-exist, all at once.
const maxed = {
  coding_comfort: 5,
  struggles: ["maths", "focus", "english"],
  worries: ["cost_of_college"],
  career_idea: "sure",
  family_expectation: "different",
}
assert.equal(visibleScreens(maxed).length, 23, "23 screens is the ceiling")

// Mutually exclusive branches never co-exist.
const lowCoding = visibleScreens({ coding_comfort: 1 }).flat().map((q) => q.id)
assert.ok(lowCoding.includes("coding_willing"))
assert.ok(!lowCoding.includes("coding_built"))

const noIdea = visibleScreens({ career_idea: "none" }).flat().map((q) => q.id)
assert.ok(noIdea.includes("confidence_needs"))
assert.ok(!noIdea.includes("career_which"))

// coding_willing must not appear before coding_comfort is answered at all.
assert.ok(!visibleScreens({}).flat().some((q) => q.id === "coding_willing"))

console.log("questions: all assertions passed")
```

- [ ] **Step 3: Run it**

Run: `node "$SCRATCHPAD/questions.test.ts"`
Expected: `questions: all assertions passed`. If the screen count is 19 or 24, a `groupWith` is missing or misspelled.

- [ ] **Step 4: Lint and typecheck**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 5: Stage (do NOT commit without explicit approval)**

```bash
git add lib/assessment/questions.ts
# Only when the user explicitly approves:
# git commit -m "feat(assessment): add full question set with branching"
```

---

### Task 3: Draft persistence

**Files:**
- Create: `lib/assessment/storage.ts`
- Test: scratch script, not committed

**Interfaces:**
- Consumes: `Answers` from `lib/assessment/types.ts`
- Produces: `Draft` type, `loadDraft(): Draft | null`, `saveDraft(answers, screenId): void`, `clearDraft(): void`

- [ ] **Step 1: Write the storage module**

Uses `globalThis.localStorage` rather than `window.localStorage` so it is testable under Node and safe during SSR. Create `lib/assessment/storage.ts`:

```ts
import type { Answers } from "./types"

const KEY = "coacheepro.assessment.v1"
const VERSION = 1
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

export type Draft = {
  version: number
  answers: Answers
  screenId: string
  savedAt: string
}

const store = (): Storage | null => {
  try {
    return globalThis.localStorage ?? null
  } catch {
    // Blocked by browser settings.
    return null
  }
}

export const loadDraft = (): Draft | null => {
  try {
    const raw = store()?.getItem(KEY)
    if (!raw) return null

    const draft = JSON.parse(raw) as Draft
    if (draft?.version !== VERSION) return null
    if (!draft.answers || typeof draft.answers !== "object") return null
    if (typeof draft.screenId !== "string") return null

    const savedAt = new Date(draft.savedAt).getTime()
    if (Number.isNaN(savedAt) || Date.now() - savedAt > MAX_AGE_MS) return null

    return draft
  } catch {
    // Corrupt JSON — treat as no draft.
    return null
  }
}

export const saveDraft = (answers: Answers, screenId: string): void => {
  try {
    const draft: Draft = {
      version: VERSION,
      answers,
      screenId,
      savedAt: new Date().toISOString(),
    }
    store()?.setItem(KEY, JSON.stringify(draft))
  } catch {
    // Private mode or quota exceeded — the flow continues in memory.
  }
}

export const clearDraft = (): void => {
  try {
    store()?.removeItem(KEY)
  } catch {
    // Nothing to do.
  }
}
```

- [ ] **Step 2: Write the assertion script**

Write to the scratchpad as `storage.test.ts`. It stubs `localStorage` before importing, so the module under test sees it:

```ts
import assert from "node:assert/strict"

const map = new Map<string, string>()
let throwOnWrite = false

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (throwOnWrite) throw new Error("QuotaExceededError")
      map.set(k, v)
    },
    removeItem: (k: string) => void map.delete(k),
  },
})

const { loadDraft, saveDraft, clearDraft } = await import(
  "../../lib/assessment/storage.ts"
)

// Round-trip.
assert.equal(loadDraft(), null, "no draft initially")
saveDraft({ name: "Asha", coding_comfort: 4 }, "coding_comfort")
const draft = loadDraft()
assert.deepEqual(draft?.answers, { name: "Asha", coding_comfort: 4 })
assert.equal(draft?.screenId, "coding_comfort")

// Clear.
clearDraft()
assert.equal(loadDraft(), null, "cleared")

// Corrupt JSON is survivable.
map.set("coacheepro.assessment.v1", "{not json")
assert.equal(loadDraft(), null, "corrupt draft ignored")

// Version mismatch is discarded, not migrated.
map.set(
  "coacheepro.assessment.v1",
  JSON.stringify({ version: 99, answers: {}, screenId: "name", savedAt: new Date().toISOString() })
)
assert.equal(loadDraft(), null, "version mismatch discarded")

// Drafts older than 30 days are discarded.
const old = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString()
map.set(
  "coacheepro.assessment.v1",
  JSON.stringify({ version: 1, answers: { name: "Asha" }, screenId: "name", savedAt: old })
)
assert.equal(loadDraft(), null, "stale draft discarded")

// A write that throws must not throw out of saveDraft.
map.clear()
throwOnWrite = true
assert.doesNotThrow(() => saveDraft({ name: "Asha" }, "name"), "private mode is survivable")
throwOnWrite = false

console.log("storage: all assertions passed")
```

- [ ] **Step 3: Run it**

Run: `node "$SCRATCHPAD/storage.test.ts"`
Expected: `storage: all assertions passed`

- [ ] **Step 4: Lint and typecheck**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 5: Stage (do NOT commit without explicit approval)**

```bash
git add lib/assessment/storage.ts
# Only when the user explicitly approves:
# git commit -m "feat(assessment): add draft persistence"
```

---

### Task 4: Dialog and progress atoms

**Files:**
- Create: `components/ui/dialog.tsx`
- Create: `components/ui/progress.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`
- Produces: `Dialog`, `DialogPortal`, `DialogBackdrop`, `DialogPopup`, `DialogTitle`, `DialogDescription`, `DialogClose` from `components/ui/dialog`; `Progress` (props: `value: number`, `max?: number`, `className?: string`) from `components/ui/progress`.

`DialogPopup` is mobile-first: a full-height bottom-anchored sheet below `sm`, a centered constrained panel at `sm` and up.

- [ ] **Step 1: Create the dialog atom**

Create `components/ui/dialog.tsx`:

```tsx
"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function DialogPopup({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={cn(
        // Mobile: full-height sheet anchored to the bottom.
        "fixed inset-x-0 bottom-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden",
        "border-t border-slate-200 bg-white text-slate-900 shadow-2xl",
        "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100",
        // Desktop: centered, constrained panel.
        "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[85dvh] sm:w-[min(32rem,calc(100vw-2rem))]",
        "sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border",
        // Motion, suppressed under reduced-motion.
        "transition-all duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "data-[starting-style]:translate-y-4 data-[ending-style]:translate-y-4",
        "sm:data-[starting-style]:translate-y-[calc(-50%+0.5rem)] sm:data-[ending-style]:translate-y-[calc(-50%+0.5rem)]",
        "motion-reduce:transition-none motion-reduce:data-[starting-style]:translate-y-0",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-bold sm:text-xl", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

export {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
```

- [ ] **Step 2: Create the progress atom**

Create `components/ui/progress.tsx`:

```tsx
"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({
  value,
  max = 100,
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn("w-full", className)}
      {...props}
    >
      <ProgressPrimitive.Track className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <ProgressPrimitive.Indicator className="h-full rounded-full bg-indigo-600 transition-[width] duration-300 ease-out motion-reduce:transition-none dark:bg-indigo-500" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
```

- [ ] **Step 3: Lint and typecheck**

Run: `npm run lint && npm run build`
Expected: both succeed. If `data-[starting-style]` variants error, confirm Tailwind v4 is picking up the arbitrary variant — they are plain attribute selectors and need no config.

- [ ] **Step 4: Stage (do NOT commit without explicit approval)**

```bash
git add components/ui/dialog.tsx components/ui/progress.tsx
# Only when the user explicitly approves:
# git commit -m "feat(ui): add dialog and progress atoms"
```

---

### Task 5: Open the modal from every CTA

This is the first user-visible milestone: every CTA opens an empty modal.

**Files:**
- Create: `components/assessment/assessment-provider.tsx`
- Create: `components/assessment/assessment-cta.tsx`
- Create: `components/assessment/assessment-dialog.tsx`
- Modify: `app/(marketing)/layout.tsx`
- Modify: `components/marketing/header.tsx` (lines 59, 141, 209)
- Modify: `components/marketing/hero.tsx` (line 40)
- Modify: `components/marketing/final-cta.tsx` (line 45)
- Modify: `components/marketing/footer.tsx` (PLATFORM_LINKS, line 6)

**Interfaces:**
- Consumes: `Dialog`, `DialogPortal`, `DialogBackdrop`, `DialogPopup`, `DialogTitle` from `@/components/ui/dialog`
- Produces: `AssessmentProvider` (wraps children), `useAssessment(): { isOpen, open, close }`, `AssessmentCta` (props: `className?`, `children`, `onActivate?`)

- [ ] **Step 1: Create the provider**

`useSearchParams()` requires a Suspense boundary in the App Router, so the param check reads `window.location.search` in an effect instead — simpler and enough for a campaign deep link. Create `components/assessment/assessment-provider.tsx`:

```tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import { AssessmentDialog } from "./assessment-dialog"

const AssessmentContext = createContext<AssessmentContextValue | null>(null)

export const AssessmentProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  // Campaign links can deep-link straight into the assessment.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("assessment") === "1") {
      setIsOpen(true)
    }
  }, [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])

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
}

type Props = {
  children: ReactNode
}
```

- [ ] **Step 2: Create the CTA leaf**

This exists so server components (`footer.tsx`) can trigger the modal without becoming client components. Create `components/assessment/assessment-cta.tsx`:

```tsx
"use client"

import type { ReactNode } from "react"

import { useAssessment } from "./assessment-provider"

export const AssessmentCta = ({ className, children, onActivate }: Props) => {
  const { open } = useAssessment()

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onActivate?.()
        open()
      }}
    >
      {children}
    </button>
  )
}

type Props = {
  className?: string
  children: ReactNode
  /** Runs before opening — used by the header to close the mobile drawer. */
  onActivate?: () => void
}
```

- [ ] **Step 3: Create the dialog shell**

Placeholder body for now; Task 9 swaps it for the flow. Create `components/assessment/assessment-dialog.tsx`:

```tsx
"use client"

import { X } from "lucide-react"
import { useLenis } from "lenis/react"
import { useEffect } from "react"

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"

import { useAssessment } from "./assessment-provider"

export const AssessmentDialog = () => {
  const { isOpen, close } = useAssessment()
  const lenis = useLenis()

  // Lenis drives scrolling on the root element and ignores the dialog's own
  // body lock, so the page keeps scrolling behind the sheet unless we stop it.
  useEffect(() => {
    if (!lenis) return
    if (isOpen) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [isOpen, lenis])

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => !nextOpen && close()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <DialogTitle>Free career assessment</DialogTitle>
            <DialogClose
              aria-label="Close assessment"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </DialogClose>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>
            <p className="text-sm text-muted-foreground">
              The questionnaire goes here.
            </p>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
```

- [ ] **Step 4: Wrap the marketing layout**

In `app/(marketing)/layout.tsx`, import the provider and wrap the existing tree. Replace the outer `<div>` wrapper's contents so the provider is the outermost element inside the return:

```tsx
import type { ReactNode } from "react"

import { AssessmentProvider } from "@/components/assessment/assessment-provider"
import { Header } from "@/components/marketing/header"
import { Footer } from "@/components/marketing/footer"
import { GradientBlob } from "@/components/marketing/gradient-blob"

export default function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AssessmentProvider>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
        {/* Background Ambient Lighting */}
        <GradientBlob className="pointer-events-none fixed inset-0 -z-10 opacity-70 dark:opacity-50" />

        {/* Navigation Header */}
        <Header />

        {/* Page Content Container */}
        <div className="flex flex-1 flex-col">
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </AssessmentProvider>
  )
}
```

- [ ] **Step 5: Rewire the three header CTAs**

In `components/marketing/header.tsx`, add `import { useAssessment } from "@/components/assessment/assessment-provider"` and pull `const { open } = useAssessment()` into the component body alongside the existing state hooks.

Line ~58 — the announcement ticker link. Replace the `<Link href="/">…</Link>` with a button, keeping the classes and inner content identical:

```tsx
<button
  type="button"
  onClick={open}
  className="inline-flex items-center font-bold text-white hover:underline underline-offset-2"
>
  <span>Take Test</span>
  <ChevronRight className="h-3 w-3 ml-0.5" />
</button>
```

Line ~141 — the desktop CTA. Remove `nativeButton={false}` and `render={<Link href="/" />}`, add `onClick`:

```tsx
<Button
  size="sm"
  onClick={open}
  className="relative h-9 overflow-hidden rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:scale-[1.02]"
>
  <span className="relative z-10 flex items-center gap-1.5">
    Start Free Test
    <ArrowRight className="h-3.5 w-3.5" />
  </span>
</Button>
```

Line ~209 — the mobile drawer CTA. Same change, and it must still close the drawer:

```tsx
<Button
  size="sm"
  onClick={() => {
    setMobileMenuOpen(false)
    open()
  }}
  className="w-full h-11 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
>
  Start Free Assessment (10 Mins)
</Button>
```

Leave the "Home" links, the logo link, and `NAV_ITEMS` untouched — those are real navigation.

- [ ] **Step 6: Rewire hero and final CTA**

In `components/marketing/hero.tsx`, add the `useAssessment` import and hook, then at line ~40 remove `render={<Link href="/" />}` and add `onClick={open}`. Keep every existing class and child unchanged. Leave the second button (line ~51, `/technology-careers`) as a `Link` — it is real navigation.

Apply the identical change in `components/marketing/final-cta.tsx` at line ~45. If either file lacks `"use client"`, add it.

If `Link` becomes unused in a file, remove the import — `npm run lint` will flag it otherwise.

- [ ] **Step 7: Rewire the footer link**

`components/marketing/footer.tsx` is a server component. Remove the assessment entry from `PLATFORM_LINKS`:

```tsx
const PLATFORM_LINKS = [
  { href: "/technology-careers", label: "Tech Careers" },
  { href: "/faq", label: "FAQ & Guidance" },
]
```

Then, at the `PLATFORM_LINKS` render site (around line 55), add the assessment trigger as a sibling `<li>` immediately after the `.map(...)`, reusing the exact className the sibling links carry:

```tsx
{PLATFORM_LINKS.map((link) => (
  <li key={link.href}>
    <Link
      href={link.href}
      className="text-xs text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
    >
      {link.label}
    </Link>
  </li>
))}
<li>
  <AssessmentCta className="text-xs text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
    10-Min Assessment
  </AssessmentCta>
</li>
```

Import it at the top: `import { AssessmentCta } from "@/components/assessment/assessment-cta"`. The footer stays a server component.

- [ ] **Step 8: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed, no unused-import warnings.

- [ ] **Step 9: Manual verification**

Run `npm run dev`, then check:

- [ ] Header desktop "Start Free Test" opens the modal — on Home, About, Tech Careers, FAQ, Contact, Privacy, Terms
- [ ] Announcement ticker link opens it
- [ ] Mobile drawer CTA opens it *and* closes the drawer
- [ ] Hero and final-CTA buttons open it
- [ ] Footer "10-Min Assessment" opens it
- [ ] `http://localhost:3000/?assessment=1` opens it on load
- [ ] Escape and the X close it; backdrop click closes it
- [ ] **The page does not scroll behind the open modal** — scroll the page, open the modal, then scroll/trackpad again. This is the Lenis check; if it still scrolls, verify `useLenis()` returns an instance (the `ReactLenis root` provider lives in `app/layout.tsx`).
- [ ] At 375px the modal is a full-height sheet; at ≥640px it is a centered panel
- [ ] Light and dark both render correctly

- [ ] **Step 10: Stage (do NOT commit without explicit approval)**

```bash
git add components/assessment app/\(marketing\)/layout.tsx components/marketing/header.tsx components/marketing/hero.tsx components/marketing/final-cta.tsx components/marketing/footer.tsx
# Only when the user explicitly approves:
# git commit -m "feat(assessment): open assessment modal from every CTA"
```

---

### Task 6: Form control atoms

**Files:**
- Create: `components/ui/field.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/textarea.tsx`
- Create: `components/ui/checkbox.tsx`
- Create: `components/ui/checkbox-group.tsx`
- Create: `components/ui/radio-group.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`
- Produces:
  - `Field`, `FieldLabel`, `FieldDescription`, `FieldError` from `components/ui/field`
  - `Input` (native input props) from `components/ui/input`
  - `Textarea` (native textarea props) from `components/ui/textarea`
  - `Checkbox` (props: `checked?`, `onCheckedChange?`, `name?`, plus base-ui Checkbox.Root props) from `components/ui/checkbox`
  - `CheckboxGroup`, `CheckboxOption` (props: `value: string`, `label: string`) from `components/ui/checkbox-group`
  - `RadioGroup`, `RadioOption` (props: `value: string`, `label: string`) from `components/ui/radio-group`

`CheckboxOption` and `RadioOption` render full-width, ≥44px-tall selectable rows — the shape every question screen needs.

- [ ] **Step 1: Create the field atom**

Create `components/ui/field.tsx`:

```tsx
"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"

import { cn } from "@/lib/utils"

function Field({ className, ...props }: React.ComponentProps<typeof FieldPrimitive.Root>) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Label>) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Description>) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Error>) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      role="alert"
      className={cn("text-xs font-medium text-red-500", className)}
      {...props}
    />
  )
}

export { Field, FieldLabel, FieldDescription, FieldError }
```

- [ ] **Step 2: Create the text controls**

The class string is the one currently inlined in `contact-form.tsx`, lifted here so there is one source of truth going forward.

Create `components/ui/input.tsx`:

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const controlClassName =
  "w-full rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 aria-invalid:border-red-500 aria-invalid:ring-red-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-indigo-400"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input data-slot="input" className={cn(controlClassName, className)} {...props} />
  )
}

export { Input, controlClassName }
```

Create `components/ui/textarea.tsx`:

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { controlClassName } from "./input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(controlClassName, "min-h-24 resize-y", className)}
      {...props}
    />
  )
}

export { Textarea }
```

`text-base` (16px) rather than `text-sm` is deliberate: iOS Safari zooms the viewport when a focused input has a font size below 16px.

- [ ] **Step 3: Create the checkbox atoms**

Create `components/ui/checkbox.tsx`:

```tsx
"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white transition-colors",
        "data-[checked]:border-indigo-600 data-[checked]:bg-indigo-600",
        "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none",
        "dark:border-slate-700 dark:bg-slate-900 dark:data-[checked]:border-indigo-500 dark:data-[checked]:bg-indigo-500",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex text-white">
        <Check className="h-3.5 w-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
```

Create `components/ui/checkbox-group.tsx`:

```tsx
"use client"

import * as React from "react"
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group"

import { cn } from "@/lib/utils"
import { Checkbox } from "./checkbox"

function CheckboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxGroupPrimitive>) {
  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function CheckboxOption({ value, label }: CheckboxOptionProps) {
  return (
    <label
      data-slot="checkbox-option"
      className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 has-data-[checked]:border-indigo-600 has-data-[checked]:bg-indigo-50 has-data-[checked]:text-indigo-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:has-data-[checked]:border-indigo-500 dark:has-data-[checked]:bg-indigo-950/60 dark:has-data-[checked]:text-indigo-300"
    >
      <Checkbox name={value} />
      <span>{label}</span>
    </label>
  )
}

type CheckboxOptionProps = {
  value: string
  label: string
}

export { CheckboxGroup, CheckboxOption }
```

base-ui's `CheckboxGroup` tracks membership by each checkbox's `name`, which is why `CheckboxOption` passes the option id as `name`.

- [ ] **Step 4: Create the radio group atom**

Create `components/ui/radio-group.tsx`:

```tsx
"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function RadioOption({ value, label }: RadioOptionProps) {
  return (
    <label
      data-slot="radio-option"
      className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 has-data-[checked]:border-indigo-600 has-data-[checked]:bg-indigo-50 has-data-[checked]:text-indigo-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:has-data-[checked]:border-indigo-500 dark:has-data-[checked]:bg-indigo-950/60 dark:has-data-[checked]:text-indigo-300"
    >
      <RadioPrimitive.Root
        value={value}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors data-[checked]:border-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-900 dark:data-[checked]:border-indigo-500"
      >
        <RadioPrimitive.Indicator className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
      </RadioPrimitive.Root>
      <span>{label}</span>
    </label>
  )
}

type RadioOptionProps = {
  value: string
  label: string
}

export { RadioGroup, RadioOption }
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 6: Stage (do NOT commit without explicit approval)**

```bash
git add components/ui/field.tsx components/ui/input.tsx components/ui/textarea.tsx components/ui/checkbox.tsx components/ui/checkbox-group.tsx components/ui/radio-group.tsx
# Only when the user explicitly approves:
# git commit -m "feat(ui): add form control atoms"
```

---

### Task 7: Scale and ranking atoms

**Files:**
- Create: `components/ui/scale-input.tsx`
- Create: `components/ui/rank-list.tsx`

**Interfaces:**
- Consumes: `RadioGroup` from `@/components/ui/radio-group`, `cn` from `@/lib/utils`
- Produces:
  - `ScaleInput` — props `{ value?: number; onValueChange: (value: number) => void; min: number; max: number; minLabel: string; maxLabel: string; name?: string }`
  - `RankList` — props `{ value: string[]; onValueChange: (value: string[]) => void; items: { id: string; label: string }[] }`

- [ ] **Step 1: Create the scale atom**

A radio group rendered as a row of numbered buttons, so it stays keyboard-navigable with arrow keys. Create `components/ui/scale-input.tsx`:

```tsx
"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function ScaleInput({
  value,
  onValueChange,
  min,
  max,
  minLabel,
  maxLabel,
  name,
}: ScaleInputProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, index) => min + index)

  return (
    <div data-slot="scale-input" className="flex w-full flex-col gap-3">
      <RadioGroupPrimitive
        name={name}
        value={value ?? null}
        onValueChange={(next) => onValueChange(Number(next))}
        className="flex w-full gap-2"
      >
        {steps.map((step) => (
          <RadioPrimitive.Root
            key={step}
            value={step}
            aria-label={`${step} out of ${max}`}
            className={cn(
              "flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 text-base font-semibold text-slate-600 transition-colors",
              "hover:border-slate-300",
              "data-[checked]:border-indigo-600 data-[checked]:bg-indigo-600 data-[checked]:text-white",
              "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none",
              "dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 dark:data-[checked]:border-indigo-500 dark:data-[checked]:bg-indigo-500"
            )}
          >
            {step}
          </RadioPrimitive.Root>
        ))}
      </RadioGroupPrimitive>

      <div className="flex justify-between gap-4 text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span className="text-right">{maxLabel}</span>
      </div>
    </div>
  )
}

type ScaleInputProps = {
  value?: number
  onValueChange: (value: number) => void
  min: number
  max: number
  minLabel: string
  maxLabel: string
  name?: string
}

export { ScaleInput }
```

- [ ] **Step 2: Create the ranking atom**

Tap-to-order rather than drag-and-drop: drag is unreliable on touch and needs a library. Each item is a button; tapping assigns the next rank, tapping a ranked item removes it and renumbers the rest automatically (rank is derived from array position, so nothing to recompute).

Create `components/ui/rank-list.tsx`:

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function RankList({ value, onValueChange, items }: RankListProps) {
  const toggle = (id: string) => {
    onValueChange(
      value.includes(id) ? value.filter((ranked) => ranked !== id) : [...value, id]
    )
  }

  return (
    <div data-slot="rank-list" className="flex flex-col gap-2">
      {items.map((item) => {
        const rank = value.indexOf(item.id)
        const isRanked = rank >= 0

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            aria-pressed={isRanked}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
              "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none",
              isRanked
                ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "border-slate-200/80 bg-slate-50/50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                isRanked
                  ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                  : "border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500"
              )}
            >
              {isRanked ? rank + 1 : ""}
            </span>
            <span>{item.label}</span>
            <span className="sr-only">
              {isRanked ? `Ranked ${rank + 1}. Tap to remove.` : "Not ranked. Tap to rank."}
            </span>
          </button>
        )
      })}
    </div>
  )
}

type RankListProps = {
  value: string[]
  onValueChange: (value: string[]) => void
  items: { id: string; label: string }[]
}

export { RankList }
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 4: Stage (do NOT commit without explicit approval)**

```bash
git add components/ui/scale-input.tsx components/ui/rank-list.tsx
# Only when the user explicitly approves:
# git commit -m "feat(ui): add scale and ranking atoms"
```

---

### Task 8: Question screen renderer

**Files:**
- Create: `components/assessment/question-screen.tsx`

**Interfaces:**
- Consumes: `Screen`, `Answers`, `AnswerValue` from `@/lib/assessment/types`; all atoms from Tasks 6 and 7
- Produces: `QuestionScreen` — props `{ screen: Screen; answers: Answers; onAnswer: (questionId: string, value: AnswerValue) => void; showErrors: boolean }`

This is the single mapping point from question `type` to atom. Nothing else in the codebase switches on `type`.

- [ ] **Step 1: Create the renderer**

Create `components/assessment/question-screen.tsx`:

```tsx
"use client"

import { CheckboxGroup, CheckboxOption } from "@/components/ui/checkbox-group"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioOption } from "@/components/ui/radio-group"
import { RankList } from "@/components/ui/rank-list"
import { ScaleInput } from "@/components/ui/scale-input"
import { Textarea } from "@/components/ui/textarea"
import { isAnswered } from "@/lib/assessment/flow"
import type { AnswerValue, Answers, Question, Screen } from "@/lib/assessment/types"

export const QuestionScreen = ({ screen, answers, onAnswer, showErrors }: Props) => (
  <div className="flex flex-col gap-8">
    {screen.map((question) => (
      <Field key={question.id}>
        <FieldLabel>{question.prompt}</FieldLabel>
        {question.helper && <FieldDescription>{question.helper}</FieldDescription>}

        <QuestionControl
          question={question}
          answers={answers}
          onAnswer={onAnswer}
        />

        {showErrors && !isAnswered(question, answers) && (
          <FieldError match>Please answer this to continue.</FieldError>
        )}
      </Field>
    ))}
  </div>
)

const QuestionControl = ({ question, answers, onAnswer }: ControlProps) => {
  const value = answers[question.id]

  switch (question.type) {
    case "text":
      return question.multiline ? (
        <Textarea
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(event) => onAnswer(question.id, event.target.value)}
        />
      ) : (
        <Input
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(event) => onAnswer(question.id, event.target.value)}
        />
      )

    case "choice":
      return (
        <RadioGroup
          value={typeof value === "string" ? value : null}
          onValueChange={(next) => onAnswer(question.id, String(next))}
        >
          {question.options.map((option) => (
            <RadioOption key={option.id} value={option.id} label={option.label} />
          ))}
        </RadioGroup>
      )

    case "multi":
      return (
        <CheckboxGroup
          value={Array.isArray(value) ? value : []}
          onValueChange={(next) => onAnswer(question.id, next)}
        >
          {question.options.map((option) => (
            <CheckboxOption key={option.id} value={option.id} label={option.label} />
          ))}
        </CheckboxGroup>
      )

    case "scale":
      return (
        <ScaleInput
          value={typeof value === "number" ? value : undefined}
          onValueChange={(next) => onAnswer(question.id, next)}
          min={question.min}
          max={question.max}
          minLabel={question.minLabel}
          maxLabel={question.maxLabel}
        />
      )

    case "ranking":
      return (
        <RankList
          value={Array.isArray(value) ? value : []}
          onValueChange={(next) => onAnswer(question.id, next)}
          items={question.items}
        />
      )
  }
}

type Props = {
  screen: Screen
  answers: Answers
  onAnswer: (questionId: string, value: AnswerValue) => void
  showErrors: boolean
}

type ControlProps = {
  question: Question
  answers: Answers
  onAnswer: (questionId: string, value: AnswerValue) => void
}
```

The `switch` has no `default` on purpose — if a new question type is added to the union, TypeScript reports the missing case at build time.

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

`FieldError`'s `match` prop takes `boolean | keyof ValidityState`; passing `match` (i.e. `true`) always shows the message and hands visibility control to us, which is what we want — these errors come from our own state, not native `ValidityState`.

- [ ] **Step 3: Stage (do NOT commit without explicit approval)**

```bash
git add components/assessment/question-screen.tsx
# Only when the user explicitly approves:
# git commit -m "feat(assessment): add question screen renderer"
```

---

### Task 9: The questionnaire flow

Second user-visible milestone: the full questionnaire runs end to end, with branching, progress, validation, and resume.

**Files:**
- Create: `components/assessment/welcome-screen.tsx`
- Create: `components/assessment/assessment-flow.tsx`
- Modify: `components/assessment/assessment-dialog.tsx` (replace the placeholder body)

**Interfaces:**
- Consumes: `visibleScreens`, `isScreenComplete`, `screenIndexOf` from `@/lib/assessment/flow`; `loadDraft`, `saveDraft`, `clearDraft` from `@/lib/assessment/storage`; `QuestionScreen` from `./question-screen`
- Produces: `AssessmentFlow` — no props yet (Task 10 adds `onClose`); `WelcomeScreen` — props `{ hasDraft: boolean; onStart: () => void; onResume: () => void }`

- [ ] **Step 1: Create the welcome screen**

Create `components/assessment/welcome-screen.tsx`:

```tsx
"use client"

import Link from "next/link"
import { Clock, Lock, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export const WelcomeScreen = ({ hasDraft, onStart, onResume }: Props) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
        Let&apos;s figure out which tech career fits you.
      </h2>
      <p className="text-sm text-muted-foreground">
        A few honest questions about what you&apos;re good at, what you enjoy, and what
        you&apos;re worried about. There are no right or wrong answers, and nothing here
        is a test.
      </p>
    </div>

    <ul className="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300">
      <li className="flex items-center gap-3">
        <Clock className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        About 10 to 15 minutes
      </li>
      <li className="flex items-center gap-3">
        <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        Free, and you don&apos;t need an account
      </li>
      <li className="flex items-center gap-3">
        <Lock className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        Your answers stay private —{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          how we handle your data
        </Link>
      </li>
    </ul>

    <div className="flex flex-col gap-2">
      {hasDraft ? (
        <>
          <Button
            onClick={onResume}
            className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Pick up where you left off
          </Button>
          <Button
            variant="outline"
            onClick={onStart}
            className="h-12 w-full rounded-xl text-sm font-semibold"
          >
            Start over
          </Button>
        </>
      ) : (
        <Button
          onClick={onStart}
          className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Start the assessment
        </Button>
      )}
    </div>
  </div>
)

type Props = {
  hasDraft: boolean
  onStart: () => void
  onResume: () => void
}
```

- [ ] **Step 2: Create the flow**

Task 10 replaces the single `TODO(task-10)` marker with the teaser, capture, and confirmation stages. Create `components/assessment/assessment-flow.tsx`:

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { isScreenComplete, screenIndexOf, visibleScreens } from "@/lib/assessment/flow"
import { clearDraft, loadDraft, saveDraft } from "@/lib/assessment/storage"
import type { AnswerValue, Answers } from "@/lib/assessment/types"

import { QuestionScreen } from "./question-screen"
import { WelcomeScreen } from "./welcome-screen"

type Stage = "welcome" | "questions" | "teaser"

export const AssessmentFlow = () => {
  const [stage, setStage] = useState<Stage>("welcome")
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)
  const [showErrors, setShowErrors] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)

  const headingRef = useRef<HTMLDivElement>(null)
  const highestProgress = useRef(0)

  const screens = visibleScreens(answers)
  const screen = screens[index]
  const isLast = index === screens.length - 1

  useEffect(() => {
    setHasDraft(loadDraft() !== null)
  }, [])

  // Move focus to the top of each new screen so screen readers and keyboard
  // users land on the question rather than staying on the Next button.
  useEffect(() => {
    if (stage === "questions") headingRef.current?.focus()
  }, [stage, index])

  const rawProgress = screens.length ? ((index + 1) / screens.length) * 100 : 0
  // A newly triggered branch grows the denominator, which would otherwise make
  // the bar jump backwards.
  highestProgress.current = Math.max(highestProgress.current, rawProgress)
  const progress = highestProgress.current

  const start = () => {
    clearDraft()
    highestProgress.current = 0
    setAnswers({})
    setIndex(0)
    setShowErrors(false)
    setStage("questions")
  }

  const resume = () => {
    const draft = loadDraft()
    if (!draft) return start()

    const restored = visibleScreens(draft.answers)
    const restoredIndex = screenIndexOf(restored, draft.screenId)

    highestProgress.current = 0
    setAnswers(draft.answers)
    setIndex(restoredIndex >= 0 ? restoredIndex : 0)
    setShowErrors(false)
    setStage("questions")
  }

  const answer = (questionId: string, value: AnswerValue) => {
    setAnswers((previous) => {
      const next = { ...previous, [questionId]: value }
      const nextScreens = visibleScreens(next)
      const currentId = screen?.[0]?.id
      const stillThere = currentId ? screenIndexOf(nextScreens, currentId) : -1
      saveDraft(next, currentId ?? "")
      // An edit can remove the screen we're standing on only via Back-editing a
      // trigger, in which case clamp rather than run off the end.
      if (stillThere === -1) setIndex((i) => Math.min(i, nextScreens.length - 1))
      return next
    })
    setShowErrors(false)
  }

  const next = () => {
    if (!screen) return
    if (!isScreenComplete(screen, answers)) return setShowErrors(true)
    if (isLast) return setStage("teaser")
    setIndex((i) => i + 1)
    setShowErrors(false)
  }

  const back = () => {
    if (index === 0) return setStage("welcome")
    setIndex((i) => i - 1)
    setShowErrors(false)
  }

  if (stage === "welcome") {
    return (
      <div className="px-5 py-6">
        <WelcomeScreen hasDraft={hasDraft} onStart={start} onResume={resume} />
      </div>
    )
  }

  if (stage === "teaser") {
    return <div className="px-5 py-6">{/* TODO(task-10): teaser + capture */}</div>
  }

  const optionalOnly = screen?.every((question) => question.optional) ?? false

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-3 dark:border-slate-800">
        <Progress value={progress} />
        <p aria-live="polite" className="mt-2 text-xs font-medium text-muted-foreground">
          Question {index + 1} of {screens.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>
        <div ref={headingRef} tabIndex={-1} className="outline-none">
          {screen && (
            <QuestionScreen
              screen={screen}
              answers={answers}
              onAnswer={answer}
              showErrors={showErrors}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
        <Button
          variant="outline"
          onClick={back}
          className="h-12 rounded-xl px-4 text-sm font-semibold"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={next}
          className="h-12 flex-1 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {isLast ? "Finish" : optionalOnly ? "Skip" : "Next"}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

Note: `optionalOnly` makes the primary button read "Skip" on a screen where nothing is required, which is how optional questions are skipped — no separate control needed.

- [ ] **Step 3: Mount the flow in the dialog**

In `components/assessment/assessment-dialog.tsx`, replace the placeholder `<div className="flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>…</div>` with:

```tsx
<div className="flex min-h-0 flex-1 flex-col">
  <AssessmentFlow />
</div>
```

Add `import { AssessmentFlow } from "./assessment-flow"`. The `min-h-0` matters: without it the flex child refuses to shrink and the internal scroll area never scrolls.

- [ ] **Step 4: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 5: Manual verification**

Run `npm run dev` and walk the whole questionnaire:

- [ ] Welcome screen appears first; "Start the assessment" moves to question 1
- [ ] Progress reads "Question 1 of 18" with nothing answered
- [ ] Required screens block Next and show "Please answer this to continue."
- [ ] Screen 1 shows name *and* class together; screen 13 shows both work-setting questions together
- [ ] Answering `coding_comfort` = 5 inserts the "what have you built" screen; the count rises to 19
- [ ] Answering `coding_comfort` = 1 inserts "would you be up for learning" instead
- [ ] Going Back and lowering `coding_comfort` from 5 to 1 swaps the branch cleanly, with no crash and no blank screen
- [ ] Selecting 3+ struggles inserts the "who could help" screen
- [ ] Selecting "Cost of college" inserts the money-constraints screen
- [ ] The progress bar never moves backwards when a branch is inserted
- [ ] Optional screens (free weekend, wish better) show "Skip" and advance without an answer
- [ ] The ranking screen numbers items 1..n as tapped, and renumbers correctly when one is removed
- [ ] Refresh the page mid-flow, reopen the modal → welcome offers "Pick up where you left off", and resuming lands on the same screen with answers intact
- [ ] "Start over" discards the draft and returns to question 1 with a blank slate
- [ ] At 375px with the keyboard open on a text question, the Next button is still reachable
- [ ] Keyboard only: Tab reaches every control, arrow keys move within radio groups and the scale, focus is visible throughout

- [ ] **Step 6: Stage (do NOT commit without explicit approval)**

```bash
git add components/assessment/assessment-flow.tsx components/assessment/welcome-screen.tsx components/assessment/assessment-dialog.tsx
# Only when the user explicitly approves:
# git commit -m "feat(assessment): add questionnaire flow with branching and resume"
```

---

### Task 10: Teaser, lead capture, and confirmation

Final user-visible milestone: the flow completes and produces a submission.

**Files:**
- Create: `components/assessment/teaser-screen.tsx`
- Create: `components/assessment/lead-capture-form.tsx`
- Create: `components/assessment/confirmation-screen.tsx`
- Modify: `components/assessment/assessment-flow.tsx`
- Modify: `components/assessment/assessment-dialog.tsx` (pass `onClose`)

**Interfaces:**
- Consumes: `Lead`, `AssessmentSubmission`, `Answers` from `@/lib/assessment/types`; `pruneAnswers` from `@/lib/assessment/flow`; `clearDraft` from `@/lib/assessment/storage`
- Produces: `TeaserScreen` — props `{ onContinue: () => void }`; `LeadCaptureForm` — props `{ onSubmitted: (lead: Lead) => void }`; `ConfirmationScreen` — props `{ name?: string; onClose: () => void }`

- [ ] **Step 1: Create the teaser**

The copy makes no computed claim, because nothing is computed. Create `components/assessment/teaser-screen.tsx`:

```tsx
"use client"

import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export const TeaserScreen = ({ onContinue }: Props) => (
  <div className="flex flex-col gap-6">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
      <CheckCircle2 className="h-6 w-6" />
    </div>

    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
        That&apos;s everything we needed.
      </h2>
      <p className="text-sm text-muted-foreground">
        Your profile is ready. We&apos;ll match you to 3 tech careers that fit it — and
        tell you which one we&apos;d back for you, with the skills and degree path that
        get you there.
      </p>
      <p className="text-sm text-muted-foreground">
        Tell us where to send it.
      </p>
    </div>

    <Button
      onClick={onContinue}
      className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
    >
      Get my career matches
      <ArrowRight className="ml-1.5 h-4 w-4" />
    </Button>
  </div>
)

type Props = {
  onContinue: () => void
}
```

- [ ] **Step 2: Create the lead capture form**

Mirrors the React Hook Form + Zod v4 pattern already in `components/marketing/contact-form.tsx`, but built on the new atoms. Create `components/assessment/lead-capture-form.tsx`:

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { Lead } from "@/lib/assessment/types"

const leadSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z.string().trim().min(1, "Phone number is required"),
  consent: z.literal(true, { error: "Please agree before we send your results" }),
})

type LeadFormValues = z.infer<typeof leadSchema>

export const LeadCaptureForm = ({ onSubmitted }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({ resolver: zodResolver(leadSchema) })

  const consent = watch("consent")

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => onSubmitted(values as Lead))}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-name" className="text-sm font-semibold">
          Your name
        </label>
        <Input
          id="lead-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="lead-name-error" role="alert" className="text-xs font-medium text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-email" className="text-sm font-semibold">
          Email
        </label>
        <Input
          id="lead-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "lead-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="lead-email-error" role="alert" className="text-xs font-medium text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-phone" className="text-sm font-semibold">
          Phone
        </label>
        <Input
          id="lead-phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "lead-phone-error" : undefined}
          {...register("phone")}
        />
        {errors.phone && (
          <p id="lead-phone-error" role="alert" className="text-xs font-medium text-red-500">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-start gap-3 text-xs text-muted-foreground">
          <Checkbox
            checked={consent === true}
            onCheckedChange={(checked) => setValue("consent", checked as true, { shouldValidate: true })}
          />
          <span>
            I&apos;m happy for CoacheePro to email or call me about my results, and I agree
            to the{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            . If you&apos;re under 18, a parent or guardian may be contacted too.
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="text-xs font-medium text-red-500">
            {errors.consent.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        {isSubmitting ? "Sending..." : "Send me my matches"}
      </Button>
    </form>
  )
}

type Props = {
  onSubmitted: (lead: Lead) => void
}
```

- [ ] **Step 3: Create the confirmation screen**

Create `components/assessment/confirmation-screen.tsx`:

```tsx
"use client"

import { MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

export const ConfirmationScreen = ({ name, onClose }: Props) => (
  <div className="flex flex-col gap-6 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
      <MailCheck className="h-6 w-6" />
    </div>

    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {name ? `Thanks, ${name}!` : "Thanks!"}
      </h2>
      <p className="text-sm text-muted-foreground">
        We&apos;ve got your answers. A career advisor will look through them and send your
        3 career matches — with the one we&apos;d back for you — within 24 hours.
      </p>
    </div>

    <Button
      variant="outline"
      onClick={onClose}
      className="h-12 w-full rounded-xl text-sm font-semibold"
    >
      Close
    </Button>
  </div>
)

type Props = {
  name?: string
  onClose: () => void
}
```

- [ ] **Step 4: Wire the three screens into the flow**

In `components/assessment/assessment-flow.tsx`:

Add the imports:

```tsx
import { pruneAnswers } from "@/lib/assessment/flow"
import type { AssessmentSubmission, Lead } from "@/lib/assessment/types"

import { ConfirmationScreen } from "./confirmation-screen"
import { LeadCaptureForm } from "./lead-capture-form"
import { TeaserScreen } from "./teaser-screen"
```

Widen the stage union:

```tsx
type Stage = "welcome" | "questions" | "teaser" | "capture" | "done"
```

Add the `onClose` prop — this is the task that consumes it — plus lead state:

```tsx
export const AssessmentFlow = ({ onClose }: Props) => {
```

```tsx
const [lead, setLead] = useState<Lead | null>(null)
```

And declare the type after the component, per `.claude/rules/component-conventions.md`:

```tsx
type Props = {
  onClose: () => void
}
```

Then update the mount in `components/assessment/assessment-dialog.tsx` to pass it:

```tsx
<AssessmentFlow onClose={close} />
```

Add the submit handler above the render branches:

```tsx
const submit = (captured: Lead) => {
  const submission: AssessmentSubmission = {
    answers: pruneAnswers(answers),
    lead: captured,
    completedAt: new Date().toISOString(),
  }
  // TODO(ADR-003): replace with a real SES or API endpoint send once configured.
  console.log("Assessment Submission:", submission)
  clearDraft()
  setLead(captured)
  setStage("done")
}
```

Replace the `stage === "teaser"` placeholder block with:

```tsx
if (stage === "teaser") {
  return (
    <div className="px-5 py-6">
      <TeaserScreen onContinue={() => setStage("capture")} />
    </div>
  )
}

if (stage === "capture") {
  return (
    <div className="overflow-y-auto px-5 py-6" data-lenis-prevent>
      <LeadCaptureForm onSubmitted={submit} />
    </div>
  )
}

if (stage === "done") {
  return (
    <div className="px-5 py-6">
      <ConfirmationScreen name={lead?.name} onClose={onClose} />
    </div>
  )
}
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 6: Manual verification**

- [ ] Finishing the last question lands on the teaser
- [ ] The teaser makes no specific claim about *which* careers matched
- [ ] "Get my career matches" opens the capture form
- [ ] Submitting with empty fields shows all four errors, including consent
- [ ] An invalid email is rejected
- [ ] A valid submission logs `Assessment Submission:` to the console with `answers`, `lead`, `completedAt`
- [ ] **Orphan check:** set `coding_comfort` to 5, answer the follow-up, go Back, change it to 1, finish — the logged `answers` must NOT contain `coding_built`
- [ ] The draft is cleared after submit: reopen the modal and confirm the welcome screen offers "Start the assessment", not "Pick up where you left off"
- [ ] The confirmation "Close" button closes the modal
- [ ] Both themes, 375px and desktop

- [ ] **Step 7: Stage (do NOT commit without explicit approval)**

```bash
git add components/assessment/teaser-screen.tsx components/assessment/lead-capture-form.tsx components/assessment/confirmation-screen.tsx components/assessment/assessment-flow.tsx components/assessment/assessment-dialog.tsx
# Only when the user explicitly approves:
# git commit -m "feat(assessment): add teaser, lead capture, and confirmation"
```

---

### Task 11: Documentation and final QA sweep

**Files:**
- Modify: `reference/PRODUCT.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Record the career-count decision**

In `reference/PRODUCT.md`, under "MVP product flow", change the free preview line to:

```markdown
2. **Free preview** — at most 3 recommended careers, exactly one flagged as our recommendation, each with a short "why."
```

- [ ] **Step 2: Update the current status**

In `CLAUDE.md`, under "Current status", add a sentence to the existing paragraph:

```markdown
The free career assessment opens as a modal from every marketing CTA (18 questions with conditional
branching, client-side only); submissions are logged, not delivered, until ADR-003 is wired.
```

- [ ] **Step 3: Full manual QA sweep**

Run through the complete checklist from the spec's Verification section in one sitting, on a real phone if possible rather than a narrowed desktop window:

- [ ] Modal opens from all six CTA call sites, on every marketing page
- [ ] `?assessment=1` opens it on load
- [ ] All five branches trigger, and disappear when their trigger is changed via Back
- [ ] Orphaned branch answers are absent from the submitted payload
- [ ] Progress never moves backwards and reaches 100% on the last question
- [ ] Required questions block Next; optional ones skip
- [ ] Refresh mid-flow, reopen, resume lands on the same question with answers intact
- [ ] "Start over" discards the draft
- [ ] Submit clears the draft; reopening starts fresh
- [ ] 375px: no horizontal overflow, Next reachable with the keyboard open, sheet fills the height
- [ ] Desktop: centered panel, backdrop click and Escape close it
- [ ] Light and dark both correct on every screen
- [ ] Keyboard-only: full traversal, visible focus, focus trapped in the dialog
- [ ] Page does not scroll behind the open modal (Lenis check, real device)
- [ ] `prefers-reduced-motion` suppresses step animation — enable it in OS settings and reopen

- [ ] **Step 4: Final lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 5: Stage (do NOT commit without explicit approval)**

```bash
git add reference/PRODUCT.md CLAUDE.md
# Only when the user explicitly approves:
# git commit -m "docs: record assessment modal status and career-count decision"
```

---

## Deliberately not in this plan

Recorded here so a reviewer doesn't flag them as gaps — each is a spec-level decision, not an oversight:

- **No API route.** Submissions go to `console.log` behind `TODO(ADR-003)`, matching `contact-form.tsx`. The endpoint contract depends on ADR-003 being wired and ADR-005 being decided. **This modal cannot go live to real traffic until that is done — leads are dropped on the floor.**
- **No results or career-matching engine.** Phase 3.
- **No server-side persistence.** ADR-005 is Pending.
- **No PDF or parent export.** Phase 4, ADR-006 is Pending.
- **`contact-form.tsx` is not migrated** onto the new `ui/` atoms. Agreed as a separate follow-up change; until then `contact-form.tsx` keeps its own inlined `inputClassName`.
- **No test framework.** Pure logic is verified with `node` assertion scripts; UI is verified manually.
