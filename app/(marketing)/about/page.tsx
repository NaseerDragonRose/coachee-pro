import type { Metadata } from "next"
import Link from "next/link"
import { Target, Users, ShieldCheck, ArrowRight, Sparkles, Compass } from "lucide-react"

import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us | CoacheePro",
  description:
    "Learn why CoacheePro exists and how our AI-driven, mentor-verified guidance helps high school students choose the right technology career path.",
}

const DIFFERENCE_PILLARS = [
  {
    icon: Target,
    title: "100% Tech-Focused Assessment",
    description:
      "Unlike generic personality tests, our assessment is built strictly for technology disciplines—evaluating domain logic, problem-solving style, and engineering interest.",
  },
  {
    icon: Users,
    title: "Verified by Human Mentors",
    description:
      "Every Tech Career Blueprint is reviewed by industry professionals before delivery, ensuring you get real-world context alongside algorithmic analysis.",
  },
  {
    icon: ShieldCheck,
    title: "No-Fluff Actionable Roadmaps",
    description:
      "We provide actionable degree paths, salary expectations, month-by-month skill roadmaps, and AI impact analysis without sales pitches for specific colleges.",
  },
]

export default function AboutPage() {
  return (
    // Set warm cream background for editorial feel
    <main className="flex flex-1 flex-col pb-16 bg-[#F7F5F0]">
      <PageHeader
        eyebrow="Our Story & Mission"
        title="Replacing Career Guesswork with Real-World Clarity"
        subtitle="CoacheePro helps high school students and parents navigate the complex tech landscape with data-backed career matching and human mentor verification."
      />

      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 space-y-16 mt-6 sm:mt-10">
        {/* Our Mission */}
        <Reveal>
          <Section title="Our Mission" centered={false} spacing="tight" className="px-0">
            {/* Neo-Brutalist Card Style */}
            <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000000] sm:p-10">
              <p className="text-lg font-medium leading-relaxed text-black/90 sm:text-2xl">
                CoacheePro helps students pursuing tech figure out which technology career actually fits them <strong className="font-black text-black">before</strong> they commit four or five years to a degree. We turn a confusing decision into a clear one: take a structured assessment, see which tech careers match your strengths, and get a concrete execution plan.
              </p>
            </div>
          </Section>
        </Reveal>

        {/* Why We Exist */}
        <Reveal delay={100}>
          <Section title="Why We Exist" centered={false} spacing="tight" className="px-0">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Data-focused Editorial Text Block */}
              <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000000]">
                <h3 className="text-lg font-black uppercase tracking-tight text-black mb-3">
                  The Information Overload
                </h3>
                <p className="text-sm font-semibold leading-relaxed text-slate-800">
                  Students are buried in fragmented advice from YouTube, relatives, and influencers. Vague questions like <em>"Will AI replace this role?"</em> or <em>"What will I actually earn?"</em> go unanswered or get generic, unreliable responses.
                </p>
              </div>

              <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000000]">
                <h3 className="text-lg font-black uppercase tracking-tight text-black mb-3">
                  Parent Peace of Mind
                </h3>
                <p className="text-sm font-semibold leading-relaxed text-slate-800">
                  Parents aren&apos;t looking for marketing roadmaps—they want confidence that their family isn&apos;t committing years and tuition to the wrong path. CoacheePro provides transparent, data-verified guidance both parents and students can trust.
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
                  // Neo-Brutalist Grid Card
                  <div
                    key={pillar.title}
                    className="flex flex-col gap-4 rounded-3xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]"
                  >
                    {/* Brand Icon Style matching Header/Hero */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black bg-black text-white shadow-[2px_2px_0px_0px_#000000]">
                      <Icon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-black tracking-tight text-black leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-semibold leading-relaxed text-slate-700">
                      {pillar.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Section>
        </Reveal>

        {/* High-Energy Electric Orange CTA Banner */}
        <Reveal delay={300}>
          <div className="relative overflow-hidden rounded-3xl bg-[#FF5500] border-2 border-black p-8 sm:p-14 text-center text-black shadow-2xl shadow-slate-950/20">
            <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center space-y-5">
              {/* Hard Badge Style */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black bg-white px-4 py-1.5 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000000]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                Start Your Career Journey
              </span>
              
              <h2 className="text-balance text-3xl font-black tracking-tight sm:text-5xl text-black leading-tight">
                Ready to Find Your Tech Career Match?
              </h2>
              <p className="text-sm sm:text-base text-slate-950/90 font-semibold leading-relaxed">
                Take our free 10-minute career assessment engine to discover which technology roles best suit your cognitive strengths and personal interests.
              </p>
              
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                {/* White Neo-Brutalist Primary Button */}
                <Button
                  size="lg"
                  nativeButton={false}
                  className="w-full sm:w-auto h-12 px-8 text-xs font-black uppercase tracking-wider rounded-full border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000000] transition-all hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000]"
                  render={<Link href="/" />}
                >
                  <Compass className="mr-2 h-4 w-4 stroke-[2.5]" />
                  <span>Start Free Assessment</span>
                </Button>
                {/* Black Neo-Brutalist Secondary Button */}
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="w-full sm:w-auto h-12 px-8 text-xs font-black uppercase tracking-wider rounded-full border border-black/20 bg-slate-950 text-white hover:bg-black transition-all hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000]"
                  render={<Link href="/contact" />}
                >
                  <span>Contact Advisors</span>
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