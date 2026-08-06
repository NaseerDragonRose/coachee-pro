import "server-only"

import { progressOf } from "@/lib/assessment/flow"
import type { QuestionnaireEntry } from "@/lib/assessment/questionnaire"
import { QUESTION_SET_VERSION } from "@/lib/assessment/questions"
import type { Answers } from "@/lib/assessment/types"
import { prisma } from "@/services/db/prisma"

import type {
  AssessmentStatusValue,
  AssessmentStore,
  AssessmentSummary,
  StoredAssessment,
} from "./assessment-store"

// Prisma types every Json column as effectively `any`, so the shape has to be
// asserted back on the way out. It's a contract we own end to end (nothing
// else writes these rows), documented in reference/DATABASE_DECISIONS.md.
type AssessmentRow = {
  id: string
  userId: string
  status: AssessmentStatusValue
  answers: unknown
  currentScreenId: string | null
  questionnaire: unknown
  startedAt: Date
  completedAt: Date | null
}

const toStored = (row: AssessmentRow): StoredAssessment => ({
  id: row.id,
  userId: row.userId,
  status: row.status,
  answers: (row.answers ?? {}) as Answers,
  currentScreenId: row.currentScreenId,
  questionnaire: (row.questionnaire as QuestionnaireEntry[] | null) ?? null,
  startedAt: row.startedAt.toISOString(),
  completedAt: row.completedAt?.toISOString() ?? null,
})

const SELECT = {
  id: true,
  userId: true,
  status: true,
  answers: true,
  currentScreenId: true,
  questionnaire: true,
  startedAt: true,
  completedAt: true,
}

export const prismaAssessmentStore: AssessmentStore = {
  createDraft: (userId) =>
    prisma.$transaction(async (tx) => {
      // Clearing the old draft first is what keeps the partial unique index
      // satisfiable. Both statements share one transaction so two concurrent
      // calls can't interleave into two live drafts.
      await tx.assessment.deleteMany({ where: { userId, status: "DRAFT" } })

      return toStored(
        await tx.assessment.create({
          data: { userId, answers: {}, questionSetVersion: QUESTION_SET_VERSION },
          select: SELECT,
        })
      )
    }),

  saveDraft: async ({ id, userId, answers, screenId }) => {
    const { count } = await prisma.assessment.updateMany({
      where: { id, userId, status: "DRAFT" },
      data: { answers, currentScreenId: screenId },
    })

    return count > 0
  },

  // `status: "DRAFT"` in the filter is load-bearing beyond ownership: it makes
  // it impossible for this to delete a completed assessment, which would take
  // a blueprint with it.
  discard: async (id, userId) => {
    const { count } = await prisma.assessment.deleteMany({
      where: { id, userId, status: "DRAFT" },
    })

    return count > 0
  },

  complete: async ({ id, userId, questionnaire, questionSetVersion }) => {
    // `status: "DRAFT"` in the filter is the double-submit guard: a second
    // call matches nothing rather than re-completing a finished assessment.
    const { count } = await prisma.assessment.updateMany({
      where: { id, userId, status: "DRAFT" },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        questionnaire,
        questionSetVersion,
      },
    })

    if (count === 0) return null

    const row = await prisma.assessment.findUnique({ where: { id }, select: SELECT })
    return row ? toStored(row) : null
  },

  findById: async (id, userId) => {
    // Ownership is part of the lookup rather than a check afterwards, so a
    // guessed id is indistinguishable from one that doesn't exist. No status
    // filter: discarded rows are deleted, so every row that exists is one the
    // student should see.
    const row = await prisma.assessment.findFirst({
      where: { id, userId },
      select: SELECT,
    })

    return row ? toStored(row) : null
  },

  listForUser: async (userId): Promise<AssessmentSummary[]> => {
    const rows = await prisma.assessment.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        answers: true,
        currentScreenId: true,
        blueprints: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            paidAt: true,
            _count: { select: { careers: true } },
            // The recommended career is the one line worth showing per row;
            // a partial unique index guarantees there's at most one.
            careers: {
              where: { isRecommended: true },
              take: 1,
              select: { careerId: true, matchPercent: true, content: true },
            },
          },
        },
      },
    })

    return rows.map((row) => {
      const blueprint = row.blueprints[0]
      const recommended = blueprint?.careers[0]
      const answers = (row.answers ?? {}) as Answers

      return {
        id: row.id,
        status: row.status,
        startedAt: row.startedAt.toISOString(),
        completedAt: row.completedAt?.toISOString() ?? null,
        draft:
          row.status === "DRAFT"
            ? {
                progress: progressOf(answers, row.currentScreenId),
                answers,
                currentScreenId: row.currentScreenId,
              }
            : null,
        blueprint: blueprint
          ? {
              id: blueprint.id,
              paidAt: blueprint.paidAt?.toISOString() ?? null,
              careerCount: blueprint._count.careers,
              recommended: recommended
                ? {
                    careerId: recommended.careerId,
                    name: (recommended.content as { name: string }).name,
                    matchPercent: recommended.matchPercent,
                  }
                : null,
            }
          : null,
      }
    })
  },
}
