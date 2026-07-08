import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { problemPoints } from "@/data/landingContent";

export function ProblemSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Problema"
          title="Talento esportivo sem estrutura vira oportunidade perdida."
          description="Atletas emergentes frequentemente evoluem em ambientes fragmentados, com pouca clareza de narrativa, dados e contrapartidas para parceiros."
        />
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {problemPoints.map((point, index) => (
            <div className="flex gap-4 border border-blueprint-line bg-white/70 p-4" key={point}>
              <span className="font-mono text-xs text-blueprint-cyan">0{index + 1}</span>
              <p className="text-sm leading-6 text-blueprint-graphite">{point}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
