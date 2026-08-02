import type { Metadata } from "next"
import {
  ShieldAlert,
  Database,
  Lock,
  Cookie,
  Share2,
  UserCheck,
  Mail,
  ExternalLink,
} from "lucide-react"

import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Privacy Policy | CoacheePro",
  description:
    "Learn how CoacheePro collects, uses, and safeguards student and parent data, assessment responses, and payment information.",
}

const POLICY_SECTIONS = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content:
      "We collect information you directly provide, including student name, grade level, email address, phone number, and responses to our career assessment engine. We also gather essential technical analytics (such as browser type, device information, and general site usage) to maintain and optimize site performance.",
  },
  {
    icon: Lock,
    title: "2. How We Use Your Information",
    content:
      "Your information is strictly used to evaluate cognitive preferences, generate your personalized Tech Career Blueprint, process order transactions, and communicate updates regarding your account or assessment. We do not sell, rent, or trade personal or student data to third-party brokers.",
  },
  {
    icon: Cookie,
    title: "3. Cookies & Local Storage",
    content:
      "CoacheePro uses essential cookies and session storage to maintain authentication state, remember interface preferences (such as light/dark theme), and analyze general traffic flows. You can configure your browser to block or alert you about cookies, though some features may lose functionality.",
  },
  {
    icon: Share2,
    title: "4. Third-Party Service Providers",
    content:
      "We rely on trusted third-party infrastructure to deliver our platform services, including secure payment processing (Razorpay), AI evaluation engines (OpenAI), and transactional messaging. These providers only access data necessary to fulfill their functions under strict confidentiality terms.",
  },
  {
    icon: UserCheck,
    title: "5. Student & Parent Data Rights",
    content:
      "You reserve full rights to request access to, correction of, or permanent deletion of your account record and assessment history at any time. Because CoacheePro caters to high school students, parent or guardian consent requests are respected immediately upon identity verification.",
  },
]

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col pb-20 bg-[#F7F5F0] text-black">
      <PageHeader
        eyebrow="Legal & Compliance"
        title="Privacy Policy"
        subtitle="Transparent details on how we protect student privacy, handle assessment inputs, and secure payment data."
      />

      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 space-y-10 mt-4">
        {/* Development Legal Disclaimer Callout */}
        <Reveal>
          <div className="flex items-start gap-4 rounded-3xl border-2 border-black bg-amber-300 p-5 sm:p-6 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ShieldAlert className="h-5 w-5 stroke-[2.5] text-[#FF5500]" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
              <p className="font-black uppercase tracking-wider text-black">Development Legal Disclaimer</p>
              <p className="font-bold text-slate-900">
                This is a preliminary privacy notice draft and must undergo final verification by legal counsel prior to commercial release, especially considering India DPDP regulations, Razorpay payment processing, and high school student user demographics.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Policy Sections */}
        <div className="space-y-8">
          {POLICY_SECTIONS.map((item, index) => {
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

        {/* Contact Section */}
        <Reveal delay={400}>
          <Section title="6. Contact Us" centered={false} spacing="tight" className="px-0">
            <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-black">
                    Have Privacy Questions?
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-700">
                    Reach out directly to our data protection team regarding your information rights or assessment data.
                  </p>
                </div>
                <a
                  href="mailto:privacy@coacheepro.com"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FF5500] hover:bg-[#E64D00] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Mail className="h-4 w-4 stroke-[2.5]" />
                  <span>privacy@coacheepro.com</span>
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