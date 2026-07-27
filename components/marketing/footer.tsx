import Link from "next/link"

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/technology-careers", label: "Technology Careers" },
  { href: "/faq", label: "FAQ" },
]

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3 sm:px-16">
        <div>
          <p className="text-lg font-semibold tracking-tight">CoacheePro</p>
          <p className="mt-3 max-w-xs text-pretty text-sm text-muted-foreground">
            Helping Class 11 &amp; 12 students discover the technology
            career that actually fits them.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <nav aria-label="Company">
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div>
          <p className="text-sm font-semibold">Legal</p>
          <nav aria-label="Legal">
            <ul className="mt-4 space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground sm:px-16">
        © {year} CoacheePro. All rights reserved.
      </div>
    </footer>
  )
}
