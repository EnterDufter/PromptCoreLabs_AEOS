import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { partnerValues } from "@/data/landingContent";

export function PartnerValueSection() {
  return (
    <section className="border-y border-blueprint-line bg-white/55 py-20" id="parceria">
      <Container>
        <SectionHeader
          eyebrow="Valor para parceiros"
          title="Parceria esportiva com método, narrativa e ativação."
          description="A proposta é aproximar marcas de projetos com contexto real, potencial de desenvolvimento e uma história capaz de gerar valor institucional."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partnerValues.map((value) => (
            <div className="border-l-2 border-blueprint-cyan bg-white/80 p-5" key={value}>
              <p className="text-sm leading-6 text-blueprint-graphite">{value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
