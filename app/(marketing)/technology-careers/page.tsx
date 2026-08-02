import type { Metadata } from "next"
import Link from "next/link"
import { Compass, Sparkles, ArrowRight } from "lucide-react"

import { CAREERS } from "@/lib/careers"
import { PageHeader } from "@/components/marketing/page-header"
import { CareerCard } from "@/components/marketing/career-card"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Technology Careers | CoacheePro",
  description:
    "Explore the top technology career paths CoacheePro evaluates—from Software Engineering and AI/ML to Cybersecurity and Product Management.",
}

export default function TechnologyCareersPage() {
  return (
    <main className="flex flex-1 flex-col pb-20 bg-[#F7F5F0] text-black">
      <PageHeader
        eyebrow="Career Explorer"
        title="Explore Technology Careers"
        subtitle='"Technology" isn’t just one career. It’s dozens of distinct roles with vastly different day-to-day problems, skill requirements, and working styles.'
      />

      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 space-y-12 mt-4">
        {/* Assessment Engine Callout */}
        <Reveal>
          <Section spacing="tight" className="px-0 max-w-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-black">
                  Evaluated by Our Matching Engine
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed max-w-2xl">
                  Our assessment evaluates your problem-solving habits, academic interests, and working style to match you with your top 3 career fits.
                </p>
              </div>
              <Button
                size="sm"
                nativeButton={false}
                className="shrink-0 bg-[#FF5500] hover:bg-[#E64D00] text-white font-black text-xs uppercase tracking-wider h-11 px-6 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                render={<Link href="/" />}
              >
                <Compass className="mr-2 h-4 w-4 stroke-[2.5]" />
                <span>Take Free Test</span>
              </Button>
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
          <div className="relative overflow-hidden rounded-3xl bg-[#FF5500] border-2 border-black p-8 sm:p-14 text-center text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative z-10 mx-auto max-w-2xl space-y-5 flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5500] stroke-[2.5]" />
                Discover Your Fit
              </span>
              <h2 className="text-balance text-3xl font-black tracking-tight sm:text-5xl text-black leading-tight">
                Unsure Which Technology Path Fits You Best?
              </h2>
              <p className="text-xs sm:text-sm font-bold text-black/90 leading-relaxed">
                Take our 10-minute career assessment to receive your personalized tech career match and free preview dashboard.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="w-full sm:w-auto h-12 px-8 text-xs font-black uppercase tracking-wider rounded-full border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  render={<Link href="/" />}
                >
                  <Compass className="mr-2 h-4 w-4 stroke-[2.5]" />
                  <span>Start Free Assessment</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="w-full sm:w-auto h-12 px-8 text-xs font-black uppercase tracking-wider rounded-full border-2 border-black bg-black text-white hover:bg-slate-900 transition-all hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  render={<Link href="/contact" />}
                >
                  <span>Ask a Question</span>
                  <ArrowRight className="ml-1.5 h-4 w-4 stroke-[2.5]" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  )
}