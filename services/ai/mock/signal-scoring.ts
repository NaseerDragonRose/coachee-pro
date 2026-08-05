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
