"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function ScaleInput({
  value,
  onValueChange,
  min,
  max,
  minLabel,
  maxLabel,
  name,
}: ScaleInputProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, index) => min + index)

  return (
    <div data-slot="scale-input" className="flex w-full flex-col gap-3">
      <RadioGroupPrimitive
        name={name}
        value={value ?? null}
        onValueChange={(next) => onValueChange(Number(next))}
        className="flex w-full gap-2"
        data-slot="scale-input-group"
      >
        {steps.map((step) => (
          <RadioPrimitive.Root
            key={step}
            value={step}
            aria-label={`${step} out of ${max}`}
            data-slot="scale-input-option"
            className={cn(
              "flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 text-base font-semibold text-slate-600 transition-colors",
              "hover:border-slate-300",
              "data-[checked]:border-indigo-600 data-[checked]:bg-indigo-600 data-[checked]:text-white",
              "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none",
              "dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 dark:data-[checked]:border-indigo-500 dark:data-[checked]:bg-indigo-500"
            )}
          >
            {step}
          </RadioPrimitive.Root>
        ))}
      </RadioGroupPrimitive>

      <div data-slot="scale-input-labels" className="flex justify-between gap-4 text-xs text-muted-foreground">
        <span data-slot="scale-input-min-label">{minLabel}</span>
        <span data-slot="scale-input-max-label" className="text-right">{maxLabel}</span>
      </div>
    </div>
  )
}

type ScaleInputProps = {
  value?: number
  onValueChange: (value: number) => void
  min: number
  max: number
  minLabel: string
  maxLabel: string
  name?: string
}

export { ScaleInput }
