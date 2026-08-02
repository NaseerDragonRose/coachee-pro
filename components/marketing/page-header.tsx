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
      className={`mx-auto w-full max-w-4xl px-6 pt-12 pb-6 sm:px-8 sm:pt-20 ${
        centered ? "flex flex-col items-center text-center" : "text-left"
      }`}
    >
      {/* Neo-Brutalist Eyebrow Pill Badge */}
      {eyebrow && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 mb-4 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
          <span>{eyebrow}</span>
        </div>
      )}

      {/* Main Title */}
      <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-balance text-3xl font-black tracking-tight text-black sm:text-5xl leading-[1.1]">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle ? (
        <p className="animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 mt-4 max-w-2xl text-balance text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}