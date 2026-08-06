"use client"

import { Target } from "lucide-react"

import type { CareerMatch } from "@/lib/blueprint/types"

import { BorderedCard } from "./bordered-card"
import { LockedSection } from "./locked-section"

export const RoadmapTimelineCard = ({ career, isPaid, onUnlock }: Props) => {
  const stages = [career.learningPath.months1to3, career.learningPath.months4to6, career.learningPath.months7to12]

  return (
    <BorderedCard className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Your roadmap for {career.name}</h3>

      <LockedSection isLocked={!isPaid} onUnlock={onUnlock}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage) => (
            <div
              key={stage.title}
              className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/50"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                {stage.timeframe}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{stage.title}</p>
              <ul className="flex flex-col gap-1.5">
                {stage.actions.map((action) => (
                  <li key={action} className="flex gap-1.5 text-xs text-muted-foreground">
                    <span className="text-indigo-500 dark:text-indigo-400">→</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
              {stage.milestone && (
                <div className="mt-auto flex items-start gap-1.5 border-t border-slate-100 pt-2 text-xs font-medium text-indigo-600 dark:border-slate-800 dark:text-indigo-400">
                  <Target className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{stage.milestone}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </LockedSection>
    </BorderedCard>
  )
}

type Props = {
  career: CareerMatch
  isPaid: boolean
  onUnlock: () => void
}
