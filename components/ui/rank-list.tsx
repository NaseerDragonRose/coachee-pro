"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function RankList({ value, onValueChange, items }: RankListProps) {
  const toggle = (id: string) => {
    onValueChange(
      value.includes(id) ? value.filter((ranked) => ranked !== id) : [...value, id]
    )
  }

  return (
    <div data-slot="rank-list" className="flex flex-col gap-2">
      {items.map((item) => {
        const rank = value.indexOf(item.id)
        const isRanked = rank >= 0

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            aria-pressed={isRanked}
            data-slot="rank-list-item"
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
              "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none",
              isRanked
                ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "border-slate-200/80 bg-slate-50/50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
            )}
          >
            <span
              aria-hidden="true"
              data-slot="rank-list-item-index"
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                isRanked
                  ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                  : "border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500"
              )}
            >
              {isRanked ? rank + 1 : ""}
            </span>
            <span data-slot="rank-list-item-label">{item.label}</span>
            <span data-slot="rank-list-item-description" className="sr-only">
              {isRanked ? `Ranked ${rank + 1}. Tap to remove.` : "Not ranked. Tap to rank."}
            </span>
          </button>
        )
      })}
    </div>
  )
}

type RankListProps = {
  value: string[]
  onValueChange: (value: string[]) => void
  items: { id: string; label: string }[]
}

export { RankList }
