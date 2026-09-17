import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projectOSCapabilities } from "@/content/landing";

export function ProjectOSSection() {
  return (
    <section id="project-os" className="section-band py-16 sm:py-20 border-b border-vibrant-cyan/15">
      <Container className="relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow="Plataforma PCL"
            title="Project.OS: gestão inteligente para projetos e ecossistemas de inovação."
            description="Project.OS é a plataforma da PromptCore Labs para gestão inteligente de projetos, editais, evidências, indicadores e governança operacional."
          />
          <p className="mt-5 font-mono text-xs leading-relaxed text-blueprint-gray">
            Com o Project.OS, organizações podem transformar oportunidades, editais e programas
            em projetos mais estruturados, rastreáveis e orientados por dados. A plataforma
            materializa a visão da PCL: combinar IA aplicada, governança e operação
            em um sistema de trabalho mais inteligente.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#contato">Falar sobre o Project.OS</Button>
            <Button href="#servicos" variant="secondary">
              Ver como funciona
            </Button>
          </div>
        </div>
        <Card className="relative overflow-hidden p-3 border-vibrant-cyan/30 bg-surface-panel shadow-cyan-glow/20">
          <div className="border border-vibrant-cyan/20 bg-surface-navy p-5 text-high-contrast">
            <div className="flex items-center justify-between border-b border-vibrant-cyan/20 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-vibrant-cyan shadow-cyan-glow" />
                <p className="font-heading text-lg font-bold text-text-high-contrast">Project.OS</p>
              </div>
              <span className="border border-tertiary/40 bg-tertiary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-tertiary shadow-green-glow">
                PCL PLATFORM
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {projectOSCapabilities.map((capability) => (
                <div key={capability} className="border border-vibrant-cyan/15 bg-surface-panel p-3.5 hover:border-vibrant-cyan transition-colors">
                  <div className="mb-3 h-1 w-6 bg-vibrant-cyan shadow-cyan-glow" />
                  <p className="font-mono text-xs font-semibold text-text-high-contrast">{capability}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}
