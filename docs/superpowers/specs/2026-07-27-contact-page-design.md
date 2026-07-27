# Contact page — design

**Date:** 2026-07-27
**Status:** Approved

## Goal

Build the `/contact` page for Phase 1 (marketing website, per `reference/PRODUCT.md`), one of the remaining Phase 1 items called out in `docs/superpowers/specs/2026-07-26-static-marketing-pages-design.md`'s "out of scope" list.

Real email delivery is not in scope yet: ADR-003 (email — `reference/ADRS.md`) is decided as AWS SES, but no AWS sandbox account, verified domain, DKIM/SPF, or SES production access exists yet. This batch stubs the send with `console.log` and treats it as success; wiring real SES sending is explicit follow-up work, tracked as a TODO in code.

The pending Phase 1 "WhatsApp link" item is folded into this page rather than done separately, since Contact is the natural home for it. The real WhatsApp number is not yet known — a placeholder is used, following the same "don't invent a fact" approach already used for price/mentor-vetting/assessment-duration copy (see `project_marketing_copy_placeholders` memory).

Out of scope for this batch:
- Real SES email sending (needs AWS sandbox account + domain verification — separate follow-up)
- Book Consultation (Calendly) and Razorpay integration — separate Phase 1 items
- Real WhatsApp number (placeholder only, swap in later)
- Any backend persistence of submissions (no DB exists yet — ADR-005 pending)

## Approach

Client-side only for now: a controlled form using **react-hook-form + zod** for validation (user's explicit choice, overriding the plain-`useState` default this repo has used elsewhere — see Dependencies below), with a stubbed submit handler. No API route, no server call — there's nothing real to send to until SES is wired up, so adding a route now would be speculative.

## File structure

```
app/(marketing)/
└── contact/page.tsx          # NEW

components/marketing/
├── contact-form.tsx            # NEW — client component
└── whatsapp-card.tsx           # NEW

components/marketing/header.tsx # EDIT — add Contact to NAV_LINKS
components/marketing/footer.tsx # EDIT — add Contact to COMPANY_LINKS
```

URL: `/contact`.

## Dependencies

Adds three new packages (none currently in `package.json`): `react-hook-form`, `zod`, `@hookform/resolvers`. This is a deliberate exception to this repo's no-new-deps-for-simple-forms pattern — user's explicit choice for this page. Future forms in this repo can reuse the same stack rather than reintroducing plain `useState` validation, now that the dependency is already paid for.

## `contact/page.tsx`

Default export (Next.js special file), same shell pattern as `/faq`:
- `metadata: Metadata` — title `"Contact | CoacheePro"` + description
- `<PageHeader title="Contact Us" subtitle="..." />`
- `<ContactForm />`
- `<WhatsappCard />`

## `ContactForm` (`components/marketing/contact-form.tsx`)

Named `const` export, `"use client"`, per `.claude/rules/component-conventions.md`.

**Fields** (all required):
- Name — non-empty string
- Email — valid email format
- Phone — non-empty string (basic presence check, no strict phone-format validation — international student/parent numbers vary too much to regex reliably)
- Message — non-empty string, reasonable min length (e.g. 10 chars) to avoid empty-ish submissions

**Validation:** zod schema passed to `react-hook-form` via `@hookform/resolvers/zod`. Field-level error messages render inline under each input on blur/submit, consistent with standard react-hook-form patterns.

**Submit handler:**
```ts
// TODO(ADR-003): replace with real SES send once domain + IAM are set up.
// For now, log the submission and treat it as delivered.
const onSubmit = (values: ContactFormValues) => {
  console.log(values)
  setSubmitted(true)
}
```

**Post-submit UX:** on `submitted === true`, the form is replaced (same page, no redirect) with an inline confirmation: "Thanks — we'll get back to you within 1–2 business days." Matches the approved design — no dedicated thank-you route.

## `WhatsappCard` (`components/marketing/whatsapp-card.tsx`)

Named `const` export. Small card/section below the form offering WhatsApp as an alternative contact method, with a `wa.me` link.

```ts
// TODO: replace with the real CoacheePro WhatsApp number before this page goes live.
const WHATSAPP_NUMBER_PLACEHOLDER = "91XXXXXXXXXX"
```

Link: `https://wa.me/${WHATSAPP_NUMBER_PLACEHOLDER}`. Visibly a placeholder in code (clearly non-dialable digits), same treatment as other unresolved facts elsewhere in the marketing copy — not meant to be clicked in production until the real number replaces it.

## Nav updates

Add `{ href: "/contact", label: "Contact" }` to:
- `NAV_LINKS` in `components/marketing/header.tsx`
- `COMPANY_LINKS` in `components/marketing/footer.tsx`

## Data flow / error handling

Entirely client-side. No API route, no server call, no persistence. The only error state is zod field-validation errors surfaced by react-hook-form. No network-failure handling needed since there's no network call yet.

## Component conventions

`ContactForm` and `WhatsappCard` follow `.claude/rules/component-conventions.md`: named `const` arrow-function export, props destructured inline, `Props` type declared after the component. `contact/page.tsx` is a default export per the Next.js special-file exception in that same rule file.

## Verification plan

1. `npm run build` — catches type errors and route issues (including the three new dependencies).
2. Visual check of `/contact` at mobile and desktop widths via the `run` skill.
3. Manually submit the form: empty submit shows all four validation errors; valid submit shows the inline success state and logs the values to the console.
4. Confirm the new `Contact` nav link appears in header and footer and resolves correctly.
5. Confirm the WhatsApp card renders and links to `wa.me/<placeholder>` (not expected to be a working chat until the real number is added).
