import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

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
          variant="outline"
          className="group h-12 border-slate-200/80 bg-white/50 px-8 text-sm font-semibold shadow-sm backdrop-blur-md transition-all hover:border-indigo-500/40 hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
          nativeButton={false}
          render={<Link href="/technology-careers" />}
        >
          <span>Explore All Tech Careers</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <span className="text-xs text-muted-foreground font-mono">
          Includes market demand, skill stacks, and salary ranges
        </span>
      </div>
    </Section>
  )
}