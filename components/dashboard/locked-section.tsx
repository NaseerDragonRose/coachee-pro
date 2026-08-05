"use client"

import type { ReactNode } from "react"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"

export const LockedSection = ({ isLocked, onUnlock, children }: Props) => {
  if (!isLocked) return <>{children}</>

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/80 px-4 text-center dark:bg-slate-950/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
          <Lock className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Unlock the full Blueprint to see this
        </p>
        <Button
          onClick={onUnlock}
          className="h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Unlock Full Blueprint
        </Button>
      </div>
    </div>
  )
}

type Props = {
  isLocked: boolean
  onUnlock: () => void
  children: ReactNode
}
