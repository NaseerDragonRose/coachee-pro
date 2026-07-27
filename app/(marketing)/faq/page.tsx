import type { Metadata } from "next"

import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ — CoacheePro",
  description: "Answers to common questions about CoacheePro.",
}

const FAQ_CATEGORIES = [
  {
    category: "Product",
    items: [
      {
        question: "What is CoacheePro?",
        answer:
          "CoacheePro is a technology career planning platform for Class 11 and 12 students. You take a free assessment, get matched to the tech careers that fit you, and can unlock a full Tech Career Blueprint with a learning path, college guidance, and salary expectations.",
      },
      {
        question: "Who is CoacheePro for?",
        answer:
          "Students aged 16–19 who are interested in technology but unsure which career fits them, and parents who want confidence in that decision before the family commits to a degree.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        question: "How much does the Tech Career Blueprint cost?",
        answer:
          "The Blueprint is a one-time, affordable fee — pricing is shown before you pay, with no subscription or hidden charges.",
      },
      {
        question: "Is the assessment free?",
        answer:
          "Yes. The Career Assessment and your free preview of the top 3 recommended careers are completely free, with no card required.",
      },
    ],
  },
  {
    category: "Assessment & Blueprint",
    items: [
      {
        question: "How long does the assessment take?",
        answer:
          "About 10–15 minutes. It covers your academics, interests, and working style — you can be honest and quick, there are no right or wrong answers.",
      },
      {
        question: "What's included in the Blueprint?",
        answer:
          "A career summary with plain-language reasoning for why it fits you, the skills you'll need, a month-by-month learning path for your first year, college guidance (degree vs. diploma, which type of program), indicative salary expectations, the career's future outlook including AI impact, and common mistakes to avoid — delivered as a dashboard and a downloadable PDF.",
      },
    ],
  },
  {
    category: "Trust & Safety",
    items: [
      {
        question: "Is my data safe?",
        answer:
          "Yes. We only use your information to generate your assessment results and Blueprint, and we never sell your personal data to third parties. See our Privacy Policy for full details.",
      },
      {
        question: "Are the mentors verified?",
        answer:
          "Our mentors are professionals brought on by the CoacheePro team to review and add context to your AI-generated Blueprint before it reaches you. As we grow, we'll share more detail on how mentors are selected.",
      },
    ],
  },
] as const

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader title="Frequently Asked Questions" />
      {FAQ_CATEGORIES.map(({ category, items }) => (
        <Reveal key={category}>
          <Section title={category} spacing="tight">
            <Accordion>
              {items.map(({ question, answer }) => (
                <AccordionItem key={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Section>
        </Reveal>
      ))}
    </main>
  )
}
