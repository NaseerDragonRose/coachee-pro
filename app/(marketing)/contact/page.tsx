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
    <main className="relative flex flex-1 flex-col pb-24 bg-[#F7F5F0] text-black">
      <PageHeader
        eyebrow="Get In Touch"
        title="We're Here to Help You Navigate"
        subtitle="Have questions about the 10-minute assessment, degree roadmaps, or technical guidance? Reach out anytime."
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
          
          {/* Main Form Section (7 Columns) */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="relative rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-6 flex items-center justify-between border-b-2 border-black pb-4">
                  <div>
                    <h2 className="text-lg font-black text-black">
                      Send Us a Message
                    </h2>
                    <p className="text-xs font-bold text-slate-700">
                      Fill out the form below and our team will get back to you shortly.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FF5500] px-3 py-1 text-[11px] font-black uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" /> Quick Form
                  </span>
                </div>

                <ContactForm />
              </div>
            </Reveal>
          </div>

          {/* Sidebar Section (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* High-Energy WhatsApp Card */}
            <Reveal delay={100}>
              <div className="group relative overflow-hidden rounded-3xl border-2 border-black bg-emerald-300 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <MessageSquare className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <span className="rounded-full border-2 border-black bg-black px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    Fastest
                  </span>
                </div>

                <div className="mt-4 space-y-1.5">
                  <h3 className="text-lg font-black text-black">
                    Need Instant Answers?
                  </h3>
                  <p className="text-xs font-bold text-black/90 leading-relaxed">
                    Chat directly with our career advisors on WhatsApp for quick clarification on tech degrees, assessments, and plans.
                  </p>
                </div>

                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-black px-5 text-xs font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-slate-900 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Chat on WhatsApp Now
                </a>
              </div>
            </Reveal>

            {/* Direct Channels Card */}
            <Reveal delay={150}>
              <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  Direct Contact Info
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#F7F5F0] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Mail className="h-5 w-5 stroke-[2.5] text-[#FF5500]" />
                    </div>
                    <div>
                      <p className="font-black text-black text-sm">Official Support Email</p>
                      <p className="text-slate-800 font-bold">support@coacheepro.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#F7F5F0] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Clock className="h-5 w-5 stroke-[2.5] text-black" />
                    </div>
                    <div>
                      <p className="font-black text-black text-sm">Average Turnaround</p>
                      <p className="text-slate-800 font-bold">Under 24 hours (Mon - Sat)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#F7F5F0] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <ShieldCheck className="h-5 w-5 stroke-[2.5] text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-black text-black text-sm">Privacy Guarantee</p>
                      <p className="text-slate-800 font-bold">Your contact info is never shared or spammed.</p>
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