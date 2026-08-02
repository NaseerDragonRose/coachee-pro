"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const controlClassName =
  "w-full rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 aria-invalid:border-red-500 aria-invalid:ring-red-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-indigo-400"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input data-slot="input" className={cn(controlClassName, className)} {...props} />
  )
}

export { Input, controlClassName }
