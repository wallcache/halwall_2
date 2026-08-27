import styles from "./Jellyfish.module.css";

/**
 * The site's mark, drawn as a mask rather than as a picture.
 *
 * The source is a white silhouette on transparency, and the header adopts a
 * whole palette per side: dark ground on the verso, cream on the recto. An
 * <img> would be a white jellyfish on cream paper the moment you opened the
 * Canon. Masking `currentColor` instead means the mark is inked by whichever
 * side is showing, and it can take the accent on hover for free.
 *
 * Decorative in both of its homes -- the header link already names itself for
 * a screen reader and the footer row says the name in text -- so it is hidden
 * from the accessibility tree rather than given a label nobody needs twice.
 *
 * Size comes from `--mark-size`, set by the module that places it. Not a prop:
 * a prop would have to arrive as an inline style, which outranks a class and
 * would make the phone-width override in the header impossible.
 */
export function Jellyfish({ className }: { className?: string }) {
  return <span aria-hidden className={`${styles.mark} ${className ?? ""}`} />;
}
