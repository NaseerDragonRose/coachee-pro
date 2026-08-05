"use client"

import { UserPlus } from "lucide-react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"

export const SignupScreen = () => (
  <div className="flex flex-col gap-6">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
      <UserPlus className="h-6 w-6" />
    </div>

    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
        Create your free account
      </h2>
      <p className="text-sm text-muted-foreground">
        One more step — sign up with Google to unlock your career matches. It takes a
        few seconds and there&apos;s no password to remember.
      </p>
    </div>

    <Button
      onClick={() => signIn("cognito", { callbackUrl: "/?assessment=done" })}
      className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
    >
      Continue with Google
    </Button>
  </div>
)
