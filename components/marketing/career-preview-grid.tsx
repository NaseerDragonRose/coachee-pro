import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CAREERS } from "@/lib/careers"
import { CareerCard } from "@/components/marketing/career-card"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { Button } from "@/components/ui/button"

const PREVIEW_CAREERS = CAREERS.slice(0, 6)

export const CareerPreviewGrid = () => {
  return (
    <Section
      eyebrow="Targeted Verticals"
      title="Explore Specialized Tech Paths"
      description="From high-growth AI engineering to cloud infrastructure—see where your strengths and interests align."
      spacing="loose"
      className="max-w-6xl"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PREVIEW_CAREERS.map((career, index) => (
          <Reveal key={career.title} delay={index * 75} className="h-full">
            <CareerCard {...career} />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-center gap-3">
        <Button
          size="lg"
          className="group h-13 rounded-full border-2 border-black bg-[#FF5500] hover:bg-[#E64D00] px-8 text-sm font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          nativeButton={false}
          render={<Link href="/technology-careers" />}
        >
          <span>See All 10 Tech Careers</span>
          <ArrowRight className="ml-2 h-4 w-4 stroke-[3] transition-transform group-hover:translate-x-1" />
        </Button>
        <span className="text-xs font-bold text-slate-700">
          Includes market demand, skill stacks, and salary ranges
        </span>
      </div>
    </Section>
  )
}