import { 
  ClipboardCheck, 
  Compass, 
  FileText, 
  Users 
} from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

const STEPS = [
  {
    step: "Step 01",
    title: "Take the 10-Min Test",
    description:
      "Answer short, clear questions about your favorite subjects, logic strengths, and work preferences.",
    icon: ClipboardCheck,
    tag: "100% Free · No Card",
  },
  {
    step: "Step 02",
    title: "See Your Top Matches",
    description:
      "Instantly view your top 3 tech career fits (like AI Developer or Web Engineer) with clear fit scores.",
    icon: Compass,
    tag: "Instant Results",
  },
  {
    step: "Step 03",
    title: "Get College & Skill Plan",
    description:
      "Unlock your full roadmap: exact skills to learn, recommended degrees (B.Tech/BCA), and salary outlooks.",
    icon: FileText,
    tag: "Full Blueprint PDF",
  },
  {
    step: "Step 04",
    title: "Talk to a Mentor",
    description:
      "Optionally connect with an active tech professional to review your plan with your parents and clear doubts.",
    icon: Users,
    tag: "Optional 1-on-1 Call",
  },
]

export const HowItWorks = () => {
  return (
    <Section
      eyebrow="Simple 4-Step Process"
      title="How You Choose the Right Tech Path"
      description="No lengthy forms or confusing advice. In just 10 minutes, gain the clarity to choose the right degree, focus on the right skills, and take your first confident step toward a successful technology career."
      spacing="loose"
      className="max-w-6xl"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((item, index) => {
          const Icon = item.icon
          return (
            <Reveal key={item.step} delay={index * 100} className="h-full">
              <div className="group relative flex h-full flex-col justify-between rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  {/* Top Header Row: Icon + Step Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Icon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <span className="rounded-md border border-black bg-black px-2 py-0.5 font-mono text-[10px] font-black uppercase text-white">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 text-base font-black text-black">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-700">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Feature Tag */}
                <div className="mt-6 pt-4 border-t-2 border-black">
                  <span className="inline-block w-fit rounded-full border-2 border-black bg-[#F7F5F0] px-3 py-1 text-[10px] font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {item.tag}
                  </span>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}

export default HowItWorks