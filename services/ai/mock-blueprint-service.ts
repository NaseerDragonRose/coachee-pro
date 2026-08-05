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
