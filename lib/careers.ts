import {
  BarChart3,
  Boxes,
  Brush,
  Cloud,
  Cpu,
  Gamepad2,
  Lightbulb,
  Server,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

export type Career = {
  title: string
  description: string
  icon: LucideIcon
}

export const CAREERS: Career[] = [
  {
    title: "Software Engineer",
    description:
      "Designs and builds the applications and systems people use every day. A strong fit if you enjoy problem-solving, logical thinking, and seeing something you built actually work.",
    icon: Boxes,
  },
  {
    title: "AI Engineer",
    description:
      "Builds and trains the machine learning models behind products like recommendation engines and chatbots. Suits students who like math, patterns, and working at the edge of what's possible.",
    icon: Sparkles,
  },
  {
    title: "Cybersecurity Analyst",
    description:
      "Protects systems and data from attacks by finding weaknesses before attackers do. A good match if you're detail-oriented and enjoy thinking like a puzzle-solver — or a detective.",
    icon: ShieldCheck,
  },
  {
    title: "Cloud Engineer",
    description:
      "Builds and manages the infrastructure that keeps apps and websites running reliably at scale. Fits students who like systems thinking and making complex things run smoothly.",
    icon: Cloud,
  },
  {
    title: "Data Scientist",
    description:
      "Turns raw data into insights that drive decisions, using statistics and code. A strong choice if you like numbers, asking why, and finding stories hidden in information.",
    icon: BarChart3,
  },
  {
    title: "UI/UX Designer",
    description:
      "Shapes how digital products look, feel, and work for the people using them. Suits students who are creative, empathetic, and curious about how design decisions affect behavior.",
    icon: Brush,
  },
  {
    title: "Product Manager",
    description:
      "Decides what gets built and why, working between users, designers, and engineers. Fits students who like leadership, communication, and connecting technology to real problems.",
    icon: Lightbulb,
  },
  {
    title: "DevOps Engineer",
    description:
      "Automates how software gets built, tested, and shipped so teams can release changes quickly and safely. A good fit if you like process, tooling, and making things more efficient.",
    icon: Server,
  },
  {
    title: "Robotics Engineer",
    description:
      "Designs and programs machines that sense and act in the physical world, from drones to industrial arms. Suits students drawn to hardware, hands-on building, and mechanics as much as code.",
    icon: Cpu,
  },
  {
    title: "Game Developer",
    description:
      "Builds the code, mechanics, and systems behind video games. A strong match if you're passionate about gaming and want to combine creativity with programming.",
    icon: Gamepad2,
  },
]
