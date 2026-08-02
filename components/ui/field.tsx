"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"

import { cn } from "@/lib/utils"

function Field({ className, ...props }: React.ComponentProps<typeof FieldPrimitive.Root>) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Label>) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Description>) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Error>) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      role="alert"
      className={cn("text-xs font-medium text-red-500", className)}
      {...props}
    />
  )
}

export { Field, FieldLabel, FieldDescription, FieldError }
