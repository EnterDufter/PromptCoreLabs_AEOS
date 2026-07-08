type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light"
}: SectionHeaderProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const titleColor = tone === "dark" ? "text-white" : "text-blueprint-ink";
  const descriptionColor = tone === "dark" ? "text-white/72" : "text-blueprint-muted";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-blueprint-cyan">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-3xl font-semibold leading-tight sm:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-7 sm:text-lg ${descriptionColor}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
