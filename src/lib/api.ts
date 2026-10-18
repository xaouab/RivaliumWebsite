import { apiUrl } from "@/components/constant";

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

const TOKEN_KEY = "rivalium.webToken";

/** Browser storage can be missing or throw (private mode, blocked storage); callers treat it as best-effort. */
export const tokenStore = {
    get(): string | null {
        try { return window.localStorage.getItem(TOKEN_KEY); } catch { return null; }
    },
    set(token: string) {
        try { window.localStorage.setItem(TOKEN_KEY, token); } catch { /* session-only sign-in */ }
    },
    clear() {
        try { window.localStorage.removeItem(TOKEN_KEY); } catch { /* nothing to clear */ }
    },
};

type Options = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string | null;
    query?: Record<string, string | number | undefined>;
    signal?: AbortSignal;
};

/** JSON request to the account server. Throws `ApiError` with the server's message on non-2xx. */
export async function api<T = any>(path: string, { method = "GET", body, token, query, signal }: Options = {}): Promise<T> {
    const url = new URL(apiUrl + path);
    for (const [key, value] of Object.entries(query ?? {})) {
        if (value !== undefined) url.searchParams.set(key, String(value));
    }

    let response: Response;
    try {
        response = await fetch(url, {
            method,
            signal,
            headers: {
                ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        if ((error as Error).name === "AbortError") throw error;
        throw new ApiError(0, "Can't reach the Rivalium servers. Check your connection and try again.");
    }

    if (response.status === 204) return undefined as T;

    let data: any = null;
    try { data = await response.json(); } catch { /* empty or non-JSON body */ }

    if (!response.ok) {
        const message = data?.message ?? (response.status === 429
            ? "Too many attempts, please wait a few minutes."
            : "Something went wrong on our side. Please try again.");
        throw new ApiError(response.status, message);
    }
    return data as T;
}

// ---- Shapes returned by the account server (accounts/src/components/user/User.ts) ----

export type Currency = { gold?: number; amethyst?: number; rivalite?: number };

export type WebUser = {
    id: string;
    username: string;
    email: string;
    confirmed: boolean;
    createdAt: number;
    playerName?: string;
    playerTag?: string;
    title?: string;
    rank?: { tier?: number; division?: number; rating?: number };
    skill?: { tier?: number; XP?: number; maxXP?: number; mmr?: number };
    currency?: Currency;
    inventory?: Record<string, number[]>;
    wardrobe?: Record<string, number>;
    battlePass?: { season?: number; xp?: number; tier?: number; premium?: boolean };
    lootBoxes?: { definitionId: string; quantity: number }[];
    status?: number;
    deletionRequestedAt?: number | null;
};

export type AccountSettings = {
    id: string;
    username: string;
    email: string;
    confirmed: boolean;
    createdAt: number;
    lastLoginAt?: number | null;
    playerName?: string;
    playerTag?: string;
    title?: string;
    consent: { email: boolean; marketing: boolean; ToS: boolean };
    personalInformation: {
        firstName: string; lastName: string; birthDate: string;
        country: string; city: string; address: string; postalCode: string;
    };
    deletionRequestedAt?: number | null;
};

export type Transaction = {
    id: string;
    kind: "shop.purchase" | "battlepass.premium" | "giftcode.redeem" | "loot.open" | "currency.convert" | "admin.adjust";
    description?: string;
    category?: string;
    itemId?: string;
    spent: { currency: string; amount: number }[];
    gained: { type?: string; currency?: string; amount?: number; category?: string; itemId?: number; name?: string }[];
    createdAt: number;
};

export type MatchEntry = {
    id: string;
    type: number;
    endedAt: number;
    result: "WIN" | "LOSS" | "DRAW";
    yourScore: number;
    opponentScore: number;
    opponents: { id: string; playerName?: string; playerTag?: string }[];
    yourStats: { kills: number; deaths: number; assists: number; gemsPlanted: number; damageDone: number; damageTaken: number };
};
