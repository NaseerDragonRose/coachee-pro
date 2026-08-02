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
    <main className="flex flex-1 flex-col">
      <Hero />
      <Reveal>
        <Section
          spacing="tight"
          eyebrow="The Reality"
          title="Everyone has an opinion about your future."
          description="Parents, teachers, relatives, and social media all mean well—but their advice is based on their experiences, not your unique strengths, interests, and ambitions."
        >
          <div className="mx-auto max-w-3xl px-4">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5 text-center dark:border-indigo-400/20 dark:bg-indigo-400/10">
              <p className="text-pretty text-sm font-semibold leading-relaxed text-slate-900 sm:text-base dark:text-slate-50">
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
