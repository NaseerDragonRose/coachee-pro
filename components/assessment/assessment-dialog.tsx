"use client"

import { X } from "lucide-react"
import { useLenis } from "lenis/react"
import { useEffect } from "react"

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"

import { AssessmentFlow } from "./assessment-flow"
import { useAssessment } from "./assessment-provider"

export const AssessmentDialog = () => {
  const { isOpen, close } = useAssessment()
  const lenis = useLenis()

  // Lenis drives scrolling on the root element and ignores the dialog's own
  // body lock, so the page keeps scrolling behind the sheet unless we stop it.
  useEffect(() => {
    if (!lenis) return
    if (isOpen) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [isOpen, lenis])

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => !nextOpen && close()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <DialogTitle>Free career assessment</DialogTitle>
            <DialogClose
              aria-label="Close assessment"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </DialogClose>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            <AssessmentFlow />
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
