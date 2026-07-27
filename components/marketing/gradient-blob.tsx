import { cn } from "@/lib/utils"

export const GradientBlob = ({ className }: Props) => {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div className="absolute -top-24 -left-24 size-96 animate-blob-drift rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-32 -right-16 size-80 animate-blob-drift rounded-full bg-highlight/25 blur-3xl [animation-delay:-4s]" />
    </div>
  )
}

type Props = {
  className?: string
}
