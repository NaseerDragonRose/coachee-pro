export type AnswerValue = string | string[] | number

export type Answers = Record<string, AnswerValue>

export type AreaId =
  | "identification"
  | "strengths"
  | "interests"
  | "learning"
  | "challenges"
  | "careers"
  | "family"

export type Option = { id: string; label: string }

type BaseQuestion = {
  id: string
  area: AreaId
  prompt: string
  helper?: string
  /** Optional questions render a Skip control and never block Next. */
  optional?: boolean
  /** Render on the same screen as the referenced question instead of its own. */
  groupWith?: string
  /** Branch predicate. Absent means always shown. */
  showIf?: (answers: Answers) => boolean
}

export type Question =
  | (BaseQuestion & { type: "text"; placeholder?: string; multiline?: boolean })
  | (BaseQuestion & { type: "choice"; options: Option[] })
  | (BaseQuestion & { type: "multi"; options: Option[] })
  | (BaseQuestion & {
      type: "scale"
      min: number
      max: number
      minLabel: string
      maxLabel: string
    })
  | (BaseQuestion & { type: "ranking"; items: Option[] })

/** One or more questions rendered together on a single screen. */
export type Screen = Question[]

