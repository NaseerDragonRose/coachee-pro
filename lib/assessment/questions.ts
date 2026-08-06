import type { Answers, Question } from "./types.ts"

const includes = (answers: Answers, id: string, optionId: string): boolean =>
  Array.isArray(answers[id]) && (answers[id] as string[]).includes(optionId)

/**
 * Recorded on every assessment so analytics can bucket by question-set
 * generation instead of mixing incomparable cohorts. Bump it whenever a
 * question is added, removed, or has its meaning changed — reworded prompts
 * and relabelled options both count, since either changes what the answer
 * meant. Becomes dynamic when the Phase 6 admin catalog lands.
 */
export const QUESTION_SET_VERSION = "2026-08-06"

export const QUESTIONS: Question[] = [
  // ---------- Area 1: Identification ----------
  // No name question: Google supplies it at sign-in, and the assessment only
  // ever runs for a signed-in student now. `users.name` is authoritative.
  {
    id: "class",
    area: "identification",
    type: "choice",
    prompt: "Which class are you in?",
    options: [
      { id: "class_11", label: "Class 11" },
      { id: "class_12", label: "Class 12" },
      { id: "finished_12", label: "Just finished Class 12" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "stream",
    area: "identification",
    type: "choice",
    prompt: "Which stream are you in?",
    options: [
      { id: "pcm", label: "PCM" },
      { id: "pcb", label: "PCB" },
      { id: "pcmb", label: "PCMB" },
      { id: "commerce_maths", label: "Commerce with Maths" },
      { id: "commerce_no_maths", label: "Commerce without Maths" },
      { id: "arts", label: "Arts / Humanities" },
      { id: "other", label: "Other" },
    ],
  },

  // ---------- Area 2: Academic & skill strengths ----------
  {
    id: "subjects",
    area: "strengths",
    type: "multi",
    prompt: "Which subjects do you enjoy and do well in?",
    helper: "Pick as many as you like. There's no right or wrong answer here.",
    options: [
      { id: "maths", label: "Maths" },
      { id: "physics", label: "Physics" },
      { id: "chemistry", label: "Chemistry" },
      { id: "biology", label: "Biology" },
      { id: "computer_science", label: "Computer Science / IT" },
      { id: "english", label: "English" },
      { id: "economics", label: "Economics" },
      { id: "art_design", label: "Art & Design" },
      { id: "other", label: "Something else" },
    ],
  },
  {
    id: "help_with",
    area: "strengths",
    type: "multi",
    prompt: "What do people usually ask you for help with?",
    helper: "There's no right or wrong answer here.",
    options: [
      { id: "fixing_gadgets", label: "Fixing gadgets or computers" },
      { id: "explaining", label: "Explaining tough topics" },
      { id: "organising", label: "Organising things" },
      { id: "making_look_good", label: "Making things look good" },
      { id: "puzzles", label: "Solving puzzles and problems" },
      { id: "leading", label: "Convincing or leading people" },
      { id: "none", label: "Honestly, none of these" },
    ],
  },
  {
    id: "coding_comfort",
    area: "strengths",
    type: "scale",
    prompt: "How comfortable are you with coding right now?",
    helper: "There's no right or wrong answer here.",
    min: 1,
    max: 5,
    minLabel: "Never tried it",
    maxLabel: "I build my own projects",
  },
  {
    id: "coding_built",
    area: "strengths",
    type: "text",
    prompt: "Nice — what have you built or tried so far?",
    helper: "A sentence is plenty.",
    optional: true,
    multiline: true,
    showIf: (answers) => Number(answers.coding_comfort) >= 4,
  },
  {
    id: "coding_willing",
    area: "strengths",
    type: "choice",
    prompt: "Would you be up for learning to code if a career needed it?",
    showIf: (answers) =>
      answers.coding_comfort !== undefined && Number(answers.coding_comfort) <= 2,
    options: [
      { id: "yes", label: "Yes, definitely" },
      { id: "maybe", label: "Maybe, if it's taught well" },
      { id: "no", label: "I'd rather not" },
    ],
  },
  {
    id: "logic_confidence",
    area: "strengths",
    type: "scale",
    prompt: "How confident are you with step-by-step logic problems?",
    helper: "There's no right or wrong answer here.",
    min: 1,
    max: 5,
    minLabel: "I find them hard",
    maxLabel: "I really enjoy them",
  },
  {
    id: "english_comfort",
    area: "strengths",
    type: "scale",
    prompt: "How comfortable are you explaining your ideas in English, spoken or written?",
    helper: "There's no right or wrong answer here.",
    min: 1,
    max: 5,
    minLabel: "Not comfortable yet",
    maxLabel: "Very comfortable",
  },

  // ---------- Area 3: Interests & passions ----------
  {
    id: "tech_interests",
    area: "interests",
    type: "multi",
    prompt: "Which of these actually sound interesting to you?",
    helper: "Pick as many as you like. There's no right or wrong answer here.",
    options: [
      { id: "apps_websites", label: "Building apps and websites" },
      { id: "ai_ml", label: "AI and machine learning" },
      { id: "cybersecurity", label: "Cybersecurity and hacking" },
      { id: "robotics", label: "Robotics and electronics" },
      { id: "games", label: "Games" },
      { id: "data", label: "Data and statistics" },
      { id: "design", label: "Design and how things look and feel" },
      { id: "cloud", label: "Cloud and large systems" },
      { id: "product", label: "Leading a product or team" },
    ],
  },
  {
    id: "free_weekend",
    area: "interests",
    type: "text",
    prompt: "A whole free weekend, no school work. What do you actually spend it on?",
    helper: "Be specific — it often says more than you'd think.",
    optional: true,
    multiline: true,
  },
  {
    id: "wish_better",
    area: "interests",
    type: "text",
    prompt: "What's one thing in the world you wish worked better?",
    optional: true,
    multiline: true,
  },

  // ---------- Area 4: Learning style & work environment ----------
  {
    id: "learning_style",
    area: "learning",
    type: "choice",
    prompt: "How do you learn best?",
    options: [
      { id: "building", label: "Building or trying things myself" },
      { id: "watching", label: "Watching and listening" },
      { id: "reading", label: "Reading and taking notes" },
      { id: "mix", label: "A mix of all of them" },
    ],
  },
  {
    id: "job_values",
    area: "learning",
    type: "ranking",
    prompt: "Put these in order — what matters most to you in a job?",
    helper: "Tap them in your order of preference. Tap again to undo.",
    items: [
      { id: "salary", label: "Good salary" },
      { id: "stability", label: "Job security and stability" },
      { id: "creativity", label: "Freedom to be creative" },
      { id: "helping", label: "Helping people" },
      { id: "cutting_edge", label: "Working with cutting-edge tech" },
    ],
  },
  {
    id: "work_setting",
    area: "learning",
    type: "choice",
    prompt: "Where would you rather spend your working day?",
    options: [
      { id: "alone", label: "Deep in code or systems on my own" },
      { id: "small_team", label: "In a small close team" },
      { id: "many_people", label: "Around lots of different people" },
    ],
  },
  {
    id: "company_type",
    area: "learning",
    type: "choice",
    prompt: "And what kind of place?",
    groupWith: "work_setting",
    options: [
      { id: "startup", label: "A fast-moving startup" },
      { id: "established", label: "A big established company" },
      { id: "unsure", label: "Not sure yet" },
    ],
  },

  // ---------- Area 5: Challenges, barriers & support ----------
  {
    id: "struggles",
    area: "challenges",
    type: "multi",
    prompt: "What do you find hardest right now?",
    helper: "Everyone has something. There's no right or wrong answer here.",
    options: [
      { id: "maths", label: "Maths" },
      { id: "focus", label: "Staying focused" },
      { id: "exam_pressure", label: "Exam pressure" },
      { id: "english", label: "English" },
      { id: "unsure_strengths", label: "Not knowing what I'm good at" },
      { id: "deciding", label: "Deciding what to do next" },
      { id: "none", label: "Nothing much right now" },
    ],
  },
  {
    id: "struggle_help",
    area: "challenges",
    type: "multi",
    prompt: "Who could help you work through these?",
    helper: "There's no right or wrong answer here.",
    showIf: (answers) =>
      Array.isArray(answers.struggles) && (answers.struggles as string[]).length >= 3,
    options: [
      { id: "parents", label: "Parents" },
      { id: "teacher", label: "A teacher" },
      { id: "friends", label: "Friends" },
      { id: "sibling", label: "An older sibling or cousin" },
      { id: "outside", label: "Someone outside my circle" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "support_network",
    area: "challenges",
    type: "multi",
    prompt: "Who helps you make big decisions?",
    helper: "There's no right or wrong answer here.",
    options: [
      { id: "parents", label: "Parents" },
      { id: "teachers", label: "Teachers" },
      { id: "friends", label: "Friends" },
      { id: "sibling", label: "Older sibling or cousin" },
      { id: "myself", label: "I mostly figure it out myself" },
    ],
  },
  {
    id: "worries",
    area: "challenges",
    type: "multi",
    prompt: "What worries you most about your future?",
    helper: "There's no right or wrong answer here.",
    options: [
      { id: "cost_of_college", label: "Cost of college" },
      { id: "family_expectations", label: "Family expectations" },
      { id: "ai_jobs", label: "AI taking away jobs" },
      { id: "wrong_path", label: "Picking the wrong path" },
      { id: "marks_exams", label: "Marks and entrance exams" },
      { id: "none", label: "Nothing much" },
    ],
  },
  {
    id: "money_constraints",
    area: "challenges",
    type: "text",
    prompt: "Are there money constraints we should build into your roadmap?",
    helper: "Only if you're comfortable sharing.",
    optional: true,
    multiline: true,
    showIf: (answers) => includes(answers, "worries", "cost_of_college"),
  },

  // ---------- Area 6: Career awareness ----------
  {
    id: "career_idea",
    area: "careers",
    type: "choice",
    prompt: "Do you have a career in mind already?",
    helper: "Plans change all the time — this is just where you are today.",
    options: [
      { id: "sure", label: "Yes, I'm fairly sure" },
      { id: "few", label: "I have a few ideas" },
      { id: "none", label: "No idea yet" },
    ],
  },
  {
    id: "career_which",
    area: "careers",
    type: "text",
    prompt: "Which one, and what appeals to you about it?",
    multiline: true,
    showIf: (answers) => answers.career_idea === "sure" || answers.career_idea === "few",
  },
  {
    id: "confidence_needs",
    area: "careers",
    type: "multi",
    prompt: "What would help you feel more confident?",
    helper: "There's no right or wrong answer here.",
    showIf: (answers) => answers.career_idea === "none",
    options: [
      { id: "day_to_day", label: "Seeing what the job is like day to day" },
      { id: "degree_paths", label: "Knowing which degree leads where" },
      { id: "talk_to_someone", label: "Talking to someone doing it" },
      { id: "salaries", label: "Knowing realistic salaries" },
      { id: "what_to_learn", label: "Knowing what to learn first" },
    ],
  },

  // ---------- Area 7: Family influence ----------
  {
    id: "family_expectation",
    area: "family",
    type: "choice",
    prompt: "Do your parents have a specific career in mind for you?",
    options: [
      { id: "matches", label: "Yes, and it matches what I want" },
      { id: "different", label: "Yes, but it's different from what I want" },
      { id: "open", label: "They're open to whatever I choose" },
      { id: "not_discussed", label: "We haven't really discussed it" },
    ],
  },
  {
    id: "family_balance",
    area: "family",
    type: "text",
    prompt: "How would you like to balance what they want with what you want?",
    optional: true,
    multiline: true,
    showIf: (answers) => answers.family_expectation === "different",
  },
]
