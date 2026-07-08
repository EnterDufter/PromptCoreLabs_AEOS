import type { ReactNode } from "react";

type TechnicalCardProps = {
  title: string;
  description?: string;
  index?: string;
  children?: ReactNode;
};

export function TechnicalCard({
  title,
  description,
  index,
  children
}: TechnicalCardProps) {
  return (
    <article className="border border-blueprint-line bg-white/82 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold leading-snug text-blueprint-ink">{title}</h3>
        {index ? (
          <span className="shrink-0 border border-blueprint-line px-2 py-1 font-mono text-xs text-blueprint-petrol">
            {index}
          </span>
        ) : null}
      </div>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-blueprint-muted">{description}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
