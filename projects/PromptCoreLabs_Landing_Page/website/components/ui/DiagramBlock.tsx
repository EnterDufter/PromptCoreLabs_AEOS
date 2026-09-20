export function DiagramBlock() {
  const nodes = [
    { label: "Dados & Contexto", status: "768-dim Vector RAG", color: "cyan" },
    { label: "Motor Cognitivo", status: "OmniRoute LLM Gateway", color: "cyan" },
    { label: "Agentes Autônomos", status: "Paperclip Orchestration", color: "green" },
    { label: "Governança AEOS", status: "Trivial Gate & Audit", color: "green" },
    { label: "Human-in-the-Loop", status: "Aprovação & Critério", color: "orange" },
    { label: "Auditoria QA", status: "Trilhos Rastreáveis", color: "cyan" },
  ];

  return (
    <figure
      className="relative border border-vibrant-cyan/20 bg-surface-panel p-4 shadow-cyan-glow/20 sm:p-6"
      aria-label="Diagrama de arquitetura cognitiva do PCL AEOS conectando dados, agentes e governança."
    >
      {/* Header do Terminal Console */}
      <div className="mb-4 flex items-center justify-between border-b border-vibrant-cyan/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-tertiary" />
          <span className="ml-2 font-mono text-xs font-semibold text-blueprint-gray uppercase tracking-widest">
            PCL.AEOS_ENGINE // SYSTEM_HEALTH: 100%
          </span>
        </div>
        <span className="border border-tertiary/40 bg-tertiary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-tertiary shadow-green-glow">
          ONLINE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {nodes.map((node) => (
          <div
            key={node.label}
            className="group border border-vibrant-cyan/15 bg-surface-navy/90 p-3.5 transition-all duration-200 hover:border-vibrant-cyan hover:shadow-cyan-glow"
          >
            <div className="mb-2 flex items-center justify-between">
              <span
                className={`h-1.5 w-6 ${
                  node.color === "orange"
                    ? "bg-secondary shadow-orange-glow"
                    : node.color === "green"
                    ? "bg-tertiary shadow-green-glow"
                    : "bg-vibrant-cyan shadow-cyan-glow"
                }`}
              />
              <span className="font-mono text-[9px] text-blueprint-gray">ACTIVE</span>
            </div>
            <p className="font-heading text-xs font-bold text-text-high-contrast group-hover:text-vibrant-cyan transition-colors">
              {node.label}
            </p>
            <p className="mt-1 font-mono text-[10px] text-blueprint-gray leading-tight">
              {node.status}
            </p>
          </div>
        ))}
      </div>

      {/* Terminal Block Output */}
      <div className="mt-4 border border-secondary/30 bg-surface-navy/95 p-4 shadow-orange-glow/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary shadow-orange-glow animate-pulse" />
            <p className="font-mono text-xs font-semibold text-secondary uppercase tracking-wider">
              Human-in-the-loop Gate
            </p>
          </div>
          <span className="font-mono text-[10px] text-blueprint-gray">GATE_ID: PCL-HITL-09</span>
        </div>
        <p className="mt-2 font-mono text-xs leading-relaxed text-blueprint-gray">
          &gt; Decisões críticas exigem validação humana. Agentes operam dentro de trilhos auditáveis e rastreáveis.
        </p>
      </div>
    </figure>
  );
}
