import { Container } from "@/components/ui/Container";
import { trustPillars } from "@/content/landing";

export function TrustBar() {
  return (
    <section aria-labelledby="sintese-title" className="border-y border-vibrant-cyan/15 bg-surface-panel/90 py-8">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.5fr] lg:items-center">
          <h2 id="sintese-title" className="font-heading text-xl font-bold text-text-high-contrast tracking-tight">
            Consultoria, plataformas e educação para transformar IA em operação real.
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustPillars.map((pillar) => (
              <article key={pillar.title} className="border-l border-vibrant-cyan/30 pl-4">
                <h3 className="font-mono text-xs font-semibold text-vibrant-cyan uppercase tracking-wider">{pillar.title}</h3>
                <p className="mt-1 font-mono text-xs leading-relaxed text-blueprint-gray">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
