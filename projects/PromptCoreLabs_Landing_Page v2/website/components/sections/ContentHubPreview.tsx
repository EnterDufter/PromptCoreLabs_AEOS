import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { futureContent } from "@/content/landing";

export function ContentHubPreview() {
  return (
    <section id="conteudos" className="border-b border-vibrant-cyan/15 bg-surface-panel/70 py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Conteúdos Futuros"
          title="Conteúdos para entender IA aplicada, arquitetura operacional e governança cognitiva."
          description="A PCL evolui como um hub de conhecimento sobre IA aplicada, agentes, automação, arquitetura operacional e ecossistemas de inovação."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {futureContent.map((title) => (
            <Card key={title} className="p-5 border-vibrant-cyan/20 bg-surface-panel hover:border-vibrant-cyan">
              <h3 className="font-heading text-sm font-bold text-text-high-contrast">{title}</h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-blueprint-gray">
                Guia preparado para SEO, GEO e mecanismos de resposta baseados em IA.
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
