import { QUESTIONS } from "./questions.ts"
import type { AnswerValue, Answers, Question, Screen } from "./types.ts"

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

/** Whether a value was actually filled in, ignoring whether it had to be. */
export const hasContent = (value: AnswerValue | undefined): boolean => {
  if (value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export const isAnswered = (question: Question, answers: Answers): boolean =>
  question.optional || hasContent(answers[question.id])

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

/**
 * Position within the currently visible screens, for the in-progress card.
 * An unknown or missing screen id means the student hasn't moved past the
 * first screen, so it reads as 1 rather than 0.
 */
export const progressOf = (
  answers: Answers,
  screenId: string | null
): { current: number; total: number } => {
  const screens = visibleScreens(answers)
  const index = screenId ? screenIndexOf(screens, screenId) : -1

  return { current: (index >= 0 ? index : 0) + 1, total: screens.length }
}
