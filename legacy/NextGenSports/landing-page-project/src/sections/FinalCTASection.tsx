import { Container } from "@/components/Container";
import { CTAButton } from "@/components/CTAButton";

export function FinalCTASection() {
  return (
    <section className="py-20">
      <Container>
        <div className="border border-blueprint-line bg-blueprint-petrol p-8 text-white sm:p-10 lg:p-12">
          <p className="max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl">
            Vamos construir uma parceria com método, narrativa e valor mensurável.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="mailto:contato@nextgensports.com" className="border-white bg-white text-blueprint-ink hover:bg-blueprint-paper">
              Solicitar apresentação executiva
            </CTAButton>
            <CTAButton href="mailto:contato@nextgensports.com" variant="secondary" className="border-white/35 bg-transparent text-white hover:border-white hover:text-white">
              Conversar sobre parceria
            </CTAButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
