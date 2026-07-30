import type { Metadata } from "next"
import { MessageSquare, Mail, Clock, ShieldCheck, Sparkles } from "lucide-react"

import { ContactForm } from "@/components/marketing/contact-form"
import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"

export const metadata: Metadata = {
  title: "Contact Us | CoacheePro",
  description:
    "Get in touch with the CoacheePro team for assessment guidance, technical support, or program details.",
}

export default function ContactPage() {
  return (
    <main className="relative flex flex-1 flex-col pb-24">
      {/* Ambient Radial Background Glows */}
      <div className="pointer-events-none absolute top-12 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

      <PageHeader
        eyebrow="Get In Touch"
        title="We're Here to Help You Navigate"
        subtitle="Have questions about the 10-minute assessment, degree roadmaps, or technical guidance? Reach out anytime."
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-2">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
          
          {/* Main Form Section (7 Columns) */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-xl shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
                <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-50">
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Fill out the form below and our team will get back to you shortly.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-3 w-3" /> Quick Form
                  </span>
                </div>

                <ContactForm />
              </div>
            </Reveal>
          </div>

          {/* Sidebar Section (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Theme-Consistent WhatsApp Card */}
            <Reveal delay={100}>
              <div className="group relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-6 shadow-lg shadow-emerald-500/5 backdrop-blur-xl dark:border-emerald-500/30 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-950 dark:shadow-none">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-500/30">
                    Fastest
                  </span>
                </div>

                <div className="mt-4 space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Need Instant Answers?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Chat directly with our career advisors on WhatsApp for quick clarification on tech degrees, assessments, and plans.
                  </p>
                </div>

                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/35 active:scale-[0.98]"
                >
                  Chat on WhatsApp Now
                </a>
              </div>
            </Reveal>

            {/* Direct Channels Card */}
            <Reveal delay={150}>
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Direct Contact Info
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">Official Support Email</p>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">support@coacheepro.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">Average Turnaround</p>
                      <p className="text-slate-500 dark:text-slate-400">Under 24 hours (Mon - Sat)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">Privacy Guarantee</p>
                      <p className="text-slate-500 dark:text-slate-400">Your contact info is never shared or spammed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </div>
    </main>
  )
}