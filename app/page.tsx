import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background">
      <Container size="sm" className="text-center py-32">
        <p className="text-xs font-semibold tracking-widest uppercase text-foreground-subtle mb-4">
          Starter Project
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-foreground mb-4">
          Website Builder
        </h1>
        <p className="text-lg text-foreground-muted leading-relaxed mb-8 max-w-md mx-auto">
          Run the design system prompt with brand inputs to get started.
        </p>
      </Container>
    </div>
  );
}
