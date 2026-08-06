"use client"

import type { ReactNode } from "react"

export const BorderedCard = ({ children, className = "" }: Props) => (
  <div
    className={`rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 ${className}`}
  >
    {children}
  </div>
)

type Props = {
  children: ReactNode
  className?: string
}
