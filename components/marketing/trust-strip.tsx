import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"

export const TrustStrip = () => {
  return (
    <Reveal className="border-y border-border bg-muted/40">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-6 py-10 text-center sm:px-16">
        <ShieldCheck aria-hidden className="size-6 text-primary" />
        <p className="text-pretty text-sm text-muted-foreground">
          A real mentor reviews every Blueprint before it reaches you — and
          we never sell your personal data.{" "}
          <Link
            href="/faq"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Read our FAQ
          </Link>
        </p>
      </div>
    </Reveal>
  )
}
