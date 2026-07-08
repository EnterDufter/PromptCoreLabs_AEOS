import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { TechnicalCard } from "@/components/TechnicalCard";
import { platformPillars } from "@/data/landingContent";

export function PlatformPillarsSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Pilares"
          title="A base operacional da plataforma."
          description="Cada pilar foi pensado para dar linguagem profissional, previsibilidade e valor institucional à jornada do talento esportivo."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {platformPillars.map((pillar, index) => (
            <TechnicalCard
              description={pillar.description}
              index={`P${String(index + 1).padStart(2, "0")}`}
              key={pillar.title}
              title={pillar.title}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
