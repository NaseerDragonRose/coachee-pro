import Link from "next/link"
import { ShieldCheck, Compass } from "lucide-react"

const PLATFORM_LINKS = [
  { href: "/technology-careers", label: "Tech Careers" },
  { href: "/", label: "10-Min Assessment" },
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
    <footer className="relative w-full border-t-2 border-black bg-[#F7F5F0] text-black">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 group-hover:-translate-y-0.5">
              <Compass className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-black">
                Coachee<span className="text-[#FF5500]">Pro</span>
              </span>
              <span className="rounded-md bg-black px-2 py-0.5 text-[10px] font-black text-white border border-black">
                2026 / 2027
              </span>
            </div>
          </Link>

          <p className="max-w-sm text-xs font-semibold leading-relaxed text-slate-800">
            Data-backed tech career clarity for 11th & 12th-grade students and parents. Choose the right degree and skill roadmap before college starts.
          </p>
          
          {/* Active Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3.5 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 border border-black animate-pulse" />
            <span>2026 Tech Assessment Engine Active</span>
          </div>
        </div>

        {/* Navigation Columns */}
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-black">
            Platform
          </p>
          <nav aria-label="Platform" className="mt-4">
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold text-slate-800 transition-colors hover:text-[#FF5500]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-black">
            Company
          </p>
          <nav aria-label="Company" className="mt-4">
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold text-slate-800 transition-colors hover:text-[#FF5500]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-black">
            Trust & Legal
          </p>
          <nav aria-label="Legal" className="mt-4">
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold text-slate-800 transition-colors hover:text-[#FF5500]"
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
      <div className="border-t-2 border-black px-6 py-6 text-center text-xs font-bold text-slate-900 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© {year} CoacheePro. Built for student clarity.</p>
          <p className="flex items-center gap-1.5 text-xs font-black text-black">
            <ShieldCheck className="h-4 w-4 text-[#FF5500] stroke-[2.5]" />
            Student Data Protection First
          </p>
        </div>
      </div>
    </footer>
  )
}