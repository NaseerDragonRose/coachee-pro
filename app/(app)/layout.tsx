import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/services/auth/auth-options"

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return <>{children}</>
}
