import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { IconMark } from "@/components/ui/IconMark";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { painPoints } from "@/content/landing";

export function ProblemSection() {
  return (
    <section id="problema" className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Problema Central"
          title="IA sem arquitetura vira improviso operacional."
          description="Muitas organizações querem aplicar IA, mas ainda operam com processos dispersos, dados fragmentados, decisões pouco rastreáveis e automações sem governança."
        />
        <p className="mt-6 max-w-3xl font-mono text-sm leading-relaxed text-blueprint-gray border-l-2 border-secondary/60 pl-4 py-1">
          A PromptCore Labs parte de uma premissa simples: antes de automatizar, é preciso
          estruturar. IA, agentes e automações só geram valor quando estão conectados a contexto,
          dados confiáveis, processos claros e pontos de controle humano.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((item, index) => (
            <Card key={item.title}>
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
