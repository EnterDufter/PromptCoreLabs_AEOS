import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { IconMark } from "@/components/ui/IconMark";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { approachPillars } from "@/content/landing";

export function ApproachSection() {
  return (
    <section id="abordagem" className="border-y border-vibrant-cyan/20 bg-surface-navy py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Nossa Abordagem"
          title="Do probabilístico ao governado."
          description="A IA generativa é probabilística por natureza. Por isso, a PromptCore Labs estrutura contexto, limites, validações, automações e pontos de controle humano para reduzir imprevisibilidade."
        />
        <div className="mt-8 border border-vibrant-cyan/30 bg-surface-panel p-6 shadow-cyan-glow/20">
          <p className="font-heading text-xl font-bold text-vibrant-cyan text-glow-cyan">
            &gt; A IA é probabilística. A operação precisa ser governada.
          </p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-blueprint-gray">
            Não vendemos IA como mágica. Construímos estruturas para que tecnologia, pessoas e
            processos funcionem melhor juntos com rastreabilidade total.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {approachPillars.map((item, index) => (
            <Card key={item.title} className="border-vibrant-cyan/20 bg-surface-panel hover:border-vibrant-cyan">
              <IconMark index={index} />
              <h3 className="mt-4 font-heading text-lg font-bold text-text-high-contrast">{item.title}</h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-blueprint-gray">{item.text}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
