import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Technology Careers — CoacheePro",
  description:
    "Explore the technology careers CoacheePro helps Class 11 & 12 students evaluate.",
}

const CAREERS = [
  "Software Engineer",
  "AI Engineer",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Product Manager",
  "DevOps Engineer",
  "Robotics Engineer",
  "Game Developer",
] as const

export default function TechnologyCareersPage() {
  return (
    <main className="flex flex-1 flex-col">
      <h1 className="mx-auto w-full max-w-3xl px-6 pt-16 text-3xl font-semibold tracking-tight sm:px-16 sm:text-4xl">
        Technology Careers
      </h1>
      <Section title="Technology Careers" className="max-w-5xl">
        <p className="text-pretty text-muted-foreground">
          [TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit —
          a short intro on exploring technology careers.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAREERS.map((career) => (
            <div key={career} className="rounded-lg border border-border p-6">
              <p className="font-semibold">{career}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                [TODO] Lorem ipsum dolor sit amet, consectetur adipiscing
                elit.
              </p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
