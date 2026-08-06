// The `assessments.questionnaire` JSONB contract — see
// reference/DATABASE_DECISIONS.md, "questionnaire is a snapshot, not an
// answer map".
//
// A flat Record<questionId, answer> is a *reference* into a question set that
// will keep changing. Snapshotting the prompt and the option labels as they
// were presented is what keeps a two-year-old assessment readable, and what
// lets the AI see "Stream: PCM" instead of "pcm".
import { hasContent, visibleQuestions } from "./flow.ts"
import type { AnswerValue, Answers, AreaId, Option, Question } from "./types.ts"

export type QuestionnaireEntry = {
  questionId: string
  area: AreaId
  type: Question["type"]
  prompt: string
  /** As presented. Absent for text and scale questions. */
  options?: Option[]
  /** Endpoint meaning for scale questions, which options can't carry. */
  scale?: { min: number; max: number; minLabel: string; maxLabel: string }
  answer: {
    /** Exactly what the flow held — ids for choices, text for text, number for scale. */
    raw: AnswerValue
    /** Human-readable rendering of `raw`, in answered order. */
    labels: string[]
  }
}

const optionsOf = (question: Question): Option[] | undefined => {
  if (question.type === "choice" || question.type === "multi") return question.options
  if (question.type === "ranking") return question.items
  return undefined
}

const labelsFor = (question: Question, value: AnswerValue): string[] => {
  const options = optionsOf(question)
  if (!options) return [String(value).trim()]

  const ids = Array.isArray(value) ? value : [String(value)]
  // A resumed draft can carry an option id that no longer exists. Keep the id
  // rather than dropping the answer — a stale label beats a silent hole.
  return ids.map((id) => options.find((option) => option.id === id)?.label ?? id)
}

const toEntry = (question: Question, value: AnswerValue): QuestionnaireEntry => ({
  questionId: question.id,
  area: question.area,
  type: question.type,
  prompt: question.prompt,
  ...(optionsOf(question) && { options: optionsOf(question) }),
  ...(question.type === "scale" && {
    scale: {
      min: question.min,
      max: question.max,
      minLabel: question.minLabel,
      maxLabel: question.maxLabel,
    },
  }),
  answer: { raw: value, labels: labelsFor(question, value) },
})

/** Builds the snapshot, in presentation order, skipping unanswered optionals. */
export const toQuestionnaire = (answers: Answers): QuestionnaireEntry[] =>
  visibleQuestions(answers)
    .filter((question) => hasContent(answers[question.id]))
    .map((question) => toEntry(question, answers[question.id] as AnswerValue))

/**
 * Projects the snapshot back to the flat map the scoring code reads. This is
 * deliberately a projection and not a second stored column — two copies of the
 * same answers drift.
 */
export const toAnswerMap = (questionnaire: QuestionnaireEntry[]): Answers =>
  Object.fromEntries(questionnaire.map((entry) => [entry.questionId, entry.answer.raw]))
