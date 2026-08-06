"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CalendarClock, Plus } from "lucide-react"

import { discardAssessment } from "@/app/actions/assessment"
import { useAssessment } from "@/components/assessment/assessment-provider"
import { Button } from "@/components/ui/button"
import { cardHover } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { DiscardDialog } from "./discard-dialog"

// One card, three behaviours. A draft has to be discarded first; a student who
// already has results is offered a mentor instead, because a second assessment
// rarely tells them anything the first didn't.
export const StartNewCard = ({ draftId, hasCompleted }: Props) => {
  const [confirming, setConfirming] = useState(false)
  const [offeringMentor, setOfferingMentor] = useState(false)
  const [pending, startTransition] = useTransition()
  const { openNew } = useAssessment()
  const router = useRouter()

  const start = () => void openNew()

  const replaceDraft = () => {
    startTransition(async () => {
      if (draftId) await discardAssessment(draftId)
      setConfirming(false)
      router.refresh()
      await openNew()
    })
  }

  const onClick = () => {
    if (draftId) return setConfirming(true)
    if (hasCompleted) return setOfferingMentor(true)
    start()
  }

  return (
    <>
      {/* Dashed border marks this as the "add" affordance rather than a
          result; the hover is otherwise the standard card treatment. */}
      <div
        className={cn(
          "group rounded-2xl border border-dashed border-slate-300 bg-white/40 p-5 shadow-sm backdrop-blur-md sm:p-6 dark:border-slate-700 dark:bg-slate-950/30",
          cardHover
        )}
      >
        {offeringMentor ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
                You Already Have a Blueprint
              </h2>
              <p className="text-sm text-muted-foreground">
                A second assessment rarely changes much. A mentor can go further with
                the results you already have.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {/* TODO: point at /book-consultation once Phase 1 booking ships.
                  Disabled and visibly not-yet-live is honest; an enabled button
                  that does nothing is not. */}
              <Button
                disabled
                className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white"
              >
                <CalendarClock className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Book a Call With a Mentor — Coming Soon
              </Button>
              <button
                type="button"
                onClick={start}
                className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              >
                Retake the Assessment
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-4 rounded-xl text-left focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            {/* Icon inverts with the card, matching career-card.tsx. */}
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/80 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
              <Plus className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Start a New Assessment
              </span>
              <span className="text-sm text-muted-foreground">
                {draftId
                  ? "Your current answers will be discarded."
                  : "About 10 minutes."}
              </span>
            </span>
          </button>
        )}
      </div>

      <DiscardDialog
        open={confirming}
        onOpenChange={setConfirming}
        onConfirm={replaceDraft}
        pending={pending}
        title="Start Over?"
        body="The answers in your assessment in progress will be deleted permanently and a new one opened."
        confirmLabel="Discard & Start New"
      />
    </>
  )
}

type Props = {
  /** The active draft, if any — its presence changes what the button does. */
  draftId: string | null
  hasCompleted: boolean
}
