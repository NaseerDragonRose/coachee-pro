import { Sparkles } from "lucide-react"

import { BlueprintFeatures } from "@/components/marketing/blueprint-features"
import { CareerPreviewGrid } from "@/components/marketing/career-preview-grid"
import { FinalCta } from "@/components/marketing/final-cta"
import { Hero } from "@/components/marketing/hero"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { TrustStrip } from "@/components/marketing/trust-strip"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-[#F7F5F0] text-black">
      <Hero />

      {/* "The Reality" Problem & Solution Section */}
      <Reveal>
        <Section spacing="tight">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
            
            {/* 1. Neo-Brutalist Eyebrow Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="h-3.5 w-3.5 text-[#FF5500] stroke-[2.5]" />
              <span>The Reality</span>
            </span>

            {/* 2. Bold Ink-Black Headline */}
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-black sm:text-5xl leading-[1.1]">
              Everyone has an opinion about your future.
            </h2>

            {/* 3. Problem Statement */}
            <p className="mt-4 text-balance text-sm sm:text-base font-semibold leading-relaxed text-slate-800">
              Parents, teachers, relatives, and social media all mean well—but their advice is based on their experiences, not your unique strengths, interests, and ambitions.
            </p>

            {/* 4. Highlighted Solution Box */}
            <div className="mt-6 rounded-2xl border-2 border-black bg-amber-200 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-balance text-sm sm:text-base font-black leading-relaxed text-black">
                CoacheePro helps you cut through the noise with a structured assessment and a personalized career path, so you can make one of life&apos;s biggest decisions with clarity and confidence.
              </p>
            </div>

          </div>
        </Section>
      </Reveal>

      <HowItWorks />
      <CareerPreviewGrid />
      <BlueprintFeatures />
      <TrustStrip />
      <FinalCta />
    </main>
  )
}