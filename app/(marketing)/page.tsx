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
        <Section spacing="tight" className="text-center">
          <div className="mx-auto max-w-3xl px-4 text-center">
  <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
    YouTube, relatives, teachers, influencers: everyone has an opinion on your future, 
    and most of them contradict each other. Parents want more than reassurance; they want 
    confidence their child isn’t about to waste years on the wrong path. CoacheePro cuts 
    through the noise with one clear, structured answer.
  </p>
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
