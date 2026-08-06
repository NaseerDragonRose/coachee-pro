// The card surface used across the marketing pages, extracted so the app
// pages match it instead of drifting. Derived verbatim from the treatment in
// components/marketing/career-card.tsx, blueprint-features.tsx,
// how-it-works.tsx and components/dashboard/bordered-card.tsx, which all
// carried an identical copy.
//
// Exported as class strings rather than a component, following the
// `controlClassName` precedent in input.tsx — these cards differ enough in
// structure that a wrapper would need more props than the classes it saves.
//
// See .claude/rules/ui-conventions.md for the rules these encode.

/** Resting state. Neutral border, no lift — every accent arrives on hover. */
export const cardSurface =
  "rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md sm:p-6 dark:border-slate-800 dark:bg-slate-950/60"

/**
 * The standard hover: lift, indigo border, indigo-tinted shadow. Applies
 * whether or not the card is itself clickable — the cursor is what tells a
 * student where the click target is.
 *
 * Properties are listed rather than `transition-all` (the marketing originals
 * use the shorthand; see the known-gap note in the rules file).
 */
export const cardHover =
  "transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:border-indigo-500/30 motion-reduce:hover:translate-y-0"

/** A card that is itself a single link or button. */
export const cardInteractive = `${cardSurface} ${cardHover} block focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none`
