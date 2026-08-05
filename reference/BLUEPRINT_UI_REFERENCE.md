# Tech Career Blueprint — UI reference

**Status:** Reference only, captured 2026-08-05. Not final UI or copy — captured from a third-party demo
(`https://roadmap-genius-15.preview.emergentagent.com/roadmap/609175af-2fd0-41de-ae31-5b6677114c54`, 
a generic career-roadmap product, not tech-career /
Indian-student specific) to catalog *what sections and content types a strong blueprint dashboard
needs*. Layout, colors, wording, and exact data points shown here (archetype names, salary figures,
course names, costs) are illustrative, not something to copy or use as real product content. Build the
actual Blueprint UI against this list later, informed by `PRODUCT.md`'s Blueprint contents and our own
design system (`shadcn/ui`, mobile-first per `.claude/rules/ui-conventions.md`).

## Section inventory

### 1. Profile header (persona summary)
- Eyebrow label ("YOUR CAREER ROADMAP")
- Personalized headline: `{name}, you're` + a highlighted **archetype badge** (e.g. "The Systems
  Builder") — a fun, memorable framing layered on top of the career matches themselves
- A narrative paragraph synthesizing the whole profile in plain language — ties together the
  strongest signals, budget context, and the general shape of recommended paths

### 2. Strengths / Watch-outs / Signal map (3-column row)
- **Strengths card** — 3 items, each a bold short title + 1–2 sentence explanation of why it's a
  strength and where it applies
- **Watch-outs card** — 2 items, each a bold short title + explanation + a concrete mitigation
  ("build basic workplace communication through daily written updates...")
- **Signal map card** — a bar chart of underlying trait categories (seen: Technical, Creative,
  Scientific, Empathy, Commercial, Entrepreneurial, Budget) showing relative strength per category.
  This is the profile-level scoring that presumably drives which careers get matched.

### 3. Top 3 matches (career switcher)
- Pill/tab row: one pill per matched career, each showing **career name + match %**
  (e.g. "Software QA Automation Engineer • 92%"). Tabs are clickable — switching tabs swaps all the
  detail below. Defaults to the top-recommended career.
- **Left detail card** (per selected career):
  - Career title
  - Meta line: stream fit (e.g. "12th with PCM preferred; BCA, BSc CS, or affordable BTech CS/IT are
    all workable") + an **AI risk label** (Low/Medium/High)
  - Match % badge
  - "Why this fits" paragraph, tied back to the profile's signals
  - "A day in this life" callout — short vignette of daily work
  - "Skills to build" — list of skill chips
- **Right card — Salary & growth**:
  - Line chart of salary progression across career-stage points (seen: Entry / 5yrs / 10yrs)
  - Stat tiles per point (local currency + USD equivalent shown together in the reference)
  - A short demand/outlook paragraph

### 4. Smart-money route / Paths to avoid (2-column row)
- **Smart-money route card** — the recommended cost-effective path in prose, plus two stat tiles
  ("Estimated cost" range, "You'd save" amount) and a named "expensive alternative" to contrast
  against
- **Paths to avoid card** — list of career/education paths that don't fit this profile, each a bold
  title + explanation tied back to weak signal areas (mirrors the Watch-outs framing)

### 5. Multi-year plan (per selected career)
- Heading: "Your N-year plan for {career}"
- A horizontal sequence of stage cards (seen: Year 1 / Year 2–3 / Year 4–5 / Year 6–10), each with:
  - Year-range badge
  - Stage title (e.g. "Build technical foundations")
  - Bullet list of actions for that stage
  - A milestone callout at the bottom (target icon + bold outcome statement)

  Note: our `PRODUCT.md` Blueprint spec defines the near-term learning path at month-level granularity
  (1–3 / 4–6 / 7–12), not year-level — the *stage → actions → milestone* card pattern is the reusable
  part, not the specific time buckets.

### 6. Learning resources
- A small set of cards, each a specific named course/platform recommendation:
  - Eyebrow label describing the resource type (e.g. "Affordable online platform or
    government-supported skilling provider")
  - Resource title
  - Description paragraph (why this resource, specifically)
  - Duration + cost line (e.g. "3–4 months · INR 3000–15000")

### 7. Next 7 days (checklist)
- A numbered (01–07) immediate action checklist, concrete and specific to the chosen career
- Ends in a CTA button ("Validate with a coach")
- **In the reference, this section was visually blurred/locked** — the one clearly gated block on
  the page, paired with a human-validation upsell CTA rather than a raw paywall. Worth considering
  as a pattern for our own free/paid or pre/post-call gating later, not a decision made now.

## Mapping to `PRODUCT.md` Blueprint contents

| PRODUCT.md field | Reference section(s) |
| --- | --- |
| Career summary + why it fits | §1 narrative + §3 "why this fits" |
| Required skills | §3 "Skills to build" |
| Learning path (month 1–3 / 4–6 / 7–12) | §5 pattern (stage → actions → milestone), re-bucketed to our granularity |
| College guidance | §3 meta line (stream fit) + §4 smart-money route |
| Salary expectations (entry / 3yr / 5yr / 10yr) | §3 salary chart + stat tiles (reference uses entry/5yr/10yr — ours adds a 3yr point) |
| Future outlook (AI impact, demand, remote, automation risk) | §3 AI risk label + demand paragraph |
| Common mistakes to avoid | §4 "Paths to avoid" |

## Extras beyond `PRODUCT.md`'s current list

Not yet in our documented Blueprint contents, but present in the reference and worth a product
decision on whether to fold in:

- Persona archetype naming (§1)
- Strengths / Watch-outs narrative, separate from career-specific reasoning (§2)
- Signal map / trait scoring visualization (§2)
- Match percentage per career (§3)
- AI risk label per career (§3)
- "A day in this life" vignette (§3)
- Named learning resources with cost/duration (§6)
- "Next 7 days" action checklist (§7)
