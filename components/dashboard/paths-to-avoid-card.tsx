"use client"

import { ShieldAlert } from "lucide-react"

import type { CareerMatch } from "@/lib/blueprint/types"

import { BorderedCard } from "./bordered-card"
import { LockedSection } from "./locked-section"

export const PathsToAvoidCard = ({ career, isPaid, onUnlock }: Props) => (
  <BorderedCard className="flex h-full flex-col gap-4">
    <div className="flex items-center gap-2">
      <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Paths to avoid</h3>
    </div>

    <LockedSection isLocked={!isPaid} onUnlock={onUnlock}>
      <ul className="flex flex-col gap-3">
        {career.commonMistakes.map((mistake) => (
          <li
            key={mistake.title}
            className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/50"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{mistake.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{mistake.detail}</p>
          </li>
        ))}
      </ul>
    </LockedSection>
  </BorderedCard>
)

type Props = {
  career: CareerMatch
  isPaid: boolean
  onUnlock: () => void
}
