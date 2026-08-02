import type { Metadata } from "next"
import Link from "next/link"
import { Target, Users, ShieldCheck, ArrowRight, Sparkles, Compass } from "lucide-react"

import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { AssessmentCta } from "@/components/assessment/assessment-cta"
import { Button, buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us | CoacheePro",
  description:
    "Learn why CoacheePro exists and how our AI-driven, mentor-verified guidance helps high school students choose the right technology career path.",
}

const DIFFERENCE_PILLARS = [
  {
    icon: Target,
    title: "100% Tech-Focused",
    description:
      "Unlike generic personality tests, our assessment is built strictly for technology disciplines—evaluating domain logic, problem-solving style, and engineering interest.",
  },
  {
    icon: Users,
    title: "Human Mentor Verified",
    description:
      "Every Tech Career Blueprint is reviewed by industry professionals before delivery, ensuring you get real-world context alongside algorithmic analysis.",
  },
  {
    icon: ShieldCheck,
    title: "No-Fluff Roadmaps",
    description:
      "We provide actionable degree paths, salary expectations, month-by-month skill roadmaps, and AI impact analysis without sales pitches for specific colleges.",
  },
]

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col pb-16">
      <PageHeader
        eyebrow="Our Story & Mission"
        title="Replacing Career Guesswork with Real-World Clarity"
        subtitle="CoacheePro helps high school students and parents navigate the complex tech landscape with data-backed career matching and human mentor verification."
      />

      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 space-y-16">
        {/* Our Mission */}
        <Reveal>
          <Section title="Our Mission" centered={false} spacing="tight" className="px-0">
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xl shadow-indigo-500/5 backdrop-blur-md sm:p-8 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-base text-slate-700 leading-relaxed sm:text-lg dark:text-slate-300">
                CoacheePro helps students pursuing tech figure out which technology career actually fits them <strong className="font-semibold text-slate-900 dark:text-slate-100">before</strong> they commit four or five years to a degree. We turn a confusing decision into a clear one: take a structured assessment, see which tech careers match your strengths, and get a concrete execution plan.
              </p>
            </div>
          </Section>
        </Reveal>

        {/* Why We Exist */}
        <Reveal delay={100}>
          <Section title="Why We Exist" centered={false} spacing="tight" className="px-0">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  The Information Overload
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Students are buried in fragmented advice from YouTube, relatives, and influencers. Questions like <em>"Which stream should I pick?"</em>, <em>"Will AI replace this role?"</em>, and <em>"What will I actually earn?"</em> go unanswered or get mixed responses.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Parent Peace of Mind
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Parents aren't looking for vague marketing roadmaps—they want confidence that their family isn't committing years and tuition to the wrong path. CoacheePro provides transparent, reliable guidance both parents and students can trust.
                </p>
              </div>
            </div>
          </Section>
        </Reveal>

        {/* Why We're Different */}
        <Reveal delay={200}>
          <Section title="Why We're Different" centered={false} spacing="tight" className="px-0">
            <div className="grid gap-6 sm:grid-cols-3">
              {DIFFERENCE_PILLARS.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.title}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm transition-all hover:border-indigo-500/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Section>
        </Reveal>

        {/* Bottom CTA Banner */}
        <Reveal delay={300}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-8 sm:p-12 text-center text-white shadow-2xl">
            <div className="relative z-10 mx-auto max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Start Your Career Journey
              </span>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Ready to Find Your Tech Career Match?
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                Take our free 10-minute career assessment engine to discover which technology roles best suit your cognitive strengths and personal interests.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <AssessmentCta
                  className={buttonVariants({
                    size: "lg",
                    className: "w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6 text-xs shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]",
                  })}
                >
                  <Compass className="mr-2 h-4 w-4" />
                  <span>Start Free Assessment</span>
                </AssessmentCta>
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="w-full sm:w-auto border-indigo-400/30 bg-indigo-900/40 text-indigo-100 hover:bg-indigo-900/80 h-11 px-6 text-xs"
                  render={<Link href="/contact" />}
                >
                  <span>Contact Our Team</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  )
}