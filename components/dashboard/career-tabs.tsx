"use client"

import { Tabs } from "@base-ui/react/tabs"

import type { CareerMatch } from "@/lib/blueprint/types"

export const CareerTabs = ({ careers, selectedCareerId, onSelect }: Props) => (
  <Tabs.Root value={selectedCareerId} onValueChange={(value) => onSelect(value as string)}>
    <Tabs.List className="flex flex-wrap gap-2">
      {careers.map((career) => (
        <Tabs.Tab
          key={career.careerId}
          value={career.careerId}
          className={(state) =>
            `inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              state.active
                ? "border-indigo-600 bg-indigo-50 font-bold text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/80 dark:text-indigo-300"
                : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
            }`
          }
        >
          {career.name} · {career.matchPercent}%
        </Tabs.Tab>
      ))}
    </Tabs.List>
  </Tabs.Root>
)

type Props = {
  careers: CareerMatch[]
  selectedCareerId: string
  onSelect: (careerId: string) => void
}
