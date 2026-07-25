# CoacheePro — Product

## Vision

CoacheePro's long-term direction is a **Career Growth Platform** spanning career discovery (students), career acceleration (working professionals), and a vetted talent marketplace (startup hiring). That full vision is **not** what we're building now — it exists so architecture decisions don't box us out of it later. See "Explicitly out of scope" below.

## The problem (MVP)

A Class 11/12 student interested in technology is overwhelmed by fragmented, conflicting advice (YouTube, relatives, teachers, influencers) on questions like:

- Which stream / degree path fits me?
- Is AI going to replace this career?
- What skills will actually matter by the time I graduate?
- What can I realistically earn, and how does that grow?
- What if I pick wrong?

Parents don't want a "career roadmap" — they want confidence that their child isn't about to waste 4–5 years.

## Target users

- **Primary:** Students, 16–19, interested in technology, unsure which tech career fits them.
- **Secondary:** Parents who want confidence before the family invests in a degree.

**No separate account types.** One login. During onboarding we ask "Who are you? Student / Parent" — this is a profile attribute for personalization only, not a distinct auth flow or permission set. Whoever wants to pay for the Blueprint can pay, regardless of which option they picked.

## Explicitly out of scope for v1

- Career counselling / coaching marketplace framing (the product is "Career GPS," not "book a counsellor")
- Schools, coaching institutes, or bootcamp partnerships (B2B)
- Mentor dashboard, AI chat, community/forums
- Learning management system or course marketplace
- Recruiter portal / talent marketplace
- Mobile app
- Career Acceleration (working professionals) and Talent Partner (startup hiring) businesses — future phases of the broader vision, not this build

## MVP product flow

1. **Free Career Assessment** — captures interest, builds trust, no paywall.
2. **Free preview** — top 3 recommended careers with a short "why."
3. **Unlock full Tech Career Blueprint (paid)** — the flagship deliverable.
4. **Optional: Book a Career Strategy Call** — a mentor reviews the AI-generated blueprint and adds context. The mentor's role is to validate and refine, not to build the plan from scratch — this is what makes the human layer scalable.

### Assessment content areas

- **Academic:** stream (PCM/PCB), favorite subjects, coding experience, logical reasoning, English communication.
- **Interests:** apps, interfaces/design, robotics, AI, cybersecurity, gaming, electronics.
- **Lifestyle/working style:** people vs. computers, creative vs. analytical, startup vs. stable company, remote vs. office, appetite for continuous learning.

Candidate career matches drawn from: Software Engineer, AI Engineer, Cybersecurity Analyst, Cloud Engineer, Data Scientist, UI/UX Designer, Product Manager, DevOps Engineer, Robotics Engineer, Game Developer.

### Blueprint contents (paid deliverable)

- Career summary + why it fits (plain-language reasoning, not just a label)
- Required skills
- Learning path (month 1–3 / 4–6 / 7–12)
- College guidance (degree vs. diploma, B.Tech vs. BCA vs. BSc CS — general guidance, not college rankings)
- Salary expectations (entry / 3yr / 5yr / 10yr, clearly labeled as indicative)
- Future outlook (AI impact, global demand, remote opportunities, automation risk)
- Common mistakes to avoid

Delivered as a polished dashboard view + PDF export.

## What makes this defensible (not "just an AI wrapper")

Per-user output alone isn't a moat — ChatGPT/Gemini/Claude can generate a roadmap too. The moat is:

- A structured, tech-career-specific assessment (not a generic personality quiz)
- Mentor-reviewed blueprints (human validation layer)
- A proprietary recommendation framework that improves over time
- **Outcome data**: which profiles map to which careers, which blueprints correlate with students actually landing internships/roles. This only exists once real users flow through the product — it's a reason to ship and start collecting data early, not a reason to delay.

## Success metrics

Not yet defined with hard targets — this needs a decision before Phase 1 launch, not an invented number. Categories to track from day one regardless of target values:

- Assessment start → completion rate
- Free preview → paid Blueprint conversion rate
- Blueprint → mentor call booking rate
- Cost per lead / cost per paid conversion (once marketing spend starts)

**Status: Pending — define target numbers before Phase 1 goes live.**

## Phased roadmap

### Phase 1 — Marketing website
**Goal:** validate demand. No login, no dashboard.
- Pages: Home, Career Blueprint, About, Technology Careers, Blog, Contact, Book Consultation, FAQ, Privacy, Terms
- Lead capture form, newsletter signup, WhatsApp link, Calendly, Razorpay payment for any early paid offering
- Homepage hero leads with the product value prop ("Discover the Best Technology Career for You"), not "book a counselling session"

### Phase 2 — User accounts
**Goal:** build identity.
- Login (provider per ADR-001), student/parent profile attribute, dashboard shell, purchase history

### Phase 3 — Career Assessment
- Multi-step questionnaire with save/resume
- Career recommendation engine (first version can be rules-based; doesn't have to be AI from day one)

### Phase 4 — Blueprint Generator
- AI report generation (career match, skills, college guidance, salary growth, roadmap)
- PDF export, payment, dashboard integration

### Phase 5 — Mentor Platform
- Mentor view: student blueprint, notes, meeting history
- Student view: book session, past sessions, action items

### Phase 6 — Admin Portal
- Manage careers, salary data, assessment questions, payments, mentors; view analytics

No phase requires re-architecting a prior one — see `reference/ARCHITECTURE.md` for how the module boundaries support this.
