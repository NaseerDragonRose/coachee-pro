import type { Metadata } from "next"
import Link from "next/link"
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
    <main className="flex flex-1 flex-col pb-16">
      <PageHeader
        eyebrow="Legal & Compliance"
        title="Privacy Policy"
        subtitle="Transparent details on how we protect student privacy, handle assessment inputs, and secure payment data."
      />

      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 space-y-10">
        {/* Legal Disclaimer Callout */}
        <Reveal>
          <div className="flex items-start gap-3.5 rounded-2xl border border-amber-500/30 bg-amber-50/60 p-4 sm:p-5 text-amber-900 backdrop-blur-md dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-200">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
              <p className="font-bold">Development Legal Disclaimer</p>
              <p className="text-amber-800/90 dark:text-amber-300/80">
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
                  <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-950/60">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
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
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 sm:p-8 backdrop-blur-md dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Have Privacy Questions?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Reach out directly to our data protection team regarding your information rights or assessment data.
                  </p>
                </div>
                <a
                  href="mailto:privacy@coacheepro.com"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:scale-[1.01]"
                >
                  <Mail className="h-4 w-4" />
                  <span>privacy@coacheepro.com</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                </a>
              </div>
            </div>
          </Section>
        </Reveal>
      </div>
    </main>
  )
}