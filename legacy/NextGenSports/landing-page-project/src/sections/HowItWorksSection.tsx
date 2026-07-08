import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { workflowSteps } from "@/data/landingContent";

export function HowItWorksSection() {
  return (
    <section className="border-y border-blueprint-line bg-blueprint-ink py-20 text-white">
      <Container>
        <SectionHeader
          eyebrow="Como funciona"
          tone="dark"
          title="Da identificação de potencial à evolução mensurável."
          description="O fluxo inicial organiza a jornada em etapas claras, permitindo que atletas, famílias, equipes e parceiros compreendam o projeto com método."
        />
        <div className="mt-10 grid gap-3 lg:grid-cols-6">
          {workflowSteps.map((step, index) => (
            <div className="border border-white/18 bg-white/6 p-4" key={step}>
              <span className="font-mono text-xs text-blueprint-cyan">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-8 text-sm font-semibold leading-6">{step}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
