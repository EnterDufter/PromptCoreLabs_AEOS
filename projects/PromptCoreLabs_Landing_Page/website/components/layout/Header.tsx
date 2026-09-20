"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navItems } from "@/content/landing";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fecha o menu ao pressionar a tecla ESC ou ao redimensionar para tela grande
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-console border-b border-vibrant-cyan/15">
      <Container className="flex min-h-16 items-center justify-between gap-3 sm:gap-5">
        <a href="#inicio" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" aria-label="PromptCore Labs - Início">
          <div className="relative flex items-center justify-center">
            {/* Soft Cyan Glow Halo behind logo */}
            <div className="absolute inset-0 bg-vibrant-cyan/25 blur-md rounded-full pointer-events-none group-hover:bg-vibrant-cyan/45 transition-all duration-300"></div>
            <span className="absolute -top-1 -right-1 z-10 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <Image
              src="/pcl-logo.png"
              alt="PCL Logo"
              width={44}
              height={44}
              className="relative z-0 h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.65)] group-hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.95)] group-hover:scale-105 transition-all duration-300"
            />
          </div>
          <span className="font-heading text-sm sm:text-base font-bold text-text-high-contrast tracking-tight group-hover:text-vibrant-cyan transition-colors">
            PromptCore <span className="text-vibrant-cyan">Labs</span>
          </span>
        </a>

        {/* Navegação Desktop (> 1024px) */}
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

        {/* Ações da Direita: CTA + Botão Hamburguer Mobile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button href="#diagnostico" className="inline-flex text-xs sm:text-sm px-3.5 sm:px-6">
            <span className="hidden sm:inline">Diagnóstico Bunker ⚡</span>
            <span className="sm:hidden">Diagnóstico ⚡</span>
          </Button>

          {/* Botão Hamburguer (visível em telas menores que lg: 1024px) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center border border-vibrant-cyan/30 bg-surface-navy text-text-high-contrast hover:border-vibrant-cyan hover:text-vibrant-cyan hover:shadow-cyan-glow transition-all lg:hidden"
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg className="h-5 w-5 text-vibrant-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-blueprint-gray group-hover:text-vibrant-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Dropdown Menu Mobile (< 1024px) */}
      {isMenuOpen && (
        <div className="border-t border-vibrant-cyan/20 bg-surface-navy/98 backdrop-blur-md lg:hidden shadow-2xl animate-fadeIn">
          <Container className="py-3 px-4">
            <nav className="flex flex-col space-y-1 font-mono text-xs uppercase tracking-wider" aria-label="Navegação mobile">
              {navItems.map((item, idx) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-3 px-3.5 py-3 transition-all border-l-2 ${
                    item.label === "PCL AEOS" || item.label === "Diagnóstico Bunker"
                      ? "text-vibrant-cyan font-bold border-vibrant-cyan bg-vibrant-cyan/10"
                      : "text-blueprint-gray border-transparent hover:border-vibrant-cyan/60 hover:text-vibrant-cyan hover:bg-vibrant-cyan/5"
                  }`}
                >
                  <span className="text-[10px] text-vibrant-cyan/60 font-mono">// 0{idx + 1}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

