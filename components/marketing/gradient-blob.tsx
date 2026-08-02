import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

export const GradientBlob = ({ className }: Props) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 max-w-full overflow-hidden select-none",
        className
      )}
    >
      {/* 1. Neo-Brutalist Architectural Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* 2. Electric Orange Accent Dot-Matrix Pattern (Top Right) */}
      <div className="absolute top-0 right-0 h-96 w-96 opacity-25 bg-[radial-gradient(#FF5500_1.5px,transparent_1.5px)] [background-size:16px_16px]" />

      {/* 3. Subtle Ink Black Accent Dot-Matrix Pattern (Bottom Left) */}
      <div className="absolute bottom-0 left-0 h-80 w-80 opacity-15 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
    </div>
  )
}