import Link from "next/link"

import { GradientBlob } from "@/components/marketing/gradient-blob"
import { Button } from "@/components/ui/button"

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <GradientBlob />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-28 text-center sm:px-16 sm:py-36">
        <h1 className="animate-in fade-in slide-in-from-bottom-4 text-balance text-5xl font-semibold tracking-tight duration-700 sm:text-6xl">
          Discover the Best Technology Career for You
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-4 max-w-xl text-pretty text-lg text-muted-foreground delay-150 duration-700">
          Take a free, structured assessment built for Class 11 &amp; 12
          students—see which tech career actually fits you.
        </p>
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-3 delay-300 duration-700 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base hover:scale-[1.02]"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Start Free Assessment
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base hover:scale-[1.02]"
            nativeButton={false}
            render={<Link href="/technology-careers" />}
          >
            Explore Technology Careers
          </Button>
        </div>
        <p className="animate-in fade-in text-sm text-muted-foreground delay-500 duration-700">
          Free to start · No credit card · 10–15 minutes
        </p>
      </div>
    </section>
  )
}
