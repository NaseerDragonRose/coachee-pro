import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "About — CoacheePro",
  description:
    "Why CoacheePro exists and how it helps Class 11 & 12 students find the right technology career.",
}

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <h1 className="mx-auto w-full max-w-3xl px-6 pt-16 text-3xl font-semibold tracking-tight sm:px-16 sm:text-4xl">
        About CoacheePro
      </h1>
      <Section title="Our Mission">
        <p className="text-pretty text-muted-foreground">
          CoacheePro helps Class 11 and 12 students figure out which
          technology career actually fits them — before they commit four
          or five years to a degree. We turn a confusing decision into a
          clear one: take a structured assessment, see which tech careers
          match your interests and strengths, and get a concrete plan for
          getting there.
        </p>
      </Section>
      <Section title="Why We Exist">
        <p className="text-pretty text-muted-foreground">
          A student interested in technology today is buried in advice —
          YouTube videos, relatives, teachers, influencers — and most of
          it is fragmented or contradictory. Which stream should I pick?
          Will AI replace this job by the time I graduate? What will I
          actually earn? What if I choose wrong? Parents feel this too:
          they&rsquo;re not looking for a vague &ldquo;roadmap,&rdquo; they want confidence
          that their child isn&rsquo;t about to waste years on the wrong path.
          CoacheePro exists to replace that guesswork with a clear,
          structured answer.
        </p>
      </Section>
      <Section title="Why We're Different">
        <p className="text-pretty text-muted-foreground">
          We&rsquo;re not a counselling service and we&rsquo;re not a generic AI
          chatbot. Our assessment is built specifically around technology
          careers — not a one-size-fits-all personality quiz — and every
          Tech Career Blueprint it produces is reviewed by a real mentor
          before it reaches you, so you get a second opinion from someone
          who&rsquo;s worked in the field, not just an algorithm&rsquo;s best guess.
        </p>
      </Section>
    </main>
  )
}
