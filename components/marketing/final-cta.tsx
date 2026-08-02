import Link from "next/link"
import { ArrowRight, ShieldCheck, Check } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"
import { Button } from "@/components/ui/button"

export const FinalCta = () => {
  return (
    <section className="py-12 sm:py-20 bg-[#FF5500] border-y-2 border-black text-white">
      <Reveal className="mx-auto max-w-5xl px-6">
        <div className="flex w-full flex-col items-center text-center">
          
          {/* Main Headline */}
          <h2 className="text-balance text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white max-w-3xl">
            15 minutes now. Ten years of clarity.
          </h2>

          {/* Subtitle */}
          <p className="mt-4 max-w-xl text-balance text-base sm:text-lg font-bold text-white/90">
            Your assessment is free, forever. Your career roadmap is generated in under a minute.
          </p>

          {/* CTA Action Button */}
          <div className="mt-8">
            <Button
              size="lg"
              className="h-14 px-10 text-base font-black bg-white hover:bg-slate-100 text-black rounded-full border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Take the free assessment
              <ArrowRight className="ml-2 h-5 w-5 stroke-[3]" />
            </Button>
          </div>

          {/* Trust Checklist Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-black uppercase text-white">
            <span className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/20">
              <Check className="h-4 w-4 stroke-[3]" />
              100% Free to Start
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/20">
              <Check className="h-4 w-4 stroke-[3]" />
              No Credit Card
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/20">
              <ShieldCheck className="h-4 w-4 stroke-[3]" />
              Instant Roadmap Preview
            </span>
          </div>

        </div>
      </Reveal>
    </section>
  )
}