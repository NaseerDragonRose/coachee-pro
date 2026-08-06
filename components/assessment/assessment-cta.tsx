"use client"

import type { ReactNode } from "react"

import { useAssessment } from "./assessment-provider"

// Used only from marketing pages and the footer, all of which are
// unauthenticated — so the CTA opens the signup dialog, not the questionnaire.
// Signed-in visitors never reach these pages; `proxy.ts` redirects them.
export const AssessmentCta = ({ className, children, onActivate }: Props) => {
  const { openSignup } = useAssessment()

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onActivate?.()
        openSignup()
      }}
    >
      {children}
    </button>
  )
}

type Props = {
  className?: string
  children: ReactNode
  /** Runs before opening — used by the header to close the mobile drawer. */
  onActivate?: () => void
}
