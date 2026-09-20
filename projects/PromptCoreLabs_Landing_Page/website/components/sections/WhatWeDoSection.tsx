import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { IconMark } from "@/components/ui/IconMark";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { whatWeDo } from "@/content/landing";

export function WhatWeDoSection() {
  return (
    <section id="o-que-fazemos" className="border-y border-vibrant-cyan/15 bg-surface-panel/70 py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="O Modelo AI Forward Deployed Architect"
          title="Sem relatórios de gaveta: desenhamos a estratégia e colocamos a tecnologia para rodar."
          description="Atuamos diretamente na infraestrutura do cliente (on-premise ou private cloud), unindo concepção executiva, engenharia de software soberana e capacitação das equipes internas para garantir autonomia real."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {whatWeDo.map((item, index) => (
            <Card
              key={item.title}
              className={
                index === 1
                  ? "min-h-72 border-vibrant-cyan/50 bg-surface-navy p-7 shadow-cyan-glow/30"
                  : "min-h-72 p-7 bg-surface-panel/90"
              }
            >
              <div className="flex items-center justify-between">
                <IconMark index={index} />
                <span className="font-mono text-[10px] text-vibrant-cyan font-bold uppercase">
                  ETAPA 0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-text-high-contrast">{item.title}</h3>
              <p className="mt-3 font-mono text-xs leading-relaxed text-blueprint-gray">{item.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#frentes-consultivas"
            className="font-mono text-xs text-blueprint-gray hover:text-vibrant-cyan transition-colors underline"
          >
            Conheça abaixo nossas 6 Frentes Consultivas Estratégicas ↓
          </a>
        </div>
      </Container>
    </section>
  );
}
