import type { QuestionnaireEntry } from "@/lib/assessment/questionnaire"
import type { Answers } from "@/lib/assessment/types"

/**
 * Mirrors the `AssessmentStatus` enum in prisma/schema.prisma. Declared as a
 * union rather than imported from lib/generated/prisma so this file stays on
 * the vendor-free side of the boundary (CLAUDE.md, "Module boundaries"). The
 * Prisma implementation assigning one to the other is what makes drift a
 * compile error.
 */
export type AssessmentStatusValue = "DRAFT" | "COMPLETED"

export type StoredAssessment = {
  id: string
  userId: string
  status: AssessmentStatusValue
  /** The live answer map, rewritten on every autosave. */
  answers: Answers
  /** Where the student stopped, so a new device can resume. */
  currentScreenId: string | null
  /**
   * The presentation snapshot, frozen at completion. Null means not completed
   * — the two are exactly equivalent, which is why it isn't merged into
   * `answers`. See reference/DATABASE_DECISIONS.md.
   */
  questionnaire: QuestionnaireEntry[] | null
  startedAt: string
  completedAt: string | null
}

/**
 * What the list view needs, and nothing more — never the questionnaire, which
 * is the largest column in the schema and useless in a list.
 */
export type AssessmentSummary = {
  id: string
  status: AssessmentStatusValue
  startedAt: string
  completedAt: string | null
  /**
   * Present only for drafts. Carries the answers and position as well as the
   * progress counter so the page can seed the modal from the list it already
   * fetched — there is deliberately no second query to re-read a draft that
   * `listForUser` just returned.
   */
  draft: {
    progress: { current: number; total: number }
    answers: Answers
    currentScreenId: string | null
  } | null
  /** Absent until the assessment is completed and its blueprint generated. */
  blueprint: {
    id: string
    paidAt: string | null
    careerCount: number
    recommended: { careerId: string; name: string; matchPercent: number } | null
  } | null
}

export interface AssessmentStore {
  /**
   * Deletes any existing draft and opens a new one, atomically. A student can
   * only hold one draft at a time, enforced by a partial unique index.
   */
  createDraft(userId: string): Promise<StoredAssessment>

  /** Fire-and-forget autosave. False when the row isn't an owned draft. */
  saveDraft(input: {
    id: string
    userId: string
    answers: Answers
    screenId: string | null
  }): Promise<boolean>

  /**
   * Deletes the draft outright. Only ever removes a `DRAFT`, which by
   * definition has no blueprint attached, so nothing is orphaned.
   */
  discard(id: string, userId: string): Promise<boolean>

  /** Null when the row isn't an owned draft, which includes a double-submit. */
  complete(input: {
    id: string
    userId: string
    questionnaire: QuestionnaireEntry[]
    questionSetVersion: string
  }): Promise<StoredAssessment | null>

  /** Ownership is part of the lookup, so "not yours" and "gone" are the same. */
  findById(id: string, userId: string): Promise<StoredAssessment | null>

  /** Newest first. */
  listForUser(userId: string): Promise<AssessmentSummary[]>
}
