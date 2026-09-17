import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export function BunkerSection() {
  const bunkerPillars = [
    {
      code: "ISO_27001",
      badge: "SEGURANÇA DA INFORMAÇÃO",
      title: "Bunker Blindado contra Vazamentos",
      desc: "Proteção de segredos industriais, dados corporativos e privacidade de clientes alinhada aos controles rigorosos da ISO/IEC 27001. Seus dados operam em circuito fechado e nunca treinam modelos públicos de concorrentes.",
      color: "cyan",
    },
    {
      code: "ISO_42001",
      badge: "GOVERNANÇA & ÉTICA EM IA",
      title: "IA Responsável e Auditável",
      desc: "Implementação pioneira da norma internacional ISO/IEC 42001 para Sistemas de Gestão de IA. Rastreabilidade total de decisões agênticas, eliminação de alucinações descontroladas e supervisão humana nos pontos críticos.",
      color: "green",
    },
    {
      code: "FAILOVER_RESILIENCE",
      badge: "RESILIÊNCIA OPERACIONAL",
      title: "Operação que Nunca Para",
      desc: "Arquitetura com redundância e contingência automática. Se provedores externos sofrerem instabilidade ou apagão, modelos locais privados assumem o processamento imediatamente, garantindo continuidade do negócio.",
      color: "orange",
    },
    {
      code: "EBITDA_SHIELD",
      badge: "PREVISIBILIDADE FINANCEIRA",
      title: "Fim das Faturas Variáveis de IA",
      desc: "Cache semântico de contexto e roteamento inteligente que eliminam re-processamento desnecessário, cortando até 80% dos custos ocultos de licenças e consumo de tokens sem perda de qualidade analítica.",
      color: "cyan",
    },
  ];

  return (
    <section id="bunker-soberano" className="section-band border-b border-vibrant-cyan/20 bg-surface-navy py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Arquitetura Bunker // Soberania, Segurança & Resiliência"
          title="Bunker de Soberania Digital: O Duplo Escudo ISO 27001 & ISO 42001"
          description="Enquanto a segurança tradicional apenas constrói muros frágeis, o Bunker de Soberania Digital da PromptCore Labs entrega resiliência contínua: sua empresa nunca fica refém de plataformas externas, seus dados permanecem protegidos e sua operação não para."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bunkerPillars.map((pillar) => (
            <Card
              key={pillar.code}
              className="group border-vibrant-cyan/20 bg-surface-panel p-6 hover:border-vibrant-cyan hover:shadow-cyan-glow transition-all"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`font-mono text-[9px] font-bold uppercase tracking-wider ${
                    pillar.color === "orange"
                      ? "text-secondary"
                      : pillar.color === "green"
                      ? "text-tertiary"
                      : "text-vibrant-cyan"
                  }`}
                >
                  // {pillar.code}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    pillar.color === "orange"
                      ? "bg-secondary shadow-orange-glow"
                      : pillar.color === "green"
                      ? "bg-tertiary shadow-green-glow"
                      : "bg-vibrant-cyan shadow-cyan-glow"
                  }`}
                />
              </div>

              <div className="mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-blueprint-gray block">
                  {pillar.badge}
                </span>
                <h3 className="font-heading text-base font-bold text-text-high-contrast group-hover:text-vibrant-cyan transition-colors mt-1">
                  {pillar.title}
                </h3>
              </div>

              <p className="font-mono text-xs leading-relaxed text-blueprint-gray mt-3">
                {pillar.desc}
              </p>
            </Card>
          ))}
        </div>

        {/* Nudge Banner para o Quiz */}
        <div className="mt-10 border border-vibrant-cyan/30 bg-surface-panel/90 p-6 shadow-cyan-glow/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold text-vibrant-cyan uppercase tracking-widest block mb-1">
              // AUDITORIA PRELIMINAR DE RISCO
            </span>
            <h4 className="font-heading text-sm sm:text-base font-bold text-text-high-contrast">
              Sua empresa está operando dentro ou fora do Bunker?
            </h4>
            <p className="font-mono text-xs text-blueprint-gray mt-1">
              Faça o teste de 60 segundos e descubra seu índice de prontidão para a ISO 27001 e ISO 42001.
            </p>
          </div>
          <a
            href="#diagnostico"
            className="btn-chamfer shrink-0 inline-flex min-h-11 items-center justify-center bg-vibrant-cyan px-6 font-mono text-xs font-bold uppercase tracking-wider text-surface-navy shadow-cyan-glow hover:bg-white hover:shadow-cyan-glow-lg transition-all"
          >
            Fazer Diagnóstico Bunker ⚡
          </a>
        </div>
      </Container>
    </section>
  );
}
