import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getServerSession } from "next-auth/next"

import { DashboardView } from "@/components/dashboard/dashboard-view"
import { authOptions } from "@/services/auth/auth-options"
import { prismaBlueprintStore } from "@/services/blueprint/prisma-blueprint-store"

// The blueprint is addressed by assessment id, so a student who retakes the
// assessment keeps both results at stable URLs instead of the newer one
// replacing the older.
//
// There's no localStorage fallback here: an id in the URL is a claim about a
// stored row, so if there's no row to back it there is nothing to show.
export default async function AssessmentBlueprintPage({ params }: Props) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  // The (app) layout already redirects unauthenticated visitors; this is the
  // type narrowing, not the gate.
  if (!session?.user?.id) notFound()

  const stored = await prismaBlueprintStore.findForUserByAssessment(id, session.user.id)
  if (!stored) notFound()

  return (
    <>
      {/* A bare text link here read as page furniture under the floating
          header. Given a border and a surface it reads as a control, and the
          arrow shifts left on hover to say which way it goes. */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
        <Link
          href="/assessments"
          className="group inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 pr-5 pl-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-[color,border-color,box-shadow] hover:border-indigo-500/40 hover:text-indigo-600 hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
          All Assessments
        </Link>
      </div>

      <DashboardView blueprint={stored.blueprint} paidAt={stored.paidAt} />
    </>
  )
}

type Props = {
  params: Promise<{ id: string }>
}
