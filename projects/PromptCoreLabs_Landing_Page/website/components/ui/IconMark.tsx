import { cn } from "@/lib/utils";

type IconMarkProps = {
  index?: number;
  className?: string;
};

export function IconMark({ index = 0, className }: IconMarkProps) {
  const tones = [
    "border-vibrant-cyan/40 bg-surface-navy text-vibrant-cyan shadow-cyan-glow/20",
    "border-tertiary/40 bg-surface-navy text-tertiary shadow-green-glow/20",
    "border-secondary/40 bg-surface-navy text-secondary shadow-orange-glow/20",
  ];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 items-center justify-center border font-mono text-xs font-bold",
        tones[index % tones.length],
        className,
      )}
    >
      0{index + 1}
    </span>
  );
}
