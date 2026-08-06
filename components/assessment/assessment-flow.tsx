"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

import { completeAssessment, saveAssessmentDraft } from "@/app/actions/assessment"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  hasContent,
  isScreenComplete,
  screenIndexOf,
  visibleScreens,
} from "@/lib/assessment/flow"
import type { AnswerValue } from "@/lib/assessment/types"

import { QuestionScreen } from "./question-screen"
import { useAssessment } from "./assessment-provider"
import { WelcomeScreen } from "./welcome-screen"

export const AssessmentFlow = () => {
  const {
    ensureAssessmentId,
    stage,
    setStage,
    answers,
    setAnswers,
    index,
    setIndex,
    close,
    finish,
  } = useAssessment()

  const [showErrors, setShowErrors] = useState(false)
  const [maxScreenCount, setMaxScreenCount] = useState(0)
  const [failed, setFailed] = useState(false)

  const headingRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const screens = visibleScreens(answers)
  const screen = screens[index]
  const isLast = index === screens.length - 1

  // Move focus to the top of each new screen/stage so screen readers and
  // keyboard users land on the new content rather than staying on a button
  // that just unmounted.
  useEffect(() => {
    headingRef.current?.focus()
  }, [stage, index])

  // Only the denominator ratchets — the numerator (current index) is free to
  // move up and down with Back/Next. maxScreenCount is updated at the point
  // answers actually change (start/answer below), not derived reactively here,
  // so a newly triggered branch can grow it but a back-edit that removes a
  // branch won't make the bar jump backwards.
  const denominator = Math.max(maxScreenCount, screens.length)
  const progress = denominator ? ((index + 1) / denominator) * 100 : 0

  const start = () => {
    setMaxScreenCount(screens.length)
    setShowErrors(false)
    setStage("questions")
  }

  const answer = (questionId: string, value: AnswerValue) => {
    const next = { ...answers, [questionId]: value }
    const nextScreens = visibleScreens(next)
    const currentId = screen?.[0]?.id
    const stillThere = currentId ? screenIndexOf(nextScreens, currentId) : -1

    if (nextScreens.length > maxScreenCount) setMaxScreenCount(nextScreens.length)

    setAnswers(next)
    // An edit can remove the screen we're standing on only via Back-editing a
    // trigger, in which case clamp rather than run off the end.
    if (stillThere === -1) setIndex((i) => Math.min(i, nextScreens.length - 1))
    setShowErrors(false)
  }

  const submit = async () => {
    setFailed(false)
    setStage("generating")

    // Finish can land before the debounced autosave has created the row, so
    // make sure it exists and carries the final answers before completing.
    const id = await ensureAssessmentId()
    if (!id) {
      setFailed(true)
      return
    }

    await saveAssessmentDraft({
      id,
      answers,
      screenId: screens[index]?.[0]?.id ?? null,
    })

    const result = await completeAssessment(id)

    if (!result.ok) {
      // Never a dead end — the answers are already saved server-side, so
      // retrying costs nothing but a tap.
      setFailed(true)
      return
    }

    finish()
    router.replace(`/assessments/${encodeURIComponent(result.assessmentId)}`)
  }

  const next = () => {
    if (!screen) return
    if (!isScreenComplete(screen, answers)) return setShowErrors(true)
    if (isLast) return void submit()
    setIndex((i) => i + 1)
    setShowErrors(false)
  }

  const back = () => {
    if (index === 0) return setStage("welcome")
    setIndex((i) => i - 1)
    setShowErrors(false)
  }

  if (stage === "welcome") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto overscroll-contain px-5 py-6 outline-none" data-lenis-prevent>
        <WelcomeScreen onStart={start} />
      </div>
    )
  }

  if (stage === "generating") {
    return (
      <div
        ref={headingRef}
        tabIndex={-1}
        className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-10 text-center outline-none"
      >
        {failed ? (
          <>
            <p role="alert" className="text-sm font-semibold text-red-500">
              We couldn&apos;t build your blueprint just then.
            </p>
            <p className="text-sm text-muted-foreground">
              Your answers are saved. Try again, or close this and come back later.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => void submit()}
                className="h-12 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={close}
                className="h-12 rounded-xl px-6 text-sm font-semibold"
              >
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 motion-reduce:animate-none dark:text-indigo-400" aria-hidden="true" />
            <p aria-live="polite" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Building Your Blueprint…
            </p>
            <p className="text-sm text-muted-foreground">This takes just a moment.</p>
          </>
        )}
      </div>
    )
  }

  const optionalOnly = screen?.every((question) => question.optional) ?? false
  const showSkip = optionalOnly && !screen?.some((question) => hasContent(answers[question.id]))

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="pb-3">
        <Progress value={progress} />
        <p aria-live="polite" className="sr-only">
          Question {index + 1} of {screens.length}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6" data-lenis-prevent>
        <div ref={headingRef} tabIndex={-1} className="outline-none">
          {screen && (
            <QuestionScreen
              screen={screen}
              answers={answers}
              onAnswer={answer}
              showErrors={showErrors}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
        <Button
          variant="outline"
          onClick={back}
          className="h-12 rounded-xl px-4 text-sm font-semibold"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        <Button
          onClick={next}
          className="h-12 flex-1 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {isLast ? "Finish" : showSkip ? "Skip" : "Next"}
          <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
