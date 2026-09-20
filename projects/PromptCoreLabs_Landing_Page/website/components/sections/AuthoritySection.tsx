import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { authorityPillars } from "@/content/landing";

export function AuthoritySection() {
  return (
    <section id="autoridade" className="py-16 sm:py-24 border-b border-vibrant-cyan/15 bg-surface-navy">
      <Container>
        <SectionHeader
          eyebrow="Autoridade Executiva & Excelência Técnica"
          title="Engenharia de alta fidelidade na intersecção entre arquitetura, dados, IA e governança."
          description="A PromptCore Labs nasce sob a liderança de Eduardo Machado (Founder & Principal AI Forward Deployed Architect), unindo 25+ anos de engenharia combinada: 15 anos em Engenharia de Processos Industriais integrados a 12+ anos projetando sistemas corporativos de TI, CRM/ERP e IA aplicada (pioneirismo cognitivo desde 2017 com IBM Watson e Salesforce Einstein ao ecossistema agêntico com Context, Looping & Graph Engineering sob governança ISO 42001/27001)."
        />

        <div className="mt-6 max-w-3xl border-l-2 border-vibrant-cyan bg-surface-panel/90 p-4 font-mono text-xs leading-relaxed text-blueprint-gray border-r border-y border-vibrant-cyan/20">
          <span className="text-vibrant-cyan font-bold block mb-1">// NOSSA COMPROVAÇÃO DE COMPETÊNCIA:</span>
          Aplicamos o rigor da Engenharia de Processos Industriais à arquitetura moderna de software e IA. Criamos nossos próprios sistemas operacionais (PCL AEOS), desenvolvemos a camada de contexto (PCL Cortex), plataformas ativas (Project.OS) e operamos sob as normas internacionais de segurança (ISO 27001) e governança (ISO 42001).
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {authorityPillars.map((pillar) => (
            <Card key={pillar} className="p-5 border-vibrant-cyan/20 bg-surface-panel hover:border-vibrant-cyan hover:shadow-cyan-glow transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-vibrant-cyan shadow-cyan-glow" />
                <span className="font-mono text-[10px] text-vibrant-cyan font-bold uppercase tracking-wider">
                  PILAR DE AUTORIDADE
                </span>
              </div>
              <h3 className="font-heading text-sm font-bold text-text-high-contrast">{pillar}</h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-blueprint-gray">
                Prática consolidada para conectar objetivos de negócio, execução técnica e conformidade regulatória.
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
