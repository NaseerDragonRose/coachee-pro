"use client"

import { useEffect, useState } from "react"

import { isBlueprintPaid, loadBlueprint, setBlueprintPaid } from "@/lib/blueprint/storage"
import type { Blueprint } from "@/lib/blueprint/types"

import { CareerMatchCard } from "./career-match-card"
import { EmptyState } from "./empty-state"
import { ProfileSummaryCard } from "./profile-summary-card"

export const DashboardView = () => {
  const [mounted, setMounted] = useState(false)
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    // Blueprint and paid status live in localStorage, which isn't available
    // during SSR — this has to run after mount, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlueprint(loadBlueprint())
    setIsPaid(isBlueprintPaid())
    setMounted(true)
  }, [])

  const unlock = () => {
    setBlueprintPaid(true)
    setIsPaid(true)
  }

  const resetToFree = () => {
    setBlueprintPaid(false)
    setIsPaid(false)
  }

  if (!mounted) return null

  if (!blueprint) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Your Tech Career Blueprint
        </h1>
        <p className="text-sm text-muted-foreground">
          Generated {new Date(blueprint.generatedAt).toLocaleDateString()}
        </p>
      </div>

      <ProfileSummaryCard profile={blueprint.profile} />

      <div className="flex flex-col gap-5">
        {blueprint.careers.map((career) => (
          <CareerMatchCard key={career.careerId} career={career} isPaid={isPaid} onUnlock={unlock} />
        ))}
      </div>

      {isPaid && (
        <button
          type="button"
          onClick={resetToFree}
          className="self-start text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-300"
        >
          Reset to free preview
        </button>
      )}
    </div>
  )
}
