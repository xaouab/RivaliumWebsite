import { IconType } from "react-icons";
import {
    FaBolt, FaBook, FaCircleDot, FaCoins, FaDesktop, FaFileContract, FaFlag, FaGem, FaHeadset, FaKeyboard,
    FaLayerGroup, FaMedal, FaPersonRunning, FaShieldHalved, FaUserGear, FaUsers, FaWandMagicSparkles,
} from "react-icons/fa6";
import { rivalAvatar, rivals } from "@/data/rivals";

export type NavLink = { label: string; href: string; icon?: IconType; image?: string; accent?: string; external?: boolean };
export type NavSection = { label?: string; items: NavLink[] };
export type NavGroup = { id: string; label: string; href?: string; sections: NavSection[] };

/**
 * Site navigation: compact dropdowns (label + small icon, no descriptions) and plain links.
 * Only destinations that exist are listed — no leaderboard or server status until the account server exposes them.
 */
export const navGroups: NavGroup[] = [
    // Naming follows AAA game sites (LoL "Game Overview / Champions", Valorant "Game Info / Agents",
    // Overwatch "Game Info / Heroes"): the roster gets its own entry, rules and systems live under Game Info,
    // and the wiki home is the "Game guide" inside it rather than a separate button.
    {
        id: "game-info",
        label: "Game Info",
        href: "/wiki",
        sections: [
            {
                label: "How to play",
                items: [
                    { label: "Game guide", href: "/wiki", icon: FaBook },
                    { label: "How a match works", href: "/wiki/gameplay/match-flow", icon: FaFlag },
                    { label: "The gem", href: "/wiki/gameplay/gem", icon: FaGem },
                    { label: "Ranks", href: "/wiki/gameplay/ranked", icon: FaMedal },
                    { label: "Controls", href: "/wiki/gameplay/controls", icon: FaKeyboard },
                ],
            },
            {
                label: "Mechanics",
                items: [
                    { label: "Movement", href: "/wiki/mechanics/movement", icon: FaPersonRunning },
                    { label: "Abilities", href: "/wiki/mechanics/abilities", icon: FaBolt },
                    { label: "Effects", href: "/wiki/mechanics/status-effects", icon: FaWandMagicSparkles },
                    { label: "Orbs", href: "/wiki/mechanics/orbs", icon: FaCircleDot },
                    { label: "Permanent orbs", href: "/wiki/mechanics/permanent-orbs", icon: FaLayerGroup },
                    { label: "Orbstones", href: "/wiki/mechanics/orbstones", icon: FaGem },
                    { label: "Economy", href: "/wiki/mechanics/economy", icon: FaCoins },
                ],
            },
        ],
    },
    {
        id: "rivals",
        label: "Rivals",
        href: "/wiki/rivals",
        sections: [{
            items: [
                ...rivals.map(rival => ({ label: rival.name, href: `/wiki/rivals/${rival.id}`, image: rivalAvatar(rival.id), accent: rival.archetype_color })),
                { label: "All rivals", href: "/wiki/rivals", icon: FaUsers },
            ],
        }],
    },
    {
        id: "support",
        label: "Support",
        href: "/support",
        sections: [{
            items: [
                { label: "Help & contact", href: "/support", icon: FaHeadset },
                { label: "Account support", href: "/account/support", icon: FaUserGear },
                { label: "System requirements", href: "/download#requirements", icon: FaDesktop },
                { label: "Terms", href: "/legal/terms", icon: FaFileContract },
                { label: "Privacy", href: "/legal/privacy", icon: FaShieldHalved },
            ],
        }],
    },
];

/** Plain top-level links, shown after the menus. */
export const navLinks: NavLink[] = [
    { label: "Patch notes", href: "/patch-notes" },
    { label: "Discord", href: "https://discord.rivalium.online", external: true },
];

export const groupItems = (group: NavGroup) => group.sections.flatMap(section => section.items);

/** Desktop bar order: menus and links interleaved. */
export const navOrder: (NavGroup | NavLink)[] = [navGroups[0], navGroups[1], navLinks[0], navGroups[2], navLinks[1]];
export const isGroup = (entry: NavGroup | NavLink): entry is NavGroup => "sections" in entry;
