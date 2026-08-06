import Link from "next/link"
import { ArrowRight, Lock, Sparkles } from "lucide-react"

import { cardHover, cardSurface } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AssessmentSummary } from "@/services/assessment/assessment-store"

import { formatDate } from "./format-date"

// Completed assessments only — the page renders drafts through DraftCard, so
// `completedAt` is never null by the time this runs.
//
// The card isn't a link. View is the click target, matching DraftCard's
// Continue, so both rows behave the same way. The card still takes the shared
// hover; the cursor is what marks the actual target.
export const AssessmentCard = ({ assessment }: Props) => {
  const { blueprint, completedAt } = assessment
  const isUnlocked = blueprint?.paidAt != null

  return (
    <div className={cn("group", cardSurface, cardHover)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isUnlocked
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {isUnlocked ? (
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {isUnlocked ? "Full blueprint" : "Free preview"}
          </span>
          {completedAt && (
            <span className="text-xs text-muted-foreground">Completed {formatDate(completedAt)}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {blueprint?.recommended ? (
            <>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Top match</p>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">
                {blueprint.recommended.name}
              </h2>
            </>
          ) : (
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">
              Blueprint unavailable
            </h2>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {blueprint
              ? `${blueprint.recommended ? `${blueprint.recommended.matchPercent}% match · ` : ""}${blueprint.careerCount} career ${blueprint.careerCount === 1 ? "match" : "matches"}`
              : "This assessment has no blueprint attached."}
          </p>
          {/* A link, not a button — it navigates, so Cmd-click and middle-click
              have to keep working. */}
          <Link
            href={`/assessments/${assessment.id}`}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            View
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

type Props = {
  assessment: AssessmentSummary
}
