import type { ReactNode } from "react"

import { AssessmentProvider } from "@/components/assessment/assessment-provider"
import { Footer } from "@/components/marketing/footer"
import { GradientBlob } from "@/components/marketing/gradient-blob"
import { Header } from "@/components/marketing/header"

// The chrome every page shares. It stays one component rather than splitting
// per-variant because `Header` reads `useAssessment()` — a layout that renders
// the header without `AssessmentProvider` above it throws at runtime, and
// that's a mistake worth making impossible.
//
// The provider owns both dialogs (assessment and signup), which is what lets a
// single header serve both variants without conditional hooks.
export const SiteShell = ({ children, variant = "marketing" }: Props) => (
  <AssessmentProvider>
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
      <GradientBlob className="pointer-events-none fixed inset-0 -z-10 opacity-70 dark:opacity-50" />

      <Header variant={variant} />

      <div className="flex flex-1 flex-col">{children}</div>

      {/* Signed-in pages drop the footer: its nav duplicates the header's and
          its marketing CTAs point at a funnel the student has already entered. */}
      {variant === "marketing" && <Footer />}
    </div>
  </AssessmentProvider>
)

type Props = {
  children: ReactNode
  variant?: "marketing" | "app"
}
