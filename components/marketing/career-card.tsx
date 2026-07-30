import type { LucideIcon } from "lucide-react"

type Props = {
  title: string
  description: string
  icon: LucideIcon
  salary?: string
  tag?: string
  skills?: string[]
}

export const CareerCard = ({
  title,
  description,
  icon: Icon,
  salary,
  tag = "High Growth",
  skills,
}: Props) => {
  return (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/30">
      <div>
        {/* Top Bar: Icon + Badge */}
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/80 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
            <Icon aria-hidden className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-700 dark:bg-slate-900 dark:text-slate-400 dark:group-hover:bg-indigo-950/80 dark:group-hover:text-indigo-300">
            {tag}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Optional Skills / Salary Footer */}
      {(salary || (skills && skills.length > 0)) && (
        <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800/80">
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {salary && (
            <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Est. {salary}
            </span>
          )}
        </div>
      )}
    </div>
  )
}