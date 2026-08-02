import type { Metadata } from "next"
import {
  ShieldAlert,
  FileText,
  CreditCard,
  AlertTriangle,
  Shield,
  RefreshCw,
  Mail,
  ExternalLink,
} from "lucide-react"

import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Terms of Service | CoacheePro",
  description: "The terms that govern your use of CoacheePro.",
}

const TERMS_SECTIONS = [
  {
    icon: FileText,
    title: "1. Acceptable Use",
    content:
      "You agree to use CoacheePro only for its intended purpose: exploring technology career guidance for yourself or, if you are a parent, on behalf of your child. You may not misuse the service, attempt to access it through unauthorized means, or interfere with its normal operation.",
  },
  {
    icon: CreditCard,
    title: "2. Payments & Refunds",
    content:
      "Paid features, such as the Tech Career Blueprint, are processed securely through Razorpay. All fees are stated in Indian Rupees (INR) unless noted otherwise and are non-refundable except as explicitly required by law.",
  },
  {
    icon: AlertTriangle,
    title: "3. No Guarantee of Outcome",
    content:
      "Career guidance, including assessment results and the Tech Career Blueprint, is informational and based on the information you provide. It is not a guarantee of admission, employment, or any specific career outcome.",
  },
  {
    icon: Shield,
    title: "4. Limitation of Liability",
    content:
      "To the maximum extent permitted by law, CoacheePro is not liable for indirect, incidental, or consequential damages arising from your use of the service.",
  },
  {
    icon: RefreshCw,
    title: "5. Changes to These Terms",
    content:
      "We may update these Terms from time to time. Continued use of CoacheePro after changes take effect constitutes acceptance of the updated Terms.",
  },
]

export default function TermsPage() {
  return (
    <main className="flex flex-1 flex-col pb-20 bg-[#F7F5F0] text-black">
      <PageHeader
        eyebrow="Legal & Terms"
        title="Terms of Service"
        subtitle="The terms and conditions governing your use of CoacheePro, our career assessment engine, and digital blueprints."
      />

      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 space-y-10 mt-4">
        {/* Placeholder Legal Disclaimer Callout */}
        <Reveal>
          <div className="flex items-start gap-4 rounded-3xl border-2 border-black bg-amber-300 p-5 sm:p-6 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ShieldAlert className="h-5 w-5 stroke-[2.5] text-[#FF5500]" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
              <p className="font-black uppercase tracking-wider text-black">Development Notice</p>
              <p className="font-bold text-slate-900">
                This is a preliminary terms of service draft and must undergo final verification by legal counsel prior to commercial release, especially considering Razorpay payment processing, an India-based audience, and minor high school student demographics.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Terms Sections */}
        <div className="space-y-8">
          {TERMS_SECTIONS.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={index * 80}>
                <Section title={item.title} centered={false} spacing="tight" className="px-0">
                  <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Icon className="h-5 w-5 stroke-[2.5]" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed pt-1">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </Section>
              </Reveal>
            )
          })}
        </div>

        {/* Contact Us Section */}
        <Reveal delay={400}>
          <Section title="6. Contact Us" centered={false} spacing="tight" className="px-0">
            <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-black">
                    Questions About Our Terms?
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-700">
                    If you have questions regarding these Terms or legal compliance, reach out directly to our legal team.
                  </p>
                </div>
                <a
                  href="mailto:legal@coacheepro.com"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FF5500] hover:bg-[#E64D00] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Mail className="h-4 w-4 stroke-[2.5]" />
                  <span>legal@coacheepro.com</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1 stroke-[2.5]" />
                </a>
              </div>
            </div>
          </Section>
        </Reveal>
      </div>
    </main>
  )
}