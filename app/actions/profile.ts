"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

import { profileSchema } from "@/lib/assessment/schema"
import { authOptions } from "@/services/auth/auth-options"
import { prismaUserStore } from "@/services/user/prisma-user-store"

export type ProfileResult =
  | { ok: true }
  | {
      ok: false
      reason: "invalid" | "unauthenticated" | "failed"
      /** Keyed by field name, for rendering errors next to their input. */
      fieldErrors?: Record<string, string>
    }

/**
 * Runs once per account, immediately after the first Google sign-in. Google
 * supplies name and email; this collects the phone number and the contact
 * consent, which nothing else can give us.
 */
export const completeProfile = async (input: unknown): Promise<ProfileResult> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { ok: false, reason: "unauthenticated" }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, reason: "invalid", fieldErrors }
  }

  try {
    await prismaUserStore.completeProfile({
      id: session.user.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
    })

    revalidatePath("/assessments")
    return { ok: true }
  } catch (error) {
    console.error("Failed to complete profile:", error)
    return { ok: false, reason: "failed" }
  }
}
