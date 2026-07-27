import { cn } from "@/lib/utils"

const SPACING = {
  tight: "py-10 sm:py-12",
  default: "py-16 sm:py-20",
  loose: "py-24 sm:py-32",
} as const

export const Section = ({
  title,
  eyebrow,
  children,
  className,
  spacing = "default",
}: Props) => {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-3xl px-6 sm:px-16",
        SPACING[spacing],
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2 className="mb-6 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  )
}

type Props = {
  title?: string
  eyebrow?: string
  children: React.ReactNode
  className?: string
  spacing?: keyof typeof SPACING
}
