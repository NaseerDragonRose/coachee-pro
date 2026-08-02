import Link from "next/link"
import { ArrowRight, Sparkles, Target, ShieldCheck, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#F7F5F0] py-12 sm:py-20 text-black">
      {/* Architectural Grid Overlay Pattern */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:28px_28px]" 
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center lg:text-left lg:grid lg:grid-cols-12 lg:items-center">
        
        {/* Left Column: Headline, Copy & CTAs */}
        <div className="flex flex-col items-center lg:items-start lg:col-span-7 space-y-6">
          
          {/* 1. Neo-Brutalist Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
            <span>Built for Class 11 & 12</span>
          </div>

          {/* 2. High-Impact Headline with Highlighted Word Pill */}
          <h1 className="text-balance text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-black">
            Pick the right career{" "}
            <span className="inline-block bg-[#FF5500] text-white px-3.5 py-0.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              before
            </span>{" "}
            you pay for it.
          </h1>

          {/* 3. Subtitle / Value Proposition */}
          <p className="text-balance text-base sm:text-lg font-medium leading-relaxed text-slate-800 max-w-2xl">
            Most students choose a degree at 17 and regret it at 22. CoacheePro reads your strengths and weaknesses, then generates an AI career roadmap with real salary and growth numbers for the next 5–10 years—and the cheapest credible way to get there.
          </p>

          {/* 4. Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto h-13 px-8 text-base font-extrabold bg-[#FF5500] hover:bg-[#E64D00] text-white rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Start free assessment
              <ArrowRight className="ml-2 h-5 w-5 stroke-[3]" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-13 px-8 text-base font-extrabold bg-white hover:bg-slate-100 text-black rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              nativeButton={false}
              render={<Link href="/technology-careers" />}
            >
              Explore 10 Tech Paths
            </Button>
          </div>

          {/* 5. Microcopy */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>No credit card. No sign-up needed to get your roadmap.</span>
          </div>

        </div>

        {/* Right Column: Hero Graphic Card Mockup */}
        <div className="lg:col-span-5 w-full mt-6 lg:mt-0 relative">
          <div className="relative rounded-3xl border-2 border-black bg-white p-5 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            {/* Header Row */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-black">
                Class 12 CS · Match Result
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-emerald-300 px-3 py-0.5 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                96% Fit Score
              </span>
            </div>

            {/* Match Info */}
            <div className="mt-5 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#FF5500] px-2.5 py-1 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Target className="h-3.5 w-3.5" />
                  YOUR TOP MATCH
                </span>
              </div>

              <h3 className="text-2xl font-black text-black">
                Software / AI Developer
              </h3>
              
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Strong logic and problem-solving aptitude. High growth in web applications, AI models, and cloud architecture.
              </p>

              {/* Skill Focus Pills */}
              <div className="pt-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  Recommended Skill Focus:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg border-2 border-black bg-[#F7F5F0] px-2.5 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Python & Data Structures
                  </span>
                  <span className="rounded-lg border-2 border-black bg-[#F7F5F0] px-2.5 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Full-Stack Web
                  </span>
                  <span className="rounded-lg border-2 border-black bg-[#F7F5F0] px-2.5 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    AI Prompt Engineering
                  </span>
                </div>
              </div>
            </div>

            {/* 10-Yr Salary Projection Box */}
            <div className="mt-6 rounded-2xl border-2 border-black bg-[#F7F5F0] p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-600">
                  10-Yr Salary Projection
                </span>
                <TrendingUp className="h-4 w-4 text-[#FF5500]" />
              </div>
              <div className="mt-1 text-3xl font-black text-black tracking-tight">
                ₹42 LPA
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-700">
                Product Engineer Track vs ₹8L Non-Tech Average
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}