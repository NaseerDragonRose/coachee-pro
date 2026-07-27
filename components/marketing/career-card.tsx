import type { LucideIcon } from "lucide-react"

export const CareerCard = ({ title, description, icon: Icon }: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden className="size-5" />
      </div>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-2 text-pretty text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

type Props = {
  title: string
  description: string
  icon: LucideIcon
}
