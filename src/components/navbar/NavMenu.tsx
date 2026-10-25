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
            className={`relative h-full inline-flex items-center gap-1.5 px-3 xl:px-4 label-caps caps-nav whitespace-nowrap transition-colors
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
            className={`absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 origin-top glass-overlay !bg-paper-3/95 p-1.5 text-left z-menu flex gap-1
                transition-[opacity,transform] ${open ? "opacity-100 translate-y-0 duration-200 ease-brand" : "opacity-0 -translate-y-1 pointer-events-none duration-150"}`}
            aria-hidden={!open}
        >
            {group.sections.map((section, index) => <div key={section.label ?? index} className={`flex flex-col w-48 ${index > 0 ? "border-l border-ice/10 pl-1" : ""}`}>
                {section.label && <p className="label-caps caps-sm text-ink-3 px-2 pt-1 pb-0.5">{section.label}</p>}
                <ul className="flex flex-col">
                    {section.items.map(item => {
                        const content = <>
                            {item.image
                                ? <img src={item.image} alt="" width={20} height={20} className="w-[18px] h-[18px] shrink-0 [image-rendering:pixelated] border" style={{ borderColor: item.accent ?? "transparent" }} />
                                : item.icon ? <item.icon aria-hidden className="w-[18px] shrink-0 text-[12px] text-frost" /> : <span className="w-[18px] shrink-0" />}
                            <span className="label-caps caps-md text-ink-2 group-hover/item:text-ink truncate">{item.label}</span>
                        </>;
                        const className = "group/item flex items-center gap-2 px-2 h-8 hover:bg-paper-4 focus-visible:bg-paper-4 transition-colors";
                        return <li key={item.href}>
                            {item.external
                                ? <a data-menu-item tabIndex={open ? 0 : -1} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={className} onClick={() => close()}>{content}</a>
                                : <Link data-menu-item tabIndex={open ? 0 : -1} href={item.href} className={className} onClick={() => close()}>{content}</Link>}
                        </li>;
                    })}
                </ul>
            </div>)}
        </div>
    </div>;
}
