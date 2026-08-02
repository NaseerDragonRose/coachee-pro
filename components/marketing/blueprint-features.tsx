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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1: Wide Feature - 12-Month Roadmap */}
        <Reveal delay={0} className="sm:col-span-2">
          <div className="group relative h-full rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Compass className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black">
                    Step-by-Step 12-Month Roadmap
                  </h3>
                  <p className="text-xs font-bold text-slate-700">Know what to learn every month</p>
                </div>
              </div>
              <span className="rounded-full border-2 border-black bg-indigo-100 px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Action Plan
              </span>
            </div>

            {/* Visual Timeline Preview */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-black bg-[#F7F5F0] p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5500]">Months 1–3</span>
                <p className="mt-1 text-xs font-black text-black">Programming Foundations</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-700">Syntax, logic, and mini projects</p>
              </div>
              <div className="rounded-xl border-2 border-black bg-[#F7F5F0] p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5500]">Months 4–6</span>
                <p className="mt-1 text-xs font-black text-black">Core Tech Stack</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-700">Frameworks and database basics</p>
              </div>
              <div className="rounded-xl border-2 border-black bg-[#F7F5F0] p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5500]">Months 7–12</span>
                <p className="mt-1 text-xs font-black text-black">Real Portfolio Building</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-700">Deploy live apps and build proof</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Card 2: College & Degree Guidance */}
        <Reveal delay={100}>
          <div className="group relative flex h-full flex-col justify-between rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-purple-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <GraduationCap className="h-5 w-5 stroke-[2.5]" />
              </div>
              <h3 className="mt-4 text-lg font-black text-black">
                College & Degree Guidance
              </h3>
              <p className="mt-1.5 text-xs font-semibold leading-relaxed text-slate-700">
                Clear comparison of B.Tech vs. BCA vs. BSc CS. Pick the right degree without overpaying for college labels.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t-2 border-black">
              <span className="rounded-md border border-black bg-[#F7F5F0] px-2 py-0.5 text-[11px] font-extrabold text-black">B.Tech CS</span>
              <span className="rounded-md border border-black bg-[#F7F5F0] px-2 py-0.5 text-[11px] font-extrabold text-black">BCA + AI</span>
              <span className="rounded-md border border-black bg-[#F7F5F0] px-2 py-0.5 text-[11px] font-extrabold text-black">BSc CS</span>
            </div>
          </div>
        </Reveal>

        {/* Card 3: Required Tech Stack */}
        <Reveal delay={150}>
          <div className="group relative flex h-full flex-col justify-between rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-blue-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Code2 className="h-5 w-5 stroke-[2.5]" />
              </div>
              <h3 className="mt-4 text-lg font-black text-black">
                Exact Skills to Learn
              </h3>
              <p className="mt-1.5 text-xs font-semibold leading-relaxed text-slate-700">
                Zero guesswork. Get a clean, prioritized list of programming languages, tools, and platforms to master.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-black pt-3 border-t-2 border-black">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 stroke-[3]" />
              Prioritized by Market Demand
            </div>
          </div>
        </Reveal>

        {/* Card 4: Salary & Growth Benchmarks */}
        <Reveal delay={200}>
          <div className="group relative flex h-full flex-col justify-between rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-emerald-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <TrendingUp className="h-5 w-5 stroke-[2.5]" />
              </div>
              <h3 className="mt-4 text-lg font-black text-black">
                Realistic Salary Expectations
              </h3>
              <p className="mt-1.5 text-xs font-semibold leading-relaxed text-slate-700">
                Clear income projections for Entry-Level, 3-Year, 5-Year, and 10-Year milestones based on real industry data.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-mono font-black text-black bg-emerald-200 border-2 border-black px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>Entry: ₹6–12L</span>
              <span>•</span>
              <span>5-Yr: ₹20–35+L</span>
            </div>
          </div>
        </Reveal>

        {/* Card 5: Common Mistakes Warning */}
        <Reveal delay={250}>
          <div className="group relative flex h-full flex-col justify-between rounded-2xl border-2 border-black bg-amber-300 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <AlertTriangle className="h-5 w-5 stroke-[2.5] text-[#FF5500]" />
              </div>
              <h3 className="mt-4 text-lg font-black text-black">
                Costly Mistakes to Avoid
              </h3>
              <p className="mt-1.5 text-xs font-bold leading-relaxed text-black/90">
                Avoid common traps like overpaying for low-value college brands or studying outdated curricula.
              </p>
            </div>
            <div className="mt-4 text-xs font-black uppercase text-black pt-3 border-t-2 border-black">
              ⚠️ Save months of wasted effort
            </div>
          </div>
        </Reveal>

      </div>

      {/* Access Micro-Footer */}
      <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <FileText className="h-4 w-4 text-[#FF5500] stroke-[2.5]" />
          <span>Delivered as an interactive web view + instant PDF download</span>
        </div>
      </div>
    </Section>
  )
}