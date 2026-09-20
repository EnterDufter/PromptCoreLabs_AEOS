import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-vibrant-cyan/40 bg-surface-panel px-3 py-1.5 text-[11px] font-mono font-medium uppercase tracking-widest text-vibrant-cyan shadow-cyan-glow/30",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-tertiary shadow-green-glow" />
      {children}
    </span>
  );
}
