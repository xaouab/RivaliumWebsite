import data from "./rivals.json";

// rivals.json is generated from the game client's lobby data (`pnpm sync:rivals`); don't edit it by hand.

export type AbilitySlot = "basic" | "alternate" | "signature_i" | "signature_ii" | "ultimate";

export type Ability = {
    slot: AbilitySlot;
    name: string;
    type?: string;
    duration?: string;
    charges?: string;
    description_markdown: string;
};

export type Rival = {
    id: string;
    name: string;
    title: string;
    archetype: string;
    archetype_color: string;
    description_markdown: string;
    stats: { base_speed: number; health: number; ultimate_charge: number };
    abilities: Ability[];
};

export const rivals: Rival[] = (data as { rivals: Rival[] }).rivals;

export function getRival(id: string) {
    return rivals.find(rival => rival.id === id) ?? null;
}

/** Default bindings from the client's project.godot input map; players can rebind them in Settings. */
export const slotLabels: Record<AbilitySlot, { name: string; key: string }> = {
    basic: { name: "Basic", key: "LMB" },
    alternate: { name: "Alternate", key: "RMB" },
    signature_i: { name: "Signature I", key: "Q" },
    signature_ii: { name: "Signature II", key: "E" },
    ultimate: { name: "Ultimate", key: "X" },
};

/** The rival's in-game portrait (client gameplay/character/rivals/<id>/Avatar.png, 128px pixel art). */
export const rivalAvatar = (id: string) => `/images/rivals/${id}/avatar.png`;
export const abilityIcon = (rivalId: string, slot: AbilitySlot) => `/images/rivals/${rivalId}/${slot}.png`;

/** Video asset ids for the wiki placeholders; drop files at /videos/<id>.mp4 and set `src`. */
export const rivalVideoId = (rivalId: string, slot?: AbilitySlot) => slot ? `rivals/${rivalId}/${slot}` : `rivals/${rivalId}/overview`;

/** Values that are "N/A" in the data aren't worth showing. */
export const present = (value?: string) => value && value.trim().toUpperCase() !== "N/A" ? value : undefined;
