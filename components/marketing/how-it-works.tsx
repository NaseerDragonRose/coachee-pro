import { ClipboardCheck, Compass, FileText, Users } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Take the free assessment",
    description:
      "Answer questions about your academics, interests, and working style. No payment, no account needed to start.",
  },
  {
    icon: Compass,
    title: "See your top 3 matches",
    description:
      "Get a free preview of the tech careers that fit you best, with a short explanation of why.",
  },
  {
    icon: FileText,
    title: "Unlock your full Blueprint",
    description:
      "Go deeper with a complete Tech Career Blueprint: skills, learning path, college guidance, and salary outlook.",
  },
  {
    icon: Users,
    title: "Book a mentor call (optional)",
    description:
      "A real mentor reviews your Blueprint and adds context in a one-on-one strategy call.",
  },
] as const

export const HowItWorks = () => {
  return (
    <Section
      eyebrow="How it works"
      title="From confusion to a clear plan"
      spacing="loose"
      className="max-w-5xl"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 100}>
            <div className="flex flex-col gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon aria-hidden className="size-5" />
              </div>
              <p className="font-semibold">
                <span className="mr-2 text-muted-foreground">
                  {index + 1}.
                </span>
                {title}
              </p>
              <p className="text-pretty text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
