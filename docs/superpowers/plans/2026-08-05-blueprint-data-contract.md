# Blueprint AI Mock + Data Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic, rules-based mock of the future AI blueprint-generation call, and finalize the `Blueprint` data contract it returns, so the assessment flow can produce a full career blueprint from a student's answers today — with a real AI implementation swappable in later behind the same interface.

**Architecture:** A typed data contract (`lib/blueprint/types.ts`) plus a `BlueprintService` interface (`services/ai/blueprint-service.ts`) with one implementation for now (`mockBlueprintService`) that scores the student's answers into a 6-category signal map, ranks the 10 catalog careers against it, and assembles a full `Blueprint` from static per-career content plus a signal-driven profile summary. `assessment-flow.tsx` calls it after lead capture and persists the result to `localStorage` (no backend/DB exists yet).

**Tech Stack:** TypeScript, Next.js (App Router), no new dependencies.

## Global Constraints

- **Do not run `npm run lint`, `npm run build`, or any type-check command after individual tasks.** Defer all verification to a single pass at the very end, only when the user explicitly says they're ready to commit.
- **Do not run `git add` or `git commit` for this work at any point in this plan**, including per-task. Commits happen only when the user explicitly authorizes them, per this repo's standing rule (`CLAUDE.md`: "Never commit anything until explicitly told to").
- **No automated tests for `services/ai/mock/**` or `services/ai/mock-blueprint-service.ts`.** This is throwaway scoring logic that gets replaced when the real AI call is wired in later — explicit user instruction, don't add test coverage for it.
- **This repo has no test framework configured** (no vitest/jest in `package.json`). Do not introduce one as part of this plan.
- Component shape for any hand-written component file touched: named `const` arrow-function export, props destructured inline, prop type named `Props` declared after the component (`.claude/rules/component-conventions.md`). This plan's UI changes are copy/icon-only inside existing components — no new component files.
- Follow the existing `@/*` path alias (`tsconfig.json`) for cross-folder imports; match this codebase's existing convention of relative imports with an explicit `.ts` extension for same-folder imports (see `lib/assessment/storage.ts`'s `from "./types.ts"`).
- `CareerId` and `SignalCategory` are plain `string` in the public contract, not TS union types — Phase 6 of the roadmap plans an admin-manageable career catalog, so the contract stays open even though the mock's own seed data (10 careers, 6 signal categories) is fixed today.
- Currency is INR lakh only — no USD conversion.

---

### Task 1: Blueprint data contract

**Files:**
- Create: `lib/blueprint/types.ts`

**Interfaces:**
- Produces: `CareerId`, `SignalCategory`, `AiRisk`, `ProfileSummary`, `LearningStage`, `CareerMatch`, `Blueprint` — every later task imports from this file.

- [ ] **Step 1: Write the data contract**

```ts
// lib/blueprint/types.ts

export type CareerId = string
// Seeded from the 10 careers in reference/PRODUCT.md today (see
// services/ai/mock/career-catalog.ts). Kept as `string`, not a union, because
// Phase 6 of the roadmap plans an admin-manageable career catalog — locking
// this to a compile-time union would mean every new career needs a deploy.

export type SignalCategory = string
// Seeded from 6 categories today (see services/ai/mock/profile-summary.ts).
// Loosened to match CareerId in case signal categories become configurable
// per assessment type or role family later.

export type AiRisk = "low" | "medium" | "high"

export type ProfileSummary = {
  archetype: string
  narrative: string
  strengths: { title: string; detail: string }[]
  watchOuts: { title: string; detail: string }[]
  signalMap: Record<SignalCategory, number>
}

export type LearningStage = {
  title: string
  actions: string[]
  milestone?: string
}

export type CareerMatch = {
  careerId: CareerId
  name: string
  matchPercent: number
  isRecommended: boolean
  aiRisk: AiRisk
  streamFit: string
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
  salaryProgressionInrLakh: {
    entry: number
    year3: number
    year5: number
    year10: number
  }
  futureOutlook: string
  commonMistakes: string[]
}

export type Blueprint = {
  version: 1
  generatedAt: string
  studentName: string
  profile: ProfileSummary
  careers: CareerMatch[]
}
```

- [ ] **Step 2: Self-check**

Read the file back and confirm all seven exported names (`CareerId`, `SignalCategory`, `AiRisk`, `ProfileSummary`, `LearningStage`, `CareerMatch`, `Blueprint`) are present and match the shapes used in this plan's later tasks. No build/type-check command — that's deferred to the end per Global Constraints.

---

### Task 2: Blueprint storage

**Files:**
- Create: `lib/blueprint/storage.ts`

**Interfaces:**
- Consumes: `Blueprint` from `lib/blueprint/types.ts` (Task 1)
- Produces: `saveBlueprint(blueprint: Blueprint): void`, `loadBlueprint(): Blueprint | null`, `clearBlueprint(): void`

- [ ] **Step 1: Write the storage module**

Mirrors the existing `lib/assessment/storage.ts` pattern (same-origin `localStorage`, defensive try/catch for private-mode/quota errors, a version guard).

```ts
// lib/blueprint/storage.ts
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

- [ ] **Step 2: Self-check**

Confirm the key name (`coacheepro.blueprint.v1`) is distinct from the existing assessment draft key (`coacheepro.assessment.v1`) so the two don't collide in `localStorage`.

---

### Task 3: BlueprintService interface

**Files:**
- Create: `services/ai/blueprint-service.ts`

**Interfaces:**
- Consumes: `Blueprint` from `lib/blueprint/types.ts` (Task 1), `Answers` from `lib/assessment/types.ts` (existing)
- Produces: `BlueprintInput` type, `BlueprintService` interface with `generate(input: BlueprintInput): Promise<Blueprint>`

- [ ] **Step 1: Write the service interface**

This is the module boundary per `CLAUDE.md` ("business logic talks to an internal interface, not a vendor SDK directly") — the real OpenAI-backed implementation drops in later behind this same interface without touching callers.

```ts
// services/ai/blueprint-service.ts
import type { Answers } from "@/lib/assessment/types"
import type { Blueprint } from "@/lib/blueprint/types"

export type BlueprintInput = {
  answers: Answers
  studentName: string
}

export interface BlueprintService {
  generate(input: BlueprintInput): Promise<Blueprint>
}
```

- [ ] **Step 2: Self-check**

Confirm `BlueprintInput` matches what `assessment-flow.tsx` will have available at the call site in Task 8: `pruneAnswers(answers)` (an `Answers`) and `captured.name` (a `string`, from `Lead`).

---

### Task 4: Signal scoring

**Files:**
- Create: `services/ai/mock/signal-scoring.ts`

**Interfaces:**
- Consumes: `Answers` from `lib/assessment/types.ts`, `SignalCategory` from `lib/blueprint/types.ts` (Task 1)
- Produces: `computeSignalMap(answers: Answers): Record<SignalCategory, number>`

- [ ] **Step 1: Write the scoring function**

Deterministic, rules-based — reads the existing 18-question answer set (`lib/assessment/questions.ts`) and produces a 0–100 score per signal category. No randomness.

```ts
// services/ai/mock/signal-scoring.ts
import type { Answers } from "@/lib/assessment/types"
import type { SignalCategory } from "@/lib/blueprint/types"

const CATEGORIES: SignalCategory[] = [
  "technical",
  "creative",
  "scientific",
  "empathy",
  "commercial",
  "entrepreneurial",
]

const clamp = (value: number): number => Math.max(0, Math.min(100, Math.round(value)))

const scaleAnswer = (value: unknown): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const includesOption = (answers: Answers, id: string, optionId: string): boolean => {
  const value = answers[id]
  return Array.isArray(value) && (value as string[]).includes(optionId)
}

export const computeSignalMap = (answers: Answers): Record<SignalCategory, number> => {
  const scores: Record<SignalCategory, number> = {
    technical: 20,
    creative: 15,
    scientific: 15,
    empathy: 15,
    commercial: 15,
    entrepreneurial: 15,
  }

  const codingComfort = scaleAnswer(answers.coding_comfort)
  const logicConfidence = scaleAnswer(answers.logic_confidence)
  const englishComfort = scaleAnswer(answers.english_comfort)

  scores.technical += codingComfort * 8 + logicConfidence * 6
  scores.scientific += logicConfidence * 5
  scores.empathy += englishComfort * 4

  const techInterests = Array.isArray(answers.tech_interests)
    ? (answers.tech_interests as string[])
    : []
  if (techInterests.includes("apps_websites")) scores.technical += 12
  if (techInterests.includes("ai_ml")) {
    scores.technical += 10
    scores.scientific += 10
  }
  if (techInterests.includes("cybersecurity")) scores.technical += 12
  if (techInterests.includes("robotics")) {
    scores.technical += 8
    scores.scientific += 10
  }
  if (techInterests.includes("cloud")) scores.technical += 12
  if (techInterests.includes("data")) scores.scientific += 15
  if (techInterests.includes("design")) scores.creative += 20
  if (techInterests.includes("games")) {
    scores.creative += 12
    scores.technical += 8
  }
  if (techInterests.includes("product")) {
    scores.commercial += 12
    scores.entrepreneurial += 8
  }

  if (includesOption(answers, "help_with", "fixing_gadgets")) scores.technical += 10
  if (includesOption(answers, "help_with", "puzzles")) {
    scores.technical += 8
    scores.scientific += 8
  }
  if (includesOption(answers, "help_with", "making_look_good")) scores.creative += 15
  if (includesOption(answers, "help_with", "explaining")) scores.empathy += 15
  if (includesOption(answers, "help_with", "organising")) scores.commercial += 10
  if (includesOption(answers, "help_with", "leading")) {
    scores.commercial += 10
    scores.entrepreneurial += 10
  }

  const subjects = Array.isArray(answers.subjects) ? (answers.subjects as string[]) : []
  if (subjects.includes("physics") || subjects.includes("chemistry") || subjects.includes("biology")) {
    scores.scientific += 10
  }
  if (subjects.includes("maths")) scores.scientific += 8
  if (subjects.includes("art_design")) scores.creative += 12
  if (subjects.includes("economics")) scores.commercial += 10

  if (answers.work_setting === "many_people") scores.empathy += 15
  if (answers.work_setting === "alone") scores.technical += 8

  if (answers.company_type === "startup") scores.entrepreneurial += 15
  if (answers.company_type === "established") scores.commercial += 10

  const jobValues = Array.isArray(answers.job_values) ? (answers.job_values as string[]) : []
  const valueBoost = (id: string, category: SignalCategory): void => {
    const position = jobValues.indexOf(id)
    if (position === -1) return
    scores[category] += (jobValues.length - position) * 5
  }
  valueBoost("helping", "empathy")
  valueBoost("salary", "commercial")
  valueBoost("stability", "commercial")
  valueBoost("creativity", "creative")
  valueBoost("cutting_edge", "entrepreneurial")

  const result = {} as Record<SignalCategory, number>
  for (const category of CATEGORIES) {
    result[category] = clamp(scores[category])
  }
  return result
}
```

- [ ] **Step 2: Trace one example by hand**

Take a student who picked `tech_interests: ["ai_ml", "data"]`, `coding_comfort: 4`, `logic_confidence: 4`, `subjects: ["maths", "physics"]`. Confirm by reading the code that `technical` and `scientific` both end up clearly highest (from the `ai_ml`/`data` interest boosts, the coding/logic scale boosts, and the maths/physics subject boosts), while `creative`, `empathy`, `commercial`, `entrepreneurial` stay near their 15-point floor. This confirms the function is directionally sane before it's wired into anything.

---

### Task 5: Career catalog

**Files:**
- Create: `services/ai/mock/career-catalog.ts`

**Interfaces:**
- Consumes: `CareerId`, `AiRisk`, `LearningStage`, `SignalCategory` from `lib/blueprint/types.ts` (Task 1)
- Produces: `CareerCatalogEntry` type, `CAREER_CATALOG: CareerCatalogEntry[]` (10 entries — the catalog from `reference/PRODUCT.md`)

- [ ] **Step 1: Write the catalog**

Each entry holds the static, career-level content (not personalized to a student) plus the two fields used for scoring (`primarySignals`, `interestTags`).

```ts
// services/ai/mock/career-catalog.ts
import type { AiRisk, CareerId, LearningStage, SignalCategory } from "@/lib/blueprint/types"

export type CareerCatalogEntry = {
  careerId: CareerId
  name: string
  primarySignals: SignalCategory[]
  interestTags: string[]
  streamFit: string
  fitReason: string
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
  futureOutlook: string
  commonMistakes: string[]
  aiRisk: AiRisk
}

export const CAREER_CATALOG: CareerCatalogEntry[] = [
  {
    careerId: "software_engineer",
    name: "Software Engineer",
    primarySignals: ["technical"],
    interestTags: ["apps_websites"],
    streamFit:
      "Any stream with Maths is workable; PCM or Computer Science background helps most. BCA, BSc CS, or B.Tech CS/IT all lead here.",
    fitReason:
      "This fits a strong technical mindset well — software engineering rewards structured problem-solving, comfort with logic, and steady improvement through building real things rather than raw creativity or persuasion.",
    dayInTheLife:
      "You write, test, and ship code — building features, fixing bugs, and working with a team through code reviews and stand-ups.",
    skillsToBuild: [
      "Programming fundamentals (Python or JavaScript)",
      "Data structures & algorithms",
      "Git & version control",
      "Building small full-stack projects",
      "SQL basics",
    ],
    learningPath: {
      months1to3: {
        title: "Learn to code",
        actions: [
          "Pick one language (Python or JavaScript) and finish a beginner course",
          "Solve daily coding problems to build logic",
          "Set up a GitHub profile and push your first project",
        ],
      },
      months4to6: {
        title: "Build real projects",
        actions: [
          "Build 2-3 small full-stack projects",
          "Learn Git branching and collaborate on a project with others",
          "Start learning SQL and basic databases",
        ],
      },
      months7to12: {
        title: "Get real-world exposure",
        actions: [
          "Apply for a beginner internship or open-source contribution",
          "Learn one framework in depth (React or similar)",
          "Polish your GitHub with documented projects",
        ],
        milestone: "Land your first internship or freelance coding project",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA or BSc CS from a reputable local college, paired with strong personal projects and an internship, gets you hired just as well as an expensive private B.Tech.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative: "A high-fee private B.Tech at a tier-3 college with a weak placement record",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 8, year5: 14, year10: 28 },
    futureOutlook:
      "Software engineering remains in strong demand as every industry keeps building digital products. AI tools are changing how code gets written, but engineers who can design systems and solve real problems stay valuable — routine, boilerplate coding is what's most exposed.",
    commonMistakes: [
      "Chasing a big-name college instead of building a strong project portfolio",
      "Learning too many languages shallowly instead of one deeply",
      "Waiting until final year to start applying for internships",
    ],
    aiRisk: "medium",
  },
  {
    careerId: "ai_engineer",
    name: "AI Engineer",
    primarySignals: ["technical", "scientific"],
    interestTags: ["ai_ml", "data"],
    streamFit: "PCM strongly preferred (Maths is essential); B.Tech CS/IT or BSc CS with a strong maths foundation.",
    fitReason:
      "This fits a profile strong in both technical and analytical thinking — AI engineering rewards comfort with maths, patience with iterative experimentation, and the same systems mindset that makes software engineering a fit, applied to models instead of pure code.",
    dayInTheLife:
      "You build and fine-tune machine learning models, clean and prepare data, and integrate AI features into real products.",
    skillsToBuild: [
      "Python programming",
      "Statistics & linear algebra basics",
      "Machine learning fundamentals",
      "Working with ML libraries (scikit-learn, PyTorch)",
      "Data handling with pandas/SQL",
    ],
    learningPath: {
      months1to3: {
        title: "Build maths & Python foundations",
        actions: [
          "Strengthen statistics and linear algebra basics",
          "Learn Python for data work (numpy, pandas)",
          "Complete an intro machine learning course",
        ],
      },
      months4to6: {
        title: "Build ML projects",
        actions: [
          "Build 2 small ML projects (classification, prediction)",
          "Learn how neural networks work at a basic level",
          "Practice on public datasets (beginner-friendly competitions)",
        ],
      },
      months7to12: {
        title: "Go deeper and get exposure",
        actions: [
          "Learn one deep learning framework (PyTorch)",
          "Try building with a large language model API",
          "Look for an AI/ML internship or research assistantship",
        ],
        milestone: "Complete and publish an end-to-end ML project",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A B.Tech CS/IT with a strong maths base, plus self-driven ML projects and online specializations, matters more than which college name is on the degree.",
      estimatedCostInrLakh: [3, 8],
      expensiveAlternative: "An expensive private B.Tech with no real ML/AI specialization or lab exposure",
    },
    salaryProgressionInrLakh: { entry: 5, year3: 10, year5: 18, year10: 35 },
    futureOutlook:
      "AI engineering is one of the fastest-growing tech fields as companies race to add AI features. Demand is strong globally including remote roles, though the field evolves quickly — engineers need to keep learning as tools change every year.",
    commonMistakes: [
      "Jumping into deep learning before basic maths and Python are solid",
      "Only doing tutorials without building original projects",
      "Ignoring the data-handling and engineering skills that most AI jobs actually need day to day",
    ],
    aiRisk: "low",
  },
  {
    careerId: "cybersecurity_analyst",
    name: "Cybersecurity Analyst",
    primarySignals: ["technical"],
    interestTags: ["cybersecurity"],
    streamFit:
      "PCM or Computer Science background helps; BCA, BSc CS/IT, or B.Tech CS with a security specialization all work.",
    fitReason:
      "This fits a strong technical, systems-oriented mindset — cybersecurity rewards structured thinking, patience with detail, and comfort investigating how systems actually work under the hood, more than persuasion or creative expression.",
    dayInTheLife:
      "You monitor systems for threats, investigate security incidents, run vulnerability scans, and help teams fix weak points before attackers find them.",
    skillsToBuild: [
      "Networking fundamentals",
      "Operating systems (Linux basics)",
      "Security tools (Wireshark, Nmap)",
      "Basic scripting (Python or Bash)",
      "Understanding common attack types",
    ],
    learningPath: {
      months1to3: {
        title: "Learn the fundamentals",
        actions: [
          "Learn networking basics (how the internet actually works)",
          "Get comfortable with the Linux command line",
          "Study common attack types and security terminology",
        ],
      },
      months4to6: {
        title: "Get hands-on",
        actions: [
          "Practice on beginner-friendly platforms (capture-the-flag style labs)",
          "Learn basic scripting to automate simple tasks",
          "Set up a home lab to practice safely",
        ],
      },
      months7to12: {
        title: "Build credibility",
        actions: [
          "Attempt an entry-level certification track",
          "Document your lab work and findings publicly",
          "Look for a SOC analyst internship or trainee role",
        ],
        milestone: "Complete your first capture-the-flag challenge or entry cert prep",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA or BSc CS/IT plus hands-on lab practice and an entry-level certification beats an expensive specialized security degree at this stage.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative: "A costly private cybersecurity-branded degree with mostly theoretical coursework",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 8, year5: 14, year10: 26 },
    futureOutlook:
      "Cybersecurity demand keeps growing as more of daily life moves online and attacks increase. It's a field with strong job security and low automation risk — defending systems still needs human judgement.",
    commonMistakes: [
      "Trying to learn every security tool at once instead of the fundamentals first",
      "Skipping networking and OS basics to jump straight to 'hacking'",
      "Not practicing hands-on labs, only reading theory",
    ],
    aiRisk: "low",
  },
  {
    careerId: "cloud_engineer",
    name: "Cloud Engineer",
    primarySignals: ["technical"],
    interestTags: ["cloud"],
    streamFit:
      "PCM or Computer Science background preferred; BCA, BSc CS/IT, or an affordable B.Tech CS/IT all work.",
    fitReason:
      "This fits a strong technical, systems-first mindset — cloud engineering rewards comfort with infrastructure, reliability, and process, more than client-facing persuasion or creative work.",
    dayInTheLife:
      "You set up and maintain cloud infrastructure, automate deployments, monitor system health, and make sure applications run reliably at scale.",
    skillsToBuild: [
      "Linux fundamentals",
      "Networking basics",
      "One cloud platform (AWS free tier)",
      "Scripting (Python or Bash)",
      "CI/CD basics",
    ],
    learningPath: {
      months1to3: {
        title: "Build core fundamentals",
        actions: [
          "Learn Linux command line and basic networking",
          "Start AWS free tier and complete beginner labs",
          "Learn basic scripting for automation",
        ],
      },
      months4to6: {
        title: "Go hands-on with cloud",
        actions: [
          "Deploy a small project on the cloud end-to-end",
          "Learn Docker basics for containers",
          "Learn Git and basic CI/CD pipelines",
        ],
      },
      months7to12: {
        title: "Get certified and get exposure",
        actions: [
          "Prepare for an entry-level cloud certification",
          "Contribute to or build an infra-focused side project",
          "Apply for cloud support or DevOps trainee roles",
        ],
        milestone: "Deploy your first project on cloud infrastructure end-to-end",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA/BSc CS/IT plus a recognized cloud certification (much cheaper than a degree) is often enough to get an entry-level cloud role.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative: "An expensive private B.Tech with no cloud/DevOps specialization or labs",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 9, year5: 15, year10: 28 },
    futureOutlook:
      "Cloud infrastructure demand keeps rising as more companies move off physical servers. It's a stable, high-demand field with strong remote-work availability and relatively low automation risk since it requires judgement about live systems.",
    commonMistakes: [
      "Trying to learn all three major cloud providers at once instead of going deep on one",
      "Only doing certifications without hands-on deployment practice",
      "Ignoring scripting/automation skills that separate juniors from seniors",
    ],
    aiRisk: "medium",
  },
  {
    careerId: "data_scientist",
    name: "Data Scientist",
    primarySignals: ["technical", "scientific"],
    interestTags: ["data"],
    streamFit: "PCM preferred (Maths essential); BSc Statistics/CS, BCA, or B.Tech with a strong maths/stats foundation.",
    fitReason:
      "This fits a profile strong in analytical, evidence-based thinking — data science rewards patience with detail, comfort with statistics, and curiosity about what the numbers actually mean, more than persuasion or creative expression.",
    dayInTheLife:
      "You explore datasets to find patterns, build models to predict or explain outcomes, and present findings that help teams make decisions.",
    skillsToBuild: [
      "Statistics fundamentals",
      "Python (pandas, numpy)",
      "SQL for data querying",
      "Data visualization",
      "Basic machine learning",
    ],
    learningPath: {
      months1to3: {
        title: "Build statistics & Python base",
        actions: [
          "Learn core statistics concepts (mean, distributions, hypothesis testing)",
          "Learn Python for data analysis",
          "Practice SQL queries on sample databases",
        ],
      },
      months4to6: {
        title: "Analyze real data",
        actions: [
          "Work through 2-3 public datasets end-to-end",
          "Learn data visualization (charts that tell a clear story)",
          "Start a beginner machine learning course",
        ],
      },
      months7to12: {
        title: "Build a portfolio",
        actions: [
          "Complete an end-to-end data project with a written report",
          "Enter a beginner-friendly data competition",
          "Look for a data analyst/scientist internship",
        ],
        milestone: "Publish a data project with clear findings and visuals",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BSc Statistics, BCA, or BSc CS with a solid maths base plus strong personal data projects matters more than a specialized 'Data Science' branded degree at a high fee.",
      estimatedCostInrLakh: [2, 7],
      expensiveAlternative:
        "A costly private 'Data Science' degree with weak maths grounding and little hands-on project work",
    },
    salaryProgressionInrLakh: { entry: 5, year3: 9, year5: 16, year10: 30 },
    futureOutlook:
      "Data-driven decision making keeps growing across every industry, keeping demand for data scientists strong. AI tools are automating some routine analysis, so the value is shifting toward people who can ask the right questions and interpret results, not just run models.",
    commonMistakes: [
      "Jumping to machine learning before statistics fundamentals are solid",
      "Only doing modelling exercises without learning to communicate findings clearly",
      "Underestimating how much of the job is cleaning messy data",
    ],
    aiRisk: "medium",
  },
  {
    careerId: "ui_ux_designer",
    name: "UI/UX Designer",
    primarySignals: ["creative"],
    interestTags: ["design"],
    streamFit:
      "Any stream works — this path values a design portfolio over a specific subject background. BDes, BA in a related field, or online design tracks all work.",
    fitReason:
      "This fits a profile strong in creative, original thinking — UI/UX design rewards visual sense, empathy for how people actually use a product, and comfort working through loosely-defined problems, more than pure structured logic.",
    dayInTheLife:
      "You research how people use a product, sketch and test different designs, and work closely with developers to bring the final interface to life.",
    skillsToBuild: [
      "Design fundamentals (layout, color, typography)",
      "A design tool (Figma)",
      "User research basics",
      "Prototyping & wireframing",
      "Basic understanding of how developers build interfaces",
    ],
    learningPath: {
      months1to3: {
        title: "Learn design fundamentals",
        actions: [
          "Learn core design principles (layout, color, typography)",
          "Get comfortable with Figma through guided tutorials",
          "Study a few apps/websites you like and note what works",
        ],
      },
      months4to6: {
        title: "Practice real projects",
        actions: [
          "Redesign 2-3 existing apps as practice projects",
          "Learn basic user research and usability testing methods",
          "Start building a simple portfolio",
        ],
      },
      months7to12: {
        title: "Build credibility",
        actions: [
          "Complete one full case study from research to final design",
          "Get feedback from designers in online communities",
          "Apply for design internships or freelance projects",
        ],
        milestone: "Publish a complete design case study in your portfolio",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A strong self-built portfolio through an affordable design course or BDes program matters far more here than the college name — design hiring is portfolio-first.",
      estimatedCostInrLakh: [1, 5],
      expensiveAlternative:
        "An expensive private design college chosen for brand name without strong industry mentorship or placements",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 8, year5: 13, year10: 24 },
    futureOutlook:
      "Good product design stays in demand as companies compete on user experience. AI tools now speed up producing design variations, so the value is shifting toward designers who deeply understand user problems, not just visual execution.",
    commonMistakes: [
      "Focusing only on visuals without learning user research",
      "Building a portfolio of redesigns instead of solving real problems",
      "Ignoring how the designs will actually be built by developers",
    ],
    aiRisk: "medium",
  },
  {
    careerId: "product_manager",
    name: "Product Manager",
    primarySignals: ["entrepreneurial", "commercial"],
    interestTags: ["product"],
    streamFit:
      "Any stream works, though comfort with numbers helps. A business, CS, or related degree all work — this role is built more on experience and skill than a specific degree.",
    fitReason:
      "This fits a profile strong in practical, ownership-driven thinking — product management rewards prioritization, initiative, and connecting technical work to real outcomes, more than deep hands-on technical execution alone.",
    dayInTheLife:
      "You decide what a product team should build next, talk to users to understand their problems, and work with designers and engineers to ship it.",
    skillsToBuild: [
      "Communication & writing clearly",
      "Basic data analysis",
      "Understanding of how software gets built",
      "Prioritization frameworks",
      "User research basics",
    ],
    learningPath: {
      months1to3: {
        title: "Understand the basics",
        actions: [
          "Learn what product managers actually do (read PM case studies)",
          "Practice breaking down problems and prioritizing clearly",
          "Get comfortable reading basic data/metrics",
        ],
      },
      months4to6: {
        title: "Get hands-on experience",
        actions: [
          "Run a mini product project (even for a college club or personal idea)",
          "Learn to write simple product requirement documents",
          "Practice presenting decisions with clear reasoning",
        ],
      },
      months7to12: {
        title: "Build real exposure",
        actions: [
          "Take part in a product case competition or hackathon",
          "Try to intern or assist on a real product team, even informally",
          "Build a portfolio of case studies showing your thinking",
        ],
        milestone: "Complete one full product case study from problem to proposed solution",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "Since this role is hired more on demonstrated thinking than a specific degree, a general BBA/BCA plus real project experience and internships is more efficient than an expensive specialized program.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative:
        "A high-fee 'product management' certificate program with no real project or internship component",
    },
    salaryProgressionInrLakh: { entry: 5, year3: 10, year5: 18, year10: 34 },
    futureOutlook:
      "Companies keep needing people who can turn business goals into things engineers can build, so demand stays healthy — though it's typically not an entry-level-heavy field; most people move into it after some experience in engineering, design, or business.",
    commonMistakes: [
      "Trying to become a PM straight after school without any hands-on project or team experience",
      "Focusing only on 'ideas' without learning to work with data or engineering constraints",
      "Underestimating how much of the job is communication and alignment, not decision-making alone",
    ],
    aiRisk: "low",
  },
  {
    careerId: "devops_engineer",
    name: "DevOps Engineer",
    primarySignals: ["technical"],
    interestTags: ["cloud", "apps_websites"],
    streamFit:
      "PCM or Computer Science background preferred; BCA, BSc CS/IT, or an affordable B.Tech CS/IT all work.",
    fitReason:
      "This fits a strong technical, systems-first mindset — DevOps rewards process discipline, comfort under pressure when something breaks, and reliability, more than persuasion or creative expression.",
    dayInTheLife:
      "You build and maintain the pipelines and systems that let developers ship code safely and often, and you're often the first responder when something breaks in production.",
    skillsToBuild: [
      "Linux fundamentals",
      "Scripting (Python or Bash)",
      "CI/CD tools",
      "Containers (Docker)",
      "Basic cloud platform knowledge",
    ],
    learningPath: {
      months1to3: {
        title: "Build core fundamentals",
        actions: [
          "Learn Linux command line thoroughly",
          "Learn Git and basic scripting",
          "Understand what CI/CD actually means with a simple example",
        ],
      },
      months4to6: {
        title: "Get hands-on",
        actions: [
          "Set up a CI/CD pipeline for a personal project",
          "Learn Docker and containerize a small app",
          "Start learning one cloud platform's basics",
        ],
      },
      months7to12: {
        title: "Build real exposure",
        actions: [
          "Automate a full deployment pipeline end-to-end",
          "Learn basic monitoring/logging concepts",
          "Apply for DevOps or cloud support trainee roles",
        ],
        milestone: "Ship a project through your own automated deployment pipeline",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA/BSc CS/IT plus hands-on pipeline and cloud projects gets you into entry-level DevOps roles without needing an expensive specialized degree.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative: "A high-fee private B.Tech with no infrastructure/DevOps exposure or labs",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 9, year5: 16, year10: 30 },
    futureOutlook:
      "As more companies ship software constantly, demand for people who keep that process reliable keeps growing. It's a hands-on, systems-heavy role that's harder to automate away since it involves judgement calls under pressure.",
    commonMistakes: [
      "Learning tools in isolation without understanding the full deployment pipeline",
      "Skipping Linux/networking fundamentals to jump straight to trendy tools",
      "Not practicing what happens when something breaks, only how to set things up",
    ],
    aiRisk: "medium",
  },
  {
    careerId: "robotics_engineer",
    name: "Robotics Engineer",
    primarySignals: ["technical", "scientific"],
    interestTags: ["robotics"],
    streamFit: "PCM required (Physics and Maths are core); B.Tech in Mechanical, Electronics, or Robotics/Mechatronics.",
    fitReason:
      "This fits a profile strong in both technical and analytical thinking — robotics rewards patience with hands-on experimentation, comfort with physics and systems, and building things end-to-end, more than pure software or purely creative work.",
    dayInTheLife:
      "You design, build, and program physical systems — from wiring circuits to writing the code that makes a robot sense and respond to its environment.",
    skillsToBuild: [
      "Basic electronics",
      "Programming (C/C++ or Python)",
      "Microcontrollers (Arduino/Raspberry Pi)",
      "Mechanical design basics",
      "Sensors & control systems basics",
    ],
    learningPath: {
      months1to3: {
        title: "Build core fundamentals",
        actions: [
          "Learn basic electronics and circuits",
          "Learn to program a microcontroller (Arduino)",
          "Study core physics concepts behind motion and sensors",
        ],
      },
      months4to6: {
        title: "Build real projects",
        actions: [
          "Build 1-2 small robotics projects (line follower, simple arm)",
          "Learn basic mechanical design concepts",
          "Join or start a robotics club project",
        ],
      },
      months7to12: {
        title: "Go deeper",
        actions: [
          "Take part in a robotics competition or hackathon",
          "Learn basic control systems concepts",
          "Document your builds as a portfolio",
        ],
        milestone: "Complete and demo a working robotics project",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A B.Tech in Mechanical, Electronics, or Mechatronics from a solid mid-tier college, paired with hands-on project work and competitions, matters more than an elite-tier institute alone.",
      estimatedCostInrLakh: [3, 8],
      expensiveAlternative: "A high-fee private engineering college with no lab access or project culture",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 8, year5: 14, year10: 26 },
    futureOutlook:
      "Robotics and automation are growing fields as manufacturing, logistics, and consumer robotics expand. It requires combining hardware and software skills, which keeps it relatively resistant to being automated away by software alone.",
    commonMistakes: [
      "Focusing only on theory without building physical projects",
      "Choosing an expensive college purely for its name instead of lab access and project culture",
      "Not developing programming skills alongside the mechanical/electronics side",
    ],
    aiRisk: "low",
  },
  {
    careerId: "game_developer",
    name: "Game Developer",
    primarySignals: ["creative", "technical"],
    interestTags: ["games"],
    streamFit: "Any stream with some Maths works; BCA, BSc CS/IT, or a specialized game development program.",
    fitReason:
      "This fits a profile that blends creative and technical thinking — game development rewards original ideas about what makes something fun, paired with the discipline to actually build and ship it as working code.",
    dayInTheLife:
      "You build the code, mechanics, and sometimes art or level design behind a game — turning gameplay ideas into something players can actually interact with.",
    skillsToBuild: [
      "Programming (C# or C++)",
      "A game engine (Unity or Unreal)",
      "Game design fundamentals",
      "Basic maths for game logic (vectors, physics)",
      "2D/3D asset basics",
    ],
    learningPath: {
      months1to3: {
        title: "Learn the fundamentals",
        actions: [
          "Learn C# programming basics",
          "Start learning Unity through guided tutorials",
          "Study the basics of game design (mechanics, fun, feedback loops)",
        ],
      },
      months4to6: {
        title: "Build small games",
        actions: [
          "Build 2-3 small complete games (even simple ones)",
          "Learn basic game physics and collision handling",
          "Join a game jam to practice building under a deadline",
        ],
      },
      months7to12: {
        title: "Build a portfolio",
        actions: [
          "Build one polished, complete game as a portfolio centerpiece",
          "Publish your work publicly",
          "Look for internships or freelance game dev work",
        ],
        milestone: "Publish a complete, playable game",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA or BSc CS/IT plus a strong portfolio of finished games (built through game jams and self-study) is more valuable to studios than an expensive specialized game-design degree.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative:
        "A high-fee private 'game design' institute with weak industry placement and outdated tools",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 7, year5: 12, year10: 22 },
    futureOutlook:
      "Game development demand is steady, driven by mobile and indie gaming growth, though the industry is competitive and can have less job stability than other tech fields (project-based hiring, studio layoffs are common).",
    commonMistakes: [
      "Spending years on one ambitious game instead of finishing several small ones",
      "Learning game engines without learning the underlying programming fundamentals",
      "Underestimating how competitive and unstable studio hiring can be",
    ],
    aiRisk: "medium",
  },
]
```

- [ ] **Step 2: Self-check**

Count the array — confirm exactly 10 entries, one per `careerId` listed in `reference/PRODUCT.md`'s candidate career list (Software Engineer, AI Engineer, Cybersecurity Analyst, Cloud Engineer, Data Scientist, UI/UX Designer, Product Manager, DevOps Engineer, Robotics Engineer, Game Developer).

---

### Task 6: Profile summary generator

**Files:**
- Create: `services/ai/mock/profile-summary.ts`

**Interfaces:**
- Consumes: `SignalCategory`, `ProfileSummary` from `lib/blueprint/types.ts` (Task 1)
- Produces: `buildProfileSummary(studentName: string, signalMap: Record<SignalCategory, number>): ProfileSummary`

- [ ] **Step 1: Write the generator**

Archetype is picked from the single highest-scoring signal category; strengths are drawn from the top 2 categories' libraries (2 from the top category, 1 from the second); watch-outs are drawn from the lowest 2 categories.

```ts
// services/ai/mock/profile-summary.ts
import type { ProfileSummary, SignalCategory } from "@/lib/blueprint/types"

type Archetype = { name: string; narrative: (studentName: string) => string }

const ARCHETYPES: Record<SignalCategory, Archetype> = {
  technical: {
    name: "The Systems Builder",
    narrative: (studentName) =>
      `${studentName} shows a clear tilt toward structured, technical work over people-heavy or highly creative roles. The strongest signal is in technical and systems thinking, which fits careers where logic, process, and reliability matter more than charisma or persuasion. ${studentName} is likely to do best in practical tech roles that reward consistency, problem-solving, and learning by building.`,
  },
  creative: {
    name: "The Creative Technologist",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward inventive, visual, and expressive work rather than purely structured or numbers-heavy roles. This usually fits careers where original thinking, design sense, and communicating ideas clearly matter as much as technical execution. ${studentName} is likely to do best in roles that mix creative problem-solving with hands-on building.`,
  },
  scientific: {
    name: "The Analytical Explorer",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward investigating, testing, and understanding how things work at a deeper level. This fits careers built on research, data, and evidence-based thinking rather than pure execution or persuasion. ${studentName} is likely to do best in roles that reward curiosity, rigor, and patient problem-solving.`,
  },
  empathy: {
    name: "The People-First Problem Solver",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward understanding and helping people, more than working alone with pure logic or numbers. This fits careers where communication, user understanding, and collaboration matter as much as technical skill. ${studentName} is likely to do best in roles that combine technical work with real interaction with people.`,
  },
  commercial: {
    name: "The Strategic Operator",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward practical, results-driven thinking — understanding what works, what's worth doing, and how to get it done efficiently. This fits careers where judgement, prioritization, and business sense matter as much as raw technical skill. ${studentName} is likely to do best in roles that connect technical work to real outcomes and decisions.`,
  },
  entrepreneurial: {
    name: "The Builder-Founder",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward ownership, initiative, and building things end-to-end rather than following a fixed process. This fits careers, or eventually ventures, where independent thinking, risk tolerance, and driving something forward matter as much as technical depth. ${studentName} is likely to do best in roles with real autonomy and room to build.`,
  },
}

const STRENGTH_LIBRARY: Record<SignalCategory, { title: string; detail: string }[]> = {
  technical: [
    {
      title: "Logical problem-solving",
      detail:
        "You're comfortable with structured tasks that have clear rules and outputs — valuable in coding, testing, and technical operations.",
    },
    {
      title: "Comfort with systems and processes",
      detail:
        "You tend to do well where reliability, documentation, and step-by-step execution matter more than persuasion or improvisation.",
    },
  ],
  creative: [
    {
      title: "Original thinking",
      detail:
        "You naturally generate ideas and enjoy shaping how something looks, feels, or works — a real asset in design and product-adjacent roles.",
    },
    {
      title: "Comfort with ambiguity",
      detail:
        "You're able to work through loosely-defined problems where there's no single right answer, which suits creative and design work.",
    },
  ],
  scientific: [
    {
      title: "Analytical rigor",
      detail: "You enjoy digging into how and why something works, which suits research-heavy and data-driven roles.",
    },
    {
      title: "Patience with detail",
      detail:
        "You're comfortable spending real time testing and verifying before drawing conclusions — valuable in data and engineering roles alike.",
    },
  ],
  empathy: [
    {
      title: "Understanding people",
      detail:
        "You pick up on what others need or struggle with, which is valuable in design, product, and any people-facing technical role.",
    },
    {
      title: "Clear communication",
      detail: "You're able to explain your thinking to others, which matters more in tech careers than most people expect.",
    },
  ],
  commercial: [
    {
      title: "Practical judgement",
      detail: "You think in terms of what's actually worth doing, which is useful in prioritization-heavy roles like product and operations.",
    },
    {
      title: "Resourcefulness",
      detail: "You tend to find efficient paths to a goal rather than the most elaborate one, which keeps projects moving.",
    },
  ],
  entrepreneurial: [
    {
      title: "Initiative",
      detail: "You're comfortable taking ownership without being told exactly what to do — valuable in fast-moving teams and startups.",
    },
    {
      title: "Risk tolerance",
      detail: "You're willing to try things that might not work, which suits builder-heavy, less structured environments.",
    },
  ],
}

const WATCHOUT_LIBRARY: Record<SignalCategory, { title: string; detail: string }> = {
  technical: {
    title: "Lower technical signal",
    detail:
      "Don't avoid technical work entirely — build basic comfort with logic and structured problem-solving through small guided exercises, since most tech careers need at least a working baseline.",
  },
  creative: {
    title: "Lower creative signal",
    detail:
      "Choose roles with clear structure instead of forcing yourself into open-ended design or branding work — use templates and proven processes rather than starting from a blank page.",
  },
  scientific: {
    title: "Lower research/analytical signal",
    detail:
      "Favor roles that apply existing methods over ones that require deep independent research — build comfort with data gradually rather than diving into heavy analysis first.",
  },
  empathy: {
    title: "Lower communication and empathy signal",
    detail:
      "Don't avoid communication entirely — build basic workplace communication through daily written updates, presentation practice, and explaining technical work simply.",
  },
  commercial: {
    title: "Lower business/commercial signal",
    detail:
      "Lean on roles with clear technical scope rather than ones requiring heavy client or stakeholder judgement calls — that instinct builds with experience over time.",
  },
  entrepreneurial: {
    title: "Lower creative and entrepreneurial drive",
    detail:
      "Choose roles with clear structure instead of forcing yourself into startup chaos or founder-style ambiguity — use templates, SOPs, and proven learning paths.",
  },
}

export const buildProfileSummary = (
  studentName: string,
  signalMap: Record<SignalCategory, number>
): ProfileSummary => {
  const ranked = (Object.entries(signalMap) as [SignalCategory, number][]).sort((a, b) => b[1] - a[1])

  const topCategory = ranked[0][0]
  const secondCategory = ranked[1][0]
  const lowestTwo = ranked.slice(-2).map(([category]) => category)

  const archetype = ARCHETYPES[topCategory]
  const strengths = [...STRENGTH_LIBRARY[topCategory], STRENGTH_LIBRARY[secondCategory][0]]
  const watchOuts = lowestTwo.map((category) => WATCHOUT_LIBRARY[category])

  return {
    archetype: archetype.name,
    narrative: archetype.narrative(studentName),
    strengths,
    watchOuts,
    signalMap,
  }
}
```

- [ ] **Step 2: Self-check**

Confirm `strengths` always has exactly 3 entries and `watchOuts` always has exactly 2, per the `ProfileSummary` contract from Task 1 — trace through: `STRENGTH_LIBRARY[topCategory]` contributes 2, plus `STRENGTH_LIBRARY[secondCategory][0]` contributes 1, for 3 total; `lowestTwo` is always length 2 since `CATEGORIES` (Task 4) has 6 entries.

---

### Task 7: Mock blueprint service orchestrator

**Files:**
- Create: `services/ai/mock-blueprint-service.ts`

**Interfaces:**
- Consumes: `BlueprintService`, `BlueprintInput` (Task 3); `computeSignalMap` (Task 4); `CAREER_CATALOG`, `CareerCatalogEntry` (Task 5); `buildProfileSummary` (Task 6); `Blueprint`, `CareerMatch`, `SignalCategory` (Task 1)
- Produces: `mockBlueprintService: BlueprintService` — this is what Task 8 imports and calls.

- [ ] **Step 1: Write the orchestrator**

```ts
// services/ai/mock-blueprint-service.ts
import type { Blueprint, CareerMatch, SignalCategory } from "@/lib/blueprint/types"
import type { BlueprintInput, BlueprintService } from "./blueprint-service"
import { CAREER_CATALOG, type CareerCatalogEntry } from "./mock/career-catalog"
import { buildProfileSummary } from "./mock/profile-summary"
import { computeSignalMap } from "./mock/signal-scoring"

const scoreCareer = (
  entry: CareerCatalogEntry,
  signalMap: Record<SignalCategory, number>,
  techInterests: string[]
): number => {
  const signalScore =
    entry.primarySignals.reduce((sum, category) => sum + signalMap[category], 0) / entry.primarySignals.length

  const interestMatches = entry.interestTags.filter((tag) => techInterests.includes(tag)).length
  const interestScore = entry.interestTags.length ? (interestMatches / entry.interestTags.length) * 100 : 0

  return signalScore * 0.6 + interestScore * 0.4
}

const buildCareerMatch = (entry: CareerCatalogEntry, matchPercent: number, isRecommended: boolean): CareerMatch => ({
  careerId: entry.careerId,
  name: entry.name,
  matchPercent,
  isRecommended,
  aiRisk: entry.aiRisk,
  streamFit: entry.streamFit,
  whyItFits: entry.fitReason,
  dayInTheLife: entry.dayInTheLife,
  skillsToBuild: entry.skillsToBuild,
  learningPath: entry.learningPath,
  collegeGuidance: entry.collegeGuidance,
  salaryProgressionInrLakh: entry.salaryProgressionInrLakh,
  futureOutlook: entry.futureOutlook,
  commonMistakes: entry.commonMistakes,
})

export const mockBlueprintService: BlueprintService = {
  async generate({ answers, studentName }: BlueprintInput): Promise<Blueprint> {
    const signalMap = computeSignalMap(answers)
    const techInterests = Array.isArray(answers.tech_interests) ? (answers.tech_interests as string[]) : []

    const ranked = CAREER_CATALOG.map((entry) => ({
      entry,
      score: scoreCareer(entry, signalMap, techInterests),
    }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    const careers = ranked.map(({ entry, score }, index) => buildCareerMatch(entry, Math.round(score), index === 0))

    return {
      version: 1,
      generatedAt: new Date().toISOString(),
      studentName,
      profile: buildProfileSummary(studentName, signalMap),
      careers,
    }
  },
}
```

- [ ] **Step 2: Self-check**

Confirm the contract invariants from the spec hold by reading the code: `careers` always has exactly 3 entries (`.slice(0, 3)` over a 10-entry catalog), and exactly one has `isRecommended: true` (`index === 0` after sorting descending by score).

---

### Task 8: Wire into the assessment flow

**Files:**
- Modify: `components/assessment/assessment-flow.tsx:1-16` (imports), `:114-125` (`submit` function)
- Modify: `components/assessment/confirmation-screen.tsx` (full file — copy + icon)

**Interfaces:**
- Consumes: `mockBlueprintService` (Task 7), `saveBlueprint` (Task 2)

- [ ] **Step 1: Update imports in `assessment-flow.tsx`**

Add two imports alongside the existing ones (after the `lib/assessment/types` import, before the local component imports):

```tsx
import { saveBlueprint } from "@/lib/blueprint/storage"
import { mockBlueprintService } from "@/services/ai/mock-blueprint-service"
```

- [ ] **Step 2: Make `submit` async and call the service**

Replace the current `submit` function (currently lines 114–125):

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

with:

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
    setStage("done")
  }
```

`LeadCaptureForm`'s `onSubmitted` prop type is `(lead: Lead) => void`, and its submit handler is `handleSubmit((values) => onSubmitted(values as Lead))` — since that arrow function returns whatever `onSubmitted` returns, passing an async `submit` here still works: `react-hook-form`'s `handleSubmit` awaits it, so the existing `isSubmitting` state (and the button's "Sending..." label) will correctly cover the mock's `generate()` call too. No changes needed in `lead-capture-form.tsx`.

- [ ] **Step 3: Update `confirmation-screen.tsx` copy**

The current copy promises a human advisor will email results within 24 hours — no longer true once a blueprint is generated immediately (even mocked). Swap the `MailCheck` icon for `CheckCircle2` (already used elsewhere in this flow, e.g. `teaser-screen.tsx`) since the message is no longer about email, and update the paragraph:

```tsx
"use client"

import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export const ConfirmationScreen = ({ name, onClose }: Props) => (
  <div className="flex flex-col gap-6 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
      <CheckCircle2 className="h-6 w-6" />
    </div>

    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {name ? `Thanks, ${name}!` : "Thanks!"}
      </h2>
      <p className="text-sm text-muted-foreground">
        We&apos;ve got your answers, and matched you to your top tech career paths based on
        them. We&apos;re putting the finishing touches on how you&apos;ll see the results —
        check back soon.
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

- [ ] **Step 4: Manually verify in the browser**

This is the one point in this plan where running something is appropriate — it's testing the actual feature end-to-end, not a lint/build/test loop.

1. Run `npm run dev`.
2. Open the site, trigger the assessment modal (e.g. "Start Free Test" in the header).
3. Click through all 18 questions with any answers, reach the teaser screen, click through to lead capture, and submit the form with a test name/email/phone.
4. Confirm the confirmation screen shows the new copy (no "24 hours" or "advisor" language) and a green checkmark icon.
5. Open browser dev tools → Application → Local Storage, and confirm a `coacheepro.blueprint.v1` key now holds a JSON blueprint with `careers` (array of 3, exactly one `isRecommended: true`) and a `profile` (archetype, narrative, 3 strengths, 2 watch-outs, 6-category signal map).
6. Try at least two different answer combinations (e.g. one leaning `ai_ml`/`data` + high `coding_comfort`, another leaning `design`/`making_look_good`) and confirm the top-3 careers and archetype actually differ between them — this is the check that the scoring is doing real work, not returning the same result regardless of input.

---

## Summary of what this plan does not cover

Per the spec's "Not in this spec" section: auth/signup, the actual Blueprint dashboard UI (see `reference/BLUEPRINT_UI_REFERENCE.md` for that later work), free/paid gating, payment, PDF export, named learning resources, and the "Next 7 days" checklist. All deferred to later sub-projects.

Once the user is ready to commit this work: run `npm run lint` and `npm run build` once, fix anything they surface, then stage and commit — not before, and not automatically.
