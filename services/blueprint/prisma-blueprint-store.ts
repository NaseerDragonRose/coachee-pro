import "server-only"

import type { CareerMatch, ProfileSummary } from "@/lib/blueprint/types"
import type { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/services/db/prisma"

import type { BlueprintStore, NewBlueprint, StoredBlueprint } from "./blueprint-store"

// The narrative half of CareerMatch — everything except the three fields that
// get real columns because they're what the outcome-data moat aggregates on
// (see reference/DATABASE_DECISIONS.md, "What's a column vs. what's JSONB").
type CareerContent = Omit<CareerMatch, "careerId" | "matchPercent" | "isRecommended">

const toContent = (career: CareerMatch): CareerContent => {
  // Written as a subtraction rather than a field list so adding a field to
  // CareerMatch stores it automatically instead of silently dropping it.
  const content: Partial<CareerMatch> = { ...career }
  delete content.careerId
  delete content.matchPercent
  delete content.isRecommended

  return content as CareerContent
}

const SELECT = {
  id: true,
  assessmentId: true,
  contentVersion: true,
  profileSummary: true,
  paidAt: true,
  createdAt: true,
  user: { select: { name: true } },
  careers: {
    select: { careerId: true, matchPercent: true, isRecommended: true, content: true },
    // The generator emits the recommended career first, then descending match.
    // Reproduce that here so the dashboard's default tab is stable.
    orderBy: [{ isRecommended: "desc" }, { matchPercent: "desc" }],
  },
} satisfies Prisma.BlueprintSelect

type BlueprintRow = Prisma.BlueprintGetPayload<{ select: typeof SELECT }>

// Prisma types every Json column as effectively `any`, so the shapes have to be
// asserted back on the way out. It's a contract we own end to end — nothing
// else writes these rows (reference/DATABASE_DECISIONS.md, "JSONB shapes").
const toCareerMatch = (row: BlueprintRow["careers"][number]): CareerMatch => ({
  careerId: row.careerId,
  matchPercent: row.matchPercent,
  isRecommended: row.isRecommended,
  ...(row.content as CareerContent),
})

// studentName isn't a blueprint column — the user row is its authoritative
// source, and duplicating it would let the two drift the moment someone edits
// their name.
const toStored = (row: BlueprintRow): StoredBlueprint => ({
  id: row.id,
  assessmentId: row.assessmentId,
  paidAt: row.paidAt?.toISOString() ?? null,
  blueprint: {
    version: 1,
    generatedAt: row.createdAt.toISOString(),
    studentName: row.user.name,
    profile: row.profileSummary as ProfileSummary,
    careers: row.careers.map(toCareerMatch),
  },
})

export const prismaBlueprintStore: BlueprintStore = {
  async create({ assessmentId, userId, blueprint }: NewBlueprint): Promise<StoredBlueprint> {
    const created = await prisma.blueprint.create({
      data: {
        userId,
        assessmentId,
        contentVersion: blueprint.version,
        profileSummary: blueprint.profile,
        careers: {
          create: blueprint.careers.map((career) => ({
            careerId: career.careerId,
            matchPercent: career.matchPercent,
            isRecommended: career.isRecommended,
            content: toContent(career),
          })),
        },
      },
      select: SELECT,
    })

    return toStored(created)
  },

  async findForUserByAssessment(assessmentId: string, userId: string): Promise<StoredBlueprint | null> {
    // userId is part of the WHERE, not a check afterwards — someone else's
    // blueprint and a nonexistent one both come back null.
    const row = await prisma.blueprint.findFirst({
      where: { assessmentId, userId },
      orderBy: { createdAt: "desc" },
      select: SELECT,
    })

    return row && row.contentVersion === 1 ? toStored(row) : null
  },

  async findLatestForUser(userId: string): Promise<StoredBlueprint | null> {
    const row = await prisma.blueprint.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: SELECT,
    })

    if (!row) return null

    // Only one content version exists so far. When a v2 lands, this is where
    // the upgrade path goes — refusing to render is better than rendering a
    // shape the components don't understand.
    if (row.contentVersion !== 1) return null

    return toStored(row)
  },
}
