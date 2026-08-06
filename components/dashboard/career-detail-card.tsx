"use client"

import { CheckCircle2 } from "lucide-react"

import type { AiRisk, CareerMatch } from "@/lib/blueprint/types"

import { BorderedCard } from "./bordered-card"
import { LockedSection } from "./locked-section"

const AI_RISK_STYLES: Record<AiRisk, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
}

const AI_RISK_LABELS: Record<AiRisk, string> = {
  low: "Low AI risk",
  medium: "Medium AI risk",
  high: "High AI risk",
}

export const CareerDetailCard = ({ career, isPaid, onUnlock }: Props) => (
  <BorderedCard className="flex h-full flex-col gap-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{career.name}</h2>
          {career.isRecommended && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              <CheckCircle2 className="h-3 w-3" />
              Our recommendation
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-muted-foreground">{career.streamFit}</p>
      </div>

      <span
        className={`inline-flex shrink-0 items-center self-start rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${AI_RISK_STYLES[career.aiRisk]}`}
      >
        {AI_RISK_LABELS[career.aiRisk]}
      </span>
    </div>

    <span className="inline-flex w-fit items-center rounded-full bg-teal-100 px-3 py-1.5 text-sm font-bold text-teal-800 dark:bg-teal-900 dark:text-teal-200">
      {career.matchPercent}% match
    </span>

    <p className="text-sm text-muted-foreground">{career.whyItFits}</p>

    <LockedSection isLocked={!isPaid} onUnlock={onUnlock}>
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/50">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            A day in this life
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{career.dayInTheLife}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Skills to build
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {career.skillsToBuild.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LockedSection>
  </BorderedCard>
)

type Props = {
  career: CareerMatch
  isPaid: boolean
  onUnlock: () => void
}
