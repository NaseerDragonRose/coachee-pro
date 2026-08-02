"use client"

import type { ReactNode } from "react"

import { useAssessment } from "./assessment-provider"

export const AssessmentCta = ({ className, children, onActivate }: Props) => {
  const { open } = useAssessment()

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onActivate?.()
        open()
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
