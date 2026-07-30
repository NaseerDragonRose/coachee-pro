import { ClipboardCheck, Compass, FileText, Users } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

const STEPS = [
  {
    step: "01",
    icon: ClipboardCheck,
    title: "Take the 10-Min Test",
    description:
      "Answer short, clear questions about your favorite subjects, logic strengths, and work preferences.",
    badge: "100% Free · No Card",
  },
  {
    step: "02",
    icon: Compass,
    title: "See Your Top Matches",
    description:
      "Instantly view your top 3 tech career fits (like AI Developer or Web Engineer) with clear fit scores.",
    badge: "Instant Results",
  },
  {
    step: "03",
    icon: FileText,
    title: "Get College & Skill Plan",
    description:
      "Unlock your full roadmap: exact skills to learn, recommended degrees (B.Tech/BCA), and salary outlooks.",
    badge: "Full Blueprint PDF",
  },
  {
    step: "04",
    icon: Users,
    title: "Talk to a Mentor",
    description:
      "Optionally connect with an active tech professional to review your plan with your parents and clear doubts.",
    badge: "Optional 1-on-1 Call",
  },
] as const

export const HowItWorks = () => {
  return (
    <Section
      eyebrow="Simple 4-Step Process"
      title="How You Find the Right Tech Path"
      description="No complex forms or long processes. Just 10 minutes to choose your degree, tech skills, and career direction with confidence."
      spacing="loose"
      className="max-w-6xl"
    >
      <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Visual Pipeline Connecting Line for Desktop */}
        <div 
          className="absolute top-1/2 left-0 hidden h-[2px] w-full -translate-y-12 bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block dark:via-slate-800" 
          aria-hidden="true" 
        />

        {STEPS.map(({ step, icon: Icon, title, description, badge }, index) => (
          <Reveal key={title} delay={index * 120}>
            <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/30">
              
              {/* Header Row: Step Number & Icon */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/80 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
                    <Icon aria-hidden className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-extrabold text-indigo-600/80 dark:text-indigo-400">
                    Step {step}
                  </span>
                </div>

                {/* Step Content */}
                <div className="mt-4">
                  <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="mt-6 pt-3">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-700 dark:bg-slate-900 dark:text-slate-400 dark:group-hover:bg-indigo-950/60 dark:group-hover:text-indigo-300">
                  {badge}
                </span>
              </div>

            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}