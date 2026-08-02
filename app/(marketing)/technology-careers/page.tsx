import type { Metadata } from "next"
import Link from "next/link"
import { Compass, Sparkles, ArrowRight } from "lucide-react"

import { CAREERS } from "@/lib/careers"
import { PageHeader } from "@/components/marketing/page-header"
import { CareerCard } from "@/components/marketing/career-card"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { AssessmentCta } from "@/components/assessment/assessment-cta"
import { Button, buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Technology Careers | CoacheePro",
  description:
    "Explore the top technology career paths CoacheePro evaluates—from Software Engineering and AI/ML to Cybersecurity and Product Management.",
}

export default function TechnologyCareersPage() {
  return (
    <main className="flex flex-1 flex-col pb-16">
      <PageHeader
        eyebrow="Career Explorer"
        title="Explore Technology Careers"
        subtitle='"Technology" isn’t just one career. It’s dozens of distinct roles with vastly different day-to-day problems, skill requirements, and working styles.'
      />

      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 space-y-12">
        {/* Assessment Engine Callout */}
        <Reveal>
          <Section spacing="tight" className="px-0 max-w-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Evaluated by Our Matching Engine
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Our assessment evaluates your problem-solving habits, academic interests, and working style to match you with your top 3 career fits.
                </p>
              </div>
              <AssessmentCta
                className={buttonVariants({
                  size: "sm",
                  className: "shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-10 px-4 shadow-md transition-all hover:scale-[1.01]",
                })}
              >
                <Compass className="mr-1.5 h-4 w-4" />
                <span>Take Free Test</span>
              </AssessmentCta>
            </div>
          </Section>
        </Reveal>

        {/* Career Cards Grid */}
        <Section spacing="tight" className="px-0 max-w-none">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAREERS.map((career, index) => (
              <Reveal key={career.title} delay={(index % 3) * 75} className="h-full">
                <CareerCard {...career} />
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Bottom CTA Banner */}
        <Reveal delay={200}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-8 sm:p-12 text-center text-white shadow-2xl">
            <div className="relative z-10 mx-auto max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Discover Your Fit
              </span>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Unsure Which Technology Path Fits You Best?
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                Take our 10-minute career assessment to receive your personalized tech career match and free preview dashboard.
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
                  <span>Ask a Question</span>
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