import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

export const GradientBlob = ({ className }: Props) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none",
        className
      )}
    >
      {/* Top-Left Ambient Indigo Studio Glow */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-[120px] dark:from-indigo-600/20 dark:via-purple-600/15" />

      {/* Top-Right Ambient Purple Studio Glow */}
      <div className="absolute top-20 -right-40 h-[450px] w-[450px] rounded-full bg-gradient-to-bl from-purple-500/15 via-indigo-500/10 to-transparent blur-[120px] dark:from-purple-600/20 dark:via-indigo-600/15" />

      {/* Center Background Light Diffusion */}
      <div className="absolute top-1/3 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[140px] dark:bg-indigo-500/10" />
    </div>
  )
}