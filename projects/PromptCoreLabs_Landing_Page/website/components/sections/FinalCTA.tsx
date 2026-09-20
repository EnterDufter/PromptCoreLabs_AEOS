import Image from "next/image";
import { Container } from "@/components/ui/Container";

const contactEmail = "contato@promptcore.com.br";

export function FinalCTA() {
  return (
    <section id="contato" className="section-band py-16 sm:py-24">
      <Container className="relative">
        <div className="border border-vibrant-cyan/30 bg-surface-panel p-6 shadow-cyan-glow/20 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
            <div>
              {/* Bento-Grid Header: Logo PNG Transparente Ampliado + Título/Badge */}
              <div className="grid gap-5 sm:gap-6 sm:grid-cols-[auto_1fr] items-center mb-6">
                {/* Bento Card: Logo PCL Transparente Ampliado (Sem caixa de fundo nem luz verde) */}
                <div className="relative flex shrink-0 items-center justify-center group w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40">
                  <Image
                    src="/pcl-logo.png"
                    alt="PromptCore Labs Architecture Logo"
                    width={160}
                    height={160}
                    priority
                    className="h-full w-full object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.45)] group-hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.75)] group-hover:scale-105 transition-all duration-300"
                  />
                </div>

                {/* Conteúdo Textual da Seção de Contato */}
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vibrant-cyan">
                    // SESSÃO ESTRATÉGICA EXECUTIVA
                  </p>
                  <h2 className="mt-2 font-heading text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-text-high-contrast tracking-tight">
                    Pronto para conquistar Soberania Tecnológica e implantar seu Bunker de IA?
                  </h2>
                </div>
              </div>
              <p className="mt-4 font-mono text-xs leading-relaxed text-blueprint-gray sm:text-sm">
                Agende uma conversa direta com nosso <strong>Founder & Principal AI Forward Deployed Architect</strong>. Vamos avaliar o cenário da sua empresa, identificar riscos de vazamento de dados, custos ocultos e estruturar a implantação sob as normas ISO 27001 e ISO 42001.
              </p>
              <p className="mt-3 font-mono text-xs text-blueprint-gray/80">
                &gt; Sem consultoria de slides. Atuação técnica hands-on diretamente no seu ambiente.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href={`mailto:${contactEmail}?subject=Sessao%20Estrategica%20Bunker%20PromptCore%20Labs`}
                  className="btn-chamfer inline-flex min-h-11 items-center justify-center bg-vibrant-cyan px-6 font-mono text-xs font-semibold uppercase tracking-wider text-surface-navy shadow-cyan-glow hover:bg-white transition-all"
                >
                  Falar Diretamente via E-mail
                </a>
                <a
                  href="#diagnostico"
                  className="inline-flex min-h-11 items-center justify-center border border-vibrant-cyan/40 bg-surface-navy px-6 font-mono text-xs font-semibold uppercase tracking-wider text-vibrant-cyan hover:border-vibrant-cyan hover:shadow-cyan-glow transition-all"
                >
                  Fazer Diagnóstico Bunker ⚡
                </a>
              </div>
            </div>

            {/* Terminal Form Component */}
            <form
              action="https://api.web3forms.com/submit"
              method="POST"
              className="border border-vibrant-cyan/20 bg-surface-navy p-5 shadow-cyan-glow/10 sm:p-6"
              aria-label="Formulário de contato executivo"
            >
              {/* Preservados 100% dos campos ocultos Web3Forms */}
              <input type="hidden" name="access_key" value="f9f1bd77-c2a2-4635-b11d-2e95d5bc996c" />
              <input type="hidden" name="subject" value="[CONTATO LP v2] Nova Solicitação de Diagnóstico - PromptCore Labs" />
              <input type="hidden" name="from_name" value="PromptCore Labs Landing Page v2" />
              <input type="hidden" name="redirect" value="https://promptcore-labs-landing.pages.dev/" />
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

              <div className="mb-4 flex items-center justify-between border-b border-vibrant-cyan/20 pb-3">
                <span className="font-mono text-xs font-bold text-vibrant-cyan uppercase tracking-wider">
                  TERMINAL_INPUT // CONTATO_ARQUITETO
                </span>
                <span className="h-2 w-2 rounded-full bg-tertiary shadow-green-glow" />
              </div>

              <div className="grid gap-4">
                <label className="grid gap-1.5 font-mono text-xs text-blueprint-gray">
                  Nome Completo *
                  <input
                    className="min-h-11 border border-vibrant-cyan/30 bg-surface-panel px-3.5 font-mono text-xs text-text-high-contrast focus:border-vibrant-cyan focus:outline-none focus:shadow-cyan-glow transition-all"
                    name="Nome"
                    autoComplete="name"
                    placeholder="Seu nome"
                    required
                  />
                </label>
                <label className="grid gap-1.5 font-mono text-xs text-blueprint-gray">
                  E-mail Corporativo *
                  <input
                    className="min-h-11 border border-vibrant-cyan/30 bg-surface-panel px-3.5 font-mono text-xs text-text-high-contrast focus:border-vibrant-cyan focus:outline-none focus:shadow-cyan-glow transition-all"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu@empresa.com.br"
                    required
                  />
                </label>
                <label className="grid gap-1.5 font-mono text-xs text-blueprint-gray">
                  WhatsApp com DDD *
                  <input
                    className="min-h-11 border border-vibrant-cyan/30 bg-surface-panel px-3.5 font-mono text-xs text-text-high-contrast focus:border-vibrant-cyan focus:outline-none focus:shadow-cyan-glow transition-all"
                    name="WhatsApp"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </label>
                <label className="grid gap-1.5 font-mono text-xs text-blueprint-gray">
                  Organização / Empresa
                  <input
                    className="min-h-11 border border-vibrant-cyan/30 bg-surface-panel px-3.5 font-mono text-xs text-text-high-contrast focus:border-vibrant-cyan focus:outline-none focus:shadow-cyan-glow transition-all"
                    name="Organizacao"
                    placeholder="Nome da sua empresa"
                    autoComplete="organization"
                  />
                </label>
                <label className="grid gap-1.5 font-mono text-xs text-blueprint-gray">
                  Desafio Principal ou Mensagem *
                  <textarea
                    className="min-h-24 border border-vibrant-cyan/30 bg-surface-panel p-3.5 font-mono text-xs text-text-high-contrast focus:border-vibrant-cyan focus:outline-none focus:shadow-cyan-glow transition-all"
                    name="message"
                    placeholder="Ex: Queremos substituir APIs públicas por modelos privados e nos adequar à ISO 42001..."
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="btn-chamfer inline-flex min-h-11 items-center justify-center bg-vibrant-cyan font-mono text-xs font-bold uppercase tracking-wider text-surface-navy shadow-cyan-glow hover:bg-white hover:shadow-cyan-glow-lg transition-all mt-2"
                >
                  Solicitar Contato com o Arquiteto [SUBMIT]
                </button>
                <p className="font-mono text-[10px] text-blueprint-gray/70">
                  &gt; Submissão segura via Web3Forms e dados protegidos sob conformidade ISO 27001.
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
