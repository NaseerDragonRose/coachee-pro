"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right" | "none"

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: Direction
  duration?: number
}

export const Reveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 700,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const initialTransforms: Record<Direction, string> = {
    up: "translate-y-6",
    down: "-translate-y-6",
    left: "translate-x-6",
    right: "-translate-x-6",
    none: "",
  }

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        transitionDuration: duration ? `${duration}ms` : undefined,
      }}
      className={cn(
        "opacity-0 transition-all ease-out motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0",
        initialTransforms[direction],
        isVisible && "translate-x-0 translate-y-0 opacity-100",
        className
      )}
    >
      {children}
    </div>
  )
}