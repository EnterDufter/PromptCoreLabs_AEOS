import { Container } from "@/components/ui/Container";
import { navItems } from "@/content/landing";

export function Footer() {
  return (
    <footer className="border-t border-vibrant-cyan/20 bg-surface-navy py-12 text-high-contrast">
      <Container className="grid gap-10 lg:grid-cols-[1.35fr_0.7fr_0.8fr] lg:items-start">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-bold text-text-high-contrast tracking-tight">
              PromptCore <span className="text-vibrant-cyan">Labs</span>
            </span>
            <span className="border border-tertiary/40 bg-tertiary/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-tertiary shadow-green-glow">
              PCL.AEOS_V2.1
            </span>
          </div>
          <p className="mt-3 font-mono text-xs leading-relaxed text-blueprint-gray">
            IA aplicada, automação e arquitetura operacional para startups, empresas e
            ecossistemas de inovação.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] text-vibrant-cyan">
            <span className="border border-vibrant-cyan/30 bg-surface-panel px-2.5 py-1">IA_APLICADA</span>
            <span className="border border-vibrant-cyan/30 bg-surface-panel px-2.5 py-1">ARQUITETURA_OPERACIONAL</span>
            <span className="border border-vibrant-cyan/30 bg-surface-panel px-2.5 py-1">GOVERNANÇA_COGNITIVA</span>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-vibrant-cyan">Navegação</p>
          <nav className="mt-3 grid gap-2.5 font-mono text-xs text-blueprint-gray" aria-label="Navegação do rodapé">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-vibrant-cyan transition-colors">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-vibrant-cyan">Contato</p>
          <a className="mt-3 block font-mono text-xs text-blueprint-gray hover:text-vibrant-cyan transition-colors" href="mailto:contato@promptcorelabs.com">
            contato@promptcorelabs.com
          </a>
          <p className="mt-6 font-mono text-[10px] text-blueprint-gray/60">
            © 2026 PromptCore Labs. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
