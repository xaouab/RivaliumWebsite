import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaEnvelope, FaInstagram } from "react-icons/fa6";
import Icon from "@/assets/images/logo/icon/icon.webp";
import { openCookieSettings } from "@/lib/consent";

const groups = [
    { title: "Game", links: [["Download", "/download"], ["Rivals", "/wiki/rivals"], ["Wiki", "/wiki"], ["Patch notes", "/patch-notes"]] },
    { title: "Account", links: [["Sign in", "/portal/login"], ["Create an account", "/portal/register"], ["Your account", "/account"], ["Purchases", "/account/purchases"]] },
    { title: "Help", links: [["Support", "/support"], ["Terms of Service", "/legal/terms"], ["Privacy Notice", "/legal/privacy"]] },
];

const socials = [
    { href: "https://discord.rivalium.online", label: "Discord", icon: FaDiscord },
    { href: "https://instagram.com/rivaliumgame", label: "Instagram", icon: FaInstagram },
    { href: "mailto:support@rivalium.online", label: "Email support", icon: FaEnvelope },
];

export default function Footer() {
    return <footer className="w-full mt-16 border-t border-ice/10 bg-paper/90 backdrop-blur-md text-left">
        <div className="max-w-7xl mx-auto px-5 py-12 grid gap-10 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
            <div className="flex flex-col gap-4">
                {/* Same lockup as the navbar: emblem exactly as tall as the wordmark's letters (0.685em with the 118% size-adjust). */}
                <Link href="/" className="flex items-center gap-[0.25em] w-fit text-[28px]" aria-label="Rivalium home">
                    <Image src={Icon} alt="" className="h-[0.64em] w-auto" />
                    <span className="display leading-none text-gradient">Rivalium</span>
                </Link>
                <p className="font-body text-sm text-ink-2 max-w-xs">
                    A competitive 2.5D arena platformer by Kaura Interactive. Master your rivals, take the gem, climb the ranks.
                </p>
                <div className="flex gap-2">
                    {socials.map(item => <a key={item.label} href={item.href} aria-label={item.label} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                        className="grid place-items-center w-11 h-11 rounded-full border border-ice/20 text-ice hover:text-ink hover:border-ice/60 hover:bg-ice/10 transition-colors">
                        <item.icon aria-hidden />
                    </a>)}
                </div>
            </div>
            {groups.map(group => <nav key={group.title} aria-label={group.title}>
                <h2 className="label-caps caps-md text-ice mb-3">{group.title}</h2>
                <ul className="flex flex-col gap-2.5 font-body text-sm">
                    {group.links.map(([label, href]) => <li key={href}>
                        <Link href={href} className="text-ink-2 hover:text-ink transition-colors whitespace-nowrap">{label}</Link>
                    </li>)}
                    {group.title === "Help" && <li>
                        <button type="button" onClick={openCookieSettings} className="text-ink-2 hover:text-ink transition-colors whitespace-nowrap">Cookie settings</button>
                    </li>}
                </ul>
            </nav>)}
        </div>
        <div className="border-t border-ice/10">
            <p className="max-w-7xl mx-auto px-5 py-5 font-body text-sm text-ink-3">
                © {new Date().getFullYear()} Kaura Interactive. Rivalium and its logo are trademarks of Kaura Interactive.
            </p>
        </div>
    </footer>;
}
