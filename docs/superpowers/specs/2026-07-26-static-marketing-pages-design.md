# Phase 1 static marketing pages — design

**Date:** 2026-07-26
**Status:** Approved

## Goal

Build the remaining static pages of Phase 1 (marketing website, per `reference/PRODUCT.md`): About, Technology Careers, FAQ, Privacy, Terms — plus the shared site shell (header/footer) needed to reach them, since the site currently has zero navigation.

Out of scope for this batch (deferred — depend on Pending ADRs or separate follow-up work):
- Blog, Contact, Book Consultation (email — ADR-003 — and Calendly integration not yet decided)
- Lead capture form, newsletter signup, WhatsApp link
- Razorpay payment integration
- Final copy for any page (placeholders only — see Content approach)
- Legal review of Privacy/Terms boilerplate

## Approach

Shared shell + light reusable primitives (no content-as-data abstraction, no fully bespoke per-page duplication). Each page is hand-written JSX composed from a small `Section` wrapper and, for FAQ, shadcn's `Accordion`. This is the least abstraction that avoids duplicating nav/footer/FAQ-accordion/section-spacing across 5 pages, and keeps every page simple enough to read top-to-bottom.

## File structure

```
app/(marketing)/
├── layout.tsx              # NEW — wraps children with Header + Footer
├── page.tsx                 # existing home page, unchanged
├── about/page.tsx
├── technology-careers/page.tsx
├── faq/page.tsx
├── privacy/page.tsx
└── terms/page.tsx

components/
├── marketing/
│   ├── header.tsx
│   ├── footer.tsx
│   └── section.tsx           # shared section wrapper (heading + spacing)
└── ui/
    └── accordion.tsx          # shadcn accordion, added via shadcn CLI for FAQ
```

URLs: `/about`, `/technology-careers`, `/faq`, `/privacy`, `/terms`.

## Shared shell

`app/(marketing)/layout.tsx` renders `<Header />`, then `{children}`, then `<Footer />`. Root `layout.tsx` (fonts, `<body>`) is unchanged — this nests one level deeper. The existing home page is unaffected.

**Header** (`components/marketing/header.tsx`):
- Logo/wordmark ("CoacheePro") linking to `/`
- Nav links: Home, About, Technology Careers, FAQ
- "Start Free Assessment" CTA button on the right (reuses existing `Button` component)
- Basic responsive collapse via Tailwind breakpoints (`sm:`/`md:`) — not full mobile-nav polish, just "doesn't break on a phone"
- Not sticky/fixed — plain top-of-page

**Footer** (`components/marketing/footer.tsx`):
- Three columns: brand blurb (1-2 lines), Company (About, FAQ), Legal (Privacy, Terms)
- Copyright line, year computed at render (`new Date().getFullYear()`)
- No newsletter signup or social icons — depend on ADR-003, not part of this batch

## Page-by-page structure

All pages use the shared `Section` wrapper and get `[TODO]`-prefixed placeholder copy (structural placeholders, not final content — see Content approach), except Privacy/Terms which get generic boilerplate.

**About** (`/about`) — 3 sections: Mission, Story (why CoacheePro exists), Why It's Different (the "not just an AI wrapper" moat from `PRODUCT.md`). No team section (not decided/ready yet).

**Technology Careers** (`/technology-careers`) — intro blurb + a responsive grid of 10 cards, one per candidate career from `PRODUCT.md` (Software Engineer, AI Engineer, Cybersecurity Analyst, Cloud Engineer, Data Scientist, UI/UX Designer, Product Manager, DevOps Engineer, Robotics Engineer, Game Developer), each with a `[TODO]` one-line description. Single page, no per-career detail routes.

**FAQ** (`/faq`) — 4 category sections (Product, Pricing, Assessment & Blueprint, Trust & Safety), each rendering a shadcn `Accordion` with 2-3 `[TODO]` Q&A items.

**Privacy** (`/privacy`) — generic startup privacy-policy boilerplate (data collected, cookies, third parties referenced generically — Razorpay, OpenAI — contact for data requests). Visible note at the top: needs legal review before launch.

**Terms** (`/terms`) — generic startup ToS boilerplate (acceptable use, payments via Razorpay, disclaimer that career guidance is informational not a guarantee, liability limits). Same "needs legal review" note.

## Shared `Section` component

```tsx
export const Section = ({ title, children, className }: Props) => { ... };

type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};
```

Renders a consistent `max-w-*` container, vertical padding, and an optional `<h2>` heading. Pages compose multiple `<Section>`s with their own JSX inside — no config objects, no generic content renderer.

## Content approach

Structural placeholders, not final copy:
- About / Technology Careers / FAQ: `[TODO]` prefix + lorem-ipsum-style filler text, correct length/shape for the real copy to replace later.
- Privacy / Terms: generic startup legal boilerplate (not `[TODO]` placeholders — looks launch-ready) with an explicit on-page note that it requires real legal review before Phase 1 goes live, given Razorpay payments, India, and minors as users.

Final copywriting for About/Technology Careers/FAQ and legal review of Privacy/Terms are explicitly follow-up work, not part of this batch.

## Component conventions

New hand-written components in this batch (`Header`, `Footer`, `Section`) follow the convention documented in `.claude/rules/component-conventions.md`: named `const` arrow-function export, props destructured inline, prop type named `Props` declared after the component. Does not apply to `components/ui/*` (shadcn-generated) or to `page.tsx`/`layout.tsx` files (Next.js requires default exports there).

## Metadata

Each page exports its own `metadata: Metadata` (title + description), following the existing pattern in root `layout.tsx`. Standard Next.js SEO — nothing custom.

## Verification plan

1. `npm run build` — catches type errors and route issues.
2. Visual check of each route (`/`, `/about`, `/technology-careers`, `/faq`, `/privacy`, `/terms`) at mobile and desktop widths via the `run` skill.
3. Confirm header/footer nav links resolve to the correct routes.
4. Confirm the FAQ accordion expands/collapses correctly.
