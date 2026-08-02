"use client"

import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export const TeaserScreen = ({ onContinue }: Props) => (
  <div className="flex flex-col gap-6">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
      <CheckCircle2 className="h-6 w-6" />
    </div>

    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
        That&apos;s everything we needed.
      </h2>
      <p className="text-sm text-muted-foreground">
        Your profile is ready. We&apos;ll match you to up to 3 tech careers that fit it — and
        tell you which one we&apos;d back for you, with the skills and degree path that
        get you there.
      </p>
      <p className="text-sm text-muted-foreground">
        Tell us where to send it.
      </p>
    </div>

    <Button
      onClick={onContinue}
      className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
    >
      Get my career matches
      <ArrowRight className="ml-1.5 h-4 w-4" />
    </Button>
  </div>
)

type Props = {
  onContinue: () => void
}
