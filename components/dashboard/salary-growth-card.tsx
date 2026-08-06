"use client"

import { TrendingUp } from "lucide-react"

import type { CareerMatch } from "@/lib/blueprint/types"

import { BorderedCard } from "./bordered-card"
import { LockedSection } from "./locked-section"

const CHART_WIDTH = 260
const CHART_HEIGHT = 110
const PADDING = 10

export const SalaryGrowthCard = ({ career, isPaid, onUnlock }: Props) => {
  const points = [
    { label: "Entry", value: career.salaryProgressionInrLakh.entry },
    { label: "3 yrs", value: career.salaryProgressionInrLakh.year3 },
    { label: "5 yrs", value: career.salaryProgressionInrLakh.year5 },
    { label: "10 yrs", value: career.salaryProgressionInrLakh.year10 },
  ]
  const maxValue = Math.max(...points.map((point) => point.value))
  const stepX = (CHART_WIDTH - PADDING * 2) / (points.length - 1)
  const coords = points.map((point, index) => ({
    ...point,
    x: PADDING + index * stepX,
    y: PADDING + (CHART_HEIGHT - PADDING * 2) * (1 - point.value / maxValue),
  }))
  const linePath = coords.map((coord) => `${coord.x},${coord.y}`).join(" ")

  return (
    <BorderedCard className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Salary & growth</h3>
      </div>

      <LockedSection isLocked={!isPaid} onUnlock={onUnlock}>
        <div className="flex flex-col gap-4">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full"
            role="img"
            aria-label={points.map((point) => `${point.label}: ₹${point.value} lakh`).join(", ")}
          >
            <polyline
              points={linePath}
              fill="none"
              strokeWidth={2}
              className="stroke-indigo-600 dark:stroke-indigo-400"
            />
            {coords.map((coord) => (
              <circle key={coord.label} cx={coord.x} cy={coord.y} r={4} className="fill-indigo-600 dark:fill-indigo-400" />
            ))}
          </svg>

          <div className="grid grid-cols-4 gap-2 text-center">
            {points.map((point) => (
              <div
                key={point.label}
                className="rounded-xl border border-slate-100 bg-slate-50/70 px-1.5 py-2 dark:border-slate-800/80 dark:bg-slate-900/50"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">₹{point.value}L</p>
                <p className="text-[10px] font-medium text-muted-foreground">{point.label}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">{career.futureOutlook}</p>
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
