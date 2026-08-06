"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"

// Discarding deletes the draft outright — there is no undo and nothing kept
// on the server. The project has no toast primitive to hang an undo window on
// either, which makes confirmation the honest option rather than the lazy one.
export const DiscardDialog = ({ open, onOpenChange, onConfirm, pending, title, body, confirmLabel }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogBackdrop />
      {/* The shared popup is a full-height sheet, which is right for 18
          questions and wrong for a two-line confirmation. On mobile this sits
          at the bottom at its natural height instead. */}
      <DialogPopup className="h-auto rounded-t-2xl sm:h-auto sm:w-[min(28rem,calc(100vw-2rem))]">
        <div className="flex flex-col gap-4 px-5 py-6">
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{body}</p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {/* Cancel is the safe default and takes focus first. */}
            <DialogClose
              autoFocus
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Cancel
            </DialogClose>
            <Button
              onClick={onConfirm}
              disabled={pending}
              className="h-12 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {pending ? "Discarding…" : confirmLabel}
            </Button>
          </div>
        </div>
      </DialogPopup>
    </DialogPortal>
  </Dialog>
)

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  pending: boolean
  title: string
  body: string
  confirmLabel: string
}
