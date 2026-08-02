"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight, 
  Compass, 
  BookOpen, 
  GraduationCap, 
  HelpCircle,
  PhoneCall,
  Sun,
  Moon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAssessment } from "@/components/assessment/assessment-provider"

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
  const { open } = useAssessment()

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
      {/* 1. Integrated Announcement Ticker (Top of page, scrolls away naturally) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 px-4 py-1.5 text-center text-[11px] font-medium text-indigo-200 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
            Class of 2026/2027
          </span>
          <span className="hidden sm:inline text-slate-300">
            Free 10-Minute Career Assessment Engine is live for Class 11 & 12 students.
          </span>
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center font-bold text-white hover:underline underline-offset-2"
          >
            <span>Take Test</span>
            <ChevronRight className="h-3 w-3 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 2. Floating Viewport-Fixed Navigation Header */}
      <div
        className={`fixed inset-x-0 z-50 px-4 transition-all duration-300 sm:px-8 ${
          scrolled ? "top-3" : "top-10 sm:top-9"
        }`}
      >
        <header
          className={`mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 ${
            scrolled
              ? "border-slate-200/90 bg-white/95 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-950/95 dark:shadow-indigo-500/5"
              : "border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/80"
          }`}
        >
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/35">
              <Compass className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-50">
                  Coachee<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
                </span>
                <span className="rounded bg-indigo-100 dark:bg-indigo-950/80 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:text-indigo-300">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 leading-none">
                High School Tech Guidance
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav aria-label="Main Navigation" className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-100/80 p-1 md:flex dark:border-slate-800/80 dark:bg-slate-900/80">
            <Link
              href="/"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-800 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            >
              Home
            </Link>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions & Primary CTA */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Dark / Light Theme Switcher */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-700 transition-colors hover:bg-slate-200/80 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle light/dark theme"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              ))}
            </button>

            {/* CTA Button */}
            <Button
              size="sm"
              onClick={open}
              className="relative h-9 overflow-hidden rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Start Free Test
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Button>
          </div>

          {/* Mobile Drawer & Theme Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              ))}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Slide-Down Sheet */}
        {mobileMenuOpen && (
          <div className="mx-auto mt-2 w-full max-w-6xl rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl md:hidden dark:border-slate-800/90 dark:bg-slate-950/95 animate-in fade-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Home Page
              </Link>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    {item.label}
                  </Link>
                )
              })}

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    open()
                  }}
                  className="w-full h-11 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  Start Free Assessment (10 Mins)
                </Button>
                <p className="text-center text-[11px] font-medium text-slate-400">
                  No credit card · Free preview included
                </p>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Spacer to preserve layout height */}
      <div className="h-12 sm:h-14" />
    </>
  )
}