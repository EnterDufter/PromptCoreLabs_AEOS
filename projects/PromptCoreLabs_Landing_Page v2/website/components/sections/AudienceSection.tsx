import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { audiences } from "@/content/landing";

export function AudienceSection() {
  return (
    <section id="para-quem" className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Para Quem"
          title="Para startups, empresas e ecossistemas que precisam transformar potencial em operação."
          description="A PCL atua com organizações que têm ideias, projetos, oportunidades e desafios complexos, mas precisam de mais estrutura para operar, medir, automatizar e crescer com inteligência."
        />
        <div className="mt-10 grid gap-5">
          {audiences.map((item, index) => (
            <Card
              key={item.title}
              className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[0.36fr_0.64fr] lg:items-start border-vibrant-cyan/20 bg-surface-panel hover:border-vibrant-cyan"
            >
              <div className="flex items-center gap-4 lg:block">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-vibrant-cyan/40 bg-surface-navy font-mono text-xs font-bold text-vibrant-cyan shadow-cyan-glow/20">
                  0{index + 1}
                </span>
                <h3 className="font-heading text-lg font-bold text-text-high-contrast lg:mt-4 lg:text-xl">{item.title}</h3>
              </div>
              <div>
                <p className="font-mono text-xs leading-relaxed text-blueprint-gray">{item.text}</p>
                <div className="mt-4 border-l-2 border-tertiary bg-surface-navy/80 p-3.5 border-r border-y border-vibrant-cyan/15">
                  <span className="font-mono text-xs font-bold text-tertiary uppercase tracking-wider">Principais ganhos:</span>{" "}
                  <span className="font-mono text-xs text-blueprint-gray">{item.gain}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
