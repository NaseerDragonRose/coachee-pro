import Link from "next/link"
import { ShieldCheck, Lock, UserCheck, ArrowRight } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"

export const TrustStrip = () => {
  return (
    <Reveal className="border-y border-slate-200/80 bg-slate-50/60 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:px-8 md:flex-row">
        
        {/* Left: Primary Guarantee */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 sm:text-sm">
              Mentor-Verified Guidance & Student Data Privacy
            </h3>
            <p className="text-[11px] text-muted-foreground sm:text-xs">
              Every assessment is verified by real tech professionals. We never sell student data or spam parents.
            </p>
          </div>
        </div>

        {/* Right: Quick Micro-Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Human Reviewed</span>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>Read FAQ</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </Reveal>
  )
}