/**
 * A player's #tag, set in the logo face (Motion Control) in the client's tag orange, everywhere a name shows a tag.
 * Mirrors the client's tag labels (UiType.LogoFont, #FFB85C).
 */
export default function PlayerTag({ tag, className = "" }: { tag?: string | null; className?: string }) {
    if (!tag) return null;
    return <span className={`font-display italic tracking-wide text-[#ffb85c] ${className}`}>#{tag}</span>;
}
