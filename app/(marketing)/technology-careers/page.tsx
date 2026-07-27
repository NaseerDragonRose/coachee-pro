import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Technology Careers — CoacheePro",
  description:
    "Explore the technology careers CoacheePro helps Class 11 & 12 students evaluate.",
}

const CAREERS = [
  {
    title: "Software Engineer",
    description:
      "Designs and builds the applications and systems people use every day. A strong fit if you enjoy problem-solving, logical thinking, and seeing something you built actually work.",
  },
  {
    title: "AI Engineer",
    description:
      "Builds and trains the machine learning models behind products like recommendation engines and chatbots. Suits students who like math, patterns, and working at the edge of what's possible.",
  },
  {
    title: "Cybersecurity Analyst",
    description:
      "Protects systems and data from attacks by finding weaknesses before attackers do. A good match if you're detail-oriented and enjoy thinking like a puzzle-solver — or a detective.",
  },
  {
    title: "Cloud Engineer",
    description:
      "Builds and manages the infrastructure that keeps apps and websites running reliably at scale. Fits students who like systems thinking and making complex things run smoothly.",
  },
  {
    title: "Data Scientist",
    description:
      "Turns raw data into insights that drive decisions, using statistics and code. A strong choice if you like numbers, asking why, and finding stories hidden in information.",
  },
  {
    title: "UI/UX Designer",
    description:
      "Shapes how digital products look, feel, and work for the people using them. Suits students who are creative, empathetic, and curious about how design decisions affect behavior.",
  },
  {
    title: "Product Manager",
    description:
      "Decides what gets built and why, working between users, designers, and engineers. Fits students who like leadership, communication, and connecting technology to real problems.",
  },
  {
    title: "DevOps Engineer",
    description:
      "Automates how software gets built, tested, and shipped so teams can release changes quickly and safely. A good fit if you like process, tooling, and making things more efficient.",
  },
  {
    title: "Robotics Engineer",
    description:
      "Designs and programs machines that sense and act in the physical world, from drones to industrial arms. Suits students drawn to hardware, hands-on building, and mechanics as much as code.",
  },
  {
    title: "Game Developer",
    description:
      "Builds the code, mechanics, and systems behind video games. A strong match if you're passionate about gaming and want to combine creativity with programming.",
  },
] as const

export default function TechnologyCareersPage() {
  return (
    <main className="flex flex-1 flex-col">
      <h1 className="mx-auto w-full max-w-3xl px-6 pt-16 text-3xl font-semibold tracking-tight sm:px-16 sm:text-4xl">
        Technology Careers
      </h1>
      <Section title="Technology Careers" className="max-w-5xl">
        <p className="text-pretty text-muted-foreground">
          &ldquo;Technology&rdquo; isn&rsquo;t one career — it&rsquo;s dozens of very different
          day-to-day jobs. Our assessment matches you against these ten
          to start, based on your interests, strengths, and working
          style.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAREERS.map(({ title, description }) => (
            <div key={title} className="rounded-lg border border-border p-6">
              <p className="font-semibold">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
