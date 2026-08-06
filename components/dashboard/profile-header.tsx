"use client"

export const ProfileHeader = ({ studentName, archetype, narrative }: Props) => (
  <div className="flex flex-col gap-3">
    <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
      Your career roadmap
    </p>
    <h1 className="text-3xl leading-tight font-black text-slate-900 sm:text-4xl dark:text-slate-100">
      {studentName}, you&apos;re{" "}
      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {archetype}
      </span>
    </h1>
    <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{narrative}</p>
  </div>
)

type Props = {
  studentName: string
  archetype: string
  narrative: string
}
