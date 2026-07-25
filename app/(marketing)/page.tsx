import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center sm:px-16">
      <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Discover the Best Technology Career for You
      </h1>
      <p className="max-w-xl text-pretty text-lg text-muted-foreground">
        Take a free, structured assessment built for Class 11 &amp; 12
        students—see which tech career actually fits you.
      </p>
      <Button size="lg" className="h-12 px-8 text-base">
        Start Free Assessment
      </Button>
    </main>
  );
}
