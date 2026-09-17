import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/content/landing";

export function ServicesSection() {
  return (
    <section id="frentes-consultivas" className="border-b border-vibrant-cyan/15 bg-surface-panel/70 py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Consultoria Estratégica & Execução Técnica"
          title="As 6 Frentes Consultivas da PromptCore Labs"
          description="Da soberania tecnológica e modelos privados à governança formal ISO 42001 e ISO 27001. Soluções concebidas para proteger seu capital intelectual e escalar margens operacionais com autonomia total."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className={`group transition-all ${
                index === 0 || index === 3
                  ? "border-vibrant-cyan/40 bg-surface-navy p-7 shadow-cyan-glow/20 hover:border-vibrant-cyan"
                  : "bg-surface-panel/90 p-7 hover:border-vibrant-cyan/50"
              }`}
            >
              <div className="mb-3 flex items-center justify-between border-b border-vibrant-cyan/20 pb-2">
                <span className="font-mono text-[10px] font-bold text-vibrant-cyan uppercase tracking-widest">
                  {service.tag || `FRENTE 0${index + 1}`}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary shadow-green-glow" />
              </div>

              <h3 className="font-heading text-lg font-bold text-text-high-contrast group-hover:text-vibrant-cyan transition-colors">
                {service.title}
              </h3>
              <p className="mt-3 font-mono text-xs leading-relaxed text-blueprint-gray">
                {service.text}
              </p>
              <div className="mt-4 border-l-2 border-vibrant-cyan bg-surface-navy/90 p-3.5 border-r border-y border-vibrant-cyan/15">
                <span className="font-mono text-xs font-bold text-vibrant-cyan uppercase tracking-wider">
                  Impacto Corporativo:
                </span>{" "}
                <span className="font-mono text-xs text-blueprint-gray">{service.result}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Micro-CTA contextual */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border border-vibrant-cyan/30 bg-surface-navy p-5 shadow-cyan-glow/10">
          <div>
            <span className="font-mono text-xs text-vibrant-cyan font-bold uppercase tracking-wider block">
              Dúvidas sobre qual frente priorizar na sua empresa?
            </span>
            <p className="font-mono text-xs text-blueprint-gray mt-0.5">
              Faça o diagnóstico preliminar gratuito para receber o roadmap recomendado pelo nosso Arquiteto.
            </p>
          </div>
          <a
            href="#diagnostico"
            className="btn-chamfer shrink-0 inline-flex min-h-10 items-center justify-center bg-vibrant-cyan px-5 font-mono text-xs font-bold uppercase tracking-wider text-surface-navy shadow-cyan-glow hover:bg-white transition-all"
          >
            Avaliar Minha Empresa (60s) ↓
          </a>
        </div>
      </Container>
    </section>
  );
}
