"use client"

import { MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

export const ConfirmationScreen = ({ name, onClose }: Props) => (
  <div className="flex flex-col gap-6 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
      <MailCheck className="h-6 w-6" />
    </div>

    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {name ? `Thanks, ${name}!` : "Thanks!"}
      </h2>
      <p className="text-sm text-muted-foreground">
        We&apos;ve got your answers. A career advisor will look through them and send your
        up to 3 career matches — with the one we&apos;d back for you — within 24 hours.
      </p>
    </div>

    <Button
      variant="outline"
      onClick={onClose}
      className="h-12 w-full rounded-xl text-sm font-semibold"
    >
      Close
    </Button>
  </div>
)

type Props = {
  name?: string
  onClose: () => void
}
