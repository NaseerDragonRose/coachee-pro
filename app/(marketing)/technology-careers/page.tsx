import type { Metadata } from "next"

import { CAREERS } from "@/lib/careers"
import { PageHeader } from "@/components/marketing/page-header"
import { CareerCard } from "@/components/marketing/career-card"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Technology Careers | CoacheePro",
  description:
    "Explore the technology careers CoacheePro helps students pursuing tech evaluate.",
}

export default function TechnologyCareersPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        title="Technology Careers"
        subtitle={"“Technology” isn’t one career. It’s dozens of very different day-to-day jobs."}
      />
      <Section spacing="tight" className="max-w-5xl">
        <p className="text-pretty text-muted-foreground">
          Our assessment matches you against these ten to start, based on
          your interests, strengths, and working style.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAREERS.map((career, index) => (
            <Reveal key={career.title} delay={(index % 3) * 75} className="h-full">
              <CareerCard {...career} />
            </Reveal>
          ))}
        </div>
      </Section>
    </main>
  )
}
