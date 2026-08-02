"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { 
  ArrowRight, 
  Menu, 
  X, 
  Compass, 
  BookOpen, 
  GraduationCap, 
  HelpCircle,
  PhoneCall,
  Sun,
  Moon
} from "lucide-react"

import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { href: "/technology-careers", label: "Tech Careers", icon: BookOpen },
  { href: "/about", label: "About Us", icon: GraduationCap },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/contact", label: "Contact", icon: PhoneCall },
]

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Prevent hydration mismatch for theme icons
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Floating Neo-Brutalist Navigation Header */}
      <div
        className={`fixed inset-x-0 z-50 px-4 transition-all duration-300 sm:px-8 ${
          scrolled ? "top-3" : "top-4 sm:top-5"
        }`}
      >
        <header
          className={`mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border-2 border-black px-5 py-2.5 transition-all duration-300 bg-white ${
            scrolled
              ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          }`}
        >
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 group-hover:-translate-y-0.5">
              <Compass className="h-5 w-5 stroke-[2.5] transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-black">
                  Coachee<span className="text-[#FF5500]">Pro</span>
                </span>
                <span className="rounded-md bg-black px-1.5 py-0.5 text-[9px] font-black text-white border border-black">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-none">
                High School Tech Guidance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden items-center gap-2 rounded-full border-2 border-black bg-[#F7F5F0] px-3 py-1 md:flex">
            <Link
              href="/"
              className="rounded-full px-3.5 py-1 text-xs font-black text-black transition-colors hover:text-[#FF5500]"
            >
              Home
            </Link>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1 text-xs font-bold text-slate-800 transition-colors hover:text-[#FF5500]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions & Primary CTA */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              aria-label="Toggle light/dark theme"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-500 stroke-[2.5]" />
              ) : (
                <Moon className="h-4 w-4 text-black stroke-[2.5]" />
              ))}
            </button>

            {/* Main Action Button */}
            <Button
              size="sm"
              nativeButton={false}
              className="relative h-10 overflow-hidden rounded-full border-2 border-black bg-[#FF5500] hover:bg-[#E64D00] px-5 text-xs font-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              render={<Link href="/" />}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Free Assessment
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </span>
            </Button>
          </div>

          {/* Mobile Menu & Theme Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-500 stroke-[2.5]" />
              ) : (
                <Moon className="h-4 w-4 text-black stroke-[2.5]" />
              ))}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 stroke-[3]" /> : <Menu className="h-5 w-5 stroke-[3]" />}
            </button>
          </div>
        </header>

        {/* Mobile Slide-Down Sheet */}
        {mobileMenuOpen && (
          <div className="mx-auto mt-2 w-full max-w-6xl rounded-2xl border-2 border-black bg-[#F7F5F0] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:hidden animate-in fade-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl border-2 border-black bg-white p-3 text-sm font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Compass className="h-4 w-4 text-[#FF5500] stroke-[2.5]" />
                Home Page
              </Link>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border-2 border-black bg-white p-3 text-sm font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Icon className="h-4 w-4 text-slate-700 stroke-[2.5]" />
                    {item.label}
                  </Link>
                )
              })}

              <div className="mt-2 pt-3 border-t-2 border-black space-y-2">
                <Button
                  size="sm"
                  nativeButton={false}
                  className="w-full h-12 rounded-full border-2 border-black bg-[#FF5500] hover:bg-[#E64D00] text-xs font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  render={<Link href="/" />}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Free Assessment (10 Mins)
                </Button>
                <p className="text-center text-[11px] font-bold text-slate-700">
                  No credit card · Free preview included
                </p>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Spacer to preserve layout height */}
      <div className="h-16 sm:h-20" />
    </>
  )
}