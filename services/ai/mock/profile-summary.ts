import type { ProfileSummary, SignalCategory } from "@/lib/blueprint/types"

type Archetype = { name: string; narrative: (studentName: string) => string }

const ARCHETYPES: Record<SignalCategory, Archetype> = {
  technical: {
    name: "The Systems Builder",
    narrative: (studentName) =>
      `${studentName} shows a clear tilt toward structured, technical work over people-heavy or highly creative roles. The strongest signal is in technical and systems thinking, which fits careers where logic, process, and reliability matter more than charisma or persuasion. ${studentName} is likely to do best in practical tech roles that reward consistency, problem-solving, and learning by building.`,
  },
  creative: {
    name: "The Creative Technologist",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward inventive, visual, and expressive work rather than purely structured or numbers-heavy roles. This usually fits careers where original thinking, design sense, and communicating ideas clearly matter as much as technical execution. ${studentName} is likely to do best in roles that mix creative problem-solving with hands-on building.`,
  },
  scientific: {
    name: "The Analytical Explorer",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward investigating, testing, and understanding how things work at a deeper level. This fits careers built on research, data, and evidence-based thinking rather than pure execution or persuasion. ${studentName} is likely to do best in roles that reward curiosity, rigor, and patient problem-solving.`,
  },
  empathy: {
    name: "The People-First Problem Solver",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward understanding and helping people, more than working alone with pure logic or numbers. This fits careers where communication, user understanding, and collaboration matter as much as technical skill. ${studentName} is likely to do best in roles that combine technical work with real interaction with people.`,
  },
  commercial: {
    name: "The Strategic Operator",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward practical, results-driven thinking — understanding what works, what's worth doing, and how to get it done efficiently. This fits careers where judgement, prioritization, and business sense matter as much as raw technical skill. ${studentName} is likely to do best in roles that connect technical work to real outcomes and decisions.`,
  },
  entrepreneurial: {
    name: "The Builder-Founder",
    narrative: (studentName) =>
      `${studentName} shows a strong pull toward ownership, initiative, and building things end-to-end rather than following a fixed process. This fits careers, or eventually ventures, where independent thinking, risk tolerance, and driving something forward matter as much as technical depth. ${studentName} is likely to do best in roles with real autonomy and room to build.`,
  },
}

const STRENGTH_LIBRARY: Record<SignalCategory, { title: string; detail: string }[]> = {
  technical: [
    {
      title: "Logical problem-solving",
      detail:
        "You're comfortable with structured tasks that have clear rules and outputs — valuable in coding, testing, and technical operations.",
    },
    {
      title: "Comfort with systems and processes",
      detail:
        "You tend to do well where reliability, documentation, and step-by-step execution matter more than persuasion or improvisation.",
    },
  ],
  creative: [
    {
      title: "Original thinking",
      detail:
        "You naturally generate ideas and enjoy shaping how something looks, feels, or works — a real asset in design and product-adjacent roles.",
    },
    {
      title: "Comfort with ambiguity",
      detail:
        "You're able to work through loosely-defined problems where there's no single right answer, which suits creative and design work.",
    },
  ],
  scientific: [
    {
      title: "Analytical rigor",
      detail: "You enjoy digging into how and why something works, which suits research-heavy and data-driven roles.",
    },
    {
      title: "Patience with detail",
      detail:
        "You're comfortable spending real time testing and verifying before drawing conclusions — valuable in data and engineering roles alike.",
    },
  ],
  empathy: [
    {
      title: "Understanding people",
      detail:
        "You pick up on what others need or struggle with, which is valuable in design, product, and any people-facing technical role.",
    },
    {
      title: "Clear communication",
      detail: "You're able to explain your thinking to others, which matters more in tech careers than most people expect.",
    },
  ],
  commercial: [
    {
      title: "Practical judgement",
      detail: "You think in terms of what's actually worth doing, which is useful in prioritization-heavy roles like product and operations.",
    },
    {
      title: "Resourcefulness",
      detail: "You tend to find efficient paths to a goal rather than the most elaborate one, which keeps projects moving.",
    },
  ],
  entrepreneurial: [
    {
      title: "Initiative",
      detail: "You're comfortable taking ownership without being told exactly what to do — valuable in fast-moving teams and startups.",
    },
    {
      title: "Risk tolerance",
      detail: "You're willing to try things that might not work, which suits builder-heavy, less structured environments.",
    },
  ],
}

const WATCHOUT_LIBRARY: Record<SignalCategory, { title: string; detail: string }> = {
  technical: {
    title: "Lower technical signal",
    detail:
      "Don't avoid technical work entirely — build basic comfort with logic and structured problem-solving through small guided exercises, since most tech careers need at least a working baseline.",
  },
  creative: {
    title: "Lower creative signal",
    detail:
      "Choose roles with clear structure instead of forcing yourself into open-ended design or branding work — use templates and proven processes rather than starting from a blank page.",
  },
  scientific: {
    title: "Lower research/analytical signal",
    detail:
      "Favor roles that apply existing methods over ones that require deep independent research — build comfort with data gradually rather than diving into heavy analysis first.",
  },
  empathy: {
    title: "Lower communication and empathy signal",
    detail:
      "Don't avoid communication entirely — build basic workplace communication through daily written updates, presentation practice, and explaining technical work simply.",
  },
  commercial: {
    title: "Lower business/commercial signal",
    detail:
      "Lean on roles with clear technical scope rather than ones requiring heavy client or stakeholder judgement calls — that instinct builds with experience over time.",
  },
  entrepreneurial: {
    title: "Lower creative and entrepreneurial drive",
    detail:
      "Choose roles with clear structure instead of forcing yourself into startup chaos or founder-style ambiguity — use templates, SOPs, and proven learning paths.",
  },
}

export const buildProfileSummary = (
  studentName: string,
  signalMap: Record<SignalCategory, number>
): ProfileSummary => {
  const ranked = (Object.entries(signalMap) as [SignalCategory, number][]).sort((a, b) => b[1] - a[1])

  const topCategory = ranked[0][0]
  const secondCategory = ranked[1][0]
  const lowestTwo = ranked.slice(-2).map(([category]) => category)

  const archetype = ARCHETYPES[topCategory]
  const strengths = [...STRENGTH_LIBRARY[topCategory], STRENGTH_LIBRARY[secondCategory][0]]
  const watchOuts = lowestTwo.map((category) => WATCHOUT_LIBRARY[category])

  return {
    archetype: archetype.name,
    narrative: archetype.narrative(studentName),
    strengths,
    watchOuts,
    signalMap,
  }
}
