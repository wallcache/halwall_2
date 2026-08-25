"use client";

import { usePathname } from "next/navigation";

/**
 * The site's furniture: header, footer, loader.
 *
 * Everything except /cv, which is a print artefact. It is A4, it gets sent to
 * people, and it should not arrive with a navigation bar across the top and a
 * loading animation in front of it. A route group with its own root layout
 * would be the textbook answer and would mean moving every other route into a
 * second group to get it; this is one component and one condition.
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  return usePathname() === "/cv" ? null : <>{children}</>;
}
