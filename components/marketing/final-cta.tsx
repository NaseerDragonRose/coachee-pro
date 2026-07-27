import Link from "next/link"

import { Reveal } from "@/components/marketing/reveal"
import { Button } from "@/components/ui/button"

export const FinalCta = () => {
  return (
    <Reveal className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center sm:px-16">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Stop guessing. Start with clarity.
        </h2>
        <p className="max-w-md text-pretty text-primary-foreground/90">
          Take the free assessment today — it takes 10–15 minutes and
          there&rsquo;s no card required.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="h-12 px-8 text-base hover:scale-[1.02]"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Start Free Assessment
        </Button>
      </div>
    </Reveal>
  )
}
