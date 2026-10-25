import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaArrowUpRightFromSquare, FaBars, FaChevronDown, FaDownload, FaUser, FaXmark } from "react-icons/fa6";
import Icon from "@/assets/images/logo/icon/icon.webp";
import Logo from "@/assets/images/logo/logo.webp";
import { useAuth } from "@/contexts/AuthContext";
import NavMenu from "./NavMenu";
import { groupItems, isGroup, navGroups, navLinks, navOrder } from "./navigation";

/** Full-width top bar with dropdown menus (design.md § Navigation). */
export default function Navbar() {
    const router = useRouter();
    const { status, user } = useAuth();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [heroCtaVisible, setHeroCtaVisible] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const path = router.asPath.split(/[?#]/)[0];

    useEffect(() => { setOpenMenu(null); setSheetOpen(false); }, [router.asPath]);

    // Close menus on outside click and Esc.
    useEffect(() => {
        if (!openMenu && !sheetOpen) return;
        const onPointer = (event: PointerEvent) => { if (!navRef.current?.contains(event.target as Node)) { setOpenMenu(null); setSheetOpen(false); } };
        const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpenMenu(null); setSheetOpen(false); } };
        window.addEventListener("pointerdown", onPointer);
        window.addEventListener("keydown", onKey);
        return () => { window.removeEventListener("pointerdown", onPointer); window.removeEventListener("keydown", onKey); };
    }, [openMenu, sheetOpen]);

    // One ember action per viewport: hide the nav Play button while the landing hero's Play is on screen.
    useEffect(() => {
        const heroCta = document.getElementById("hero-cta");
        if (!heroCta) { setHeroCtaVisible(false); return; }
        const observer = new IntersectionObserver(([entry]) => setHeroCtaVisible(entry.isIntersecting), { threshold: 0.1 });
        observer.observe(heroCta);
        return () => observer.disconnect();
    }, [router.asPath]);

    const groupActive = (id: string) => {
        const group = navGroups.find(item => item.id === id)!;
        // "/wiki" (Game guide) only counts on its own page, so rival pages light up Rivals, not Discover.
        return groupItems(group).some(item => !item.external && (path === item.href || (item.href !== "/wiki" && path.startsWith(item.href + "/"))));
    };

    const account = status === "signed-in"
        ? <Link href="/account" aria-label="Your account" className="button is-sm inline-flex items-center gap-2 px-4 text-base !min-h-[44px]">
            <FaUser aria-hidden /> <span className="hidden sm:inline max-w-[8rem] truncate">{user?.playerName ?? user?.username}</span>
        </Link>
        : status === "signed-out"
            ? <Link href={{ pathname: "/portal/login", query: path.startsWith("/portal") ? {} : { next: router.asPath } }}
                className="button is-sm inline-flex items-center px-5 text-base !min-h-[44px]">Sign in</Link>
            : <span className="w-24" aria-hidden />;

    const play = <Link href="/download"
        className={`button main is-sm inline-flex items-center gap-2 px-5 text-base !min-h-[44px] transition-opacity duration-200 ${heroCtaVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        aria-hidden={heroCtaVisible || undefined} tabIndex={heroCtaVisible ? -1 : undefined}>
        <FaDownload aria-hidden /> Play now
    </Link>;

    return <nav ref={navRef} aria-label="Main" className="fixed top-0 inset-x-0 z-nav p-2 flex flex-col pointer-events-none">
        <div className="pointer-events-auto glass-strong !bg-paper/90 w-full h-[80px] px-3 md:px-5 flex items-center gap-2">
            {/* Brand lockup: R emblem + the real logo artwork (not typed text). In logo.webp the letters fill rows
                24–134 of 184 (60% of the height, centred at 43%); the dagger hangs below. At 48px the letters are 29px
                tall, so the emblem is 29px, and the artwork drops 3px so the letters' centre meets the emblem's. */}
            <Link href="/" className="shrink-0 flex items-center gap-2.5 pr-2" aria-label="Rivalium home">
                <Image className="h-[29px] w-auto" src={Icon} alt="" priority />
                <Image className="h-12 w-auto translate-y-[3px] hidden sm:block drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)]" src={Logo} alt="Rivalium" priority />
            </Link>
            <div className="hidden lg:flex flex-1 justify-center items-stretch h-full">
                {navOrder.map(entry => {
                    if (isGroup(entry)) { const group = entry; return <NavMenu key={group.id} group={group} active={groupActive(group.id)}
                        open={openMenu === group.id} onOpenChange={open => setOpenMenu(open ? group.id : (openMenu === group.id ? null : openMenu))} />; }
                    const link = entry;
                    const active = !link.external && (path === link.href || path.startsWith(link.href + "/"));
                    const className = `relative h-full inline-flex items-center gap-1.5 px-3 xl:px-4 label-caps caps-nav whitespace-nowrap transition-colors
                        ${active ? "text-ink" : "text-ice hover:text-ink"}
                        after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[3px] after:rounded-full after:bg-frost after:transition-transform after:duration-200
                        ${active ? "after:scale-x-100" : "after:scale-x-0"}`;
                    return link.external
                        ? <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={className}>{link.label}<FaArrowUpRightFromSquare aria-hidden className="text-[10px] opacity-70" /></a>
                        : <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={className}>{link.label}</Link>;
                })}
            </div>
            <div className="flex flex-1 lg:flex-none justify-end items-center gap-2">
                {play}
                {account}
                <button type="button" className="lg:hidden grid place-items-center w-11 h-11 rounded-full text-ice hover:bg-ice/10"
                    aria-expanded={sheetOpen} aria-controls="mobile-nav" aria-label={sheetOpen ? "Close menu" : "Open menu"} onClick={() => setSheetOpen(value => !value)}>
                    {sheetOpen ? <FaXmark /> : <FaBars />}
                </button>
            </div>
        </div>

        {sheetOpen && <div id="mobile-nav" className="lg:hidden pointer-events-auto glass-raised rounded-xl mt-2 p-2 w-full max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin text-left fade-in">
            {navGroups.map(group => <details key={group.id} className="group border-b border-ice/10 last:border-0" open={groupActive(group.id)}>
                <summary className="list-none flex items-center justify-between min-h-[52px] px-3 label-caps caps-lg text-ink cursor-pointer">
                    {group.label} <FaChevronDown aria-hidden className="text-xs transition-transform group-open:rotate-180" />
                </summary>
                <ul className="pb-2">
                    {groupItems(group).map(item => <li key={item.href}>
                        <a href={item.href} target={item.external && item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                            className="flex items-center gap-3 min-h-[48px] px-3 rounded-xl hover:bg-paper-4">
                            {item.icon && <item.icon aria-hidden className="text-frost shrink-0" />}
                            <span className="font-body text-ink-2">{item.label}</span>
                        </a>
                    </li>)}
                </ul>
            </details>)}
            <ul className="pt-1">
                {navLinks.map(link => <li key={link.href}>
                    <a href={link.href} target={link.external ? "_blank" : undefined} rel="noreferrer"
                        className="flex items-center justify-between min-h-[52px] px-3 rounded-xl label-caps caps-lg text-ink hover:bg-paper-4">
                        {link.label}{link.external && <FaArrowUpRightFromSquare aria-hidden className="text-xs opacity-70" />}
                    </a>
                </li>)}
            </ul>
        </div>}
    </nav>;
}
