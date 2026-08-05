"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

export const SessionProvider = ({ children }: Props) => (
  <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
)

type Props = {
  children: ReactNode
}
