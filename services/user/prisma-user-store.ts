import "server-only"

import { prisma } from "@/services/db/prisma"

import type { StoredUser, UserStore } from "./user-store"

type UserRow = {
  id: string
  email: string
  name: string
  phone: string | null
  consentedAt: Date | null
}

const toStored = (row: UserRow): StoredUser => ({
  id: row.id,
  email: row.email,
  name: row.name,
  phone: row.phone,
  consentedAt: row.consentedAt?.toISOString() ?? null,
})

const SELECT = {
  id: true,
  email: true,
  name: true,
  phone: true,
  consentedAt: true,
}

export const prismaUserStore: UserStore = {
  // Deliberately lets a unique-constraint violation on `email` propagate: it
  // means a Cognito `sub` changed under an address we already hold, and the
  // caller fails the sign-in either way. Merging the two accounts silently is
  // how someone ends up reading a stranger's blueprint.
  // See reference/DATABASE_DECISIONS.md, open questions.
  upsertFromAuth: async ({ id, email, name }) => {
    await prisma.user.upsert({
      where: { id },
      // Name and email can change upstream (a student edits their Google
      // profile), so the update is not a no-op.
      update: { email, name },
      create: { id, email, name },
    })
  },

  findById: async (id) => {
    const row = await prisma.user.findUnique({ where: { id }, select: SELECT })
    return row ? toStored(row) : null
  },

  completeProfile: async ({ id, name, phone }) => {
    await prisma.user.update({
      where: { id },
      data: { name, phone, consentedAt: new Date() },
    })
  },
}
