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
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#F7F5F0] text-black antialiased selection:bg-[#FF5500] selection:text-white">
      {/* Neo-Brutalist Architectural Grid & Dot Matrix Overlay */}
      <GradientBlob className="pointer-events-none fixed inset-0 -z-10" />

      {/* Navigation Header */}
      <Header />

      {/* Main Page Content Container */}
      <div className="flex flex-1 flex-col">
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}