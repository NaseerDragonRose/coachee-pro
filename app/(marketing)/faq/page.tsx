import type { Metadata } from "next"

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
        question: "[TODO] What is CoacheePro?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        question: "[TODO] Who is CoacheePro for?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        question: "[TODO] How much does the Tech Career Blueprint cost?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        question: "[TODO] Is the assessment free?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    category: "Assessment & Blueprint",
    items: [
      {
        question: "[TODO] How long does the assessment take?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        question: "[TODO] What's included in the Blueprint?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    category: "Trust & Safety",
    items: [
      {
        question: "[TODO] Is my data safe?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        question: "[TODO] Are the mentors verified?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
] as const

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col">
      {FAQ_CATEGORIES.map(({ category, items }) => (
        <Section key={category} title={category}>
          <Accordion>
            {items.map(({ question, answer }) => (
              <AccordionItem key={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      ))}
    </main>
  )
}
