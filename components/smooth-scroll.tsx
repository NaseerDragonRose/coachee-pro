"use client"

import { ReactLenis } from "lenis/react"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08, // Lower value = smoother, heavier momentum (0.05 - 0.1)
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
      }}
    >
      {children}
    </ReactLenis>
  )
}