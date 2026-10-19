import Link from "next/link";
import { MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";
import Spinner from "@/components/ui/Spinner";

interface ButtonProps {
    /** main = ember primary (one per view). Default / secondary / frost = frost secondary. no-back = ghost. See docs/buttons in .ai. */
    type?: 'main' | 'secondary' | 'frost' | 'no-back' | 'premium';
    content?: string;
    Icon?: IconType;
    small?: boolean;
    big?: boolean;
    disabled?: boolean;
    loading?: boolean;
    /** Renders a link styled as a button. */
    href?: string;
    external?: boolean;
    submit?: boolean;
    className?: string;
    ariaLabel?: string;
    /** Thin offset frame for the single hero call to action. */
    framed?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ type, onClick, content, small, big, disabled, loading, Icon, href, external, submit, className = "", ariaLabel, framed }: ButtonProps) {

    const inactive = disabled || loading;
    // Size ladder (design.md § Buttons): default 48px, small 40px (dense rows only), big 60px.
    // `main` adds its own 56px floor so the primary action is always the largest thing in its row.
    // One step up from the body ladder (owner: buttons a bit bigger, all in the display face).
    let size = "text-lg md:text-xl px-7 py-2.5";
    if (small) size = "is-sm text-base px-5 py-2";
    if (big) size = "is-lg text-xl md:text-2xl px-9 md:px-11 py-3";
    if (framed) size += " is-framed";

    const classes = `inline-flex items-center gap-2 button ${disabled ? "" : type ?? ""} ${size} ${className}`;
    const inner = <>
        {loading ? <Spinner /> : Icon && <Icon aria-hidden />}
        {content && <span>{content}</span>}
    </>;

    if (href && !inactive) {
        return external
            ? <a className={classes} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>{inner}</a>
            : <Link className={classes} href={href} aria-label={ariaLabel}>{inner}</Link>;
    }

    return <button
        className={classes}
        type={submit ? "submit" : "button"}
        onClick={onClick}
        disabled={inactive}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
    >
        {inner}
    </button>;
}
