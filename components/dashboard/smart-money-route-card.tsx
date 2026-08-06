"use client"

import { PiggyBank } from "lucide-react"

import type { CareerMatch } from "@/lib/blueprint/types"

import { BorderedCard } from "./bordered-card"
import { LockedSection } from "./locked-section"

export const SmartMoneyRouteCard = ({ career, isPaid, onUnlock }: Props) => (
  <BorderedCard className="flex h-full flex-col gap-4">
    <div className="flex items-center gap-2">
      <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">The smart-money route</h3>
    </div>

    <LockedSection isLocked={!isPaid} onUnlock={onUnlock}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{career.collegeGuidance.smartMoneyRoute}</p>

        <div className="w-fit rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/50">
          <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Estimated cost</p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            ₹{career.collegeGuidance.estimatedCostInrLakh[0]}–{career.collegeGuidance.estimatedCostInrLakh[1]} lakh
            total
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Expensive alternative: </span>
          {career.collegeGuidance.expensiveAlternative}
        </p>
      </div>
    </LockedSection>
  </BorderedCard>
)

type Props = {
  career: CareerMatch
  isPaid: boolean
  onUnlock: () => void
}
