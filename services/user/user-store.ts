export type StoredUser = {
  id: string
  email: string
  name: string
  phone: string | null
  /** Null until the profile step is completed — the two are equivalent. */
  consentedAt: string | null
}

export type UserStore = {
  /**
   * Called from the NextAuth `signIn` callback. Nothing else creates the row,
   * and every assessment and blueprint has a foreign key to it.
   */
  upsertFromAuth: (input: { id: string; email: string; name: string }) => Promise<void>
  findById: (id: string) => Promise<StoredUser | null>
  completeProfile: (input: { id: string; name: string; phone: string }) => Promise<void>
}
