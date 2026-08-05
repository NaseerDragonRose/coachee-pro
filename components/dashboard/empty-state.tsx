"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

export const EmptyState = () => (
  <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
      <Sparkles className="h-6 w-6" />
    </div>
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        No results on this device yet
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Take the free career assessment to get your personalized tech career matches.
      </p>
    </div>
    <Link
      href="/?assessment=1"
      className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
    >
      Take the Free Assessment
    </Link>
  </div>
)
