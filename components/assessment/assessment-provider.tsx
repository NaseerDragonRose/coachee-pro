"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import { AssessmentDialog } from "./assessment-dialog"

const AssessmentContext = createContext<AssessmentContextValue | null>(null)

export const AssessmentProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    // Campaign links can deep-link straight into the assessment. This reads
    // the URL, which is only reliably available client-side after mount, not
    // during render.
    if (new URLSearchParams(window.location.search).get("assessment") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true)
    }
  }, [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])

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
}

type Props = {
  children: ReactNode
}
