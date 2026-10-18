import { IconType } from "react-icons";
import { FaBook, FaBolt, FaGamepad, FaKeyboard, FaMedal, FaUsers } from "react-icons/fa6";

export type NavLink = { label: string; href: string; description?: string; icon?: IconType; external?: boolean };
export type NavGroup = { id: string; label: string; href?: string; items: NavLink[] };

/**
 * Site navigation. Only destinations that exist are listed — no leaderboard or server status
 * until the account server exposes them. Mirrors design.md § Navigation.
 */
export const navGroups: NavGroup[] = [
    {
        id: "game",
        label: "Game",
        href: "/wiki",
        items: [
            { label: "Rivals", href: "/wiki/rivals", description: "Every rival, their kit and how to play them.", icon: FaUsers },
            { label: "Gameplay", href: "/wiki/gameplay", description: "Rounds, the gem, ranks and controls.", icon: FaGamepad },
            { label: "Mechanics", href: "/wiki/mechanics", description: "Movement, abilities, effects, orbstones, economy.", icon: FaBolt },
            { label: "Ranks", href: "/wiki/gameplay/ranked", description: "From Unranked to Grandrival.", icon: FaMedal },
            { label: "Controls", href: "/wiki/gameplay/controls", description: "Default keys and rebinding.", icon: FaKeyboard },
            { label: "Wiki home", href: "/wiki", description: "The full game guide.", icon: FaBook },
        ],
    },
];

/** Plain top-level links (reference sites keep only the game catalogue as a menu). */
export const navLinks: NavLink[] = [
    { label: "Patch notes", href: "/patch-notes" },
    { label: "Support", href: "/support" },
    { label: "Discord", href: "https://discord.rivalium.online", external: true },
];
