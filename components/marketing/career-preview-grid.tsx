import Link from "next/link"

import { CAREERS } from "@/lib/careers"
import { CareerCard } from "@/components/marketing/career-card"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { Button } from "@/components/ui/button"

const PREVIEW_CAREERS = CAREERS.slice(0, 6)

export const CareerPreviewGrid = () => {
  return (
    <Section
      eyebrow="Technology careers"
      title="Which one fits you?"
      spacing="loose"
      className="max-w-5xl"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PREVIEW_CAREERS.map((career, index) => (
          <Reveal key={career.title} delay={index * 75}>
            <CareerCard {...career} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/technology-careers" />}
        >
          See all 10 careers →
        </Button>
      </div>
    </Section>
  )
}
