import type { Metadata } from "next"
import Link from "next/link"
import { HelpCircle, ArrowRight } from "lucide-react"

import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | CoacheePro",
  description:
    "Get answers to common questions about the CoacheePro career assessment, Tech Career Blueprint, pricing, and student data privacy.",
}

const FAQ_CATEGORIES = [
  {
    category: "Product",
    items: [
      {
        question: "What is CoacheePro?",
        answer:
          "CoacheePro is a technology career planning platform for students pursuing tech. You take a free assessment, get matched to the tech careers that fit you, and can unlock a full Tech Career Blueprint with a learning path, college guidance, and salary expectations.",
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
          "The Blueprint is a one-time, affordable fee. You'll see the price before you pay, with no subscription or hidden charges.",
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
          "About 10–15 minutes. It covers your academics, interests, and working style. Answer honestly and quickly: there are no right or wrong answers.",
      },
      {
        question: "What's included in the Blueprint?",
        answer:
          "A career summary with plain-language reasoning for why it fits you, the skills you'll need, a month-by-month learning path for your first year, college guidance (degree vs. diploma, which type of program), indicative salary expectations, the career's future outlook including AI impact, and common mistakes to avoid. Delivered as a dashboard and a downloadable PDF.",
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
          "The CoacheePro team brings on professionals to review and add context to your AI-generated Blueprint before it reaches you. As we grow, we'll share more detail on how we select mentors.",
      },
    ],
  },
] as const

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col pb-16">
      <PageHeader
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about the CoacheePro assessment, our Tech Career Blueprint, pricing, and data privacy."
      />

      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 space-y-12">
        {FAQ_CATEGORIES.map(({ category, items }, index) => (
          <Reveal key={category} delay={index * 100}>
            <Section title={category} centered={false} spacing="tight" className="px-0">
              <Accordion type="single" collapsible className="w-full">
                {items.map(({ question, answer }) => (
                  <AccordionItem key={question} value={question}>
                    <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-slate-100">
                      {question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Section>
          </Reveal>
        ))}

        {/* Fallback Support CTA */}
        <Reveal delay={400}>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 sm:p-8 text-center backdrop-blur-md dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
              Still have questions?
            </h3>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm max-w-md mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Reach out to our team directly and we&apos;ll get right back to you.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                nativeButton={false}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-10 px-5 text-xs shadow-md transition-all hover:scale-[1.01]"
                render={<Link href="/contact" />}
              >
                <span>Contact Support</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  )
}