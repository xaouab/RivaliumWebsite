import Link from "next/link";
import { KeyboardEvent, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { NavGroup } from "./navigation";

type Props = {
    group: NavGroup;
    open: boolean;
    active: boolean;
    onOpenChange: (open: boolean) => void;
};

/**
 * Disclosure menu for the nav pill. Click / Enter / Space / ArrowDown opens; Esc closes and returns
 * focus to the trigger; arrows move between items; hover opens after a short intent delay on mouse.
 * The panel grows from its trigger (transform-origin top) and never blocks input while animating.
 */
export default function NavMenu({ group, open, active, onOpenChange }: Props) {
    const trigger = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const hoverTimer = useRef<number>();

    const items = () => Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("a[data-menu-item]") ?? []);

    useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

    const close = (refocus = false) => {
        onOpenChange(false);
        if (refocus) trigger.current?.focus();
    };

    const onTriggerKey = (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            onOpenChange(true);
            requestAnimationFrame(() => items()[0]?.focus());
        }
    };

    const onPanelKey = (event: KeyboardEvent) => {
        const list = items();
        const index = list.indexOf(document.activeElement as HTMLAnchorElement);
        if (event.key === "Escape") { event.preventDefault(); close(true); }
        else if (event.key === "ArrowDown") { event.preventDefault(); list[(index + 1) % list.length]?.focus(); }
        else if (event.key === "ArrowUp") { event.preventDefault(); list[(index - 1 + list.length) % list.length]?.focus(); }
        else if (event.key === "Home") { event.preventDefault(); list[0]?.focus(); }
        else if (event.key === "End") { event.preventDefault(); list[list.length - 1]?.focus(); }
        else if (event.key === "Tab") onOpenChange(false);
    };

    // Hover intent only for real mice; touch uses the click path.
    const hover = (next: boolean) => (event: React.PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => onOpenChange(next), next ? 120 : 220);
    };

    return <div className="relative h-full" onPointerEnter={hover(true)} onPointerLeave={hover(false)}>
        <button
            ref={trigger}
            type="button"
            aria-expanded={open}
            aria-controls={`menu-${group.id}`}
            onClick={() => onOpenChange(!open)}
            onKeyDown={onTriggerKey}
            className={`relative h-full inline-flex items-center gap-1.5 px-3 xl:px-4 label-caps text-[15px] whitespace-nowrap transition-colors
                ${open || active ? "text-ink" : "text-ice hover:text-ink"}
                after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[3px] after:rounded-full after:bg-frost after:transition-transform after:duration-200
                ${active ? "after:scale-x-100" : "after:scale-x-0"}`}
        >
            {group.label}
            <FaChevronDown aria-hidden className={`text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>

        <div
            ref={panel}
            id={`menu-${group.id}`}
            onKeyDown={onPanelKey}
            className={`absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 w-[22rem] origin-top glass-overlay !bg-paper-3/95 rounded-2xl p-2 text-left z-menu
                transition-[opacity,transform] ${open ? "opacity-100 scale-100 duration-200 ease-brand" : "opacity-0 scale-95 pointer-events-none duration-150"}`}
            aria-hidden={!open}
        >
            <ul className="flex flex-col">
                {group.items.map(item => {
                    const content = <>
                        {item.icon && <span className="grid place-items-center w-10 h-10 shrink-0 rounded-lg bg-paper text-frost"><item.icon aria-hidden /></span>}
                        <span className="flex flex-col min-w-0">
                            <span className="label-caps text-sm text-ink">{item.label}</span>
                            {item.description && <span className="font-body text-sm text-ink-2 leading-snug">{item.description}</span>}
                        </span>
                    </>;
                    const className = "flex items-center gap-3 rounded-xl px-3 py-2.5 min-h-[56px] hover:bg-paper-4 focus-visible:bg-paper-4 transition-colors";
                    return <li key={item.href}>
                        {item.external
                            ? <a data-menu-item tabIndex={open ? 0 : -1} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={className} onClick={() => close()}>{content}</a>
                            : <Link data-menu-item tabIndex={open ? 0 : -1} href={item.href} className={className} onClick={() => close()}>{content}</Link>}
                    </li>;
                })}
            </ul>
        </div>
    </div>;
}
