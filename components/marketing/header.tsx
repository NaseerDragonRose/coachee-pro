import Link from "next/link"

import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/technology-careers", label: "Technology Careers" },
  { href: "/faq", label: "FAQ" },
]

export const Header = () => {
  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-16">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          CoacheePro
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button size="sm" nativeButton={false} className="shrink-0" render={<Link href="/" />}>
          Start Free Assessment
        </Button>
      </div>
    </header>
  )
}
