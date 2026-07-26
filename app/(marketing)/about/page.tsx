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
          [TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </p>
      </Section>
      <Section title="Why We Exist">
        <p className="text-pretty text-muted-foreground">
          [TODO] Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Section>
      <Section title="Why We're Different">
        <p className="text-pretty text-muted-foreground">
          [TODO] Duis aute irure dolor in reprehenderit in voluptate velit
          esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </Section>
    </main>
  )
}
