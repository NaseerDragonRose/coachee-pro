import type { AiRisk, CareerId, LearningStage, SignalCategory } from "@/lib/blueprint/types"

export type CareerCatalogEntry = {
  careerId: CareerId
  name: string
  primarySignals: SignalCategory[]
  interestTags: string[]
  streamFit: string
  fitReason: string
  dayInTheLife: string
  skillsToBuild: string[]
  learningPath: {
    months1to3: LearningStage
    months4to6: LearningStage
    months7to12: LearningStage
  }
  collegeGuidance: {
    smartMoneyRoute: string
    estimatedCostInrLakh: [number, number]
    expensiveAlternative: string
  }
  salaryProgressionInrLakh: { entry: number; year3: number; year5: number; year10: number }
  futureOutlook: string
  commonMistakes: { title: string; detail: string }[]
  aiRisk: AiRisk
}

export const CAREER_CATALOG: CareerCatalogEntry[] = [
  {
    careerId: "software_engineer",
    name: "Software Engineer",
    primarySignals: ["technical"],
    interestTags: ["apps_websites"],
    streamFit:
      "Any stream with Maths is workable; PCM or Computer Science background helps most. BCA, BSc CS, or B.Tech CS/IT all lead here.",
    fitReason:
      "This fits a strong technical mindset well — software engineering rewards structured problem-solving, comfort with logic, and steady improvement through building real things rather than raw creativity or persuasion.",
    dayInTheLife:
      "You write, test, and ship code — building features, fixing bugs, and working with a team through code reviews and stand-ups.",
    skillsToBuild: [
      "Programming fundamentals (Python or JavaScript)",
      "Data structures & algorithms",
      "Git & version control",
      "Building small full-stack projects",
      "SQL basics",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Learn to code",
        actions: [
          "Pick one language (Python or JavaScript) and finish a beginner course",
          "Solve daily coding problems to build logic",
          "Set up a GitHub profile and push your first project",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Build real projects",
        actions: [
          "Build 2-3 small full-stack projects",
          "Learn Git branching and collaborate on a project with others",
          "Start learning SQL and basic databases",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Get real-world exposure",
        actions: [
          "Apply for a beginner internship or open-source contribution",
          "Learn one framework in depth (React or similar)",
          "Polish your GitHub with documented projects",
        ],
        milestone: "Land your first internship or freelance coding project",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA or BSc CS from a reputable local college, paired with strong personal projects and an internship, gets you hired just as well as an expensive private B.Tech.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative: "A high-fee private B.Tech at a tier-3 college with a weak placement record",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 8, year5: 14, year10: 28 },
    futureOutlook:
      "Software engineering remains in strong demand as every industry keeps building digital products. AI tools are changing how code gets written, but engineers who can design systems and solve real problems stay valuable — routine, boilerplate coding is what's most exposed.",
    commonMistakes: [
      {
        title: "Chasing college brand over portfolio",
        detail:
          "Companies hire mostly on your projects and problem-solving ability — a well-documented GitHub with 2-3 solid builds beats a prestigious college name with nothing to show for it.",
      },
      {
        title: "Spreading thin across languages",
        detail:
          "Jumping between Python, Java, and JavaScript before mastering any one of them leaves you unable to build anything real — depth in one language gets you hired faster than surface familiarity with five.",
      },
      {
        title: "Leaving internships to the last year",
        detail:
          "Recruiters look for early signs of initiative — starting to apply in year one or two, even for small roles, builds the experience and references that make final-year applications land.",
      },
    ],
    aiRisk: "medium",
  },
  {
    careerId: "ai_engineer",
    name: "AI Engineer",
    primarySignals: ["technical", "scientific"],
    interestTags: ["ai_ml", "data"],
    streamFit: "PCM strongly preferred (Maths is essential); B.Tech CS/IT or BSc CS with a strong maths foundation.",
    fitReason:
      "This fits a profile strong in both technical and analytical thinking — AI engineering rewards comfort with maths, patience with iterative experimentation, and the same systems mindset that makes software engineering a fit, applied to models instead of pure code.",
    dayInTheLife:
      "You build and fine-tune machine learning models, clean and prepare data, and integrate AI features into real products.",
    skillsToBuild: [
      "Python programming",
      "Statistics & linear algebra basics",
      "Machine learning fundamentals",
      "Working with ML libraries (scikit-learn, PyTorch)",
      "Data handling with pandas/SQL",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Build maths & Python foundations",
        actions: [
          "Strengthen statistics and linear algebra basics",
          "Learn Python for data work (numpy, pandas)",
          "Complete an intro machine learning course",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Build ML projects",
        actions: [
          "Build 2 small ML projects (classification, prediction)",
          "Learn how neural networks work at a basic level",
          "Practice on public datasets (beginner-friendly competitions)",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Go deeper and get exposure",
        actions: [
          "Learn one deep learning framework (PyTorch)",
          "Try building with a large language model API",
          "Look for an AI/ML internship or research assistantship",
        ],
        milestone: "Complete and publish an end-to-end ML project",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A B.Tech CS/IT with a strong maths base, plus self-driven ML projects and online specializations, matters more than which college name is on the degree.",
      estimatedCostInrLakh: [3, 8],
      expensiveAlternative: "An expensive private B.Tech with no real ML/AI specialization or lab exposure",
    },
    salaryProgressionInrLakh: { entry: 5, year3: 10, year5: 18, year10: 35 },
    futureOutlook:
      "AI engineering is one of the fastest-growing tech fields as companies race to add AI features. Demand is strong globally including remote roles, though the field evolves quickly — engineers need to keep learning as tools change every year.",
    commonMistakes: [
      {
        title: "Skipping the maths and Python basics",
        detail:
          "Deep learning tutorials make sense only once statistics, linear algebra, and Python are second nature — without that base you'll copy code you don't understand and stall the first time something breaks.",
      },
      {
        title: "Tutorial-only learning",
        detail:
          "Following along with courses feels like progress, but interviewers and recruiters look for projects you designed and debugged yourself — tutorials alone don't prove you can solve a new problem.",
      },
      {
        title: "Underrating data-handling skills",
        detail:
          "Most real AI jobs spend more time cleaning and preparing data than tuning models — skipping pandas, SQL, and data pipelines leaves a gap that shows up fast on the job.",
      },
    ],
    aiRisk: "low",
  },
  {
    careerId: "cybersecurity_analyst",
    name: "Cybersecurity Analyst",
    primarySignals: ["technical"],
    interestTags: ["cybersecurity"],
    streamFit:
      "PCM or Computer Science background helps; BCA, BSc CS/IT, or B.Tech CS with a security specialization all work.",
    fitReason:
      "This fits a strong technical, systems-oriented mindset — cybersecurity rewards structured thinking, patience with detail, and comfort investigating how systems actually work under the hood, more than persuasion or creative expression.",
    dayInTheLife:
      "You monitor systems for threats, investigate security incidents, run vulnerability scans, and help teams fix weak points before attackers find them.",
    skillsToBuild: [
      "Networking fundamentals",
      "Operating systems (Linux basics)",
      "Security tools (Wireshark, Nmap)",
      "Basic scripting (Python or Bash)",
      "Understanding common attack types",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Learn the fundamentals",
        actions: [
          "Learn networking basics (how the internet actually works)",
          "Get comfortable with the Linux command line",
          "Study common attack types and security terminology",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Get hands-on",
        actions: [
          "Practice on beginner-friendly platforms (capture-the-flag style labs)",
          "Learn basic scripting to automate simple tasks",
          "Set up a home lab to practice safely",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Build credibility",
        actions: [
          "Attempt an entry-level certification track",
          "Document your lab work and findings publicly",
          "Look for a SOC analyst internship or trainee role",
        ],
        milestone: "Complete your first capture-the-flag challenge or entry cert prep",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA or BSc CS/IT plus hands-on lab practice and an entry-level certification beats an expensive specialized security degree at this stage.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative: "A costly private cybersecurity-branded degree with mostly theoretical coursework",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 8, year5: 14, year10: 26 },
    futureOutlook:
      "Cybersecurity demand keeps growing as more of daily life moves online and attacks increase. It's a field with strong job security and low automation risk — defending systems still needs human judgement.",
    commonMistakes: [
      {
        title: "Tool-hopping before the fundamentals",
        detail:
          "Jumping between every scanner and framework without understanding networking and OS basics first means none of the tools actually make sense — fundamentals first makes every tool easier to learn later.",
      },
      {
        title: "Skipping straight to 'hacking'",
        detail:
          "Offensive security techniques only make sense once you understand how networks and operating systems actually work — without that foundation, you're memorizing commands instead of understanding attacks.",
      },
      {
        title: "Theory without hands-on labs",
        detail:
          "Reading about attacks and defenses builds vocabulary, not skill — recruiters and certifications alike expect real lab time, not just familiarity with the concepts.",
      },
    ],
    aiRisk: "low",
  },
  {
    careerId: "cloud_engineer",
    name: "Cloud Engineer",
    primarySignals: ["technical"],
    interestTags: ["cloud"],
    streamFit:
      "PCM or Computer Science background preferred; BCA, BSc CS/IT, or an affordable B.Tech CS/IT all work.",
    fitReason:
      "This fits a strong technical, systems-first mindset — cloud engineering rewards comfort with infrastructure, reliability, and process, more than client-facing persuasion or creative work.",
    dayInTheLife:
      "You set up and maintain cloud infrastructure, automate deployments, monitor system health, and make sure applications run reliably at scale.",
    skillsToBuild: [
      "Linux fundamentals",
      "Networking basics",
      "One cloud platform (AWS free tier)",
      "Scripting (Python or Bash)",
      "CI/CD basics",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Build core fundamentals",
        actions: [
          "Learn Linux command line and basic networking",
          "Start AWS free tier and complete beginner labs",
          "Learn basic scripting for automation",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Go hands-on with cloud",
        actions: [
          "Deploy a small project on the cloud end-to-end",
          "Learn Docker basics for containers",
          "Learn Git and basic CI/CD pipelines",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Get certified and get exposure",
        actions: [
          "Prepare for an entry-level cloud certification",
          "Contribute to or build an infra-focused side project",
          "Apply for cloud support or DevOps trainee roles",
        ],
        milestone: "Deploy your first project on cloud infrastructure end-to-end",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA/BSc CS/IT plus a recognized cloud certification (much cheaper than a degree) is often enough to get an entry-level cloud role.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative: "An expensive private B.Tech with no cloud/DevOps specialization or labs",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 9, year5: 15, year10: 28 },
    futureOutlook:
      "Cloud infrastructure demand keeps rising as more companies move off physical servers. It's a stable, high-demand field with strong remote-work availability and relatively low automation risk since it requires judgement about live systems.",
    commonMistakes: [
      {
        title: "Spreading across all three cloud providers",
        detail:
          "AWS, Azure, and GCP each have their own ecosystem of services — splitting attention across all three early on means shallow knowledge everywhere instead of real depth in one that gets you hired.",
      },
      {
        title: "Certifications without real deployments",
        detail:
          "A certification proves you can pass an exam, not that you can deploy and maintain a real system — pairing every cert with a hands-on project is what actually builds job-ready skill.",
      },
      {
        title: "Skipping automation and scripting",
        detail:
          "Manually clicking through cloud consoles is what juniors do — the engineers who move up are the ones who script and automate repetitive infrastructure work early.",
      },
    ],
    aiRisk: "medium",
  },
  {
    careerId: "data_scientist",
    name: "Data Scientist",
    primarySignals: ["technical", "scientific"],
    interestTags: ["data"],
    streamFit: "PCM preferred (Maths essential); BSc Statistics/CS, BCA, or B.Tech with a strong maths/stats foundation.",
    fitReason:
      "This fits a profile strong in analytical, evidence-based thinking — data science rewards patience with detail, comfort with statistics, and curiosity about what the numbers actually mean, more than persuasion or creative expression.",
    dayInTheLife:
      "You explore datasets to find patterns, build models to predict or explain outcomes, and present findings that help teams make decisions.",
    skillsToBuild: [
      "Statistics fundamentals",
      "Python (pandas, numpy)",
      "SQL for data querying",
      "Data visualization",
      "Basic machine learning",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Build statistics & Python base",
        actions: [
          "Learn core statistics concepts (mean, distributions, hypothesis testing)",
          "Learn Python for data analysis",
          "Practice SQL queries on sample databases",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Analyze real data",
        actions: [
          "Work through 2-3 public datasets end-to-end",
          "Learn data visualization (charts that tell a clear story)",
          "Start a beginner machine learning course",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Build a portfolio",
        actions: [
          "Complete an end-to-end data project with a written report",
          "Enter a beginner-friendly data competition",
          "Look for a data analyst/scientist internship",
        ],
        milestone: "Publish a data project with clear findings and visuals",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BSc Statistics, BCA, or BSc CS with a solid maths base plus strong personal data projects matters more than a specialized 'Data Science' branded degree at a high fee.",
      estimatedCostInrLakh: [2, 7],
      expensiveAlternative:
        "A costly private 'Data Science' degree with weak maths grounding and little hands-on project work",
    },
    salaryProgressionInrLakh: { entry: 5, year3: 9, year5: 16, year10: 30 },
    futureOutlook:
      "Data-driven decision making keeps growing across every industry, keeping demand for data scientists strong. AI tools are automating some routine analysis, so the value is shifting toward people who can ask the right questions and interpret results, not just run models.",
    commonMistakes: [
      {
        title: "Rushing to ML before statistics",
        detail:
          "Machine learning models are built on statistical reasoning — without a solid grounding in distributions, hypothesis testing, and probability, you'll misread your own results without realizing it.",
      },
      {
        title: "Modelling without communication skills",
        detail:
          "A model nobody can act on is wasted work — the data scientists who stand out can explain what the numbers mean and why it matters to someone non-technical.",
      },
      {
        title: "Underestimating data cleaning",
        detail:
          "Real-world datasets are messy, inconsistent, and full of gaps — the majority of a data scientist's actual time goes into cleaning and preparing data, not building models.",
      },
    ],
    aiRisk: "medium",
  },
  {
    careerId: "ui_ux_designer",
    name: "UI/UX Designer",
    primarySignals: ["creative"],
    interestTags: ["design"],
    streamFit:
      "Any stream works — this path values a design portfolio over a specific subject background. BDes, BA in a related field, or online design tracks all work.",
    fitReason:
      "This fits a profile strong in creative, original thinking — UI/UX design rewards visual sense, empathy for how people actually use a product, and comfort working through loosely-defined problems, more than pure structured logic.",
    dayInTheLife:
      "You research how people use a product, sketch and test different designs, and work closely with developers to bring the final interface to life.",
    skillsToBuild: [
      "Design fundamentals (layout, color, typography)",
      "A design tool (Figma)",
      "User research basics",
      "Prototyping & wireframing",
      "Basic understanding of how developers build interfaces",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Learn design fundamentals",
        actions: [
          "Learn core design principles (layout, color, typography)",
          "Get comfortable with Figma through guided tutorials",
          "Study a few apps/websites you like and note what works",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Practice real projects",
        actions: [
          "Redesign 2-3 existing apps as practice projects",
          "Learn basic user research and usability testing methods",
          "Start building a simple portfolio",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Build credibility",
        actions: [
          "Complete one full case study from research to final design",
          "Get feedback from designers in online communities",
          "Apply for design internships or freelance projects",
        ],
        milestone: "Publish a complete design case study in your portfolio",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A strong self-built portfolio through an affordable design course or BDes program matters far more here than the college name — design hiring is portfolio-first.",
      estimatedCostInrLakh: [1, 5],
      expensiveAlternative:
        "An expensive private design college chosen for brand name without strong industry mentorship or placements",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 8, year5: 13, year10: 24 },
    futureOutlook:
      "Good product design stays in demand as companies compete on user experience. AI tools now speed up producing design variations, so the value is shifting toward designers who deeply understand user problems, not just visual execution.",
    commonMistakes: [
      {
        title: "Visuals without user research",
        detail:
          "Pretty screens that don't solve a real user problem don't get hired — design portfolios that show research, reasoning, and iteration stand out far more than polish alone.",
      },
      {
        title: "Portfolio full of redesigns",
        detail:
          "Redesigning existing famous apps is a common beginner exercise, but it doesn't show you can solve an original problem — case studies built around real, self-identified problems carry more weight.",
      },
      {
        title: "Designing without developer context",
        detail:
          "Interfaces that look great but ignore technical constraints create friction with engineering teams — understanding how your designs actually get built makes you far easier to work with.",
      },
    ],
    aiRisk: "medium",
  },
  {
    careerId: "product_manager",
    name: "Product Manager",
    primarySignals: ["entrepreneurial", "commercial"],
    interestTags: ["product"],
    streamFit:
      "Any stream works, though comfort with numbers helps. A business, CS, or related degree all work — this role is built more on experience and skill than a specific degree.",
    fitReason:
      "This fits a profile strong in practical, ownership-driven thinking — product management rewards prioritization, initiative, and connecting technical work to real outcomes, more than deep hands-on technical execution alone.",
    dayInTheLife:
      "You decide what a product team should build next, talk to users to understand their problems, and work with designers and engineers to ship it.",
    skillsToBuild: [
      "Communication & writing clearly",
      "Basic data analysis",
      "Understanding of how software gets built",
      "Prioritization frameworks",
      "User research basics",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Understand the basics",
        actions: [
          "Learn what product managers actually do (read PM case studies)",
          "Practice breaking down problems and prioritizing clearly",
          "Get comfortable reading basic data/metrics",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Get hands-on experience",
        actions: [
          "Run a mini product project (even for a college club or personal idea)",
          "Learn to write simple product requirement documents",
          "Practice presenting decisions with clear reasoning",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Build real exposure",
        actions: [
          "Take part in a product case competition or hackathon",
          "Try to intern or assist on a real product team, even informally",
          "Build a portfolio of case studies showing your thinking",
        ],
        milestone: "Complete one full product case study from problem to proposed solution",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "Since this role is hired more on demonstrated thinking than a specific degree, a general BBA/BCA plus real project experience and internships is more efficient than an expensive specialized program.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative:
        "A high-fee 'product management' certificate program with no real project or internship component",
    },
    salaryProgressionInrLakh: { entry: 5, year3: 10, year5: 18, year10: 34 },
    futureOutlook:
      "Companies keep needing people who can turn business goals into things engineers can build, so demand stays healthy — though it's typically not an entry-level-heavy field; most people move into it after some experience in engineering, design, or business.",
    commonMistakes: [
      {
        title: "Aiming for PM with no hands-on experience",
        detail:
          "Product management is rarely an entry-level hire — building real project or team experience first, even informally, gives you the credibility and instincts the role actually needs.",
      },
      {
        title: "Ideas without data or engineering grounding",
        detail:
          "Good product decisions are backed by data and shaped by what's actually feasible to build — PMs who only pitch ideas without that grounding struggle to gain trust from their teams.",
      },
      {
        title: "Underrating communication and alignment",
        detail:
          "Most of a PM's real work is keeping designers, engineers, and stakeholders aligned — treating the job as pure decision-making misses where the actual effort goes.",
      },
    ],
    aiRisk: "low",
  },
  {
    careerId: "devops_engineer",
    name: "DevOps Engineer",
    primarySignals: ["technical"],
    interestTags: ["cloud", "apps_websites"],
    streamFit:
      "PCM or Computer Science background preferred; BCA, BSc CS/IT, or an affordable B.Tech CS/IT all work.",
    fitReason:
      "This fits a strong technical, systems-first mindset — DevOps rewards process discipline, comfort under pressure when something breaks, and reliability, more than persuasion or creative expression.",
    dayInTheLife:
      "You build and maintain the pipelines and systems that let developers ship code safely and often, and you're often the first responder when something breaks in production.",
    skillsToBuild: [
      "Linux fundamentals",
      "Scripting (Python or Bash)",
      "CI/CD tools",
      "Containers (Docker)",
      "Basic cloud platform knowledge",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Build core fundamentals",
        actions: [
          "Learn Linux command line thoroughly",
          "Learn Git and basic scripting",
          "Understand what CI/CD actually means with a simple example",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Get hands-on",
        actions: [
          "Set up a CI/CD pipeline for a personal project",
          "Learn Docker and containerize a small app",
          "Start learning one cloud platform's basics",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Build real exposure",
        actions: [
          "Automate a full deployment pipeline end-to-end",
          "Learn basic monitoring/logging concepts",
          "Apply for DevOps or cloud support trainee roles",
        ],
        milestone: "Ship a project through your own automated deployment pipeline",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA/BSc CS/IT plus hands-on pipeline and cloud projects gets you into entry-level DevOps roles without needing an expensive specialized degree.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative: "A high-fee private B.Tech with no infrastructure/DevOps exposure or labs",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 9, year5: 16, year10: 30 },
    futureOutlook:
      "As more companies ship software constantly, demand for people who keep that process reliable keeps growing. It's a hands-on, systems-heavy role that's harder to automate away since it involves judgement calls under pressure.",
    commonMistakes: [
      {
        title: "Learning tools without the full pipeline",
        detail:
          "Knowing Docker or a CI/CD tool in isolation isn't enough — DevOps is about understanding how code moves from a developer's laptop to production, end to end.",
      },
      {
        title: "Skipping Linux and networking basics",
        detail:
          "Trendy tools change every year, but Linux and networking fundamentals are what make any of them make sense — skipping straight to the tools leaves shaky foundations underneath.",
      },
      {
        title: "Only practicing setup, not failure",
        detail:
          "Anyone can follow a tutorial to set something up — the real skill DevOps engineers are paid for is staying calm and effective when something breaks in production.",
      },
    ],
    aiRisk: "medium",
  },
  {
    careerId: "robotics_engineer",
    name: "Robotics Engineer",
    primarySignals: ["technical", "scientific"],
    interestTags: ["robotics"],
    streamFit: "PCM required (Physics and Maths are core); B.Tech in Mechanical, Electronics, or Robotics/Mechatronics.",
    fitReason:
      "This fits a profile strong in both technical and analytical thinking — robotics rewards patience with hands-on experimentation, comfort with physics and systems, and building things end-to-end, more than pure software or purely creative work.",
    dayInTheLife:
      "You design, build, and program physical systems — from wiring circuits to writing the code that makes a robot sense and respond to its environment.",
    skillsToBuild: [
      "Basic electronics",
      "Programming (C/C++ or Python)",
      "Microcontrollers (Arduino/Raspberry Pi)",
      "Mechanical design basics",
      "Sensors & control systems basics",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Build core fundamentals",
        actions: [
          "Learn basic electronics and circuits",
          "Learn to program a microcontroller (Arduino)",
          "Study core physics concepts behind motion and sensors",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Build real projects",
        actions: [
          "Build 1-2 small robotics projects (line follower, simple arm)",
          "Learn basic mechanical design concepts",
          "Join or start a robotics club project",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Go deeper",
        actions: [
          "Take part in a robotics competition or hackathon",
          "Learn basic control systems concepts",
          "Document your builds as a portfolio",
        ],
        milestone: "Complete and demo a working robotics project",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A B.Tech in Mechanical, Electronics, or Mechatronics from a solid mid-tier college, paired with hands-on project work and competitions, matters more than an elite-tier institute alone.",
      estimatedCostInrLakh: [3, 8],
      expensiveAlternative: "A high-fee private engineering college with no lab access or project culture",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 8, year5: 14, year10: 26 },
    futureOutlook:
      "Robotics and automation are growing fields as manufacturing, logistics, and consumer robotics expand. It requires combining hardware and software skills, which keeps it relatively resistant to being automated away by software alone.",
    commonMistakes: [
      {
        title: "Theory without physical projects",
        detail:
          "Robotics is a hands-on discipline — understanding the physics on paper doesn't translate to being able to wire, build, and debug a real physical system under real-world constraints.",
      },
      {
        title: "Choosing college brand over lab access",
        detail:
          "A robotics program's value comes from its labs, equipment, and project culture — an expensive name-brand college without real hands-on access is a worse choice than a cheaper one with strong labs.",
      },
      {
        title: "Neglecting programming skills",
        detail:
          "Modern robotics is as much software as hardware — focusing only on the mechanical and electronics side while neglecting programming leaves half the skill set missing.",
      },
    ],
    aiRisk: "low",
  },
  {
    careerId: "game_developer",
    name: "Game Developer",
    primarySignals: ["creative", "technical"],
    interestTags: ["games"],
    streamFit: "Any stream with some Maths works; BCA, BSc CS/IT, or a specialized game development program.",
    fitReason:
      "This fits a profile that blends creative and technical thinking — game development rewards original ideas about what makes something fun, paired with the discipline to actually build and ship it as working code.",
    dayInTheLife:
      "You build the code, mechanics, and sometimes art or level design behind a game — turning gameplay ideas into something players can actually interact with.",
    skillsToBuild: [
      "Programming (C# or C++)",
      "A game engine (Unity or Unreal)",
      "Game design fundamentals",
      "Basic maths for game logic (vectors, physics)",
      "2D/3D asset basics",
    ],
    learningPath: {
      months1to3: {
        timeframe: "Months 1–3",
        title: "Learn the fundamentals",
        actions: [
          "Learn C# programming basics",
          "Start learning Unity through guided tutorials",
          "Study the basics of game design (mechanics, fun, feedback loops)",
        ],
      },
      months4to6: {
        timeframe: "Months 4–6",
        title: "Build small games",
        actions: [
          "Build 2-3 small complete games (even simple ones)",
          "Learn basic game physics and collision handling",
          "Join a game jam to practice building under a deadline",
        ],
      },
      months7to12: {
        timeframe: "Months 7–12",
        title: "Build a portfolio",
        actions: [
          "Build one polished, complete game as a portfolio centerpiece",
          "Publish your work publicly",
          "Look for internships or freelance game dev work",
        ],
        milestone: "Publish a complete, playable game",
      },
    },
    collegeGuidance: {
      smartMoneyRoute:
        "A BCA or BSc CS/IT plus a strong portfolio of finished games (built through game jams and self-study) is more valuable to studios than an expensive specialized game-design degree.",
      estimatedCostInrLakh: [2, 6],
      expensiveAlternative:
        "A high-fee private 'game design' institute with weak industry placement and outdated tools",
    },
    salaryProgressionInrLakh: { entry: 4, year3: 7, year5: 12, year10: 22 },
    futureOutlook:
      "Game development demand is steady, driven by mobile and indie gaming growth, though the industry is competitive and can have less job stability than other tech fields (project-based hiring, studio layoffs are common).",
    commonMistakes: [
      {
        title: "One ambitious game instead of finishing small ones",
        detail:
          "Unfinished ambitious projects don't build a portfolio — shipping several small, complete games teaches far more about the full development cycle than years on one game that never ships.",
      },
      {
        title: "Engine skills without programming fundamentals",
        detail:
          "Drag-and-drop familiarity with Unity or Unreal only goes so far — the developers who can actually solve problems understand the programming fundamentals underneath the engine.",
      },
      {
        title: "Underestimating how unstable studio hiring is",
        detail:
          "Game studio hiring is project-based and layoffs are common — going in with a realistic picture of the industry's instability helps you plan a more resilient path, like freelance or indie work alongside studio applications.",
      },
    ],
    aiRisk: "medium",
  },
]
