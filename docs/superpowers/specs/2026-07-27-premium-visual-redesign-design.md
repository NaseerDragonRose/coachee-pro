# Premium visual redesign — design

**Date:** 2026-07-27
**Status:** Approved

## Goal

The marketing site currently runs on the stock shadcn "base-nova" theme: pure grayscale color tokens (zero chroma), no motion, no imagery, flat bordered cards, and a homepage that is a single hero with nothing else. It reads as an unstyled template rather than a designed product. This redesign builds a real design system (color, type, motion, layout) and applies it across all four marketing pages, so the site reads as premium and trustworthy to both students and the parents evaluating a paid purchase on their behalf.

Out of scope for this batch:
- Real photography/illustration (deferred — abstract shapes/gradients carry visual interest instead, see below)
- Any new page or route (Contact, Book Consultation, Blog — still blocked on ADR-003 / not in Phase 1 scope per existing project memory)
- Copy changes (About/Technology Careers/FAQ content is final from the prior session — only presentation changes)
- Dark mode *toggle* — dark tokens are filled in properly (not left as unused stubs) but there is no UI to switch to it yet; light is the only reachable mode this phase

## Direction (confirmed with user)

- **Color:** Indigo primary, warm-tinted neutrals (not pure grayscale) — trustworthy/tech-credible without feeling cold.
- **Personality:** Notion/Airbnb-style approachable premium — rounded, generous whitespace, human — over Linear's sharp minimalism, Stripe's fintech polish, or Apple's ultra-minimal restraint.
- **Visual interest:** Code-only abstract gradients/shapes (gradient blobs, subtle grid/glow), not photography or a stock icon set alone. Zero new asset dependency.
- **Sequencing:** Build the full system against Home first (flagship), then propagate to About/Technology Careers/FAQ in the same batch.

## Design tokens (`app/globals.css`)

Replace the zero-chroma grayscale tokens with:
- **Primary:** indigo (~Tailwind indigo-600, `oklch(~0.51 0.26 277)` in light mode; a lighter indigo-400/500 tint for dark mode primary, so it stays legible on a dark background).
- **Neutrals:** background/foreground/muted/border all get a few percent chroma toward the brand hue (~277) instead of `0 0 0` oklch — the specific mechanism that reads as "warm" rather than sterile.
- **Secondary accent:** a soft warm amber/coral, used sparingly (a badge, a gradient stop, a small highlight) so the palette isn't monochrome-blue.
- **Radius:** bump `--radius` up slightly from the current 0.625rem for a softer, friendlier corner (Airbnb/Notion direction, not Linear's sharp corners).
- **Shadows:** introduce soft, low-opacity elevation shadows as the primary way cards separate from background, supplementing (not fully replacing) the existing border-based separation.
- Both `:root` and `.dark` get real values — no unused/stub dark tokens.
- All text/background pairs checked against WCAG AA contrast (4.5:1 body text, 3:1 large text/UI) before values are finalized in code.

Because shadcn components (`Button`, `Accordion`, etc.) already consume these CSS variables rather than hardcoded colors, this token change alone re-skins every existing `components/ui/*` primitive with no code changes required there.

## Typography

Keep Geist Sans / Geist Mono (already loaded, no new font/network request). Changes are to scale and confidence, not typeface:
- Hero headline moves to a much larger, heavier size than the current single `text-4xl`/`text-5xl` line.
- A deliberate type scale across H1/H2/H3/body with tighter heading tracking and generous body line-height, replacing today's flat, under-differentiated sizing.

## Motion & interaction

No new dependency (no Framer Motion/GSAP) — built from `tw-animate-css` (already imported), a handful of custom keyframes in `globals.css`, and one small reusable primitive:

- **`<Reveal>`** (new client component, `components/marketing/reveal.tsx`): wraps a section, uses `IntersectionObserver` to add a fade/slide-up transition class the first time it enters the viewport. Used once, reused by every section on every page — not a per-section one-off.
- **Hero entrance:** one-time fade/slide-in of headline/subhead/CTA on load, plus a slow-drifting gradient blob behind the content (CSS keyframe animation, no JS).
- **Hover states:** cards lift with an increased shadow; buttons get a subtle scale/shadow response beyond today's flat color swap; links get an underline-grow effect instead of an instant color change.
- **Accessibility:** every animation above is gated behind `prefers-reduced-motion: no-preference` — users with reduced motion enabled get the static end-state instantly, nothing is forced on them.

## New/changed components

```
components/marketing/
├── header.tsx          # CHANGED — sticky, blurred backdrop, underline-grow nav links
├── footer.tsx           # CHANGED — new type/spacing/color, same link structure
├── section.tsx          # CHANGED — new spacing rhythm (not one repeated py-16 everywhere)
├── page-header.tsx      # NEW — shared page-title block (About/Technology Careers/FAQ
│                          currently duplicate this h1 markup identically); gradient
│                          backdrop consistent with the Home hero
├── reveal.tsx            # NEW — IntersectionObserver fade/slide-up wrapper, see above
├── gradient-blob.tsx      # NEW — decorative CSS gradient-mesh background piece, used in
│                          hero and final-CTA band
├── hero.tsx               # NEW — Home hero section
├── how-it-works.tsx        # NEW — Home 4-step flow section
├── career-preview-grid.tsx  # NEW — Home 6-career preview grid (icon + title + line)
├── blueprint-features.tsx    # NEW — Home "what's in the Blueprint" feature list
├── trust-strip.tsx             # NEW — Home mentor-review/data-handling one-liner
└── final-cta.tsx                # NEW — Home closing CTA band
```

All new hand-written components follow `.claude/rules/component-conventions.md`: named `const` arrow-function export, props destructured inline, `Props` type declared after the component.

`components/ui/*` (Button, Accordion, etc.) are **not** touched — they re-skin automatically via the token change above.

## Home page structure (`app/(marketing)/page.tsx`)

Composed from the new section components, each wrapped in `<Reveal>` except the hero (which gets its own one-time load-in animation instead of scroll-triggered):

1. **Hero** — headline, subhead, primary CTA ("Start Free Assessment"), secondary CTA ("Explore Technology Careers"), gradient-blob background, and an honest trust line under the buttons ("Free to start · No credit card · 10–15 minutes" — real facts from the FAQ, not invented stats).
2. **The problem, named** — 2–3 lines on the fragmented-advice pain point (same substance as the About page's "Why We Exist," shortened for homepage pacing).
3. **How it works** — 4 numbered steps: Free Assessment → Free Preview → Unlock full Blueprint → Optional mentor call.
4. **Explore careers preview** — 6 of the 10 careers (icon + title + one-liner, reusing copy already written on `/technology-careers`), "See all 10 →" link.
5. **What's in the Blueprint** — feature list of the real paid deliverable contents (skills, learning path, college guidance, salary expectations, future outlook, common mistakes). No fabricated product screenshot.
6. **Trust & Safety strip** — one line on mentor review + data handling, linking to `/faq`.
7. **Final CTA band** — high-contrast indigo section repeating the primary CTA.

Deliberately excluded: testimonials, client logos, usage stats, or any other social proof — there are no real users yet, and fabricating any would be dishonest and would need to be ripped out the moment real numbers exist.

## Propagation to About / Technology Careers / FAQ

Content is unchanged (already finalized). Presentation only:
- All three adopt the new shared `<PageHeader>` in place of their current duplicated `<h1>` block.
- **Technology Careers**: career cards get the new elevation/shadow system plus a `lucide-react` icon per career (dependency already installed, currently unused) instead of a plain text block; grid entrance wrapped in `<Reveal>`.
- **About**: sections get the new spacing rhythm and card/divider treatment between Mission / Why We Exist / Why We're Different.
- **FAQ**: accordion re-skins automatically via the token change (no code change needed there); page gets the shared `PageHeader` and updated section spacing.

## Accessibility checklist

- Contrast: all text/background/button pairs verified against WCAG AA before finalizing token values.
- Motion: every animation respects `prefers-reduced-motion`.
- Focus: visible focus-visible rings preserved on every interactive element; links distinguished by underline, not color alone.
- Structure: one `h1` per page, ordered `h2`/`h3` beneath, unchanged by the visual layer.
- Icons: decorative icons (career grid, feature list) get `aria-hidden`; none of the new icons convey information not already present as text.

## Verification plan

1. `npm run lint` and `tsc --noEmit` — no new errors.
2. `npm run build` — production build succeeds.
3. Visual check of all four routes (`/`, `/about`, `/technology-careers`, `/faq`) at mobile and desktop widths via the `run` skill, in both the default and `prefers-reduced-motion: reduce` states.
4. Manual contrast check (e.g. computed against WCAG AA) for primary/background, primary-foreground/primary, and muted-foreground/background pairs.
5. Keyboard-only pass: confirm every interactive element (nav links, CTA buttons, accordion triggers, footer links) is reachable and shows a visible focus state.
