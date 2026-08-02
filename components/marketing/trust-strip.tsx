import Link from "next/link"
import { ShieldCheck, Lock, UserCheck, ArrowRight } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"

export const TrustStrip = () => {
  return (
    <Reveal className="border-y-2 border-black bg-white py-6 text-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:px-8 md:flex-row">
        
        {/* Left: Primary Guarantee */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-black">
              Mentor-Verified Guidance & Student Data Privacy
            </h3>
            <p className="text-[11px] sm:text-xs font-bold text-slate-800">
              Every assessment is verified by real tech professionals. We never sell student data or spam parents.
            </p>
          </div>
        </div>

        {/* Right: Micro-Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-black text-black">
          <div className="flex items-center gap-1.5 rounded-full border-2 border-black bg-[#F7F5F0] px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Lock className="h-3.5 w-3.5 text-[#FF5500] stroke-[2.5]" />
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border-2 border-black bg-[#F7F5F0] px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <UserCheck className="h-3.5 w-3.5 text-[#FF5500] stroke-[2.5]" />
            <span>Human Reviewed</span>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 font-black text-black hover:text-[#FF5500] underline underline-offset-4"
          >
            <span>Read FAQ</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
          </Link>
        </div>

      </div>
    </Reveal>
  )
}