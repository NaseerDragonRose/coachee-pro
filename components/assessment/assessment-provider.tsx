"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"

import { saveAssessmentDraft, startAssessment } from "@/app/actions/assessment"
import { screenIndexOf, visibleScreens } from "@/lib/assessment/flow"
import type { Answers } from "@/lib/assessment/types"

import { AssessmentDialog } from "./assessment-dialog"
import { SignupDialog } from "./signup-dialog"

export type Stage = "welcome" | "questions" | "generating"

export type DraftSeed = {
  id: string
  answers: Answers
  currentScreenId: string | null
}

const AUTOSAVE_DELAY_MS = 1_000

const screenIdAt = (answers: Answers, index: number): string | null =>
  visibleScreens(answers)[index]?.[0]?.id ?? null

const AssessmentContext = createContext<AssessmentContextValue | null>(null)

// Owns the flow's state as well as the dialog's open flag, so closing the
// modal can unmount its children without losing the student's place. Position
// survives twice over: this state covers close-and-reopen inside a session,
// and `currentScreenId` in the database covers a new session or a new device.
//
// Nothing here reads or writes the URL. Modal steps are deliberately invisible
// to the address bar — a documented deviation from the "deep-link stateful UI"
// guideline, recorded in docs/superpowers/specs/.
export const AssessmentProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>("welcome")
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const creating = useRef(false)

  /**
   * Creates the row on demand and returns its id. Opening the modal doesn't
   * write anything — a student who opens it and closes again leaves nothing
   * behind. The row appears once there's an answer worth keeping.
   *
   * The ref guards re-entry: the autosave timer and Finish can both arrive
   * here, and two `startAssessment()` calls would race for one draft slot.
   */
  const ensureAssessmentId = useCallback(async (): Promise<string | null> => {
    if (assessmentId) return assessmentId
    if (creating.current) return null

    creating.current = true
    try {
      const result = await startAssessment()
      if (!result.ok) return null

      setAssessmentId(result.assessment.id)
      return result.assessment.id
    } finally {
      creating.current = false
    }
  }, [assessmentId])

  // Deliberately depends on the values rather than reading them from a ref:
  // a ref written during render is a React violation, and identity changing
  // with the answers is exactly what reschedules the debounce below.
  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }

    // Nothing answered yet means nothing to store, and no row to create.
    if (Object.keys(answers).length === 0) return

    const id = await ensureAssessmentId()
    if (!id) return

    await saveAssessmentDraft({ id, answers, screenId: screenIdAt(answers, index) })
  }, [answers, index, ensureAssessmentId])

  // One debounced write covers both an answer and a move between screens, so
  // closing mid-screen still records where the student stood.
  useEffect(() => {
    if (!isOpen) return

    timer.current = setTimeout(() => void flush(), AUTOSAVE_DELAY_MS)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [isOpen, flush])

  const openSignup = useCallback(() => setIsSignupOpen(true), [])
  const closeSignup = useCallback(() => setIsSignupOpen(false), [])

  // No write here. The row is created by the first autosave that has something
  // to save, so opening and closing the modal costs nothing.
  const openNew = useCallback(() => {
    setAssessmentId(null)
    setAnswers({})
    setIndex(0)
    setStage("welcome")
    setIsOpen(true)
  }, [])

  const openDraft = useCallback((draft: DraftSeed) => {
    const restored = screenIndexOf(visibleScreens(draft.answers), draft.currentScreenId ?? "")

    setAssessmentId(draft.id)
    setAnswers(draft.answers)
    setIndex(restored >= 0 ? restored : 0)
    // Straight to the question they stopped on — the assessments page card
    // already made the resume-or-restart choice.
    setStage("questions")
    setIsOpen(true)
  }, [])

  // Deliberately leaves stage, index and answers alone: reopening returns to
  // the same place with no server round trip.
  const close = useCallback(() => {
    void flush()
    setIsOpen(false)
  }, [flush])

  const finish = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setIsOpen(false)
    setAssessmentId(null)
    setAnswers({})
    setIndex(0)
    setStage("welcome")
  }, [])

  const value = useMemo(
    () => ({
      isOpen,
      openNew,
      openDraft,
      close,
      finish,
      isSignupOpen,
      openSignup,
      closeSignup,
      assessmentId,
      ensureAssessmentId,
      stage,
      setStage,
      answers,
      setAnswers,
      index,
      setIndex,
    }),
    [
      isOpen,
      openNew,
      openDraft,
      close,
      finish,
      isSignupOpen,
      openSignup,
      closeSignup,
      assessmentId,
      ensureAssessmentId,
      stage,
      answers,
      index,
    ]
  )

  return (
    <AssessmentContext.Provider value={value}>
      {children}
      <AssessmentDialog />
      <SignupDialog />
    </AssessmentContext.Provider>
  )
}

export const useAssessment = (): AssessmentContextValue => {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error("useAssessment must be used inside an AssessmentProvider")
  }
  return context
}

type AssessmentContextValue = {
  isOpen: boolean
  openNew: () => void
  openDraft: (draft: DraftSeed) => void
  close: () => void
  /** Clears state after completion so the next open starts fresh. */
  finish: () => void
  isSignupOpen: boolean
  openSignup: () => void
  closeSignup: () => void
  assessmentId: string | null
  /** Creates the row if it doesn't exist yet. Null if creation failed. */
  ensureAssessmentId: () => Promise<string | null>
  stage: Stage
  setStage: (stage: Stage) => void
  answers: Answers
  setAnswers: (answers: Answers) => void
  index: number
  setIndex: (index: number | ((current: number) => number)) => void
}

type Props = {
  children: ReactNode
}
