"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"

import { ProfileCompletion } from "./profile-completion"

// Dismissal lives in localStorage rather than a column: it's a nudge, not a
// fact about the account, and a stray dismissal on one device shouldn't
// silence the prompt everywhere forever. Completing the profile is what
// records state properly, via `users.consented_at`.
const DISMISSED_KEY = "coacheepro.profile-prompt.dismissed.v1"

// An optional prompt, never a gate. The account already exists — the sign-in
// callback creates it from the Google profile — so nothing here is needed for
// the app to work. It only asks for the phone number and contact consent,
// which Google can't give us.
export const ProfilePrompt = ({ name }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // localStorage isn't available during SSR, so this can't run in render.
    try {
      if (window.localStorage.getItem(DISMISSED_KEY)) return
    } catch {
      // Blocked by browser settings — show the prompt rather than swallow it.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(true)
  }, [])

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISSED_KEY, new Date().toISOString())
    } catch {
      // Private mode or quota — it'll ask again next visit, which is fine.
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && dismiss()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="h-auto rounded-t-2xl sm:h-auto sm:w-[min(28rem,calc(100vw-2rem))]">
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <DialogTitle>Add Your Contact Details</DialogTitle>
            <DialogClose
              aria-label="Close"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogClose>
          </header>

          <div className="flex flex-col gap-5 overflow-y-auto overscroll-contain px-5 py-6">
            <p className="text-sm text-muted-foreground">
              Optional, and you can do it later. A number lets a mentor talk your
              results through with you — we never use it for marketing blasts.
            </p>

            <ProfileCompletion name={name} onDone={() => setIsOpen(false)} />

            <button
              type="button"
              onClick={dismiss}
              className="inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Skip for Now
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}

type Props = {
  name: string
}
