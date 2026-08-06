"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

import { pruneAnswers } from "@/lib/assessment/flow"
import { toAnswerMap, toQuestionnaire } from "@/lib/assessment/questionnaire"
import { QUESTION_SET_VERSION } from "@/lib/assessment/questions"
import { answersSchema } from "@/lib/assessment/schema"
import { mockBlueprintService } from "@/services/ai/mock-blueprint-service"
import type { StoredAssessment } from "@/services/assessment/assessment-store"
import { prismaAssessmentStore } from "@/services/assessment/prisma-assessment-store"
import { authOptions } from "@/services/auth/auth-options"
import { prismaBlueprintStore } from "@/services/blueprint/prisma-blueprint-store"
import { prismaUserStore } from "@/services/user/prisma-user-store"

export type StartResult =
  | { ok: true; assessment: StoredAssessment }
  | { ok: false; reason: "unauthenticated" | "failed" }

export type DiscardResult = { ok: boolean }

export type CompleteResult =
  | { ok: true; assessmentId: string }
  | { ok: false; reason: "invalid" | "unauthenticated" | "not-found" | "failed" }

const currentUserId = async (): Promise<string | null> => {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

/**
 * Opens a fresh assessment, deleting any draft the student already had. The
 * row exists from the first question, so there is no anonymous window and
 * nothing to claim later.
 */
export const startAssessment = async (): Promise<StartResult> => {
  const userId = await currentUserId()
  if (!userId) return { ok: false, reason: "unauthenticated" }

  try {
    return { ok: true, assessment: await prismaAssessmentStore.createDraft(userId) }
  } catch (error) {
    console.error("Failed to start assessment:", error)
    return { ok: false, reason: "failed" }
  }
}

/**
 * Debounced autosave. Deliberately returns nothing: when the row isn't an
 * owned draft the update matches zero rows and that is the whole outcome —
 * there is no caller to tell and nothing it could usefully do.
 */
export const saveAssessmentDraft = async (input: unknown): Promise<void> => {
  const userId = await currentUserId()
  if (!userId) return

  const { id, answers, screenId } = (input ?? {}) as {
    id?: unknown
    answers?: unknown
    screenId?: unknown
  }

  if (typeof id !== "string" || id.length === 0) return
  if (screenId !== null && typeof screenId !== "string") return

  const parsed = answersSchema.safeParse(answers)
  if (!parsed.success) return

  try {
    await prismaAssessmentStore.saveDraft({ id, userId, answers: parsed.data, screenId })
  } catch (error) {
    // An autosave failure must not interrupt the student mid-question; the
    // next keystroke schedules another one.
    console.error("Failed to save assessment draft:", error)
  }
}

/** Archives a draft. The row survives; it just stops being the student's. */
export const discardAssessment = async (id: unknown): Promise<DiscardResult> => {
  const userId = await currentUserId()
  if (!userId) return { ok: false }
  if (typeof id !== "string" || id.length === 0) return { ok: false }

  try {
    const ok = await prismaAssessmentStore.discard(id, userId)
    if (ok) revalidatePath("/assessments")
    return { ok }
  } catch (error) {
    console.error("Failed to discard assessment:", error)
    return { ok: false }
  }
}

/**
 * Freezes the snapshot, generates the blueprint and persists it. Generation
 * reads only what's stored — a client-supplied blueprint is never accepted.
 */
export const completeAssessment = async (id: unknown): Promise<CompleteResult> => {
  if (typeof id !== "string" || id.length === 0) return { ok: false, reason: "invalid" }

  const userId = await currentUserId()
  if (!userId) return { ok: false, reason: "unauthenticated" }

  try {
    const draft = await prismaAssessmentStore.findById(id, userId)
    if (!draft || draft.status !== "DRAFT") return { ok: false, reason: "not-found" }

    const pruned = pruneAnswers(draft.answers)
    const questionnaire = toQuestionnaire(pruned)
    if (questionnaire.length === 0) return { ok: false, reason: "invalid" }

    // `status: DRAFT` is part of the update's filter, so a double-submit
    // returns null here rather than writing a second blueprint.
    const completed = await prismaAssessmentStore.complete({
      id,
      userId,
      questionnaire,
      questionSetVersion: QUESTION_SET_VERSION,
    })
    if (!completed) return { ok: false, reason: "not-found" }

    const user = await prismaUserStore.findById(userId)

    await prismaBlueprintStore.create({
      assessmentId: id,
      userId,
      blueprint: await mockBlueprintService.generate({
        answers: toAnswerMap(questionnaire),
        studentName: user?.name ?? "there",
      }),
    })

    revalidatePath("/assessments")
    return { ok: true, assessmentId: id }
  } catch (error) {
    console.error("Failed to complete assessment:", error)
    return { ok: false, reason: "failed" }
  }
}
