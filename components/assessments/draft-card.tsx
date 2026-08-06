"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CircleDashed } from "lucide-react"

import { discardAssessment } from "@/app/actions/assessment"
import { useAssessment } from "@/components/assessment/assessment-provider"
import { Button } from "@/components/ui/button"
import { cardHover, cardSurface } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AssessmentSummary } from "@/services/assessment/assessment-store"

import { DiscardDialog } from "./discard-dialog"
import { formatDate } from "./format-date"

export const DraftCard = ({ assessment }: Props) => {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()
  const { openDraft } = useAssessment()
  const router = useRouter()

  const draft = assessment.draft
  if (!draft) return null

  const discard = () => {
    startTransition(async () => {
      await discardAssessment(assessment.id)
      setConfirming(false)
      router.refresh()
    })
  }

  return (
    <>
      {/* Same hover as every marketing card, even though the click targets are
          the buttons inside — the cursor is what distinguishes them. The
          border stays neutral at rest and only turns indigo on hover. */}
      <div className={cn("group", cardSurface, cardHover)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
              In Progress
            </span>
            <span className="text-xs text-muted-foreground">
              Started {formatDate(assessment.startedAt)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-900 tabular-nums sm:text-2xl dark:text-slate-100">
              Question {draft.progress.current} of {draft.progress.total}
            </h2>
            <p className="text-sm text-muted-foreground">
              Pick up exactly where you stopped — nothing is lost.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex h-11 items-center rounded-xl px-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Discard
            </button>
            <Button
              onClick={() => openDraft({ id: assessment.id, ...draft })}
              className="h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Continue
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <DiscardDialog
        open={confirming}
        onOpenChange={setConfirming}
        onConfirm={discard}
        pending={pending}
        title="Discard This Assessment?"
        body="Your answers so far will be deleted permanently. You can start a new assessment anytime."
        confirmLabel="Discard"
      />
    </>
  )
}

type Props = {
  assessment: AssessmentSummary
}
