"use client"

import type { ProfileSummary, SignalCategory } from "@/lib/blueprint/types"

import { BorderedCard } from "./bordered-card"

const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical",
  creative: "Creative",
  scientific: "Scientific",
  empathy: "Empathy",
  commercial: "Commercial",
  entrepreneurial: "Entrepreneurial",
}

export const SignalMapCard = ({ signalMap }: Props) => {
  const entries = Object.entries(signalMap) as [SignalCategory, number][]

  return (
    <BorderedCard className="flex flex-col gap-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Your signal map</h3>
      <div className="flex flex-col gap-3">
        {entries.map(([category, value]) => (
          <div key={category} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-medium text-slate-600 sm:w-28 dark:text-slate-400">
              {CATEGORY_LABELS[category] ?? category}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400" style={{ width: `${value}%` }} />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
              {value}
            </span>
          </div>
        ))}
      </div>
    </BorderedCard>
  )
}

type Props = {
  signalMap: ProfileSummary["signalMap"]
}
