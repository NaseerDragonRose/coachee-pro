# UI conventions

Applies to **all** UI in this repo — `components/**`, `app/**/page.tsx`, `app/**/layout.tsx`, and anything else that renders. Unlike `component-conventions.md` (which is about file shape), this is about how the UI is built and verified.

## Mobile-first, always

Design the smallest viewport first, then add for larger ones. This is not a preference — most CoacheePro traffic is Class 11/12 students on phones.

- **Base classes are the mobile styles.** Layer with `sm:` / `md:` / `lg:` to *add* or *expand*. Never write desktop styles as the base and claw them back with `max-sm:` or overrides.
  - ✅ `flex flex-col gap-4 sm:flex-row sm:gap-8`
  - ❌ `flex flex-row gap-8 max-sm:flex-col max-sm:gap-4`
- **Build and check at ~375px width first**, then 768px, then desktop. If it only looks right after the breakpoint kicks in, the base styles are wrong.
- **No horizontal overflow at any width.** Wide content (tables, code, long career cards) scrolls inside its own `overflow-x-auto` container, never the page body.
- **Touch targets ≥ 44×44px** for anything tappable. Buttons that are `h-8` on desktop need a larger tap area on mobile.
- **Nothing important behind hover.** Hover is a progressive enhancement; tooltips, hover-reveal actions, and hover-only affordances must have a tap-reachable equivalent.
- **Type and spacing scale up, not down.** Start with the mobile size (`text-2xl`) and step up (`sm:text-3xl lg:text-5xl`).
- **Overlays are sheets on mobile.** Dialogs, drawers, and menus go full-height / near-full-width below `sm:` and become centered, constrained panels at `sm:` and up.
- **Fixed/sticky elements must respect safe areas** and must not cover the primary action on short viewports.

## Accessibility baseline

- Every interactive element is keyboard reachable with a visible focus ring.
- Form fields have a real `<label>`; errors use `role="alert"` and `aria-describedby`.
- Respect `prefers-reduced-motion` for any animation beyond a simple fade.
- Colour is never the only signal for state (error, selected, required).

## Theming

Every surface must work in both light and dark. Pair each light class with its `dark:` counterpart at the point it's written — don't defer dark mode to a later pass.

## Interaction feedback

The rule: **the pointer and the hover effect must agree about what is clickable.** A card that lifts but isn't clickable is a lie; a button that doesn't change the cursor reads as decoration.

### Cursor

Handled globally in `app/globals.css` — do **not** sprinkle `cursor-pointer` per component.

Tailwind v4's preflight sets `appearance: button` but never a cursor, and the browser default for `<button>` is `default`, not `pointer`. Left alone, every button in the app shows an arrow while every link shows a hand. The base layer restores `cursor: pointer` on `button:not(:disabled)`, `[role="button"]`, `label[for]` and `summary`, and sets `cursor: not-allowed` on anything disabled.

If a new interactive element doesn't get a pointer, add it to that rule rather than to the component.

### The marketing pages are the reference

**`components/marketing/**` is the base reference for cards and buttons.** When building anything in `app/(app)/**`, match what's already there rather than inventing a variant. The shared pieces are extracted into `components/ui/card.ts`; the originals they came from are `career-card.tsx`, `blueprint-features.tsx`, `how-it-works.tsx` and `components/dashboard/bordered-card.tsx`, which all carried an identical copy of the same treatment.

### Cards

One resting state, one hover, applied to every card:

| | Rest | Hover |
| --- | --- | --- |
| Border | `border-slate-200/80` (`dark:border-slate-800`) | `border-indigo-500/40` (`dark:border-indigo-500/30`) |
| Shadow | `shadow-sm` | `shadow-xl shadow-indigo-500/10` |
| Position | — | `-translate-y-1` |
| Surface | `bg-white/70 backdrop-blur-md` (`dark:bg-slate-950/60`) | unchanged |

Use `cardSurface` + `cardHover` from `components/ui/card.ts`, or `cardInteractive` when the card is itself a single link or button (it adds `block` and a focus ring).

**Every accent arrives on hover.** A card does not sit permanently in an accent colour to signal state — use a pill, an icon, or a label for that. `draft-card.tsx` marks itself "In Progress" with a badge, not a coloured border.

**The hover applies whether or not the card itself is clickable.** A card holding its own buttons still lifts; the cursor is what tells a student where the click target actually is. That is why the cursor rule above is global and not optional.

Put `group` on the card and let icons and badges respond with `group-hover:` — `career-card.tsx` inverts its icon box that way, and `start-new-card.tsx` follows it.

**One documented exception:** `whatsapp-card.tsx` uses an emerald accent and skips the lift. It's a single promoted CTA on a marketing page rather than one of a set, so it doesn't need to distinguish itself from neighbours. Don't copy it for ordinary cards.

### Buttons

`components/ui/button.tsx` (base-ui + cva) is the primitive. It already provides `focus-visible` ring, `active:translate-y-px`, and `disabled:opacity-50 disabled:pointer-events-none` — don't reimplement those.

The marketing convention layered on top:

- **Primary CTA** — `rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700`, height `h-11` or `h-12`, `px-6`/`px-8`.
- **Secondary** — `variant="outline"`, same height.
- **Tertiary / low-stakes** — a bare `<button>` with `hover:bg-slate-100 dark:hover:bg-slate-900` (e.g. Discard).
- **Destructive confirmation** — `bg-red-600 hover:bg-red-700`, only inside a confirm dialog, never as the resting state of a list row.

Note `disabled:pointer-events-none` on the primitive means a disabled button receives no hover *or* cursor — the `not-allowed` cursor won't show. Reduced opacity plus an explicit label ("… — Coming Soon") is what communicates the state.

### Every interactive element needs all three

Hover, focus-visible, and disabled — stated at the point the element is written:

- **Hover** — a visible change (background, border, or colour), never opacity alone.
- **Focus** — `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none`. Never `outline-none` without a replacement.
- **Disabled** — visually distinct *and* `disabled` on the element, so the cursor rule applies. A "coming soon" control is disabled and says so in its label; it is never an enabled button that does nothing.

### Motion

- List transition properties explicitly — `transition-[transform,border-color,box-shadow]`, never `transition-all`. The shorthand animates layout properties too and is a rendering cost on every hover.
- Any transform-based hover pairs with `motion-reduce:hover:translate-y-0`. The global `prefers-reduced-motion` block in `globals.css` collapses durations but does not stop a transform from applying.

### Known gap

These rules were written after most of the marketing pages were built. `transition-all` still appears in roughly 35 places across `components/marketing/**`, `components/ui/{button,dialog,accordion}.tsx` and several `app/(marketing)/**` pages, and `components/dashboard/bordered-card.tsx` duplicates `cardInteractive` by hand instead of importing it.

Apply the rules to anything you touch. Don't open a dedicated sweep unless asked — a 35-file diff for hover polish buries whatever else is in flight.
