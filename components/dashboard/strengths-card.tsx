"use client"

import { CheckCircle2 } from "lucide-react"

import type { ProfileSummary } from "@/lib/blueprint/types"

import { BorderedCard } from "./bordered-card"

export const StrengthsCard = ({ items }: Props) => (
  <BorderedCard className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Strengths</h3>
    </div>
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.title} className="border-l-4 border-indigo-500 pl-3 dark:border-indigo-400">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
          <p className="text-sm text-muted-foreground">{item.detail}</p>
        </li>
      ))}
    </ul>
  </BorderedCard>
)

type Props = {
  items: ProfileSummary["strengths"]
}
