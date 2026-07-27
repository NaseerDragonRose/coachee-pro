import type { Metadata } from "next"

import { ContactForm } from "@/components/marketing/contact-form"
import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { WhatsappCard } from "@/components/marketing/whatsapp-card"

export const metadata: Metadata = {
  title: "Contact | CoacheePro",
  description: "Get in touch with the CoacheePro team.",
}

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        title="Contact Us"
        subtitle="Questions about the assessment, the Blueprint, or anything else? We're happy to help."
      />
      <Reveal>
        <Section spacing="tight">
          <ContactForm />
        </Section>
      </Reveal>
      <Reveal>
        <Section spacing="tight">
          <WhatsappCard />
        </Section>
      </Reveal>
    </main>
  )
}
