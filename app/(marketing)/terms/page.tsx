import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Terms of Service — CoacheePro",
  description: "The terms that govern your use of CoacheePro.",
}

export default function TermsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <h1 className="mx-auto w-full max-w-3xl px-6 pt-16 text-3xl font-semibold tracking-tight sm:px-16 sm:text-4xl">
        Terms of Service
      </h1>
      <Section title="Terms of Service">
        <p className="rounded-md border border-dashed border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          This is a generic placeholder set of terms and has not been
          reviewed by legal counsel. It must be replaced with reviewed
          terms before Phase 1 goes live, given payments (Razorpay), an
          India-based audience, and users who may be minors.
        </p>
      </Section>
      <Section title="Acceptable Use">
        <p className="text-pretty text-muted-foreground">
          You agree to use CoacheePro only for its intended purpose:
          exploring technology career guidance for yourself or, if you
          are a parent, on behalf of your child. You may not misuse the
          service, attempt to access it through unauthorized means, or
          interfere with its normal operation.
        </p>
      </Section>
      <Section title="Payments">
        <p className="text-pretty text-muted-foreground">
          Paid features, such as the Tech Career Blueprint, are processed
          through Razorpay. All fees are stated in Indian Rupees (INR)
          unless noted otherwise and are non-refundable except as
          required by law.
        </p>
      </Section>
      <Section title="No Guarantee of Outcome">
        <p className="text-pretty text-muted-foreground">
          Career guidance, including assessment results and the Tech
          Career Blueprint, is informational and based on the information
          you provide. It is not a guarantee of admission, employment, or
          any specific career outcome.
        </p>
      </Section>
      <Section title="Limitation of Liability">
        <p className="text-pretty text-muted-foreground">
          To the maximum extent permitted by law, CoacheePro is not
          liable for indirect, incidental, or consequential damages
          arising from your use of the service.
        </p>
      </Section>
      <Section title="Changes to These Terms">
        <p className="text-pretty text-muted-foreground">
          We may update these Terms from time to time. Continued use of
          CoacheePro after changes take effect constitutes acceptance of
          the updated Terms.
        </p>
      </Section>
      <Section title="Contact Us">
        <p className="text-pretty text-muted-foreground">
          If you have questions about these Terms, please contact us at{" "}
          <a href="mailto:legal@coacheepro.com" className="underline">
            legal@coacheepro.com
          </a>
          .
        </p>
      </Section>
    </main>
  )
}
