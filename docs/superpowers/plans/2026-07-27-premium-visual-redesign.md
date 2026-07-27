# Premium Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stock, zero-color shadcn theme with a real design system (warm-tinted indigo palette, motion, layout rhythm) and apply it across Home, About, Technology Careers, and FAQ — turning a one-hero placeholder homepage into a full conversion-focused landing page.

**Architecture:** Token-driven re-skin (CSS variables in `globals.css` cascade into every existing `components/ui/*` primitive with zero code changes there) + a small set of new hand-written `components/marketing/*` primitives (`Reveal`, `GradientBlob`, `PageHeader`) composed into new Home sections and applied to the three content pages.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, shadcn (`base-nova`) + `@base-ui/react`, `tw-animate-css`, `lucide-react`. No new dependencies.

## Global Constraints

- No new npm dependencies (no Framer Motion/GSAP/new fonts) — motion is built from `tw-animate-css` (already installed) plus custom CSS keyframes.
- `components/ui/*` (shadcn primitives) are not modified — they re-skin automatically via CSS variable changes in `globals.css`.
- About/Technology Careers/FAQ copy is unchanged — this batch is presentation-only.
- Every animation/transition must be neutralized under `prefers-reduced-motion: reduce`.
- No fabricated social proof (testimonials, client logos, usage stats) anywhere — there are no real users yet.
- New hand-written components follow `.claude/rules/component-conventions.md`: named `const` arrow-function export, props destructured inline, `Props` type declared after the component. Does not apply to `page.tsx`/`layout.tsx` files.
- Scope is exactly Home, About, Technology Careers, FAQ. Privacy/Terms are explicitly out of scope for this batch (per the approved spec's Goal section) — do not touch them.
- **Do not run `git commit` at any step.** Per this repo's `CLAUDE.md`, nothing is committed until the user explicitly asks, even at the end of a completed batch. Every "Commit" step that would normally appear in this plan is omitted for that reason — stop after verification and report completion instead.

---

### Task 1: Design tokens, radius, shadows, and motion CSS

**Files:**
- Modify: `app/globals.css` (full replace)

**Interfaces:**
- Produces: CSS custom properties `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--border`, `--input`, `--ring`, `--highlight`, `--highlight-foreground`, `--radius` (all consumed automatically by existing `components/ui/*`). Also produces the Tailwind utility classes `bg-highlight`, `text-highlight-foreground`, and `animate-blob-drift`, and a global `@media (prefers-reduced-motion: reduce)` override consumed by every later task's motion classes.

- [ ] **Step 1: Replace `app/globals.css` with the new token set**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-highlight-foreground: var(--highlight-foreground);
  --color-highlight: var(--highlight);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  --animate-blob-drift: blob-drift 18s ease-in-out infinite;
}

@keyframes blob-drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(24px, -32px) scale(1.06);
  }
  66% {
    transform: translate(-18px, 18px) scale(0.96);
  }
}

:root {
  --background: oklch(0.985 0.006 275);
  --foreground: oklch(0.22 0.02 275);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.02 275);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.02 275);
  --primary: oklch(0.511 0.262 276.966);
  --primary-foreground: oklch(0.985 0.006 275);
  --secondary: oklch(0.96 0.012 275);
  --secondary-foreground: oklch(0.22 0.02 275);
  --muted: oklch(0.96 0.012 275);
  --muted-foreground: oklch(0.5 0.02 275);
  --accent: oklch(0.96 0.012 275);
  --accent-foreground: oklch(0.22 0.02 275);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.9 0.012 275);
  --input: oklch(0.9 0.012 275);
  --ring: oklch(0.6 0.2 277);
  --highlight: oklch(0.82 0.14 80);
  --highlight-foreground: oklch(0.28 0.06 80);
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --radius: 0.75rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.19 0.014 275);
  --foreground: oklch(0.96 0.006 275);
  --card: oklch(0.235 0.016 275);
  --card-foreground: oklch(0.96 0.006 275);
  --popover: oklch(0.235 0.016 275);
  --popover-foreground: oklch(0.96 0.006 275);
  --primary: oklch(0.72 0.16 277);
  --primary-foreground: oklch(0.16 0.02 277);
  --secondary: oklch(0.29 0.018 275);
  --secondary-foreground: oklch(0.96 0.006 275);
  --muted: oklch(0.27 0.016 275);
  --muted-foreground: oklch(0.68 0.02 275);
  --accent: oklch(0.29 0.018 275);
  --accent-foreground: oklch(0.96 0.006 275);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 12%);
  --input: oklch(1 0 0 / 16%);
  --ring: oklch(0.72 0.16 277);
  --highlight: oklch(0.8 0.15 80);
  --highlight-foreground: oklch(0.2 0.04 80);
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run dev` briefly (or `npm run build`), confirm no CSS/PostCSS errors in the terminal output, then stop the dev server.
Expected: server starts cleanly, no Tailwind/PostCSS error about unknown `--animate-blob-drift` or `oklch()` syntax.

---

### Task 2: `Reveal` and `GradientBlob` primitives

**Files:**
- Create: `components/marketing/reveal.tsx`
- Create: `components/marketing/gradient-blob.tsx`

**Interfaces:**
- Consumes: Tailwind utilities `animate-blob-drift`, `bg-highlight`, `bg-primary` from Task 1.
- Produces:
  - `Reveal({ children: React.ReactNode; className?: string; delay?: number })` — client component, renders a `div` that fades/slides up once it enters the viewport. `delay` is milliseconds, applied via inline `animationDelay` style (not a Tailwind class, since it's an arbitrary per-item value).
  - `GradientBlob({ className?: string })` — server component, renders an absolutely-positioned `aria-hidden` decorative layer with two blurred, drifting gradient circles. Meant to be the first child of a `relative overflow-hidden` wrapper.

- [ ] **Step 1: Create `components/marketing/reveal.tsx`**

```tsx
"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export const Reveal = ({ children, className, delay = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(
        "opacity-0",
        isVisible &&
          "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out opacity-100",
        className
      )}
    >
      {children}
    </div>
  )
}

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}
```

- [ ] **Step 2: Create `components/marketing/gradient-blob.tsx`**

```tsx
import { cn } from "@/lib/utils"

export const GradientBlob = ({ className }: Props) => {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div className="absolute -top-24 -left-24 size-96 animate-blob-drift rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-32 -right-16 size-80 animate-blob-drift rounded-full bg-highlight/25 blur-3xl [animation-delay:-4s]" />
    </div>
  )
}

type Props = {
  className?: string
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `reveal.tsx` or `gradient-blob.tsx`.

---

### Task 3: Redesign Header and Footer

**Files:**
- Modify: `components/marketing/header.tsx`
- Modify: `components/marketing/footer.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button` (unchanged), tokens from Task 1.
- Produces: no prop/type changes — both components remain zero-prop, so no downstream task depends on new interfaces here.

- [ ] **Step 1: Replace `components/marketing/header.tsx`**

```tsx
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
```

- [ ] **Step 2: Replace `components/marketing/footer.tsx`**

```tsx
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
            <ul className="mt-4 space-y-3">
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
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `header.tsx` or `footer.tsx`.

---

### Task 4: Redesign `Section`, add `PageHeader`

**Files:**
- Modify: `components/marketing/section.tsx`
- Create: `components/marketing/page-header.tsx`

**Interfaces:**
- Consumes: `GradientBlob` from Task 2.
- Produces:
  - `Section({ title?: string; eyebrow?: string; children: React.ReactNode; className?: string; spacing?: "tight" | "default" | "loose" })` — `spacing` defaults to `"default"`. Existing call sites (`<Section title="...">` in About/FAQ/Technology Careers) remain valid unchanged — `eyebrow` and `spacing` are additive optional props.
  - `PageHeader({ title: string; subtitle?: string })` — used by Task 7 in place of each page's duplicated `<h1>` block.

- [ ] **Step 1: Replace `components/marketing/section.tsx`**

```tsx
import { cn } from "@/lib/utils"

const SPACING = {
  tight: "py-10 sm:py-12",
  default: "py-16 sm:py-20",
  loose: "py-24 sm:py-32",
} as const

export const Section = ({
  title,
  eyebrow,
  children,
  className,
  spacing = "default",
}: Props) => {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-3xl px-6 sm:px-16",
        SPACING[spacing],
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2 className="mb-6 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  )
}

type Props = {
  title?: string
  eyebrow?: string
  children: React.ReactNode
  className?: string
  spacing?: keyof typeof SPACING
}
```

- [ ] **Step 2: Create `components/marketing/page-header.tsx`**

```tsx
import { GradientBlob } from "@/components/marketing/gradient-blob"

export const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="relative overflow-hidden">
      <GradientBlob className="opacity-60" />
      <div className="relative mx-auto w-full max-w-3xl px-6 pt-20 pb-4 sm:px-16 sm:pt-28">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  )
}

type Props = {
  title: string
  subtitle?: string
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. Note that About/FAQ/Technology Careers still reference the *old* `Section` call shape at this point (they're updated in Task 7) — that's fine, since the new props are optional and backward compatible.

---

### Task 5: Extract shared career data, build Home section components

**Files:**
- Create: `lib/careers.ts`
- Create: `components/marketing/career-card.tsx`
- Create: `components/marketing/hero.tsx`
- Create: `components/marketing/how-it-works.tsx`
- Create: `components/marketing/career-preview-grid.tsx`
- Create: `components/marketing/blueprint-features.tsx`
- Create: `components/marketing/trust-strip.tsx`
- Create: `components/marketing/final-cta.tsx`

**Why `lib/careers.ts`:** the 10 career descriptions currently live as a local `const` inside `app/(marketing)/technology-careers/page.tsx`. The Home page needs a 6-career preview of the *same* copy, so the data moves to a shared module rather than being duplicated — Task 7 updates the Technology Careers page to import from here too.

**Interfaces:**
- Consumes: `Reveal`, `GradientBlob` (Task 2), `Section` (Task 4), `Button` (existing, unchanged).
- Produces:
  - `lib/careers.ts` exports `type Career = { title: string; description: string; icon: LucideIcon }` and `CAREERS: Career[]` (10 items, in the same order as today). Consumed by Task 7's Technology Careers page rewrite.
  - `CareerCard({ title: string; description: string; icon: LucideIcon })` — the single career-card rendering used by both `CareerPreviewGrid` here and the full Technology Careers page in Task 7. Its prop shape matches `Career` exactly, so callers can spread a `Career` object directly (`<CareerCard {...career} />`).
  - `Hero()`, `HowItWorks()`, `CareerPreviewGrid()`, `BlueprintFeatures()`, `TrustStrip()`, `FinalCta()` — zero-prop components, consumed by Task 6's Home page composition.

- [ ] **Step 1: Create `lib/careers.ts`**

```ts
import {
  BarChart3,
  Boxes,
  Brush,
  Cloud,
  Cpu,
  Gamepad2,
  Lightbulb,
  Server,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

export type Career = {
  title: string
  description: string
  icon: LucideIcon
}

export const CAREERS: Career[] = [
  {
    title: "Software Engineer",
    description:
      "Designs and builds the applications and systems people use every day. A strong fit if you enjoy problem-solving, logical thinking, and seeing something you built actually work.",
    icon: Boxes,
  },
  {
    title: "AI Engineer",
    description:
      "Builds and trains the machine learning models behind products like recommendation engines and chatbots. Suits students who like math, patterns, and working at the edge of what's possible.",
    icon: Sparkles,
  },
  {
    title: "Cybersecurity Analyst",
    description:
      "Protects systems and data from attacks by finding weaknesses before attackers do. A good match if you're detail-oriented and enjoy thinking like a puzzle-solver — or a detective.",
    icon: ShieldCheck,
  },
  {
    title: "Cloud Engineer",
    description:
      "Builds and manages the infrastructure that keeps apps and websites running reliably at scale. Fits students who like systems thinking and making complex things run smoothly.",
    icon: Cloud,
  },
  {
    title: "Data Scientist",
    description:
      "Turns raw data into insights that drive decisions, using statistics and code. A strong choice if you like numbers, asking why, and finding stories hidden in information.",
    icon: BarChart3,
  },
  {
    title: "UI/UX Designer",
    description:
      "Shapes how digital products look, feel, and work for the people using them. Suits students who are creative, empathetic, and curious about how design decisions affect behavior.",
    icon: Brush,
  },
  {
    title: "Product Manager",
    description:
      "Decides what gets built and why, working between users, designers, and engineers. Fits students who like leadership, communication, and connecting technology to real problems.",
    icon: Lightbulb,
  },
  {
    title: "DevOps Engineer",
    description:
      "Automates how software gets built, tested, and shipped so teams can release changes quickly and safely. A good fit if you like process, tooling, and making things more efficient.",
    icon: Server,
  },
  {
    title: "Robotics Engineer",
    description:
      "Designs and programs machines that sense and act in the physical world, from drones to industrial arms. Suits students drawn to hardware, hands-on building, and mechanics as much as code.",
    icon: Cpu,
  },
  {
    title: "Game Developer",
    description:
      "Builds the code, mechanics, and systems behind video games. A strong match if you're passionate about gaming and want to combine creativity with programming.",
    icon: Gamepad2,
  },
]
```

- [ ] **Step 2: Create `components/marketing/career-card.tsx`**

```tsx
import type { LucideIcon } from "lucide-react"

export const CareerCard = ({ title, description, icon: Icon }: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden className="size-5" />
      </div>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-2 text-pretty text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

type Props = {
  title: string
  description: string
  icon: LucideIcon
}
```

- [ ] **Step 3: Create `components/marketing/hero.tsx`**

```tsx
import Link from "next/link"

import { GradientBlob } from "@/components/marketing/gradient-blob"
import { Button } from "@/components/ui/button"

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <GradientBlob />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-28 text-center sm:px-16 sm:py-36">
        <h1 className="animate-in fade-in slide-in-from-bottom-4 text-balance text-5xl font-semibold tracking-tight duration-700 sm:text-6xl">
          Discover the Best Technology Career for You
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-4 max-w-xl text-pretty text-lg text-muted-foreground delay-150 duration-700">
          Take a free, structured assessment built for Class 11 &amp; 12
          students—see which tech career actually fits you.
        </p>
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-3 delay-300 duration-700 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Start Free Assessment
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base"
            nativeButton={false}
            render={<Link href="/technology-careers" />}
          >
            Explore Technology Careers
          </Button>
        </div>
        <p className="animate-in fade-in text-sm text-muted-foreground delay-500 duration-700">
          Free to start · No credit card · 10–15 minutes
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/marketing/how-it-works.tsx`**

```tsx
import { ClipboardCheck, Compass, FileText, Users } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Take the free assessment",
    description:
      "Answer questions about your academics, interests, and working style. No payment, no account needed to start.",
  },
  {
    icon: Compass,
    title: "See your top 3 matches",
    description:
      "Get a free preview of the tech careers that fit you best, with a short explanation of why.",
  },
  {
    icon: FileText,
    title: "Unlock your full Blueprint",
    description:
      "Go deeper with a complete Tech Career Blueprint: skills, learning path, college guidance, and salary outlook.",
  },
  {
    icon: Users,
    title: "Book a mentor call (optional)",
    description:
      "A real mentor reviews your Blueprint and adds context in a one-on-one strategy call.",
  },
] as const

export const HowItWorks = () => {
  return (
    <Section
      eyebrow="How it works"
      title="From confusion to a clear plan"
      spacing="loose"
      className="max-w-5xl"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 100}>
            <div className="flex flex-col gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon aria-hidden className="size-5" />
              </div>
              <p className="font-semibold">
                <span className="mr-2 text-muted-foreground">
                  {index + 1}.
                </span>
                {title}
              </p>
              <p className="text-pretty text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 5: Create `components/marketing/career-preview-grid.tsx`**

```tsx
import Link from "next/link"

import { CAREERS } from "@/lib/careers"
import { CareerCard } from "@/components/marketing/career-card"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { Button } from "@/components/ui/button"

const PREVIEW_CAREERS = CAREERS.slice(0, 6)

export const CareerPreviewGrid = () => {
  return (
    <Section
      eyebrow="Technology careers"
      title="Which one fits you?"
      spacing="loose"
      className="max-w-5xl"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PREVIEW_CAREERS.map((career, index) => (
          <Reveal key={career.title} delay={index * 75}>
            <CareerCard {...career} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/technology-careers" />}
        >
          See all 10 careers →
        </Button>
      </div>
    </Section>
  )
}
```

- [ ] **Step 6: Create `components/marketing/blueprint-features.tsx`**

```tsx
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

const FEATURES = [
  {
    title: "Career summary & why it fits",
    description: "Plain-language reasoning, not just a label.",
  },
  {
    title: "Required skills",
    description: "Exactly what to learn, in what order.",
  },
  {
    title: "Learning path",
    description: "Month 1–3, 4–6, and 7–12, mapped out.",
  },
  {
    title: "College guidance",
    description: "Degree vs. diploma, B.Tech vs. BCA vs. BSc CS.",
  },
  {
    title: "Salary expectations",
    description:
      "Entry, 3-year, 5-year, and 10-year, clearly labeled as indicative.",
  },
  {
    title: "Future outlook",
    description:
      "AI impact, global demand, remote opportunities, automation risk.",
  },
  {
    title: "Common mistakes to avoid",
    description: "The wrong turns other students make, so you don't have to.",
  },
] as const

export const BlueprintFeatures = () => {
  return (
    <Section
      eyebrow="Tech career blueprint"
      title="Everything you need to commit with confidence"
      spacing="loose"
      className="max-w-5xl"
    >
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {FEATURES.map(({ title, description }, index) => (
          <Reveal key={title} delay={index * 60}>
            <div className="flex gap-3">
              <div
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Delivered as a dashboard view plus a downloadable PDF.
      </p>
    </Section>
  )
}
```

- [ ] **Step 7: Create `components/marketing/trust-strip.tsx`**

```tsx
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { Reveal } from "@/components/marketing/reveal"

export const TrustStrip = () => {
  return (
    <Reveal className="border-y border-border bg-muted/40">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-6 py-10 text-center sm:px-16">
        <ShieldCheck aria-hidden className="size-6 text-primary" />
        <p className="text-pretty text-sm text-muted-foreground">
          Every Blueprint is reviewed by a real mentor before it reaches you,
          and we never sell your personal data.{" "}
          <Link
            href="/faq"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Read our FAQ
          </Link>
        </p>
      </div>
    </Reveal>
  )
}
```

- [ ] **Step 8: Create `components/marketing/final-cta.tsx`**

```tsx
import Link from "next/link"

import { Reveal } from "@/components/marketing/reveal"
import { Button } from "@/components/ui/button"

export const FinalCta = () => {
  return (
    <Reveal className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center sm:px-16">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Stop guessing. Start with clarity.
        </h2>
        <p className="max-w-md text-pretty text-primary-foreground/80">
          Take the free assessment today — it takes 10–15 minutes and
          there&rsquo;s no card required.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="h-12 px-8 text-base"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Start Free Assessment
        </Button>
      </div>
    </Reveal>
  )
}
```

- [ ] **Step 9: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. Confirm `lucide-react` exports used (`BarChart3`, `Boxes`, `Brush`, `Cloud`, `Cpu`, `Gamepad2`, `Lightbulb`, `Server`, `ShieldCheck`, `Sparkles`, `ClipboardCheck`, `Compass`, `FileText`, `Users`) resolve — a typo here shows up as a TS2305 "has no exported member" error.

---

### Task 6: Compose the new Home page

**Files:**
- Modify: `app/(marketing)/page.tsx`

**Interfaces:**
- Consumes: `Hero`, `HowItWorks`, `CareerPreviewGrid`, `BlueprintFeatures`, `TrustStrip`, `FinalCta` (Task 5), `Reveal` (Task 2), `Section` (Task 4).

- [ ] **Step 1: Replace `app/(marketing)/page.tsx`**

```tsx
import { BlueprintFeatures } from "@/components/marketing/blueprint-features"
import { CareerPreviewGrid } from "@/components/marketing/career-preview-grid"
import { FinalCta } from "@/components/marketing/final-cta"
import { Hero } from "@/components/marketing/hero"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { TrustStrip } from "@/components/marketing/trust-strip"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Reveal>
        <Section spacing="tight" className="text-center">
          <p className="text-pretty text-lg text-muted-foreground">
            Fragmented advice from YouTube, relatives, and influencers leaves
            students guessing — and parents wanting confidence their child
            isn&rsquo;t about to waste years on the wrong path. CoacheePro
            replaces the guesswork with a clear, structured answer.
          </p>
        </Section>
      </Reveal>
      <HowItWorks />
      <CareerPreviewGrid />
      <BlueprintFeatures />
      <TrustStrip />
      <FinalCta />
    </main>
  )
}
```

- [ ] **Step 2: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed with no errors.

---

### Task 7: Propagate the design system to About / Technology Careers / FAQ

**Files:**
- Modify: `app/(marketing)/about/page.tsx`
- Modify: `app/(marketing)/technology-careers/page.tsx`
- Modify: `app/(marketing)/faq/page.tsx`

**Interfaces:**
- Consumes: `PageHeader` (Task 4), `Reveal` (Task 2), `Section` (Task 4), `CAREERS` and `CareerCard` (Task 5).

- [ ] **Step 1: Replace `app/(marketing)/about/page.tsx`**

```tsx
import type { Metadata } from "next"

import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "About — CoacheePro",
  description:
    "Why CoacheePro exists and how it helps Class 11 & 12 students find the right technology career.",
}

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader title="About CoacheePro" />
      <Reveal>
        <Section title="Our Mission">
          <p className="text-pretty text-muted-foreground">
            CoacheePro helps Class 11 and 12 students figure out which
            technology career actually fits them — before they commit four
            or five years to a degree. We turn a confusing decision into a
            clear one: take a structured assessment, see which tech careers
            match your interests and strengths, and get a concrete plan for
            getting there.
          </p>
        </Section>
      </Reveal>
      <Reveal>
        <Section title="Why We Exist">
          <p className="text-pretty text-muted-foreground">
            A student interested in technology today is buried in advice —
            YouTube videos, relatives, teachers, influencers — and most of
            it is fragmented or contradictory. Which stream should I pick?
            Will AI replace this job by the time I graduate? What will I
            actually earn? What if I choose wrong? Parents feel this too:
            they&rsquo;re not looking for a vague &ldquo;roadmap,&rdquo; they
            want confidence that their child isn&rsquo;t about to waste
            years on the wrong path. CoacheePro exists to replace that
            guesswork with a clear, structured answer.
          </p>
        </Section>
      </Reveal>
      <Reveal>
        <Section title="Why We're Different">
          <p className="text-pretty text-muted-foreground">
            We&rsquo;re not a counselling service and we&rsquo;re not a
            generic AI chatbot. Our assessment is built specifically around
            technology careers — not a one-size-fits-all personality quiz —
            and every Tech Career Blueprint it produces is reviewed by a
            real mentor before it reaches you, so you get a second opinion
            from someone who&rsquo;s worked in the field, not just an
            algorithm&rsquo;s best guess.
          </p>
        </Section>
      </Reveal>
    </main>
  )
}
```

- [ ] **Step 2: Replace `app/(marketing)/technology-careers/page.tsx`**

```tsx
import type { Metadata } from "next"

import { CAREERS } from "@/lib/careers"
import { PageHeader } from "@/components/marketing/page-header"
import { CareerCard } from "@/components/marketing/career-card"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Technology Careers — CoacheePro",
  description:
    "Explore the technology careers CoacheePro helps Class 11 & 12 students evaluate.",
}

export default function TechnologyCareersPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        title="Technology Careers"
        subtitle={"\"Technology\" isn't one career — it's dozens of very different day-to-day jobs."}
      />
      <Section spacing="tight" className="max-w-5xl">
        <p className="text-pretty text-muted-foreground">
          Our assessment matches you against these ten to start, based on
          your interests, strengths, and working style.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAREERS.map((career, index) => (
            <Reveal key={career.title} delay={(index % 3) * 75}>
              <CareerCard {...career} />
            </Reveal>
          ))}
        </div>
      </Section>
    </main>
  )
}
```

- [ ] **Step 3: Replace `app/(marketing)/faq/page.tsx`**

Keep the existing `FAQ_CATEGORIES` constant (Product/Pricing/Assessment & Blueprint/Trust & Safety, with the real copy already written) exactly as-is. Only the imports and the JSX returned from `FaqPage` change:

```tsx
import type { Metadata } from "next"

import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ — CoacheePro",
  description: "Answers to common questions about CoacheePro.",
}

const FAQ_CATEGORIES = [
  {
    category: "Product",
    items: [
      {
        question: "What is CoacheePro?",
        answer:
          "CoacheePro is a technology career planning platform for Class 11 and 12 students. You take a free assessment, get matched to the tech careers that fit you, and can unlock a full Tech Career Blueprint with a learning path, college guidance, and salary expectations.",
      },
      {
        question: "Who is CoacheePro for?",
        answer:
          "Students aged 16–19 who are interested in technology but unsure which career fits them, and parents who want confidence in that decision before the family commits to a degree.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        question: "How much does the Tech Career Blueprint cost?",
        answer:
          "The Blueprint is a one-time, affordable fee — pricing is shown before you pay, with no subscription or hidden charges.",
      },
      {
        question: "Is the assessment free?",
        answer:
          "Yes. The Career Assessment and your free preview of the top 3 recommended careers are completely free, with no card required.",
      },
    ],
  },
  {
    category: "Assessment & Blueprint",
    items: [
      {
        question: "How long does the assessment take?",
        answer:
          "About 10–15 minutes. It covers your academics, interests, and working style — you can be honest and quick, there are no right or wrong answers.",
      },
      {
        question: "What's included in the Blueprint?",
        answer:
          "A career summary with plain-language reasoning for why it fits you, the skills you'll need, a month-by-month learning path for your first year, college guidance (degree vs. diploma, which type of program), indicative salary expectations, the career's future outlook including AI impact, and common mistakes to avoid — delivered as a dashboard and a downloadable PDF.",
      },
    ],
  },
  {
    category: "Trust & Safety",
    items: [
      {
        question: "Is my data safe?",
        answer:
          "Yes. We only use your information to generate your assessment results and Blueprint, and we never sell your personal data to third parties. See our Privacy Policy for full details.",
      },
      {
        question: "Are the mentors verified?",
        answer:
          "Our mentors are professionals brought on by the CoacheePro team to review and add context to your AI-generated Blueprint before it reaches you. As we grow, we'll share more detail on how mentors are selected.",
      },
    ],
  },
] as const

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader title="Frequently Asked Questions" />
      {FAQ_CATEGORIES.map(({ category, items }) => (
        <Reveal key={category}>
          <Section title={category}>
            <Accordion>
              {items.map(({ question, answer }) => (
                <AccordionItem key={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Section>
        </Reveal>
      ))}
    </main>
  )
}
```

- [ ] **Step 4: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both clean. Watch specifically for `react/no-unescaped-entities` on the Technology Careers `subtitle` string — it's a prop value, not JSX text, so a literal `'`/`"` inside the JS string is fine and should not trigger the rule; if it does, escape with `&rsquo;`/`&ldquo;`/`&rdquo;` inside the JSX text equivalent instead.

---

### Task 8: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: zero errors, zero warnings.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; confirm all 4 routes (`/`, `/about`, `/technology-careers`, `/faq`) are listed in the route output with no errors.

- [ ] **Step 3: Contrast check on key color pairs**

For each pair below, compute the WCAG contrast ratio from the final `oklch` values in `app/globals.css` (light mode) and confirm it meets the stated minimum:
- `--foreground` on `--background`: body text, must be ≥ 4.5:1.
- `--primary-foreground` on `--primary`: button text, must be ≥ 4.5:1.
- `--muted-foreground` on `--background`: secondary text, must be ≥ 4.5:1.
- `--muted-foreground` on `--card`: card body copy, must be ≥ 4.5:1.

If any pair fails, adjust that token's lightness (`L` channel) — not its hue or chroma — by the smallest amount needed to pass, and re-run this step.

- [ ] **Step 4: Visual check via the `run` skill**

Invoke the `run` skill to launch the dev server and view all four routes (`/`, `/about`, `/technology-careers`, `/faq`) at a mobile width (~390px) and a desktop width (~1440px). Confirm:
- Hero gradient blob is visible and not clipped/overflowing horizontally on mobile.
- Header stays fixed to the top and its blurred background is visible once the page is scrolled.
- Career cards and Blueprint feature list render icons (no broken/missing icon glyphs).
- Nothing overflows horizontally on mobile (no unwanted scrollbar).

- [ ] **Step 5: Reduced-motion check**

In the browser dev tools, emulate `prefers-reduced-motion: reduce` (Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion") and reload `/`. Confirm all content is visible immediately with no lingering `opacity-0` elements (the global override in `app/globals.css` should collapse every transition/animation to ~0ms).

- [ ] **Step 6: Keyboard navigation check**

Tab through the Home page from the top: header nav links → header CTA → hero CTAs → footer links. Confirm a visible focus ring appears on every stop and the underline-grow effect on nav links also triggers on keyboard focus (not just mouse hover) — if it doesn't, add `focus-visible:after:w-full` alongside the existing `group-hover:w-full` in `header.tsx`.

- [ ] **Step 7: Report results**

Summarize pass/fail for steps 1–6 to the user. Per the Global Constraints section, do not run `git commit` — stop here and wait for explicit instruction to commit.
