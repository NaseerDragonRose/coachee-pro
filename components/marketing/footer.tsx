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
    <footer className="w-full border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3 sm:px-16">
        <div>
          <p className="text-lg font-semibold tracking-tight">CoacheePro</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Helping Class 11 &amp; 12 students discover the technology
            career that actually fits them.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <nav aria-label="Company">
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div>
          <p className="text-sm font-semibold">Legal</p>
          <nav aria-label="Legal">
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
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
