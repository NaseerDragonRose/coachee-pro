import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { SiteShell } from "@/components/site-shell"
import { authOptions } from "@/services/auth/auth-options"

// `proxy.ts` already turns anonymous visitors away before this renders. This
// check stays anyway: the proxy protects by URL pattern, so a matcher edit
// could silently unguard these routes, and this is the layer that actually
// guarantees no signed-in-only markup is ever produced.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return <SiteShell variant="app">{children}</SiteShell>
}
