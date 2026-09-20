import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { DiagramBlock } from "@/components/ui/DiagramBlock";

export function HeroSection() {
  return (
    <section id="inicio" className="section-band pt-16 sm:pt-20 lg:pt-24 pb-16 lg:pb-24">
      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Consultoria & Centro de Inovação Corporativa</Badge>
            <span className="border border-tertiary/40 bg-tertiary/10 px-2 py-0.5 font-mono text-[10px] text-tertiary shadow-green-glow">
              // BUNKER DE SOBERANIA ATIVO
            </span>
          </div>
          
          <h1 className="mt-6 max-w-4xl font-heading text-3xl font-bold leading-[1.1] text-text-high-contrast sm:text-5xl lg:text-5xl tracking-tight">
            Arquitetura, IA e operação para transformar ideias em empresas <span className="text-vibrant-cyan text-glow-cyan">mais inteligentes</span>.
          </h1>
          
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-blueprint-gray sm:text-base">
            A PromptCore Labs ajuda startups, empresas e ecossistemas de inovação a estruturar
            processos, dados, automações e agentes de IA com governança, contexto e visão de
            crescimento.
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-3 font-mono text-[11px] text-blueprint-gray">
            <div className="border border-vibrant-cyan/20 bg-surface-panel/80 p-2.5">
              <span className="text-vibrant-cyan font-bold block">🛡️ DUPLO ESCUDO</span>
              ISO 27001 & ISO 42001
            </div>
            <div className="border border-vibrant-cyan/20 bg-surface-panel/80 p-2.5">
              <span className="text-vibrant-cyan font-bold block">🔒 IA PRÓPRIA</span>
              Zero vazamento de dados
            </div>
            <div className="border border-vibrant-cyan/20 bg-surface-panel/80 p-2.5">
              <span className="text-vibrant-cyan font-bold block">⚡ EBITDA SHIELD</span>
              Previsibilidade de custos
            </div>
          </div>
          
          <div className="mt-6 border-l-2 border-vibrant-cyan bg-surface-panel/90 p-4 font-mono text-xs leading-relaxed text-on-surface border-r border-y border-vibrant-cyan/20 shadow-cyan-glow/20">
            <span className="text-tertiary font-semibold">// FORWARD DEPLOYED ARCHITECTURE:</span> Concepção estratégica, arquitetura e execução técnica no ambiente do cliente. Substituímos dependências externas por modelos privados, orquestração agêntica e resiliência operacional.
          </div>
          
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button href="#diagnostico">Fazer Diagnóstico Bunker (60s) ⚡</Button>
            <Button href="#o-que-fazemos" variant="secondary">
              Conhecer o Arquiteto Forward Deployed
            </Button>
          </div>
          
          <p className="mt-4 font-mono text-[11px] text-blueprint-gray">
            &gt; Avalie em 60 segundos se sua empresa opera dentro ou fora do Bunker de Soberania Digital.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-4 bg-vibrant-cyan/5 blur-3xl pointer-events-none" />
          <DiagramBlock />
        </div>
      </Container>
    </section>
  );
}
