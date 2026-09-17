import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function AEOSSection() {
  const aeosPillars = [
    {
      tag: "CORTEX ENGINE",
      title: "Inteligência Arquitetural Cortex",
      desc: "Documentação viva (Living Architecture) com 25 diagramas C4 e sequências UML mantidos e auditados continuamente pela persona Cortex.",
      color: "cyan",
    },
    {
      tag: "FINOPS & CACHE",
      title: "EBITDA Shield & Token FinOps",
      desc: "Cache semântico de prompts via OmniRoute AI Gateway que previne re-computação, corta custos em até 80% e protege a margem financeira.",
      color: "green",
    },
    {
      tag: "SOVEREIGN BUNKER",
      title: "Bunker de Soberania Digital",
      desc: "Isolamento soberano de contexto, segurança rigorosa sob ISO 27001 e rastreabilidade total para operações agênticas de missão crítica.",
      color: "orange",
    },
    {
      tag: "TLC-v3 METHODOLOGY",
      title: "Metodologia TLC-v3 & ISO 42001",
      desc: "Padrões de engenharia Spec-Driven e governança ética para interoperabilidade, resiliência e alta performance entre agentes autônomos.",
      color: "cyan",
    },
  ];

  return (
    <section id="pcl-aeos" className="section-band border-b border-vibrant-cyan/20 bg-surface-navy py-16 sm:py-24">
      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow="Governança & Living Architecture // PCL AEOS"
            title="PCL AEOS: A prova viva de engenharia que ancora nosso Bunker de Soberania."
            description="O PCL AEOS é o sistema operacional da PromptCore Labs projetado como uma fortaleza de segurança, escalabilidade e governança financeira. Movido pela Living Architecture mantida pela inteligência Cortex, ele audita e documenta em tempo real nossas arquiteturas sob as normas ISO 27001 e ISO 42001."
          />

          <div className="mt-6 border border-vibrant-cyan/30 bg-surface-panel/90 p-4 shadow-cyan-glow/20">
            <div className="flex items-center justify-between border-b border-vibrant-cyan/20 pb-2 mb-2">
              <span className="font-mono text-[10px] font-bold text-vibrant-cyan uppercase tracking-widest">
                // OMNIROUTE_GATEWAY: EBITDA_SHIELD_ACTIVE
              </span>
              <span className="border border-tertiary/40 bg-tertiary/10 px-2 py-0.5 font-mono text-[9px] text-tertiary shadow-green-glow">
                CACHE HIT: 0 COST
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-blueprint-gray">
              &gt; Redução drástica de custos por reutilização inteligente de contexto e roteamento dinâmico entre GPU local privada e nuvem.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://enterdufter.github.io/PromptCoreLabs_AEOS/#"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer inline-flex min-h-11 items-center justify-center bg-vibrant-cyan px-6 font-mono text-xs font-bold uppercase tracking-wider text-surface-navy shadow-cyan-glow hover:bg-white hover:shadow-cyan-glow-lg transition-all"
            >
              Acessar PCL AEOS & Living Architecture [LIVE] ↗
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {aeosPillars.map((pillar) => (
            <Card
              key={pillar.title}
              className="group border-vibrant-cyan/20 bg-surface-panel p-5 hover:border-vibrant-cyan hover:shadow-cyan-glow transition-all"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`font-mono text-[9px] font-bold uppercase tracking-wider ${
                    pillar.color === "orange"
                      ? "text-secondary"
                      : pillar.color === "green"
                      ? "text-tertiary"
                      : "text-vibrant-cyan"
                  }`}
                >
                  {pillar.tag}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    pillar.color === "orange"
                      ? "bg-secondary shadow-orange-glow"
                      : pillar.color === "green"
                      ? "bg-tertiary shadow-green-glow"
                      : "bg-vibrant-cyan shadow-cyan-glow"
                  }`}
                />
              </div>
              <h3 className="font-heading text-sm font-bold text-text-high-contrast group-hover:text-vibrant-cyan transition-colors">
                {pillar.title}
              </h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-blueprint-gray">
                {pillar.desc}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
