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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-16">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          CoacheePro
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
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
