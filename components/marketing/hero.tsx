import Link from "next/link"
import { ArrowRight, Sparkles, Target, GraduationCap, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 text-center">
        
        {/* 1. Student-Focused Eyebrow Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>For 11th & 12th Grade Students</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-normal text-muted-foreground">Class of 2026 / 2027</span>
        </div>

        {/* 2. Instant-Read Headline (Read in 1 Second) */}
        <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-slate-50">
          Choose the Right Tech Career <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Before College</span>
        </h1>

        {/* 3. Punchy, Zero-Jargon Subtitle */}
        <p className="animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          Don't waste years in the wrong degree. Take a quick 10-minute test to find the exact tech path, required skills, and college degree that fits you.
        </p>

        {/* 4. Action-Oriented Buttons */}
        <div className="animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base font-semibold shadow-md transition-all hover:scale-[1.02] bg-indigo-600 hover:bg-indigo-700 text-white"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Find My Tech Career
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base font-medium transition-all hover:scale-[1.02]"
            nativeButton={false}
            render={<Link href="/technology-careers" />}
          >
            Explore 10 Careers
          </Button>
        </div>

        {/* 5. Friction-Free Microcopy */}
        <p className="animate-in fade-in text-xs font-medium text-muted-foreground delay-500 duration-700">
          100% Free · No Signup Needed · 10 Mins
        </p>

        {/* 6. Student Dashboard Preview (What they actually get) */}
        <div className="animate-in fade-in slide-in-from-bottom-8 delay-700 duration-1000 mt-4 w-full max-w-4xl rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-2xl shadow-indigo-500/10 backdrop-blur-md sm:p-6 dark:border-slate-800 dark:bg-slate-950/80">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">Sample Student Result · Class 12 CS</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              96% Fit Score
            </span>
          </div>

          {/* Student Result Card */}
          <div className="mt-4 grid gap-4 text-left sm:grid-cols-3">
            
            {/* Top Match */}
            <div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/80 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  <Target className="h-3.5 w-3.5" />
                  Your Best Match
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Based on Math & Logic Strengths
                </span>
              </div>

              <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Software / AI Developer
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                You enjoy problem-solving and coding logic. Best suited for high-growth tech products and app development.
              </p>

              {/* What to learn right now */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Start Learning Now:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium border text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">Python Basics</span>
                  <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium border text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">Logic & Algorithms</span>
                  <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium border text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">Web Basics</span>
                </div>
              </div>
            </div>

            {/* College & Degree Guidance Box */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/80 dark:bg-slate-900/60">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Recommended Degree
                </span>
                <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                  B.Tech CS or BCA + AI
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Focus on practical projects over college brand reputation alone.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Full 4-Year College Plan Inside
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}