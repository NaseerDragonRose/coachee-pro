"use client"

import { useEffect, useMemo, useState } from "react"

import { isBlueprintPaid, loadBlueprint, setBlueprintPaid } from "@/lib/blueprint/storage"
import type { Blueprint } from "@/lib/blueprint/types"

import { CareerDetailCard } from "./career-detail-card"
import { CareerTabs } from "./career-tabs"
import { EmptyState } from "./empty-state"
import { PathsToAvoidCard } from "./paths-to-avoid-card"
import { ProfileHeader } from "./profile-header"
import { RoadmapTimelineCard } from "./roadmap-timeline-card"
import { SalaryGrowthCard } from "./salary-growth-card"
import { SignalMapCard } from "./signal-map-card"
import { SmartMoneyRouteCard } from "./smart-money-route-card"
import { StrengthsCard } from "./strengths-card"
import { WatchOutsCard } from "./watch-outs-card"

export const DashboardView = () => {
  const [mounted, setMounted] = useState(false)
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null)

  useEffect(() => {
    // Blueprint and paid status live in localStorage, which isn't available
    // during SSR — this has to run after mount, not during render.
    const loaded = loadBlueprint()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlueprint(loaded)
    setIsPaid(isBlueprintPaid())
    setSelectedCareerId(
      loaded?.careers.find((career) => career.isRecommended)?.careerId ?? loaded?.careers[0]?.careerId ?? null
    )
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

  const selectedCareer = useMemo(
    () => blueprint?.careers.find((career) => career.careerId === selectedCareerId) ?? null,
    [blueprint, selectedCareerId]
  )

  if (!mounted) return null

  if (!blueprint) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <ProfileHeader
        studentName={blueprint.studentName}
        archetype={blueprint.profile.archetype}
        narrative={blueprint.profile.narrative}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StrengthsCard items={blueprint.profile.strengths} />
        <WatchOutsCard items={blueprint.profile.watchOuts} />
        <SignalMapCard signalMap={blueprint.profile.signalMap} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Your top {blueprint.careers.length} matches
        </h2>

        {selectedCareerId && (
          <CareerTabs careers={blueprint.careers} selectedCareerId={selectedCareerId} onSelect={setSelectedCareerId} />
        )}

        {selectedCareer && (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <CareerDetailCard career={selectedCareer} isPaid={isPaid} onUnlock={unlock} />
              </div>
              <div className="lg:col-span-2">
                <SalaryGrowthCard career={selectedCareer} isPaid={isPaid} onUnlock={unlock} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SmartMoneyRouteCard career={selectedCareer} isPaid={isPaid} onUnlock={unlock} />
              <PathsToAvoidCard career={selectedCareer} isPaid={isPaid} onUnlock={unlock} />
            </div>

            <RoadmapTimelineCard career={selectedCareer} isPaid={isPaid} onUnlock={unlock} />
          </>
        )}
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
