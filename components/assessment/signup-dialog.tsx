"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useLenis } from "lenis/react"
import { Clock, ShieldCheck, Smartphone, X } from "lucide-react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"

import { useAssessment } from "./assessment-provider"

const REASONS = [
  {
    icon: Clock,
    title: "Pause Anytime",
    body: "Your answers save as you go, so you can stop after two questions and pick up later.",
  },
  {
    icon: Smartphone,
    title: "Any Device",
    body: "Start on your phone, finish on a laptop. Your blueprint follows you either way.",
  },
  {
    icon: ShieldCheck,
    title: "Never Shared",
    body: "We don't sell or share your details with colleges, recruiters, or anyone else.",
  },
]

export const SignupDialog = () => {
  const { isSignupOpen, closeSignup } = useAssessment()
  const lenis = useLenis()

  // Lenis drives scrolling on the root element and ignores the dialog's own
  // body lock, so the page keeps scrolling behind the sheet unless we stop it.
  useEffect(() => {
    if (!lenis) return
    if (isSignupOpen) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [isSignupOpen, lenis])

  return (
    <Dialog open={isSignupOpen} onOpenChange={(nextOpen) => !nextOpen && closeSignup()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <DialogTitle>Sign In to Start</DialogTitle>
            <DialogClose
              aria-label="Close sign in"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogClose>
          </header>

          <div
            className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-5 py-6"
            data-lenis-prevent
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-pretty text-slate-900 sm:text-3xl dark:text-slate-100">
                One Quick Sign In First
              </h2>
              <p className="text-sm text-muted-foreground">
                The assessment takes about 10&nbsp;minutes. Signing in first is what lets us
                keep your place and hand your results back whenever you want them.
              </p>
            </div>

            <ul className="flex flex-col gap-4">
              {REASONS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {title}
                    </p>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            <Button
              onClick={() => signIn("cognito", { callbackUrl: "/assessments" })}
              className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Continue With Google
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              We only read your name and email. Read our{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
