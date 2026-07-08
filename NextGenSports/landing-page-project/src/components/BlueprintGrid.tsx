export function BlueprintGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-70" />
      <div className="absolute left-[8%] top-24 h-px w-1/3 bg-blueprint-line" />
      <div className="absolute right-[12%] top-40 h-48 w-px bg-blueprint-line" />
      <div className="absolute bottom-20 left-[14%] h-24 w-24 border border-blueprint-line" />
      <div className="absolute bottom-32 right-[8%] h-px w-1/4 bg-blueprint-cyan/40" />
    </div>
  );
}
