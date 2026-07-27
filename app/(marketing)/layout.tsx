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
    <>
      <GradientBlob className="fixed inset-0 -z-10" />
      <Header />
      {children}
      <Footer />
    </>
  )
}
