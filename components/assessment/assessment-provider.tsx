"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useRouter } from "next/navigation"

import { loadBlueprint } from "@/lib/blueprint/storage"
import { cognitoAuthService } from "@/services/auth/cognito-auth-service"

import { AssessmentDialog } from "./assessment-dialog"
import type { Stage } from "./assessment-flow"

const AssessmentContext = createContext<AssessmentContextValue | null>(null)

export const AssessmentProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [initialStage, setInitialStage] = useState<Stage | null>(null)
  const router = useRouter()

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const consumeInitialStage = useCallback(() => setInitialStage(null), [])

  useEffect(() => {
    // Campaign links can deep-link straight into the assessment, and the
    // post-signup Google redirect lands back here too — both read the URL,
    // which is only reliably available client-side after mount, not
    // during render.
    const assessment = new URLSearchParams(window.location.search).get("assessment")

    if (assessment === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true)
      return
    }

    if (assessment === "done") {
      // No saved blueprint means this isn't a real post-assessment
      // redirect (stale/bookmarked link) — ignore it.
      if (!loadBlueprint()) return

      cognitoAuthService.getSession().then((session) => {
        // Signup can fail to complete (denied consent, refresh mid-flow);
        // land back on the signup screen to retry rather than sending an
        // unauthenticated visitor to the auth-gated dashboard.
        if (session) {
          router.replace("/dashboard")
          return
        }
        setInitialStage("signup")
        setIsOpen(true)
      })
    }
  }, [router])

  const value = useMemo(
    () => ({ isOpen, open, close, initialStage, consumeInitialStage }),
    [isOpen, open, close, initialStage, consumeInitialStage]
  )

  return (
    <AssessmentContext.Provider value={value}>
      {children}
      <AssessmentDialog />
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
  open: () => void
  close: () => void
  initialStage: Stage | null
  consumeInitialStage: () => void
}

type Props = {
  children: ReactNode
}
