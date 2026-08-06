import type { Blueprint } from "@/lib/blueprint/types"

export type NewBlueprint = {
  assessmentId: string
  userId: string
  blueprint: Blueprint
}

export type StoredBlueprint = {
  id: string
  /** The assessment it was generated from — this is what the URL carries. */
  assessmentId: string
  blueprint: Blueprint
  /** Null while the blueprint is still on the free preview. */
  paidAt: string | null
}

export interface BlueprintStore {
  /**
   * Persists the blueprint generated for a just-completed assessment. There is
   * no claim step and no ownership to reconcile — the assessment has belonged
   * to this user since its first question.
   */
  create(input: NewBlueprint): Promise<StoredBlueprint>

  /**
   * Both arguments are part of the lookup, not a lookup plus a check — an
   * assessment belonging to someone else is indistinguishable from one that
   * doesn't exist, so the route can't be used to probe for valid ids.
   */
  findForUserByAssessment(assessmentId: string, userId: string): Promise<StoredBlueprint | null>

  findLatestForUser(userId: string): Promise<StoredBlueprint | null>
}
