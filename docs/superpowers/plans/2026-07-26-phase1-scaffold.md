# Phase 1 Next.js Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the Next.js project skeleton for CoacheePro Phase 1 (marketing website), with the confirmed stack wired end-to-end and one professionally-built home page proving the setup works.

**Architecture:** Scaffold a fresh Next.js + shadcn/ui project in a scratch directory, then merge only the generated application files into the repo root (the repo already has `CLAUDE.md`, `reference/`, `README.md`, `docs/` which must not be clobbered). Restructure the generated home page into the `(marketing)` route group per `ARCHITECTURE.md`. No DB, no other pages, no `services/`/`types/`/`prisma/` — those are deferred to the phase that actually needs them.

**Tech Stack:** Next.js 16.x (App Router, TypeScript), Tailwind CSS v4, shadcn/ui (Nova preset, neutral base), ESLint 9, npm, Node.js 24 LTS.

## Global Constraints

- Node.js 24 (current Active LTS) — verify with `node --version` before starting; if a different version is active, switch via `nvm use 24` or equivalent before running any command below.
- Package manager: npm only (no pnpm/yarn artifacts).
- No `src/` directory — `app/` lives at the repo root per `reference/ARCHITECTURE.md`'s folder structure.
- Import alias: `@/*`.
- shadcn/ui uses the **Nova** preset with **neutral** base color — a deliberate, full design-token theme (OKLCH color scale, radius scale, dark mode), not raw un-customized defaults. CoacheePro has no confirmed brand color yet (not decided in any `/reference` doc), so neutral is the correct choice — inventing a brand color now would be guessing an undecided product decision, not a shortcut avoided.
- Only `app/(marketing)/`, `components/`, `lib/`, `public/` get created this pass. `services/`, `types/`, `prisma/`, `app/(app)/`, `app/(admin)/` are deliberately deferred until the phase that needs them (Phase 2+).
- Every page/component must satisfy the Vercel Web Interface Guidelines recorded in `docs/superpowers/specs/2026-07-26-phase1-scaffold-design.md` (focus states, semantic HTML, typography, accessibility, copy rules, etc.).
- **Never run `git commit` without the user's explicit go-ahead, every single time** — this is a standing rule in `CLAUDE.md`. Every task in this plan ends with verification, not a commit. Stop and ask before committing anything.
- Do not let generated files overwrite the existing `README.md` or `.gitignore` — both already exist and the `.gitignore` already anticipates Node/Next.js ignores.

---

### Task 1: Initialize Next.js + shadcn/ui and merge into the repo

**Files:**
- Create: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`, `app/layout.tsx`, `app/globals.css`, `app/favicon.ico`, `app/page.tsx` (temporary — replaced in Task 2), `components/ui/button.tsx`, `lib/utils.ts`
- Modify: none
- Test: none (verified via build/lint commands below — this is infra setup, not application logic)

**Interfaces:**
- Consumes: nothing (first task)
- Produces:
  - `Button`, `buttonVariants` exported from `@/components/ui/button`
  - `cn(...)` exported from `@/lib/utils`
  - npm scripts: `dev`, `build`, `start`, `lint`

**Note on the scratch directory:** shell variables do not persist between separate command invocations in this environment. Rather than `mktemp -d` + a remembered variable, use the fixed, recomputable path `../coachee-pro-scaffold-scratch` (a sibling of the repo root) in every step below — no state needs to carry over between steps.

- [ ] **Step 1: Scaffold Next.js into a scratch directory**

Run from the repo root:

```bash
rm -rf ../coachee-pro-scaffold-scratch
npx --yes create-next-app@latest ../coachee-pro-scaffold-scratch \
  --typescript --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*" --use-npm --no-agents-md --disable-git --yes
```

Expected: `Success! Created ... at .../coachee-pro-scaffold-scratch`, with no `src/`, no `AGENTS.md`, no `CLAUDE.md`, and no nested `.git` inside it.

- [ ] **Step 2: Verify the scratch project has no unwanted files**

```bash
find ../coachee-pro-scaffold-scratch -maxdepth 1 | sort
```

Expected: `.next`, `app`, `eslint.config.mjs`, `next-env.d.ts`, `next.config.ts`, `node_modules`, `package-lock.json`, `package.json`, `postcss.config.mjs`, `public`, `README.md`, `tsconfig.json`. No `AGENTS.md`, no `CLAUDE.md`, no `src`.

- [ ] **Step 3: Initialize shadcn/ui in the scratch project**

```bash
npx --yes shadcn@latest init -y -d --cwd ../coachee-pro-scaffold-scratch
```

Expected output includes:
```
✔ Writing components.json.
✔ Created 2 files:
  - components/ui/button.tsx
  - lib/utils.ts
✔ Updating app/globals.css
```

This uses the Nova preset with neutral base color (the CLI's own default via `-d`), which produces a complete OKLCH-based theme with light/dark variants — not placeholder styling.

- [ ] **Step 4: Merge scratch project files into the repo root**

Run from the repo root (`/Users/nasruddin/Documents/Practise/coachee-pro`):

```bash
rsync -a --exclude=node_modules --exclude=.next --exclude=README.md --exclude=.git \
  ../coachee-pro-scaffold-scratch/ ./
```

This copies `app/`, `components/`, `lib/`, `public/`, `components.json`, and all config files into the repo root, without touching the existing `README.md`.

- [ ] **Step 5: Remove unused template assets and the scratch directory**

The default create-next-app template ships Next.js/Vercel branded SVGs that this project's home page won't reference:

```bash
rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
rm -rf ../coachee-pro-scaffold-scratch
```

- [ ] **Step 6: Install dependencies at the repo root**

```bash
npm install
```

Expected: installs succeed with no unresolved peer-dependency errors. (A fresh `create-next-app` install commonly reports npm audit advisories in transitive dev-tooling packages — e.g. `brace-expansion`/`minimatch` inside the eslint chain, or `postcss`/`sharp` inside Next.js's own dependency tree — where the only "fix" `npm audit` offers is downgrading `next` or `eslint` to a much older major version. Do not apply `npm audit fix --force` for these; that would break the app. This is expected upstream state for a fresh scaffold, not an action item.)

- [ ] **Step 7: Verify the build and lint pipeline**

```bash
npm run build
npm run lint
```

Expected: `npm run build` reports `✓ Compiled successfully` and lists route `/` as static. `npm run lint` produces no output (clean).

- [ ] **Step 8: Confirm scope — nothing extra was created**

```bash
git status --short
```

Expected: only the files listed in this task's **Files** section (plus `public/*.svg`, `components.json`) appear as untracked (`??`). No `services/`, `types/`, `prisma/`, `app/(app)/`, or `app/(admin)/` should exist.

Do not commit. Move to Task 2.

---

### Task 2: Marketing route group + professional home page

**Files:**
- Create: `app/(marketing)/page.tsx`
- Modify: `app/layout.tsx`
- Delete: `app/page.tsx` (moved into the route group)

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button` (Task 1)
- Produces: `Home` default export at `app/(marketing)/page.tsx`, rendered at route `/`

- [ ] **Step 1: Move the home page into the `(marketing)` route group**

```bash
mkdir -p "app/(marketing)"
git mv app/page.tsx "app/(marketing)/page.tsx" 2>/dev/null || mv app/page.tsx "app/(marketing)/page.tsx"
```

- [ ] **Step 2: Replace the placeholder home page with real hero content**

Replace the full contents of `app/(marketing)/page.tsx` with:

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center sm:px-16">
      <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Discover the Best Technology Career for You
      </h1>
      <p className="max-w-xl text-pretty text-lg text-muted-foreground">
        Take a free, structured assessment built for Class 11 &amp; 12
        students—see which tech career actually fits you.
      </p>
      <Button size="lg">Start Free Assessment</Button>
    </main>
  );
}
```

The headline is the exact hero value prop specified in `reference/PRODUCT.md` ("Discover the Best Technology Career for You," not "book a counselling session"). The button has no destination yet — the assessment flow is Phase 3 work; wiring it up is out of scope here.

- [ ] **Step 3: Update root layout metadata**

In `app/layout.tsx`, replace the `metadata` export:

```tsx
export const metadata: Metadata = {
  title: "CoacheePro — Discover the Best Technology Career for You",
  description:
    "A free career assessment for Class 11 & 12 students exploring technology careers.",
};
```

Leave the rest of `app/layout.tsx` (fonts, `html`/`body` structure) unchanged.

- [ ] **Step 4: Verify the page renders**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000/ | grep -o "Discover the Best Technology Career for You"
kill %1
```

Expected: the grep finds the headline text, confirming the route renders.

- [ ] **Step 5: Verify build and lint still pass**

```bash
npm run build
npm run lint
```

Expected: same clean output as Task 1, Step 7, now building `app/(marketing)/page.tsx` instead of the placeholder.

Do not commit. Move to Task 3.

---

### Task 3: Web Interface Guidelines compliance pass

**Files:**
- Modify (only if findings require changes): `app/(marketing)/page.tsx`, `app/layout.tsx`

**Interfaces:**
- Consumes: `app/(marketing)/page.tsx`, `app/layout.tsx` (Task 2)
- Produces: same files, guideline-compliant

- [ ] **Step 1: Run the web-design-guidelines skill against the scaffolded UI**

Invoke the `web-design-guidelines` skill (installed personally at `~/.claude-personal/skills/web-design-guidelines`) against `app/layout.tsx` and `app/(marketing)/page.tsx`. It fetches the current ruleset from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` and reports findings in `file:line` format.

- [ ] **Step 2: Fix any reported findings**

Apply fixes directly in the two files. Known-satisfied rules going in (verify these hold, don't just assume): single `<h1>` per page, `lang="en"` on `<html>`, semantic `<main>` landmark, shadcn `Button` already ships `focus-visible:ring-*` states, no straight quotes/ellipsis in the copy, `&amp;` used instead of "and", `text-balance`/`text-pretty` on heading/paragraph.

- [ ] **Step 3: Re-run build and lint after any fixes**

```bash
npm run build
npm run lint
```

Expected: clean, same as before.

Commit locally with a plain factual message (local commit only, nothing pushed — this project's "never commit without explicit OK" rule governs pushing/merging to main, not per-task local commits made during this approved SDD execution). Move to Task 4.

---

### Task 4: Final verification and status update

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: entire scaffold from Tasks 1–3
- Produces: nothing new — final checkpoint

- [ ] **Step 1: Confirm the folder structure matches the spec exactly**

```bash
find app components lib public -maxdepth 2 | sort
```

Expected: only `app/(marketing)/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/favicon.ico`, `components/ui/button.tsx`, `lib/utils.ts`, and `public/` (now empty of unused template SVGs). No `app/(app)`, `app/(admin)`, `services/`, `types/`, `prisma/`.

- [ ] **Step 2: Full pipeline check**

```bash
npm run build && npm run lint
```

Expected: both clean, as in prior tasks.

- [ ] **Step 3: Update README status**

In `README.md`, replace:

```markdown
## Status

Documentation phase complete. Application not yet built — Phase 1 (marketing website) is the next milestone.
```

with:

```markdown
## Status

Phase 1 scaffold complete — Next.js + Tailwind + shadcn/ui initialized with a working home page. Building out the remaining Phase 1 pages (About, Career Blueprint, Technology Careers, Blog, Contact, Book Consultation, FAQ, Privacy, Terms) is the next milestone.
```

- [ ] **Step 4: Commit locally, then stop for review**

Commit this task's changes locally with a plain factual message (nothing pushed). Then stop: this local commit is the last step this plan authorizes. Merging `phase1-nextjs-scaffold` into `main`, pushing anything, or any further commit beyond what this plan specifies requires the user's explicit go-ahead each time — per `CLAUDE.md`'s standing "never commit/push without being told" rule, which governs everything past this plan's scope.
