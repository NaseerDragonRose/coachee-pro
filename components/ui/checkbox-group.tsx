"use client"

import * as React from "react"
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group"

import { cn } from "@/lib/utils"
import { Checkbox } from "./checkbox"

function CheckboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxGroupPrimitive>) {
  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function CheckboxOption({ value, label }: CheckboxOptionProps) {
  return (
    <label
      data-slot="checkbox-option"
      className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 has-data-[checked]:border-indigo-600 has-data-[checked]:bg-indigo-50 has-data-[checked]:text-indigo-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:has-data-[checked]:border-indigo-500 dark:has-data-[checked]:bg-indigo-950/60 dark:has-data-[checked]:text-indigo-300"
    >
      <Checkbox name={value} />
      <span data-slot="checkbox-option-label">{label}</span>
    </label>
  )
}

type CheckboxOptionProps = {
  value: string
  label: string
}

export { CheckboxGroup, CheckboxOption }
