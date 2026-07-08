import { BlueprintGrid } from "@/components/BlueprintGrid";
import { Container } from "@/components/Container";
import { CTAButton } from "@/components/CTAButton";
import { heroContent } from "@/data/landingContent";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-blueprint-line">
      <BlueprintGrid />
      <Container className="relative grid min-h-[86vh] items-center gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 max-w-fit border border-blueprint-line bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blueprint-petrol">
            {heroContent.eyebrow}
          </p>
          <h1 className="max-w-5xl text-4xl font-semibold leading-[1.04] text-blueprint-ink sm:text-5xl lg:text-6xl">
            {heroContent.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blueprint-muted">
            {heroContent.subtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="#plataforma">{heroContent.primaryCta}</CTAButton>
            <CTAButton href="#parceria" variant="secondary">
              {heroContent.secondaryCta}
            </CTAButton>
          </div>
        </div>

        <div className="relative">
          <div className="border border-blueprint-line bg-white/80 p-5 shadow-technical">
            <div className="mb-4 flex items-center justify-between border-b border-blueprint-line pb-3">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-blueprint-muted">
                Executive blueprint
              </span>
              <span className="h-2 w-2 bg-blueprint-cyan" />
            </div>
            <div className="grid gap-3">
              {["Talent", "Performance", "Brand", "Partners"].map((label, index) => (
                <div
                  className="grid grid-cols-[96px_1fr] items-center gap-4 border border-blueprint-line bg-blueprint-paper/70 p-3"
                  key={label}
                >
                  <span className="font-mono text-xs text-blueprint-petrol">
                    0{index + 1} / {label}
                  </span>
                  <span className="h-2 bg-linear-scan" />
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-blueprint-muted">
              <span className="border border-blueprint-line py-3">Method</span>
              <span className="border border-blueprint-line py-3">Media</span>
              <span className="border border-blueprint-line py-3">Value</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
