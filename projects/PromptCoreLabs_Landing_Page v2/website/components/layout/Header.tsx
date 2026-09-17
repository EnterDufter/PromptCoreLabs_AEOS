import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navItems } from "@/content/landing";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-console border-b border-vibrant-cyan/15">
      <Container className="flex min-h-16 items-center justify-between gap-5">
        <a href="#inicio" className="flex items-center gap-3 group" aria-label="PromptCore Labs - Início">
          <div className="relative flex h-10 w-10 items-center justify-center border border-vibrant-cyan/40 bg-surface-navy p-1 group-hover:border-vibrant-cyan group-hover:shadow-cyan-glow transition-all">
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <Image
              src="/pcl-logo.png"
              alt="PCL Logo"
              width={36}
              height={36}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-heading text-base font-bold text-text-high-contrast tracking-tight group-hover:text-vibrant-cyan transition-colors">
            PromptCore <span className="text-vibrant-cyan">Labs</span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 text-xs font-mono font-medium text-blueprint-gray lg:flex uppercase tracking-wider" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`transition-colors hover:text-vibrant-cyan ${
                item.label === "PCL AEOS" || item.label === "Diagnóstico Bunker" ? "text-vibrant-cyan font-bold" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button href="#diagnostico" className="inline-flex">
          <span className="hidden sm:inline">Diagnóstico Bunker ⚡</span>
          <span className="sm:hidden">Diagnóstico</span>
        </Button>
      </Container>
    </header>
  );
}
