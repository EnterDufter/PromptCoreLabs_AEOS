import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { educationThemes } from "@/content/landing";

export function EducationSection() {
  return (
    <section id="educacao" className="py-16 sm:py-20 border-b border-vibrant-cyan/15">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <SectionHeader
            eyebrow="Educação & Labs"
            title="Educação executiva para aplicar IA com método, contexto e governança."
            description="A PromptCore Labs atua na formação de equipes, lideranças, startups e instituições. Nossos programas educacionais são estruturados sob metodologia ativa e capacitação pedagógica certificada (SENAI), conectando IA aplicada com casos práticos e uso responsável da tecnologia."
          />
          <Button href="#contato" className="mt-8">
            Desenhar uma trilha com a PCL
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {educationThemes.map((theme) => (
            <Card key={theme} className="p-5 border-vibrant-cyan/20 bg-surface-panel hover:border-vibrant-cyan">
              <h3 className="font-heading text-sm font-bold text-text-high-contrast">{theme}</h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-blueprint-gray">
                Conteúdo aplicado para decisões, processos e rotinas reais de trabalho.
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
