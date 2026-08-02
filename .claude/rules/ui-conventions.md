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
