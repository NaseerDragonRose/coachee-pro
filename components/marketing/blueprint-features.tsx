import {
  GraduationCap,
  TrendingUp,
  Code2,
  AlertTriangle,
  Compass,
  FileText,
  CheckCircle2
} from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

export const BlueprintFeatures = () => {
  return (
    <Section
      eyebrow="Tech Career Blueprint"
      title="Everything You Need to Choose Your Path"
      description="A complete personalized report delivered directly to your screen and as a PDF. No vague advice—just actionable guidance."
      spacing="loose"
      className="max-w-6xl"
    >
      {/* Bento Grid Layout */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1: Wide Feature - 12-Month Roadmap */}
        <Reveal delay={0} className="sm:col-span-2">
          <div className="group relative h-full rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/30">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Step-by-Step 12-Month Roadmap
                  </h3>
                  <p className="text-xs text-muted-foreground">Know what to learn every month</p>
                </div>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                Action Plan
              </span>
            </div>

            {/* Visual Timeline Preview */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/50">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Months 1–3</span>
                <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">Programming Foundations</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Syntax, logic, and mini projects</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/50">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Months 4–6</span>
                <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">Core Tech Stack</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Frameworks and database basics</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/50">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Months 7–12</span>
                <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">Real Portfolio Building</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Deploy live apps and build proof</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Card 2: College & Degree Guidance */}
        <Reveal delay={100}>
          <div className="group relative h-full flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
                College & Degree Guidance
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Clear comparison of B.Tech vs. BCA vs. BSc CS. Pick the right degree without overpaying for college labels.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">B.Tech CS</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">BCA + AI</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">BSc CS</span>
            </div>
          </div>
        </Reveal>

        {/* Card 3: Required Tech Stack */}
        <Reveal delay={150}>
          <div className="group relative h-full flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
                Exact Skills to Learn
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Zero guesswork. Get a clean, prioritized list of programming languages, tools, and platforms to master.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Prioritized by Job Market Demand
            </div>
          </div>
        </Reveal>

        {/* Card 4: Salary & Growth Benchmarks */}
        <Reveal delay={200}>
          <div className="group relative h-full flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
                Realistic Salary Expectations
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Clear income projections for Entry-Level, 3-Year, 5-Year, and 10-Year milestones based on real industry data.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
              <span>Entry: ₹6–12 LPA</span>
              <span>•</span>
              <span>5-Yr: ₹20–35+ LPA</span>
            </div>
          </div>
        </Reveal>

        {/* Card 5: Common Mistakes Warning */}
        <Reveal delay={250}>
          <div className="group relative h-full flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-amber-50/30 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
                Costly Mistakes to Avoid
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Avoid the common traps other students make—like learning outdated tech stacks or ignoring practical portfolio projects.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-amber-800 dark:text-amber-400">
              ⚠️ Save months of wasted effort
            </div>
          </div>
        </Reveal>

      </div>

      {/* Download & Access Micro-Footer */}
      <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Delivered as an interactive web view + instant PDF download</span>
        </div>
      </div>
    </Section>
  )
}