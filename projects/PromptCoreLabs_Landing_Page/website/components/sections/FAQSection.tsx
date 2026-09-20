import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { faqItems } from "@/content/faq";

export function FAQSection() {
  return (
    <section id="faq" className="py-16 sm:py-20 border-b border-vibrant-cyan/15">
      <Container>
        <SectionHeader
          eyebrow="FAQ"
          title="Perguntas frequentes sobre a PromptCore Labs."
          description="Respostas diretas para apoiar decisão, conversão qualificada e visibilidade em mecanismos de busca e IA."
        />
        <div className="mt-10 divide-y divide-vibrant-cyan/15 border border-vibrant-cyan/20 bg-surface-panel shadow-cyan-glow/10">
          {faqItems.map((item) => (
            <details key={item.question} className="group p-6 open:bg-surface-navy/60 transition-colors">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left font-heading text-sm font-bold text-text-high-contrast group-hover:text-vibrant-cyan transition-colors">
                {item.question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-vibrant-cyan/40 font-mono text-xs text-vibrant-cyan transition group-open:rotate-45 group-open:border-vibrant-cyan group-open:shadow-cyan-glow">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-4xl font-mono text-xs leading-relaxed text-blueprint-gray">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
