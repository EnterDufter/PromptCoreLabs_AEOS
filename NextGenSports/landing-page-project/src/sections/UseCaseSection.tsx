import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";

export function UseCaseSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Caso inicial"
            title="Motorsport como primeiro território de aplicação."
          />
          <div className="border border-blueprint-line bg-white/75 p-6">
            <p className="text-lg leading-8 text-blueprint-graphite">
              O automobilismo e o kartismo são o primeiro caso de uso da NextGen Sports por reunirem alta exigência técnica, necessidade de preparação contínua, custos relevantes, exposição de marca e uma jornada clara de evolução competitiva.
            </p>
            <p className="mt-5 text-base leading-7 text-blueprint-muted">
              A plataforma nasce nesse ambiente para validar método, linguagem e governança, mantendo potencial de expansão para outros esportes emergentes no futuro.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
