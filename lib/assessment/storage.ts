import type { Answers } from "./types.ts"

const KEY = "coacheepro.assessment.v1"
const VERSION = 1
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

export type Draft = {
  version: number
  answers: Answers
  screenId: string
  savedAt: string
}

const store = (): Storage | null => {
  try {
    return globalThis.localStorage ?? null
  } catch {
    // Blocked by browser settings.
    return null
  }
}

export const loadDraft = (): Draft | null => {
  try {
    const raw = store()?.getItem(KEY)
    if (!raw) return null

    const draft = JSON.parse(raw) as Draft
    if (draft?.version !== VERSION) return null
    if (!draft.answers || typeof draft.answers !== "object") return null
    if (typeof draft.screenId !== "string") return null

    const savedAt = new Date(draft.savedAt).getTime()
    if (Number.isNaN(savedAt) || Date.now() - savedAt > MAX_AGE_MS) return null

    return draft
  } catch {
    // Corrupt JSON — treat as no draft.
    return null
  }
}

export const saveDraft = (answers: Answers, screenId: string): void => {
  try {
    const draft: Draft = {
      version: VERSION,
      answers,
      screenId,
      savedAt: new Date().toISOString(),
    }
    store()?.setItem(KEY, JSON.stringify(draft))
  } catch {
    // Private mode or quota exceeded — the flow continues in memory.
  }
}

export const clearDraft = (): void => {
  try {
    store()?.removeItem(KEY)
  } catch {
    // Nothing to do.
  }
}
