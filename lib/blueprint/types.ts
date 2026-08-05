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
