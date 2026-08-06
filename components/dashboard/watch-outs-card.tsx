"use client"

import { AlertTriangle } from "lucide-react"

import type { ProfileSummary } from "@/lib/blueprint/types"

import { BorderedCard } from "./bordered-card"

export const WatchOutsCard = ({ items }: Props) => (
  <BorderedCard className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <AlertTriangle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Watch-outs</h3>
    </div>
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.title} className="border-l-4 border-amber-500 pl-3 dark:border-amber-400">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
          <p className="text-sm text-muted-foreground">{item.detail}</p>
        </li>
      ))}
    </ul>
  </BorderedCard>
)

type Props = {
  items: ProfileSummary["watchOuts"]
}
