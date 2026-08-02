import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const SPACING = {
  tight: "py-10 sm:py-14",
  default: "py-16 sm:py-24",
  loose: "py-20 sm:py-32",
} as const

type Props = {
  title?: string
  eyebrow?: string
  description?: string
  children: React.ReactNode
  className?: string
  spacing?: keyof typeof SPACING
  centered?: boolean
}

export const Section = ({
  title,
  eyebrow,
  description,
  children,
  className,
  spacing = "default",
  centered = true,
}: Props) => {
  const hasHeader = Boolean(eyebrow || title || description)

  return (
    <section
      className={cn(
        "mx-auto w-full px-6 sm:px-8 text-black",
        SPACING[spacing],
        className
      )}
    >
      {hasHeader && (
        <div
          className={cn(
            "mb-12 flex flex-col gap-3",
            centered ? "items-center text-center" : "items-start text-left"
          )}
        >
          {eyebrow && (
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
              <span>{eyebrow}</span>
            </div>
          )}

          {title && (
            <h2 className="max-w-3xl text-balance text-3xl sm:text-5xl font-black tracking-tight text-black leading-[1.1]">
              {title}
            </h2>
          )}

          {description && (
            <p className="max-w-2xl text-balance text-sm sm:text-base font-semibold leading-relaxed text-slate-800">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  )
}