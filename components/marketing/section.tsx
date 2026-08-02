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
        "mx-auto w-full px-6 sm:px-8",
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
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{eyebrow}</span>
            </div>
          )}

          {title && (
            <h2 className="max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
              {title}
            </h2>
          )}

          {description && (
            <p className="max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  )
}