import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { solutionItems } from "@/data/landingContent";

export function SolutionSection() {
  return (
    <section className="border-y border-blueprint-line bg-white/55 py-20" id="plataforma">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeader
            eyebrow="Solução"
            title="Uma plataforma para organizar a carreira como projeto estratégico."
            description="A NextGen Sports estrutura os elementos que transformam potencial esportivo em proposta institucional: desenvolvimento, evidências, narrativa e parceria."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {solutionItems.map((item) => (
              <div
                className="border border-blueprint-line bg-blueprint-paper p-4 text-sm font-semibold capitalize text-blueprint-ink"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
