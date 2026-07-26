# Phase 1 Next.js Scaffold — Design

## Purpose

Initialize the Next.js project for CoacheePro Phase 1 (marketing website). This is a bare project skeleton, not a page-building effort — it establishes the foundation (tooling, folder structure, base UI system) that all subsequent Phase 1 page work builds on.

## Scope

**In scope:**
- Next.js project init with the confirmed stack (see `reference/ARCHITECTURE.md`)
- Folder structure matching `ARCHITECTURE.md`, limited to what Phase 1 actually needs
- shadcn/ui initialized and proven working with one real component
- One working home page (placeholder content, real layout)

**Out of scope (follow-on work, not this step):**
- Copy/content/design for the other 9 Phase 1 pages (About, Career Blueprint, Technology Careers, Blog, Contact, Book Consultation, FAQ, Privacy, Terms)
- Lead capture form, newsletter signup, WhatsApp link, Calendly embed, Razorpay integration
- `services/`, `types/`, `prisma/` — no content exists for these yet; add when the phase that needs them starts (Phase 2+ or when an actual integration lands)
- `(app)/` and `(admin)/` route groups — Phase 2 and Phase 6 respectively
- AWS Amplify deploy config (`amplify.yml`), CI/CD wiring

## Stack decisions (locked in)

| Decision | Choice |
| --- | --- |
| Node.js | 24 (current Active LTS) |
| Package manager | npm |
| Framework | Next.js, latest stable, App Router |
| Language | TypeScript |
| Linting | ESLint (Next.js default config) |
| Styling | Tailwind CSS v4 (create-next-app default) |
| UI components | shadcn/ui, initialized now |
| Import alias | `@/*` |

## Folder structure

```
coachee-pro/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx        # Home placeholder
│   ├── layout.tsx          # Root layout
│   └── globals.css
├── components/
│   └── ui/                 # shadcn-generated components
├── lib/
│   └── utils.ts            # shadcn cn() helper
├── public/
└── package.json / tsconfig.json / next.config.ts / components.json / eslint config
```

Everything else in the full folder structure documented in `ARCHITECTURE.md` (`services/`, `types/`, `prisma/`, `(app)/`, `(admin)/`) is intentionally deferred — same "don't scaffold empty placeholders" principle CLAUDE.md already applies to `.claude/`.

## Quality bar

The UI must read as professional, not a scaffolding throwaway — no shortcuts. Concretely:

- shadcn/ui init uses a deliberate theme (real color tokens, typography, radius) rather than leaving default placeholder values untouched.
- The one demo component and the home page placeholder must reflect actual layout/spacing/typography discipline — not unstyled boilerplate — since this is the foundation every later Phase 1 page inherits.
- Visual reference: [sheryians.com](https://sheryians.com/) — modern Indian coding-bootcamp aesthetic, directional inspiration only. It's a JS-rendered SPA and couldn't be fetched for exact colors/layout in this session; treat it as a vibe reference, not a pixel target, until screenshots or specific pages are shared for closer matching.
- Compliance bar: every component/page must satisfy the [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) — focus states, forms, animation, typography, accessibility, content handling, performance, hydration safety, and copy rules as fetched into this session. Run the `web-design-guidelines` skill as a review pass over generated UI code before considering any component or page done.
- Use the `tailwind-4-docs` skill for Tailwind v4-specific implementation questions.

## Verification

- `npm run dev` boots; home page renders at `/`
- shadcn Button (or equivalent proof component) renders with correct theming, no style errors
- `npm run build` succeeds
- `npm run lint` passes clean
- `web-design-guidelines` review pass run against the scaffolded home page/demo component with no unresolved findings
