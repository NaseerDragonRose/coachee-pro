"use client"

import Link from "next/link"
import { Clock, Lock, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export const WelcomeScreen = ({ hasDraft, onStart, onResume }: Props) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
        Let&apos;s figure out which tech career fits you.
      </h2>
      <p className="text-sm text-muted-foreground">
        A few honest questions about what you&apos;re good at, what you enjoy, and what
        you&apos;re worried about. There are no right or wrong answers, and nothing here
        is a test.
      </p>
    </div>

    <ul className="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300">
      <li className="flex items-center gap-3">
        <Clock className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        About 10 to 15 minutes
      </li>
      <li className="flex items-center gap-3">
        <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        Free, and you don&apos;t need an account
      </li>
      <li className="flex items-start gap-3">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <span>
          Your answers stay private —{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            how we handle your data
          </Link>
        </span>
      </li>
    </ul>

    <div className="flex flex-col gap-2">
      {hasDraft ? (
        <>
          <Button
            onClick={onResume}
            className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Pick up where you left off
          </Button>
          <Button
            variant="outline"
            onClick={onStart}
            className="h-12 w-full rounded-xl text-sm font-semibold"
          >
            Start over
          </Button>
        </>
      ) : (
        <Button
          onClick={onStart}
          className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Start the assessment
        </Button>
      )}
    </div>
  </div>
)

type Props = {
  hasDraft: boolean
  onStart: () => void
  onResume: () => void
}
