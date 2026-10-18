import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Menu entry. The active section gets a frost underline (shape, not just color) so you always know
 * where you are, like the selected tab in the game lobby.
 */
export default function NavbarButton({ text, href, disabled, blank, block }: { text: string; href: string; disabled?: boolean; blank?: boolean; block?: boolean }) {
    const router = useRouter();
    const path = router.asPath.split(/[?#]/)[0];
    const selected = !blank && (href === "/" ? path === "/" : path === href || path.startsWith(href.replace(/\/$/, "") + "/"))
        // "Rivals" owns /wiki/rivals; keep "Wiki" from lighting up there too.
        && !(href === "/wiki" && path.startsWith("/wiki/rivals"));

    const base = "label-caps transition-colors";
    const className = block
        ? `${base} flex items-center min-h-[48px] px-4 rounded-md text-base ${selected ? "bg-frost/15 text-ink" : "text-ice hover:bg-ice/10 hover:text-ink"}`
        : `${base} relative h-full inline-flex items-center px-3 xl:px-4 text-sm xl:text-base ${selected ? "text-ink" : "text-ice/85 hover:text-ink"}
           after:absolute after:left-3 after:right-3 after:bottom-0 after:h-[3px] after:rounded-full after:bg-frost after:transition-transform after:duration-200 after:origin-center
           ${selected ? "after:scale-x-100 after:shadow-[0_0_12px_rgba(150,189,255,.8)]" : "after:scale-x-0 hover:after:scale-x-50"}`;

    if (blank) return <a href={href} target="_blank" rel="noreferrer" className={className}>{text}</a>;
    return <Link href={href} aria-current={selected ? "page" : undefined} aria-disabled={disabled || undefined}
        className={`${className} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>{text}</Link>;
}
