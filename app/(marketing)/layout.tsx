import type { ReactNode } from "react"

import { Header } from "@/components/marketing/header"
import { Footer } from "@/components/marketing/footer"
import { GradientBlob } from "@/components/marketing/gradient-blob"

export default function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
      {/* Background Ambient Lighting */}
      <GradientBlob className="pointer-events-none fixed inset-0 -z-10 opacity-70 dark:opacity-50" />

      {/* Navigation Header */}
      <Header />

      {/* Page Content Container */}
      <div className="flex flex-1 flex-col">
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}