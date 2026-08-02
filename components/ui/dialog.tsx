"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function DialogPopup({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={cn(
        // Mobile: full-height sheet anchored to the bottom.
        "fixed inset-x-0 bottom-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden",
        "border-t border-slate-200 bg-white text-slate-900 shadow-2xl",
        "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100",
        // Desktop: centered, constrained panel.
        "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[85dvh] sm:w-[min(32rem,calc(100vw-2rem))]",
        "sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border",
        // Motion, suppressed under reduced-motion.
        "transition-all duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "data-[starting-style]:translate-y-4 data-[ending-style]:translate-y-4",
        "sm:data-[starting-style]:translate-y-[calc(-50%+0.5rem)] sm:data-[ending-style]:translate-y-[calc(-50%+0.5rem)]",
        "motion-reduce:transition-none motion-reduce:data-[starting-style]:translate-y-0",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-bold sm:text-xl", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

export {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
