"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Target, ShieldCheck, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAssessment } from "@/components/assessment/assessment-provider"

export const Hero = () => {
  const { openSignup } = useAssessment()

  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center lg:text-left lg:grid lg:grid-cols-12 lg:items-center">

        {/* Left Column: Headline, Copy & CTAs */}
        <div className="flex flex-col items-center lg:items-start lg:col-span-7 space-y-6">

          {/* 1. Eyebrow Badge */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built for Class 11 & 12</span>
          </div>

          {/* 2. Headline with Highlighted Word */}
          <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl text-balance text-4xl font-extrabold tracking-tight leading-[1.1] text-slate-900 sm:text-6xl dark:text-slate-50">
            Pick the right career{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              before
            </span>{" "}
            you pay for it.
          </h1>

          {/* 3. Subtitle / Value Proposition */}
          <p className="animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Most students choose a degree at 17 and regret it at 22. CoacheePro reads your strengths and weaknesses, then generates an AI career roadmap with real salary and growth numbers for the next 5–10 years—and the cheapest credible way to get there.
          </p>

          {/* 4. Action Buttons */}
          <div className="animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 flex w-full flex-col items-center gap-4 pt-2 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              className="h-12 w-full px-8 text-base font-semibold shadow-md transition-all hover:scale-[1.02] bg-indigo-600 hover:bg-indigo-700 text-white sm:w-auto"
              onClick={openSignup}
            >
              Start free assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full px-8 text-base font-medium transition-all hover:scale-[1.02] sm:w-auto"
              nativeButton={false}
              render={<Link href="/technology-careers" />}
            >
              Explore 10 Tech Paths
            </Button>
          </div>

          {/* 5. Microcopy */}
          <div className="animate-in fade-in delay-500 duration-700 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>No credit card. No sign-up needed to get your roadmap.</span>
          </div>

        </div>

        {/* Right Column: Hero Graphic Card Mockup */}
        <div className="animate-in fade-in slide-in-from-bottom-8 delay-700 duration-1000 relative mt-6 w-full lg:col-span-5 lg:mt-0">
          <div className="relative rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur-md sm:p-6 dark:border-slate-800 dark:bg-slate-950/80">

            {/* Header Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Class 12 CS · Match Result
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                96% Fit Score
              </span>
            </div>

            {/* Match Info */}
            <div className="mt-5 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  <Target className="h-3.5 w-3.5" />
                  Your Top Match
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Software / AI Developer
              </h3>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Strong logic and problem-solving aptitude. High growth in web applications, AI models, and cloud architecture.
              </p>

              {/* Skill Focus Pills */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recommended Skill Focus:
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded border bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Python & Data Structures
                  </span>
                  <span className="rounded border bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Full-Stack Web
                  </span>
                  <span className="rounded border bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    AI Prompt Engineering
                  </span>
                </div>
              </div>
            </div>

            {/* 10-Yr Salary Projection Box */}
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-left dark:border-slate-800/80 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  10-Yr Salary Projection
                </span>
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                ₹42 LPA
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Product Engineer Track vs ₹8L Non-Tech Average
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
