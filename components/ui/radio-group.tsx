"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function RadioOption({ value, label }: RadioOptionProps) {
  return (
    <label
      data-slot="radio-option"
      className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 has-data-[checked]:border-indigo-600 has-data-[checked]:bg-indigo-50 has-data-[checked]:text-indigo-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:has-data-[checked]:border-indigo-500 dark:has-data-[checked]:bg-indigo-950/60 dark:has-data-[checked]:text-indigo-300"
    >
      <RadioPrimitive.Root
        value={value}
        data-slot="radio-option-control"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors data-[checked]:border-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-900 dark:data-[checked]:border-indigo-500"
      >
        <RadioPrimitive.Indicator
          data-slot="radio-option-indicator"
          className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500"
        />
      </RadioPrimitive.Root>
      <span data-slot="radio-option-label">{label}</span>
    </label>
  )
}

type RadioOptionProps = {
  value: string
  label: string
}

export { RadioGroup, RadioOption }
