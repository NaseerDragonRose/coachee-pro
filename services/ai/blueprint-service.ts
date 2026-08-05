import type { Answers } from "@/lib/assessment/types"
import type { Blueprint } from "@/lib/blueprint/types"

export type BlueprintInput = {
  answers: Answers
  studentName: string
}

export interface BlueprintService {
  generate(input: BlueprintInput): Promise<Blueprint>
}
