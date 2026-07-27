"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export const Reveal = ({ children, className, delay = 0 }: Props) => {
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
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "translate-y-4 opacity-0 transition-all duration-700 ease-out",
        isVisible && "translate-y-0 opacity-100",
        className
      )}
    >
      {children}
    </div>
  )
}

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}
