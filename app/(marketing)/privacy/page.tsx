import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Privacy Policy — CoacheePro",
  description: "How CoacheePro collects, uses, and protects your data.",
}

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <h1 className="mx-auto w-full max-w-3xl px-6 pt-16 text-3xl font-semibold tracking-tight sm:px-16 sm:text-4xl">
        Privacy Policy
      </h1>
      <Section title="Privacy Policy">
        <p className="rounded-md border border-dashed border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          This is a generic placeholder policy and has not been reviewed
          by legal counsel. It must be replaced with a reviewed policy
          before Phase 1 goes live, given payments (Razorpay), an
          India-based audience, and users who may be minors.
        </p>
      </Section>
      <Section title="Information We Collect">
        <p className="text-pretty text-muted-foreground">
          We collect information you provide directly, such as your name,
          email address, and responses to our career assessment. We also
          collect limited technical information, such as your browser
          type and general usage data, to help us improve the site.
        </p>
      </Section>
      <Section title="How We Use Your Information">
        <p className="text-pretty text-muted-foreground">
          We use your information to provide the CoacheePro service,
          including generating your career assessment results, processing
          payments, and communicating with you about your account. We do
          not sell your personal information to third parties.
        </p>
      </Section>
      <Section title="Cookies">
        <p className="text-pretty text-muted-foreground">
          We use cookies and similar technologies to keep you signed in,
          remember your preferences, and understand how the site is
          used. You can control cookies through your browser settings.
        </p>
      </Section>
      <Section title="Third-Party Services">
        <p className="text-pretty text-muted-foreground">
          We work with third-party providers to operate CoacheePro,
          including payment processing (Razorpay) and AI-generated
          content (OpenAI). These providers only receive the information
          necessary to perform their services and are bound by their own
          privacy obligations.
        </p>
      </Section>
      <Section title="Your Rights">
        <p className="text-pretty text-muted-foreground">
          You may request access to, correction of, or deletion of your
          personal information at any time by contacting us.
        </p>
      </Section>
      <Section title="Contact Us">
        <p className="text-pretty text-muted-foreground">
          If you have questions about this Privacy Policy, please contact
          us at{" "}
          <a href="mailto:privacy@coacheepro.com" className="underline">
            privacy@coacheepro.com
          </a>
          .
        </p>
      </Section>
    </main>
  )
}
