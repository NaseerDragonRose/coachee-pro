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
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(
        "opacity-0",
        isVisible &&
          "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out opacity-100",
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
