"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({
  value,
  max = 100,
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn("w-full", className)}
      {...props}
    >
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="h-1.5 w-full overflow-hidden bg-slate-200 dark:bg-slate-800"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full bg-indigo-600 transition-[width] duration-300 ease-out motion-reduce:transition-none dark:bg-indigo-500"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
