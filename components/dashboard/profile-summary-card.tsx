"use client"

import type { ProfileSummary } from "@/lib/blueprint/types"

export const ProfileSummaryCard = ({ profile }: Props) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
        Your profile
      </p>
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{profile.archetype}</h2>
      <p className="text-sm text-muted-foreground">{profile.narrative}</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Strengths</p>
        <ul className="flex flex-col gap-2">
          {profile.strengths.map((strength) => (
            <li key={strength.title} className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{strength.title}</span>
              <span className="text-muted-foreground"> — {strength.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Watch-outs</p>
        <ul className="flex flex-col gap-2">
          {profile.watchOuts.map((watchOut) => (
            <li key={watchOut.title} className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{watchOut.title}</span>
              <span className="text-muted-foreground"> — {watchOut.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

type Props = {
  profile: ProfileSummary
}
