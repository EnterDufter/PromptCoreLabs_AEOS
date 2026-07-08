import type { AnchorHTMLAttributes, ReactNode } from "react";

type CTAButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function CTAButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: CTAButtonProps) {
  const styles =
    variant === "primary"
      ? "border-blueprint-petrol bg-blueprint-petrol text-white hover:bg-blueprint-ink"
      : "border-blueprint-line bg-white/75 text-blueprint-ink hover:border-blueprint-cyan hover:text-blueprint-petrol";

  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center border px-5 text-sm font-semibold transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
