import { GradientBlob } from "@/components/marketing/gradient-blob"

export const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="relative overflow-hidden">
      <GradientBlob className="opacity-60" />
      <div className="relative mx-auto w-full max-w-3xl px-6 pt-20 pb-4 sm:px-16 sm:pt-28">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  )
}

type Props = {
  title: string
  subtitle?: string
}
