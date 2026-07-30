import { Sparkles } from "lucide-react"

type Props = {
  title: string
  subtitle?: string
  eyebrow?: string
  centered?: boolean
}

export const PageHeader = ({
  title,
  subtitle,
  eyebrow,
  centered = true,
}: Props) => {
  return (
    <div
      className={`mx-auto w-full max-w-4xl px-6 pt-16 pb-6 sm:px-8 sm:pt-24 ${
        centered ? "flex flex-col items-center text-center" : "text-left"
      }`}
    >
      {/* Optional Eyebrow Pill Badge */}
      {eyebrow && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{eyebrow}</span>
        </div>
      )}

      {/* Main Title */}
      <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle ? (
        <p className="animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}