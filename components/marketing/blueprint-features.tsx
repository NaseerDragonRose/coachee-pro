import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

const FEATURES = [
  {
    title: "Career summary & why it fits",
    description: "Plain-language reasoning, not just a label.",
  },
  {
    title: "Required skills",
    description: "Exactly what to learn, in what order.",
  },
  {
    title: "Learning path",
    description: "Month 1–3, 4–6, and 7–12, mapped out.",
  },
  {
    title: "College guidance",
    description: "Degree vs. diploma, B.Tech vs. BCA vs. BSc CS.",
  },
  {
    title: "Salary expectations",
    description:
      "Entry, 3-year, 5-year, and 10-year, clearly labeled as indicative.",
  },
  {
    title: "Future outlook",
    description:
      "AI impact, global demand, remote opportunities, automation risk.",
  },
  {
    title: "Common mistakes to avoid",
    description: "The wrong turns other students make, so you don't have to.",
  },
] as const

export const BlueprintFeatures = () => {
  return (
    <Section
      eyebrow="Tech career blueprint"
      title="Everything you need to commit with confidence"
      spacing="loose"
      className="max-w-5xl"
    >
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {FEATURES.map(({ title, description }, index) => (
          <Reveal key={title} delay={index * 60}>
            <div className="flex gap-3">
              <div
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Delivered as a dashboard view plus a downloadable PDF.
      </p>
    </Section>
  )
}
