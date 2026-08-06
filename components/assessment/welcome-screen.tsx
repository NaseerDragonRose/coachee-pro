"use client"

import Link from "next/link"
import { Clock, Lock, Pause } from "lucide-react"

import { Button } from "@/components/ui/button"

export const WelcomeScreen = ({ onStart }: Props) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-pretty text-slate-900 sm:text-3xl dark:text-slate-100">
        Let&apos;s Figure Out Which Tech Career Fits You
      </h2>
      <p className="text-sm text-muted-foreground">
        A few honest questions about what you&apos;re good at, what you enjoy, and what
        you&apos;re worried about. There are no right or wrong answers, and nothing here
        is a test.
      </p>
    </div>

    <ul className="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300">
      <li className="flex items-center gap-3">
        <Clock className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
        About 10 to 15 minutes
      </li>
      <li className="flex items-center gap-3">
        <Pause className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
        Close it anytime — your answers save as you go
      </li>
      <li className="flex items-start gap-3">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
        <span>
          Your answers stay private —{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            how we handle your data
          </Link>
        </span>
      </li>
    </ul>

    <Button
      onClick={onStart}
      className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      Begin
    </Button>
  </div>
)

type Props = {
  onStart: () => void
}
