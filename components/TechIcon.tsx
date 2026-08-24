import { techIcons } from "@/content/tech-icons";

/**
 * A brand mark from the generated simple-icons subset.
 *
 * Inked with `currentColor` by default so it inherits whatever it sits in;
 * pass `brand` where the actual brand colour earns its place, which is mostly
 * the stack lists on hover.
 */
export function TechIcon({
  slug,
  size = 16,
  brand = false,
  className,
}: {
  slug: string;
  size?: number;
  brand?: boolean;
  className?: string;
}) {
  const icon = techIcons[slug];
  if (!icon) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      fill={brand ? icon.hex : "currentColor"}
    >
      <path d={icon.path} />
    </svg>
  );
}

export const hasTechIcon = (slug?: string) => Boolean(slug && techIcons[slug]);
