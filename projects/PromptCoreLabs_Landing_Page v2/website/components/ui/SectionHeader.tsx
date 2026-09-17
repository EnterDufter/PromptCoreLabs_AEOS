import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <h2 className="mt-4 font-heading text-2xl font-bold leading-tight text-text-high-contrast sm:text-4xl lg:text-4xl tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 font-mono text-sm leading-relaxed text-blueprint-gray sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
