import * as icons from "./icons";

/**
 * One of the site's own icons, chosen by name from content.
 *
 * Content files are data and cannot hold a React component, so they name the
 * icon they want and this resolves it. Returns null on an unknown name rather
 * than throwing: a missing icon should cost a page an icon, not the page.
 */
const REGISTRY = {
  book: icons.Book,
  calendar: icons.Calendar,
  globe: icons.Globe,
  sparkle: icons.Sparkle,
  compass: icons.Compass,
  layers: icons.Layers,
  ranking: icons.Ranking,
  flame: icons.Flame,
  letterform: icons.Letterform,
  cache: icons.Cache,
  bell: icons.Bell,
  terminal: icons.Terminal,
  camera: icons.Camera,
  boot: icons.Boot,
  document: icons.Document,
  cap: icons.Cap,
  play: icons.Play,
} as const;

export type UiIconName = keyof typeof REGISTRY;

export function UiIcon({
  name,
  size = 16,
  className,
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  const Icon = name ? REGISTRY[name as UiIconName] : undefined;
  return Icon ? <Icon size={size} className={className} /> : null;
}
