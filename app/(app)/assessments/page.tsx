import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { AssessmentCard } from "@/components/assessments/assessment-card"
import { DraftCard } from "@/components/assessments/draft-card"
import { ProfilePrompt } from "@/components/assessments/profile-prompt"
import { StartNewCard } from "@/components/assessments/start-new-card"
import { authOptions } from "@/services/auth/auth-options"
import { prismaAssessmentStore } from "@/services/assessment/prisma-assessment-store"
import { prismaUserStore } from "@/services/user/prisma-user-store"

export default async function AssessmentsPage() {
  const session = await getServerSession(authOptions)

  // The (app) layout already gates this; without the narrowing there's no id
  // to query with.
  if (!session?.user?.id) redirect("/")

  // A valid session whose User row is missing would otherwise redirect to "/",
  // which `proxy.ts` sends straight back here — an infinite loop. The session
  // is signed by us and carries the same name and email the sign-in callback
  // would have written, so the honest recovery is to rewrite the row rather
  // than bounce. Reachable whenever a session outlives its user row.
  let user = await prismaUserStore.findById(session.user.id)

  if (!user) {
    await prismaUserStore.upsertFromAuth({
      id: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "",
    })
    user = await prismaUserStore.findById(session.user.id)
  }

  // Still nothing means the write itself is failing; signing out clears the
  // stale cookie instead of looping on it.
  if (!user) redirect("/api/auth/signout")

  const assessments = await prismaAssessmentStore.listForUser(session.user.id)
  const draft = assessments.find((assessment) => assessment.status === "DRAFT") ?? null
  const completed = assessments.filter((assessment) => assessment.status === "COMPLETED")

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Your Assessments
        </h1>
        <p className="text-sm text-muted-foreground">
          {assessments.length === 0
            ? "Nothing here yet — your first assessment takes about 10 minutes."
            : draft
              ? "Finish what you started, or begin again."
              : `${completed.length} completed, newest first.`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {draft && <DraftCard assessment={draft} />}

        {completed.map((assessment) => (
          <AssessmentCard key={assessment.id} assessment={assessment} />
        ))}

        <StartNewCard draftId={draft?.id ?? null} hasCompleted={completed.length > 0} />
      </div>

      {/* A nudge, not a gate — the assessment is reachable without it. */}
      {!user.consentedAt && <ProfilePrompt name={user.name} />}
    </div>
  )
}
