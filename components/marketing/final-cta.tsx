import Link from "next/link"
import { ArrowRight, Sparkles, ShieldCheck, Check } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"
import { Button } from "@/components/ui/button"

export const FinalCta = () => {
  return (
    <section className="px-6 py-12 sm:py-20">
      <Reveal className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl shadow-indigo-500/10">
        <div className="relative flex w-full flex-col items-center px-6 py-16 text-center sm:px-16 sm:py-24">
          
          {/* Ambient Glows */}
          <div 
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" 
            aria-hidden="true" 
          />
          <div 
            className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-purple-500/15 blur-3xl" 
            aria-hidden="true" 
          />

          {/* Eyebrow Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Ready for Class of 2026 / 2027</span>
          </div>

          {/* Main Headline */}
          <h2 className="relative z-10 mt-6 max-w-2xl text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Stop Guessing. <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Start Your Tech Journey</span> with Clarity.
          </h2>

          {/* Subtitle */}
          <p className="relative z-10 mt-4 max-w-lg text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
            Take the 10-minute structured assessment. Uncover your ideal tech role, key skills to learn, and exact college degree roadmap.
          </p>

          {/* CTA Action Button */}
          <div className="relative z-10 mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] bg-indigo-600 hover:bg-indigo-500 text-white"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Start Free Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Trust Checklist Footer */}
          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-indigo-400" />
              100% Free to Start
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-indigo-400" />
              No Credit Card Required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              No Account Needed to Preview
            </span>
          </div>

        </div>
      </Reveal>
    </section>
  )
}