"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white transition-colors",
        "data-[checked]:border-indigo-600 data-[checked]:bg-indigo-600",
        "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none",
        "dark:border-slate-700 dark:bg-slate-900 dark:data-[checked]:border-indigo-500 dark:data-[checked]:bg-indigo-500",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex text-white">
        <Check className="h-3.5 w-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
