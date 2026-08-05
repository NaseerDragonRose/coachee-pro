import type { Blueprint } from "./types.ts"

const KEY = "coacheepro.blueprint.v1"
const PAID_KEY = "coacheepro.blueprint.paid.v1"

const store = (): Storage | null => {
  try {
    return globalThis.localStorage ?? null
  } catch {
    // Blocked by browser settings.
    return null
  }
}

export const saveBlueprint = (blueprint: Blueprint): void => {
  try {
    store()?.setItem(KEY, JSON.stringify(blueprint))
  } catch {
    // Private mode or quota exceeded — the flow continues without persistence.
  }
}

export const isBlueprintPaid = (): boolean => {
  try {
    return store()?.getItem(PAID_KEY) === "1"
  } catch {
    return false
  }
}

export const setBlueprintPaid = (paid: boolean): void => {
  try {
    if (paid) {
      store()?.setItem(PAID_KEY, "1")
    } else {
      store()?.removeItem(PAID_KEY)
    }
  } catch {
    // Private mode or quota exceeded — the flow continues without persistence.
  }
}

export const loadBlueprint = (): Blueprint | null => {
  try {
    const raw = store()?.getItem(KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Blueprint
    if (parsed?.version !== 1) return null

    return parsed
  } catch {
    // Corrupt JSON — treat as no blueprint.
    return null
  }
}

export const clearBlueprint = (): void => {
  try {
    store()?.removeItem(KEY)
    store()?.removeItem(PAID_KEY)
  } catch {
    // Nothing to do.
  }
}
