"use client"

import { CheckCircle2 } from "lucide-react"

import type { AiRisk, CareerMatch } from "@/lib/blueprint/types"

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

export const CareerMatchCard = ({ career, isPaid, onUnlock }: Props) => {
  const salaryRows: { label: string; value: number }[] = [
    { label: "Entry", value: career.salaryProgressionInrLakh.entry },
    { label: "3 yr", value: career.salaryProgressionInrLakh.year3 },
    { label: "5 yr", value: career.salaryProgressionInrLakh.year5 },
    { label: "10 yr", value: career.salaryProgressionInrLakh.year10 },
  ]
  const learningStages = [
    career.learningPath.months1to3,
    career.learningPath.months4to6,
    career.learningPath.months7to12,
  ]

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{career.name}</h3>
            {career.isRecommended && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                <CheckCircle2 className="h-3 w-3" />
                Our recommendation
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-muted-foreground">{career.streamFit}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${AI_RISK_STYLES[career.aiRisk]}`}>
            {AI_RISK_LABELS[career.aiRisk]}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {career.matchPercent}% match
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{career.whyItFits}</p>

      <LockedSection isLocked={!isPaid} onUnlock={onUnlock}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              A day in the life
            </p>
            <p className="text-sm text-muted-foreground">{career.dayInTheLife}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Skills to build
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {career.skillsToBuild.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Learning path
            </p>
            {learningStages.map((stage) => (
              <div key={stage.title} className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stage.title}</p>
                <ul className="ml-4 list-disc text-sm text-muted-foreground">
                  {stage.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
                {stage.milestone && (
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Milestone: {stage.milestone}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              College guidance
            </p>
            <p className="text-sm text-muted-foreground">{career.collegeGuidance.smartMoneyRoute}</p>
            <p className="text-xs text-muted-foreground">
              Typical cost: ₹{career.collegeGuidance.estimatedCostInrLakh[0]}–
              {career.collegeGuidance.estimatedCostInrLakh[1]} lakh
            </p>
            <p className="text-xs text-muted-foreground">
              Alternative: {career.collegeGuidance.expensiveAlternative}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Salary progression (₹ lakh/year, indicative)
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {salaryRows.map((row) => (
                <div key={row.label} className="rounded-xl bg-slate-50 px-2 py-2 dark:bg-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">₹{row.value}L</p>
                  <p className="text-[10px] font-medium text-muted-foreground">{row.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Future outlook
            </p>
            <p className="text-sm text-muted-foreground">{career.futureOutlook}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Common mistakes to avoid
            </p>
            <ul className="ml-4 list-disc text-sm text-muted-foreground">
              {career.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </div>
        </div>
      </LockedSection>
    </div>
  )
}

type Props = {
  career: CareerMatch
  isPaid: boolean
  onUnlock: () => void
}
