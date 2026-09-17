import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "border border-vibrant-cyan/20 bg-surface-panel p-6 shadow-cyan-glow/10 transition-all duration-200 hover:border-vibrant-cyan hover:shadow-cyan-glow",
        className,
      )}
    >
      {children}
    </div>
  );
}
