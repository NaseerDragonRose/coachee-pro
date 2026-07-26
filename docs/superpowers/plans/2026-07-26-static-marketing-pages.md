# Phase 1 Static Marketing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared marketing site shell (header/footer) and the five remaining static Phase 1 pages — About, Technology Careers, FAQ, Privacy, Terms — for CoacheePro.

**Architecture:** A `MarketingLayout` wraps all routes in `app/(marketing)/` with a shared `Header` and `Footer`. Each page is hand-written JSX composed from a shared `Section` wrapper component; the FAQ page additionally uses a hand-written `Accordion` primitive. No content-as-data abstraction — this is 5 simple pages, not a CMS.

**Tech Stack:** Next.js App Router (TypeScript), Tailwind CSS v4, `@base-ui/react` primitives (already the project's primitive library — see `components/ui/button.tsx`), `lucide-react` icons.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-26-static-marketing-pages-design.md`
- Routes: `/about`, `/technology-careers`, `/faq`, `/privacy`, `/terms` (all under `app/(marketing)/`, no auth).
- Content: About / Technology Careers / FAQ use `[TODO]`-prefixed lorem-ipsum-style placeholder copy. Privacy / Terms use generic startup legal boilerplate (no `[TODO]`) plus a visible on-page note that it needs real legal review before launch (Razorpay payments, India, users who may be minors).
- Component convention (`.claude/rules/component-conventions.md`): hand-written components (`Header`, `Footer`, `Section`) use a named `const` arrow-function export, props destructured inline in the signature, and a `Props` type declared after the component. This does **not** apply to `components/ui/*` (treated as vendor/shadcn-style output) or to `page.tsx`/`layout.tsx` files (Next.js requires default exports there).
- No test framework exists in this repo (verified: `package.json` has no test runner, no test files anywhere). Do not introduce one for this batch. Verification is `npm run build` (catches type errors and route/compile issues) after each task, plus a final manual browser pass — matches the spec's own verification plan.
- **Never run `git commit` without pausing to get explicit user approval first**, even though steps below are written as "Commit" — this repo's `CLAUDE.md` requires explicit per-instance approval before every commit. At each Commit step, stop and ask the user; only run `git commit` after they say yes.
- The Accordion (Task 2) is hand-written wrapping `@base-ui/react/accordion` (already installed — confirmed present in `node_modules/@base-ui/react/accordion`) rather than generated via the shadcn CLI, following the exact pattern already used by `components/ui/button.tsx` (`data-slot` attributes, `cn()` for classNames, spreads primitive props, no `forwardRef` needed since the base-ui primitives forward refs themselves).
- Base UI's primitives use a `render` prop (accepts a `ReactElement`) to change the rendered element — **not** Radix's `asChild`. Confirmed in `node_modules/@base-ui/react/internals/types.d.ts`.

---

### Task 1: `Section` shared wrapper component

**Files:**
- Create: `components/marketing/section.tsx`

**Interfaces:**
- Produces: `Section({ title, children, className }: Props)` — named export, consumed by Tasks 6–10 as `import { Section } from "@/components/marketing/section"`.

- [ ] **Step 1: Write the component**

```tsx
export const Section = ({ title, children, className }: Props) => {
  return (
    <section className={`mx-auto w-full max-w-3xl px-6 py-16 sm:px-16${className ? ` ${className}` : ""}`}>
      {title ? (
        <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
};

type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: build succeeds (the component is unused so far, but must type-check cleanly).

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit` (see Global Constraints). If approved:

```bash
git add components/marketing/section.tsx
git commit -m "feat: add shared Section wrapper for marketing pages"
```

---

### Task 2: `Accordion` primitive component

**Files:**
- Create: `components/ui/accordion.tsx`

**Interfaces:**
- Produces: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` — named exports, consumed by Task 8 (FAQ page) as `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"`.

- [ ] **Step 1: Write the component**

```tsx
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  className,
  ...props
}: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex w-full flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-all hover:underline [&[data-panel-open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add components/ui/accordion.tsx
git commit -m "feat: add Accordion primitive wrapping base-ui accordion"
```

---

### Task 3: `Header` component

**Files:**
- Create: `components/marketing/header.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button` (existing, `render` prop for polymorphic rendering).
- Produces: `Header()` — named export, consumed by Task 5 (`app/(marketing)/layout.tsx`) as `import { Header } from "@/components/marketing/header"`.

- [ ] **Step 1: Write the component**

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
        <Button size="sm" className="shrink-0" render={<Link href="/" />}>
          Start Free Assessment
        </Button>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: build succeeds (component is unused so far, but must type-check cleanly — this also confirms the `render` prop usage on `Button` is valid).

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add components/marketing/header.tsx
git commit -m "feat: add marketing site Header"
```

---

### Task 4: `Footer` component

**Files:**
- Create: `components/marketing/footer.tsx`

**Interfaces:**
- Produces: `Footer()` — named export, consumed by Task 5 (`app/(marketing)/layout.tsx`) as `import { Footer } from "@/components/marketing/footer"`.

- [ ] **Step 1: Write the component**

```tsx
import Link from "next/link"

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
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
        </div>
        <div>
          <p className="text-sm font-semibold">Legal</p>
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
        </div>
      </div>
      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground sm:px-16">
        © {year} CoacheePro. All rights reserved.
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add components/marketing/footer.tsx
git commit -m "feat: add marketing site Footer"
```

---

### Task 5: Marketing layout — wires up Header + Footer

**Files:**
- Create: `app/(marketing)/layout.tsx`

**Interfaces:**
- Consumes: `Header` (Task 3), `Footer` (Task 4).
- Produces: default-exported `MarketingLayout` — a Next.js layout, applied automatically to every route in `app/(marketing)/` including the existing `page.tsx` (home). Nothing else imports this directly.

- [ ] **Step 1: Write the layout**

```tsx
import type { ReactNode } from "react"

import { Header } from "@/components/marketing/header"
import { Footer } from "@/components/marketing/footer"

export default function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
```

Note: this does not add its own `<main>` — the existing home page (`app/(marketing)/page.tsx`) already renders its own `<main className="flex flex-1 ...">`, and every new page created in Tasks 6–10 does the same. Root `layout.tsx`'s `<body className="min-h-full flex flex-col">` makes Header/`<main>`/Footer flex siblings, so the flex-1 main pushes the footer to the bottom on short pages.

- [ ] **Step 2: Verify it builds and the home page still renders correctly**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000/` in a browser. Expected: the existing home page hero renders unchanged, now with the Header above it and Footer below it. Confirm nav links in the Header point to `/`, `/about`, `/technology-careers`, `/faq` (the latter three will 404 until Tasks 6–8 land — that's expected at this point in the plan).

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add "app/(marketing)/layout.tsx"
git commit -m "feat: wrap marketing routes with shared Header and Footer"
```

---

### Task 6: About page

**Files:**
- Create: `app/(marketing)/about/page.tsx`

**Interfaces:**
- Consumes: `Section` (Task 1).
- Produces: route `/about`.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "About — CoacheePro",
  description:
    "Why CoacheePro exists and how it helps Class 11 & 12 students find the right technology career.",
}

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section title="Our Mission">
        <p className="text-pretty text-muted-foreground">
          [TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </p>
      </Section>
      <Section title="Why We Exist">
        <p className="text-pretty text-muted-foreground">
          [TODO] Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Section>
      <Section title="Why We're Different">
        <p className="text-pretty text-muted-foreground">
          [TODO] Duis aute irure dolor in reprehenderit in voluptate velit
          esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </Section>
    </main>
  )
}
```

- [ ] **Step 2: Verify it builds and renders**

Run: `npm run build`
Expected: build succeeds, `/about` listed in the route output.

Run: `npm run dev`, open `http://localhost:3000/about`. Expected: page renders with Header/Footer, three sections visible.

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add "app/(marketing)/about/page.tsx"
git commit -m "feat: add About page"
```

---

### Task 7: Technology Careers page

**Files:**
- Create: `app/(marketing)/technology-careers/page.tsx`

**Interfaces:**
- Consumes: `Section` (Task 1).
- Produces: route `/technology-careers`.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Technology Careers — CoacheePro",
  description:
    "Explore the technology careers CoacheePro helps Class 11 & 12 students evaluate.",
}

const CAREERS = [
  "Software Engineer",
  "AI Engineer",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Product Manager",
  "DevOps Engineer",
  "Robotics Engineer",
  "Game Developer",
] as const

export default function TechnologyCareersPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section title="Technology Careers">
        <p className="text-pretty text-muted-foreground">
          [TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit —
          a short intro on exploring technology careers.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAREERS.map((career) => (
            <div key={career} className="rounded-lg border border-border p-6">
              <p className="font-semibold">{career}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                [TODO] Lorem ipsum dolor sit amet, consectetur adipiscing
                elit.
              </p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
```

- [ ] **Step 2: Verify it builds and renders**

Run: `npm run build`
Expected: build succeeds, `/technology-careers` listed in the route output.

Run: `npm run dev`, open `http://localhost:3000/technology-careers`. Expected: intro text plus a 10-card grid, responsive (1 column on mobile, up to 3 on desktop).

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add "app/(marketing)/technology-careers/page.tsx"
git commit -m "feat: add Technology Careers page"
```

---

### Task 8: FAQ page

**Files:**
- Create: `app/(marketing)/faq/page.tsx`

**Interfaces:**
- Consumes: `Section` (Task 1), `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent` (Task 2).
- Produces: route `/faq`.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next"

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
        question: "[TODO] What is CoacheePro?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        question: "[TODO] Who is CoacheePro for?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        question: "[TODO] How much does the Tech Career Blueprint cost?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        question: "[TODO] Is the assessment free?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    category: "Assessment & Blueprint",
    items: [
      {
        question: "[TODO] How long does the assessment take?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        question: "[TODO] What's included in the Blueprint?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
  {
    category: "Trust & Safety",
    items: [
      {
        question: "[TODO] Is my data safe?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        question: "[TODO] Are the mentors verified?",
        answer:
          "[TODO] Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ],
  },
] as const

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col">
      {FAQ_CATEGORIES.map(({ category, items }) => (
        <Section key={category} title={category}>
          <Accordion>
            {items.map(({ question, answer }) => (
              <AccordionItem key={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      ))}
    </main>
  )
}
```

- [ ] **Step 2: Verify it builds and renders**

Run: `npm run build`
Expected: build succeeds, `/faq` listed in the route output.

Run: `npm run dev`, open `http://localhost:3000/faq`. Expected: 4 category sections, each with an accordion; clicking a question expands/collapses its answer (chevron icon rotates on open).

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add "app/(marketing)/faq/page.tsx"
git commit -m "feat: add FAQ page"
```

---

### Task 9: Privacy page

**Files:**
- Create: `app/(marketing)/privacy/page.tsx`

**Interfaces:**
- Consumes: `Section` (Task 1).
- Produces: route `/privacy`.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Privacy Policy — CoacheePro",
  description: "How CoacheePro collects, uses, and protects your data.",
}

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section title="Privacy Policy">
        <p className="rounded-md border border-dashed border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          This is a generic placeholder policy and has not been reviewed
          by legal counsel. It must be replaced with a reviewed policy
          before Phase 1 goes live, given payments (Razorpay), an
          India-based audience, and users who may be minors.
        </p>
      </Section>
      <Section title="Information We Collect">
        <p className="text-pretty text-muted-foreground">
          We collect information you provide directly, such as your name,
          email address, and responses to our career assessment. We also
          collect limited technical information, such as your browser
          type and general usage data, to help us improve the site.
        </p>
      </Section>
      <Section title="How We Use Your Information">
        <p className="text-pretty text-muted-foreground">
          We use your information to provide the CoacheePro service,
          including generating your career assessment results, processing
          payments, and communicating with you about your account. We do
          not sell your personal information to third parties.
        </p>
      </Section>
      <Section title="Cookies">
        <p className="text-pretty text-muted-foreground">
          We use cookies and similar technologies to keep you signed in,
          remember your preferences, and understand how the site is
          used. You can control cookies through your browser settings.
        </p>
      </Section>
      <Section title="Third-Party Services">
        <p className="text-pretty text-muted-foreground">
          We work with third-party providers to operate CoacheePro,
          including payment processing (Razorpay) and AI-generated
          content (OpenAI). These providers only receive the information
          necessary to perform their services and are bound by their own
          privacy obligations.
        </p>
      </Section>
      <Section title="Your Rights">
        <p className="text-pretty text-muted-foreground">
          You may request access to, correction of, or deletion of your
          personal information at any time by contacting us.
        </p>
      </Section>
      <Section title="Contact Us">
        <p className="text-pretty text-muted-foreground">
          If you have questions about this Privacy Policy, please contact
          us at privacy@coacheepro.com.
        </p>
      </Section>
    </main>
  )
}
```

- [ ] **Step 2: Verify it builds and renders**

Run: `npm run build`
Expected: build succeeds, `/privacy` listed in the route output.

Run: `npm run dev`, open `http://localhost:3000/privacy`. Expected: legal-review notice visible at the top, followed by the policy sections.

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add "app/(marketing)/privacy/page.tsx"
git commit -m "feat: add Privacy Policy page"
```

---

### Task 10: Terms page

**Files:**
- Create: `app/(marketing)/terms/page.tsx`

**Interfaces:**
- Consumes: `Section` (Task 1).
- Produces: route `/terms`.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next"

import { Section } from "@/components/marketing/section"

export const metadata: Metadata = {
  title: "Terms of Service — CoacheePro",
  description: "The terms that govern your use of CoacheePro.",
}

export default function TermsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section title="Terms of Service">
        <p className="rounded-md border border-dashed border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          This is a generic placeholder set of terms and has not been
          reviewed by legal counsel. It must be replaced with reviewed
          terms before Phase 1 goes live, given payments (Razorpay), an
          India-based audience, and users who may be minors.
        </p>
      </Section>
      <Section title="Acceptable Use">
        <p className="text-pretty text-muted-foreground">
          You agree to use CoacheePro only for its intended purpose:
          exploring technology career guidance for yourself or, if you
          are a parent, on behalf of your child. You may not misuse the
          service, attempt to access it through unauthorized means, or
          interfere with its normal operation.
        </p>
      </Section>
      <Section title="Payments">
        <p className="text-pretty text-muted-foreground">
          Paid features, such as the Tech Career Blueprint, are processed
          through Razorpay. All fees are stated in Indian Rupees (INR)
          unless noted otherwise and are non-refundable except as
          required by law.
        </p>
      </Section>
      <Section title="No Guarantee of Outcome">
        <p className="text-pretty text-muted-foreground">
          Career guidance, including assessment results and the Tech
          Career Blueprint, is informational and based on the information
          you provide. It is not a guarantee of admission, employment, or
          any specific career outcome.
        </p>
      </Section>
      <Section title="Limitation of Liability">
        <p className="text-pretty text-muted-foreground">
          To the maximum extent permitted by law, CoacheePro is not
          liable for indirect, incidental, or consequential damages
          arising from your use of the service.
        </p>
      </Section>
      <Section title="Changes to These Terms">
        <p className="text-pretty text-muted-foreground">
          We may update these Terms from time to time. Continued use of
          CoacheePro after changes take effect constitutes acceptance of
          the updated Terms.
        </p>
      </Section>
      <Section title="Contact Us">
        <p className="text-pretty text-muted-foreground">
          If you have questions about these Terms, please contact us at
          legal@coacheepro.com.
        </p>
      </Section>
    </main>
  )
}
```

- [ ] **Step 2: Verify it builds and renders**

Run: `npm run build`
Expected: build succeeds, `/terms` listed in the route output.

Run: `npm run dev`, open `http://localhost:3000/terms`. Expected: legal-review notice visible at the top, followed by the terms sections.

- [ ] **Step 3: Commit**

Pause and ask the user for explicit approval before running `git commit`. If approved:

```bash
git add "app/(marketing)/terms/page.tsx"
git commit -m "feat: add Terms of Service page"
```

---

### Task 11: Full-site verification pass

**Files:** none created or modified — this task is verification only.

**Interfaces:** none.

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: build succeeds with all 6 marketing routes listed (`/`, `/about`, `/technology-careers`, `/faq`, `/privacy`, `/terms`).

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual browser pass at desktop width**

Use the `run` skill to start the dev server and open each of the 6 routes at a desktop viewport width. For each, confirm:
- Header renders with all 4 nav links, and each link navigates to the correct page.
- Footer renders with Company and Legal links, and each link navigates to the correct page.
- Page content renders without layout breakage (no overflow, no overlapping text).
- On `/faq`, click at least 2 accordion questions and confirm they expand and collapse correctly, with the chevron icon rotating.

- [ ] **Step 4: Manual browser pass at mobile width**

Repeat the same 6-route check at a mobile viewport width (e.g. 375px). Confirm the Header's nav collapses sensibly (no horizontal overflow) and the CTA button remains visible and usable, and that the Technology Careers card grid drops to a single column.

- [ ] **Step 5: Report results**

Summarize pass/fail for each route and viewport combination. If anything fails, fix it and re-run Steps 1–4 before considering this task (and the plan) complete.

No commit for this task — it produces no file changes.
