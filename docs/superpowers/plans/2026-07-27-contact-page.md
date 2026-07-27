# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/contact` marketing page — a validated contact form (Name, Email, Phone, Message) with a stubbed (console.log) submit handler, plus a WhatsApp card, per the approved spec.

**Architecture:** Fully client-side. No API route, no server call, no persistence — real SES email sending is out of scope until an AWS sandbox account and verified domain exist (tracked as a code TODO against ADR-003). Two new named-export components (`ContactForm`, `WhatsappCard`) composed into a new default-export page route, following the same shell pattern as `/faq`.

**Tech Stack:** Next.js App Router, React 19, Tailwind v4, `react-hook-form` + `zod` + `@hookform/resolvers` (new dependencies — user's explicit choice for this form, see spec).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-27-contact-page-design.md`
- No new backend/API route or DB persistence in this batch — submit handler stubs with `console.log` and a `// TODO(ADR-003)` comment.
- WhatsApp number is a placeholder (`91XXXXXXXXXX`) with a `// TODO` comment — do not invent a real number.
- Hand-written components (`ContactForm`, `WhatsappCard`) follow `.claude/rules/component-conventions.md`: named `const` arrow-function export, props destructured inline, `Props` type (if any props exist) declared after the component. `contact/page.tsx` is a default export (Next.js special-file exception in the same rule file).
- **No test framework exists in this repo** (checked — no Jest/Vitest/RTL config, no `*.test.*`/`*.spec.*` files anywhere, no prior Phase 1 page has automated tests). Per the spec's Verification Plan, each task's "test" step is `npm run build` (type-check) plus a manual dev-server check — not automated unit tests. Do not introduce a test framework as part of this plan; that would be a repo-wide infra decision out of scope here.
- Never `git commit` in this repo without the user's explicit go-ahead for that specific commit (per `CLAUDE.md`) — draft commits as instructed below, but hold if the user hasn't given a per-commit OK in this session.

---

### Task 1: Install form dependencies + build `ContactForm`

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`)
- Create: `components/marketing/contact-form.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button` (existing — accepts standard button props including `type` and `disabled`).
- Produces: `ContactForm` — a zero-props React component, default-exported nowhere (named export only), for `app/(marketing)/contact/page.tsx` (Task 3) to import as `import { ContactForm } from "@/components/marketing/contact-form"`.

- [ ] **Step 1: Install the new dependencies**

```bash
npm install react-hook-form@7.83.0 zod@4.4.3 @hookform/resolvers@5.5.7
```

- [ ] **Step 2: Verify install**

Run: `npm ls react-hook-form zod @hookform/resolvers`
Expected: all three print a resolved version with no `UNMET DEPENDENCY` errors.

- [ ] **Step 3: Create `components/marketing/contact-form.tsx`**

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const inputClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (values: ContactFormValues) => {
    // TODO(ADR-003): replace with a real SES send once a domain and IAM
    // credentials are set up. For now, log the submission and treat it
    // as delivered.
    console.log(values)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-6 text-center">
        <p className="text-lg font-semibold">Message sent</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks — we&apos;ll get back to you within 1–2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          className={inputClassName}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={inputClassName}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          className={inputClassName}
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className={inputClassName}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 4: Type-check**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors related to `contact-form.tsx` (the build will still fail at this point only if nothing imports the new unused-export file incorrectly — it should succeed cleanly since it's a valid standalone module).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components/marketing/contact-form.tsx
git commit -m "feat: add ContactForm with react-hook-form + zod validation"
```

---

### Task 2: Build `WhatsappCard`

**Files:**
- Create: `components/marketing/whatsapp-card.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button` (existing, supports `nativeButton={false}` + `render={<a .../>}` polymorphic rendering — same pattern already used in `components/marketing/header.tsx:31-38`).
- Produces: `WhatsappCard` — a zero-props React component for `app/(marketing)/contact/page.tsx` (Task 3) to import as `import { WhatsappCard } from "@/components/marketing/whatsapp-card"`.

- [ ] **Step 1: Create `components/marketing/whatsapp-card.tsx`**

```tsx
import { Button } from "@/components/ui/button"

// TODO: replace with the real CoacheePro WhatsApp number before this page goes live.
const WHATSAPP_NUMBER_PLACEHOLDER = "91XXXXXXXXXX"

export const WhatsappCard = () => {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">Prefer WhatsApp?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Message us directly and we&apos;ll get back to you.
        </p>
      </div>
      <Button
        variant="outline"
        nativeButton={false}
        className="shrink-0"
        render={
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER_PLACEHOLDER}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        Chat on WhatsApp
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors related to `whatsapp-card.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/whatsapp-card.tsx
git commit -m "feat: add WhatsappCard with placeholder contact number"
```

---

### Task 3: Wire up `/contact` page

**Files:**
- Create: `app/(marketing)/contact/page.tsx`

**Interfaces:**
- Consumes: `ContactForm` (Task 1, `@/components/marketing/contact-form`), `WhatsappCard` (Task 2, `@/components/marketing/whatsapp-card`), `PageHeader` (existing, `@/components/marketing/page-header`, props `{ title: string; subtitle?: string }`), `Reveal` (existing, `@/components/marketing/reveal`, prop `children`), `Section` (existing, `@/components/marketing/section`, props include `spacing?: "tight" | "default" | "loose"`).
- Produces: the `/contact` route, default-exported `ContactPage` component + `metadata` export, following the exact pattern of `app/(marketing)/faq/page.tsx:81-101`.

- [ ] **Step 1: Create `app/(marketing)/contact/page.tsx`**

```tsx
import type { Metadata } from "next"

import { ContactForm } from "@/components/marketing/contact-form"
import { PageHeader } from "@/components/marketing/page-header"
import { Reveal } from "@/components/marketing/reveal"
import { Section } from "@/components/marketing/section"
import { WhatsappCard } from "@/components/marketing/whatsapp-card"

export const metadata: Metadata = {
  title: "Contact | CoacheePro",
  description: "Get in touch with the CoacheePro team.",
}

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader
        title="Contact Us"
        subtitle="Questions about the assessment, the Blueprint, or anything else? We're happy to help."
      />
      <Reveal>
        <Section spacing="tight">
          <ContactForm />
        </Section>
      </Reveal>
      <Reveal>
        <Section spacing="tight">
          <WhatsappCard />
        </Section>
      </Reveal>
    </main>
  )
}
```

- [ ] **Step 2: Type-check and route-check**

Run: `npm run build`
Expected: build succeeds and lists `/contact` as a generated static route in the output.

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/contact/page.tsx"
git commit -m "feat: add /contact page"
```

---

### Task 4: Add Contact to header and footer navigation

**Files:**
- Modify: `components/marketing/header.tsx:5-10`
- Modify: `components/marketing/footer.tsx:3-7`

**Interfaces:**
- Consumes: nothing new — pure data changes to existing `NAV_LINKS` / `COMPANY_LINKS` arrays already rendered by `Header` and `Footer`.
- Produces: nothing consumed by later tasks — this is the last task.

- [ ] **Step 1: Add Contact to `NAV_LINKS` in `components/marketing/header.tsx`**

Change:
```tsx
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/technology-careers", label: "Technology Careers" },
  { href: "/faq", label: "FAQ" },
]
```
to:
```tsx
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/technology-careers", label: "Technology Careers" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]
```

- [ ] **Step 2: Add Contact to `COMPANY_LINKS` in `components/marketing/footer.tsx`**

Change:
```tsx
const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/technology-careers", label: "Technology Careers" },
  { href: "/faq", label: "FAQ" },
]
```
to:
```tsx
const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/technology-careers", label: "Technology Careers" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]
```

- [ ] **Step 3: Type-check**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/header.tsx components/marketing/footer.tsx
git commit -m "feat: add Contact link to header and footer nav"
```

---

### Task 5: Manual verification pass

**Files:** none (verification only).

**Interfaces:** none — exercises the full page built in Tasks 1–4.

- [ ] **Step 1: Start the dev server**

Use the `run` skill (or `npm run dev`) to launch the app.

- [ ] **Step 2: Visual check**

Navigate to `http://localhost:3000/contact`. Confirm at both a mobile width (~375px) and desktop width (~1280px):
- Page renders with the "Contact Us" heading and subtitle
- Name, Email, Phone, Message fields and the "Send Message" button are visible
- The WhatsApp card renders below the form with a "Chat on WhatsApp" button

- [ ] **Step 3: Validation check**

Click "Send Message" with all fields empty. Confirm four inline error messages appear: "Name is required", "Email is required", "Phone number is required", "Message must be at least 10 characters".

- [ ] **Step 4: Happy-path check**

Fill in Name, a valid email, a phone number, and a message of 10+ characters. Click "Send Message". Confirm:
- The form is replaced by the "Message sent" confirmation (no page navigation/redirect)
- The submitted values appear in the browser console (via `console.log`)

- [ ] **Step 5: Nav check**

Confirm a "Contact" link appears in both the header nav and the footer "Company" column on `/`, and that clicking it navigates to `/contact`.

- [ ] **Step 6: WhatsApp link check**

Confirm the "Chat on WhatsApp" button links to `https://wa.me/91XXXXXXXXXX` (opens in a new tab) — expected to be a placeholder, not a working chat, until the real number is added.

No commit for this task — it's verification only. If any check fails, fix the relevant task's code and re-commit there rather than patching ad hoc.
