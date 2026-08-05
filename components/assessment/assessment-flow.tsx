"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { isScreenComplete, pruneAnswers, screenIndexOf, visibleScreens } from "@/lib/assessment/flow"
import { clearDraft, loadDraft, saveDraft } from "@/lib/assessment/storage"
import type { AnswerValue, Answers, AssessmentSubmission, Lead } from "@/lib/assessment/types"
import { saveBlueprint } from "@/lib/blueprint/storage"
import { mockBlueprintService } from "@/services/ai/mock-blueprint-service"

import { ConfirmationScreen } from "./confirmation-screen"
import { LeadCaptureForm } from "./lead-capture-form"
import { QuestionScreen } from "./question-screen"
import { SignupScreen } from "./signup-screen"
import { TeaserScreen } from "./teaser-screen"
import { useAssessment } from "./assessment-provider"
import { WelcomeScreen } from "./welcome-screen"

export type Stage = "welcome" | "questions" | "teaser" | "capture" | "signup" | "done"

const hasContent = (value: AnswerValue | undefined): boolean => {
  if (value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export const AssessmentFlow = ({ onClose }: Props) => {
  const [stage, setStage] = useState<Stage>("welcome")
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)
  const [showErrors, setShowErrors] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [lead, setLead] = useState<Lead | null>(null)

  const [maxScreenCount, setMaxScreenCount] = useState(0)

  const headingRef = useRef<HTMLDivElement>(null)

  const { initialStage, consumeInitialStage } = useAssessment()
  const { data: session } = useSession()

  useEffect(() => {
    // The post-signup OAuth redirect lands the browser back here with no
    // in-memory stage — assessment-provider.tsx figures out where to
    // resume (done vs. signup) and hands it over via context; this effect
    // applies it once, then clears it so a later open() starts fresh.
    if (!initialStage) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage(initialStage)
    consumeInitialStage()
  }, [initialStage, consumeInitialStage])

  const screens = visibleScreens(answers)
  const screen = screens[index]
  const isLast = index === screens.length - 1

  useEffect(() => {
    // The draft check needs localStorage, which isn't available during SSR —
    // this has to run after mount, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasDraft(loadDraft() !== null)
  }, [])

  // Move focus to the top of each new screen/stage so screen readers and
  // keyboard users land on the new content rather than staying on a button
  // that just unmounted.
  useEffect(() => {
    headingRef.current?.focus()
  }, [stage, index])

  // Only the denominator ratchets — the numerator (current index) is free to
  // move up and down with Back/Next. maxScreenCount is updated at the point
  // answers actually change (start/resume/answer below), not derived
  // reactively here, so a newly triggered branch can grow it but a
  // back-edit that removes a branch won't make the bar jump backwards.
  const denominator = Math.max(maxScreenCount, screens.length)
  const progress = denominator ? ((index + 1) / denominator) * 100 : 0

  const start = () => {
    clearDraft()
    setMaxScreenCount(0)
    setAnswers({})
    setIndex(0)
    setShowErrors(false)
    setStage("questions")
  }

  const resume = () => {
    const draft = loadDraft()
    if (!draft) return start()

    const restored = visibleScreens(draft.answers)
    const restoredIndex = screenIndexOf(restored, draft.screenId)

    setMaxScreenCount(restored.length)
    setAnswers(draft.answers)
    setIndex(restoredIndex >= 0 ? restoredIndex : 0)
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
    saveDraft(next, currentId ?? "")
    // An edit can remove the screen we're standing on only via Back-editing a
    // trigger, in which case clamp rather than run off the end.
    if (stillThere === -1) setIndex((i) => Math.min(i, nextScreens.length - 1))
    setShowErrors(false)
  }

  const next = () => {
    if (!screen) return
    if (!isScreenComplete(screen, answers)) return setShowErrors(true)
    if (isLast) return setStage("teaser")
    setIndex((i) => i + 1)
    setShowErrors(false)
  }

  const back = () => {
    if (index === 0) return setStage("welcome")
    setIndex((i) => i - 1)
    setShowErrors(false)
  }

  const submit = async (captured: Lead) => {
    const submission: AssessmentSubmission = {
      answers: pruneAnswers(answers),
      lead: captured,
      completedAt: new Date().toISOString(),
    }
    // TODO(ADR-003): replace with a real SES or API endpoint send once configured.
    console.log("Assessment Submission:", submission)

    const blueprint = await mockBlueprintService.generate({
      answers: submission.answers,
      studentName: captured.name,
    })
    saveBlueprint(blueprint)

    clearDraft()
    setLead(captured)
    setStage("signup")
  }

  if (stage === "welcome") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <WelcomeScreen hasDraft={hasDraft} onStart={start} onResume={resume} />
      </div>
    )
  }

  if (stage === "teaser") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <TeaserScreen onContinue={() => setStage("capture")} />
      </div>
    )
  }

  if (stage === "capture") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <LeadCaptureForm onSubmitted={submit} />
      </div>
    )
  }

  if (stage === "signup") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <SignupScreen />
      </div>
    )
  }

  if (stage === "done") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <ConfirmationScreen name={lead?.name ?? session?.user?.name ?? undefined} onClose={onClose} />
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

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>
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
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={next}
          className="h-12 flex-1 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {isLast ? "Finish" : showSkip ? "Skip" : "Next"}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

type Props = {
  onClose: () => void
}
