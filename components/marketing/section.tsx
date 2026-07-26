import { cn } from "@/lib/utils";

export const Section = ({ title, children, className }: Props) => {
  return (
    <section className={cn("mx-auto w-full max-w-3xl px-6 py-16 sm:px-16", className)}>
      {title ? (
        <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
};

type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};
