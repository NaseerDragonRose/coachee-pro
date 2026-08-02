import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { AssessmentCta } from "@/components/assessment/assessment-cta"

const PLATFORM_LINKS = [
  { href: "/technology-careers", label: "Tech Careers" },
  { href: "/faq", label: "FAQ & Guidance" },
]

const COMPANY_LINKS = [
  { href: "/about", label: "About CoacheePro" },
  { href: "/contact", label: "Contact Advisors" },
]

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
]

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Brand Column (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              CoacheePro
            </span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              Class of 2026/2027
            </span>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Data-backed tech career clarity for 11th & 12th-grade students and parents. Choose the right degree and skill roadmap before college starts.
          </p>
          
          {/* Active System Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>2026 Tech Assessment Engine Active</span>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Platform
          </p>
          <nav aria-label="Platform" className="mt-4">
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <AssessmentCta className="text-xs text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  10-Min Assessment
                </AssessmentCta>
              </li>
            </ul>
          </nav>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Company
          </p>
          <nav aria-label="Company" className="mt-4">
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Legal Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Trust & Legal
          </p>
          <nav aria-label="Legal" className="mt-4">
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 px-6 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p>© {year} CoacheePro. Built for student clarity.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
            Student Data Protection First
          </p>
        </div>
      </div>
    </footer>
  )
}