import { IconType } from "react-icons";
import {
    FaBan, FaBolt, FaBurst, FaCloudBolt, FaDroplet, FaEye, FaEyeSlash, FaFeather, FaGaugeHigh, FaGhost, FaHandFist, FaHeartCrack,
    FaHeartPulse, FaHourglassHalf, FaPersonRunning, FaShield, FaShieldHalved, FaSkull, FaSnowflake, FaSunPlantWilt, FaVirus,
    FaWandMagicSparkles, FaWind,
} from "react-icons/fa6";

/*
 * Status effects and elements as the game shows them: colours from the HUD presets in
 * client/gameplay/ui/hud/effect/UIEffect.tscn and the orb ramps in client/gameplay/orb/Orb.tscn.
 * Effects without a HUD preset yet use colours derived from the nearest one.
 * Numbers come from client/gameplay/player/stats/ (Player.Effects.cs, Player.Life.cs, Player.Stats.cs, Player.Elements.cs).
 */

export type GameEffect = {
    id: string;
    name: string;
    /** Text the HUD shows. */
    hud: string;
    kind: "buff" | "debuff" | "form";
    icon: IconType;
    /** HUD bar colours, left to right; the bar fades out on the right like the game's. */
    stops: string[];
    /** Label colour (dark on light bars so it stays readable). */
    ink: string;
    text: string;
    /** "partial" / "planned": not fully in the game yet. */
    status?: "partial" | "planned";
};

const silver = ["#5A5A66", "#C4C4C4"];

export const effects: GameEffect[] = [
    { id: "heal", name: "Heal", hud: "Healing", kind: "buff", icon: FaHeartPulse, stops: ["#308A50", "#3FA862"], ink: "#FFFFFF", text: "Restores health every second." },
    { id: "agility", name: "Agility", hud: "Agility", kind: "buff", icon: FaFeather, stops: silver, ink: "#FFFFFF", text: "+10% movement speed and shorter cooldowns.", status: "partial" },
    { id: "swiftness", name: "Swiftness", hud: "Swiftness", kind: "buff", icon: FaWind, stops: silver, ink: "#FFFFFF", text: "Faster movement (Kenn's Signature II: +40%)." },
    { id: "power", name: "Power", hud: "Power", kind: "buff", icon: FaHandFist, stops: ["#B23A1F", "#FF7A45"], ink: "#FFFFFF", text: "+10% damage dealt." },
    { id: "shield", name: "Shield", hud: "Shield", kind: "buff", icon: FaShield, stops: ["#4D7FFF", "#A8C1FF"], ink: "#06164A", text: "An extra health bar that takes damage first." },
    { id: "redemption", name: "Redemption", hud: "Redemption", kind: "buff", icon: FaWandMagicSparkles, stops: ["#CC8E2B", "#FFD48F"], ink: "#3A2600", text: "Ignores the next attack that hits you.", status: "planned" },
    { id: "protection", name: "Protection", hud: "Protection", kind: "buff", icon: FaShieldHalved, stops: ["#CC8E2B", "#FFD48F", "#FFCB78"], ink: "#3A2600", text: "Invulnerable for the duration.", status: "partial" },
    { id: "invisibility", name: "Invisibility", hud: "Invisible", kind: "buff", icon: FaEyeSlash, stops: ["#212121", "#333333"], ink: "#ABABAB", text: "Enemies can't see you." },
    { id: "overdrive", name: "Overdrive", hud: "Overdrive", kind: "buff", icon: FaGaugeHigh, stops: ["#C15C0D", "#FDCD6B"], ink: "#FFFFFF", text: "Every stat maxed out, with Power and Agility.", status: "partial" },
    { id: "nullifying", name: "Nullifying", hud: "Nullifying", kind: "buff", icon: FaBan, stops: ["#8A5FCF", "#C9A0FF"], ink: "#1E0B40", text: "Immune to debuffs.", status: "planned" },

    { id: "bleed", name: "Bleed", hud: "Bleeding", kind: "debuff", icon: FaDroplet, stops: ["#FF4545", "#B02323"], ink: "#FFD9D9", text: "Loses health every second." },
    { id: "vulnerability", name: "Vulnerability", hud: "Vulnerable", kind: "debuff", icon: FaHeartCrack, stops: ["#5A1E1E", "#A83636"], ink: "#FFC8C8", text: "+20% damage taken." },
    { id: "slowness", name: "Slowness", hud: "Slowed", kind: "debuff", icon: FaSnowflake, stops: ["#363636", "#4A4A4A"], ink: "#C4C4C4", text: "Slower movement." },
    { id: "weakened", name: "Weakened", hud: "Weakened", kind: "debuff", icon: FaSunPlantWilt, stops: ["#3A3A4A", "#6E6E86"], ink: "#E0E0F0", text: "−20% damage dealt." },
    { id: "shattering", name: "Shattering", hud: "Shattered", kind: "debuff", icon: FaBurst, stops: ["#2A2A2A", "#5E5E5E"], ink: "#E0E0E0", text: "Stats drop to zero.", status: "planned" },
    { id: "impotence", name: "Impotence", hud: "Impotent", kind: "debuff", icon: FaSkull, stops: ["#1B1B60", "#541B60"], ink: "#C9B8FF", text: "Grounded, can't cast, −50% movement speed.", status: "partial" },
    { id: "lethargy", name: "Lethargy", hud: "Lethargic", kind: "debuff", icon: FaHourglassHalf, stops: ["#363636", "#7A7A7A"], ink: "#E0E0E0", text: "Haste stacks count for less.", status: "planned" },
    { id: "blindness", name: "Blindness", hud: "Blinded", kind: "debuff", icon: FaEye, stops: ["#141542", "#5478C7"], ink: "#B2D6FF", text: "Your view is blurred.", status: "planned" },
    { id: "decay", name: "Decay", hud: "Decaying", kind: "debuff", icon: FaVirus, stops: ["#2B3A1F", "#6B8A3A"], ink: "#D6E8B8", text: "−80% healing received.", status: "planned" },

    { id: "spectre", name: "Spectre", hud: "Spectre", kind: "form", icon: FaGhost, stops: ["#7A2B2B", "#C23434", "#D74F4F"], ink: "#FFE0E0", text: "Kenn's ultimate (30 s): his blades heal him, and each kill makes him invisible for 2 s." },
    { id: "stormwrath", name: "Stormwrath", hud: "Stormwrath", kind: "form", icon: FaCloudBolt, stops: ["#3A4A6A", "#7E9CC8"], ink: "#E6F0FF", text: "Masr's ultimate (30 s): his basic and alternate attacks bounce." },
];

export const effectGroups: { kind: GameEffect["kind"]; label: string }[] = [
    { kind: "buff", label: "Buffs" },
    { kind: "debuff", label: "Debuffs" },
    { kind: "form", label: "Rival forms" },
];

export type GameElement = {
    id: "lethality" | "vitality" | "haste";
    name: string;
    orbstone: string;
    icon: IconType;
    /** Orb shader colour ramp (Orb.tscn), dark to light. */
    ramp: string[];
    perStack: string;
    atTen: string;
};

export const elements: GameElement[] = [
    {
        id: "lethality", name: "Lethality", orbstone: "Red", icon: FaBolt,
        ramp: ["#700000", "#A30000", "#D72121", "#E46767", "#EC9797", "#FFD4D4"],
        perStack: "+2% damage dealt",
        atTen: "+20% damage",
    },
    {
        id: "vitality", name: "Vitality", orbstone: "Blue", icon: FaHeartPulse,
        ramp: ["#002894", "#4D7FFF", "#A8C1FF"],
        perStack: "−2.5% damage taken, +3% healing",
        atTen: "−25% damage taken, +30% healing",
    },
    {
        id: "haste", name: "Haste", orbstone: "White", icon: FaPersonRunning,
        ramp: ["#4B4B4B", "#A3A3A3", "#FFFFFF"],
        perStack: "−4% cooldowns, +2% speed",
        atTen: "−40% cooldowns, +20% speed",
    },
];
