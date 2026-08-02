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
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div>
        {/* Top Bar: Icon + Tag Badge */}
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Icon aria-hidden className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="rounded-full border-2 border-black bg-[#F7F5F0] px-3 py-0.5 text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {tag}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="mt-4 text-lg font-black tracking-tight text-black">
          {title}
        </h3>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-700">
          {description}
        </p>
      </div>

      {/* Skills / Salary Footer */}
      {(salary || (skills && skills.length > 0)) && (
        <div className="mt-5 flex flex-col gap-2.5 border-t-2 border-black pt-4">
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-black bg-[#F7F5F0] px-2 py-0.5 text-[10px] font-bold text-black"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {salary && (
            <span className="inline-block w-fit rounded-lg border-2 border-black bg-emerald-300 px-2.5 py-0.5 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Est. {salary}
            </span>
          )}
        </div>
      )}
    </div>
  )
}