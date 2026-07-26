# CoacheePro

An AI-assisted Technology Career Planning Platform for Class 11 & 12 students.

Students who are unsure which technology career fits them take a structured assessment and get an AI-generated, mentor-reviewable **Tech Career Blueprint** — career matches and why they fit, required skills, a learning path, college guidance, salary trajectory, and future outlook.

**Live at:** [coacheepro.com](https://coacheepro.com)

## Status

Phase 1 scaffold complete — Next.js + Tailwind + shadcn/ui initialized with a working home page. Building out the remaining Phase 1 pages (About, Career Blueprint, Technology Careers, Blog, Contact, Book Consultation, FAQ, Privacy, Terms) is the next milestone.

## Documentation

Detailed product and architecture docs live in [`/reference`](reference):

- [`reference/PRODUCT.md`](reference/PRODUCT.md) — vision, target users, MVP scope, product flow, phased roadmap
- [`reference/ARCHITECTURE.md`](reference/ARCHITECTURE.md) — tech stack, database design, folder structure, module boundaries, security
- [`reference/ADRS.md`](reference/ADRS.md) — pending technology decisions with pros/cons/cost

Engineering principles and operating rules for anyone (or any agent) working in this repo are in [`CLAUDE.md`](CLAUDE.md).

## Tech stack

Next.js (TypeScript), Tailwind, AWS Amplify, PostgreSQL, Prisma, AWS S3, Razorpay, OpenAI. Full rationale and pending decisions in [`reference/ARCHITECTURE.md`](reference/ARCHITECTURE.md).
