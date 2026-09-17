import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
};

export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center px-6 text-sm font-mono font-semibold uppercase tracking-wider transition-all duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibrant-cyan",
        variant === "primary" &&
          "btn-chamfer bg-vibrant-cyan text-surface-navy shadow-cyan-glow hover:bg-white hover:shadow-cyan-glow-lg transition-transform hover:-translate-y-0.5",
        variant === "secondary" &&
          "border border-vibrant-cyan/40 bg-surface-panel/80 text-vibrant-cyan hover:border-vibrant-cyan hover:bg-vibrant-cyan/10 hover:shadow-cyan-glow transition-all",
        variant === "dark" &&
          "border border-outline-variant bg-surface-navy text-high-contrast hover:border-vibrant-cyan hover:text-vibrant-cyan",
        className,
      )}
    >
      {children}
    </a>
  );
}
