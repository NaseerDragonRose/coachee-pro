"use client"

import { getSession } from "next-auth/react"

import type { AuthService, Session } from "./auth-service"

export const cognitoAuthService: AuthService = {
  async getSession(): Promise<Session | null> {
    const session = await getSession()
    if (!session?.user) return null

    return {
      id: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "",
    }
  },
}
