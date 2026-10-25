import { useSyncExternalStore } from "react";

/*
 * Cookie and storage consent (GDPR / ePrivacy, CNIL guidance): nothing optional runs before a choice,
 * refusing is as easy as accepting, choices last 6 months, and a policy change asks again.
 * Gate any optional script on `hasConsent("analytics")` / `useConsent()`.
 */

export type ConsentCategory = "essential" | "preferences" | "analytics" | "marketing";
export type ConsentChoices = Record<Exclude<ConsentCategory, "essential">, boolean>;
export type ConsentRecord = ConsentChoices & { version: number; decidedAt: string };

/** Bump when the categories or their purposes change: everyone is asked again. */
export const CONSENT_VERSION = 1;
const KEY = "rivalium.consent";
const COOKIE = "rivalium_consent";
const MAX_AGE_DAYS = 182;
const OPEN_EVENT = "rivalium:open-cookie-settings";

export const consentCategories: { id: ConsentCategory; label: string; text: string; examples: string; locked?: boolean }[] = [
    {
        id: "essential",
        label: "Essential",
        text: "Keep you signed in, protect forms from bots and remember this choice. The site can't work without them.",
        examples: "rivalium.webToken (sign-in, local storage), rivalium_consent (this choice, 6 months)",
        locked: true,
    },
    {
        id: "preferences",
        label: "Preferences",
        text: "Remember interface choices such as filters, open sections and the operating system on the download page.",
        examples: "Local storage on this device only",
    },
    {
        id: "analytics",
        label: "Analytics",
        text: "Count visits and see which pages help players, so we can improve the wiki and the site. Aggregated, never sold.",
        examples: "None in use today. Turned on only if we add a privacy-friendly analytics tool.",
    },
    {
        id: "marketing",
        label: "Marketing",
        text: "Measure campaigns and show Rivalium ads on other sites.",
        examples: "None in use today.",
    },
];

const listeners = new Set<() => void>();
let cached: ConsentRecord | null | undefined;

function read(): ConsentRecord | null {
    try {
        const raw = window.localStorage.getItem(KEY) ?? decodeURIComponent(document.cookie.split("; ").find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) ?? "");
        if (!raw) return null;
        const record = JSON.parse(raw) as ConsentRecord;
        const expired = Date.now() - new Date(record.decidedAt).getTime() > MAX_AGE_DAYS * 864e5;
        return record.version === CONSENT_VERSION && !expired ? record : null;
    } catch {
        return null;
    }
}

export function getConsent(): ConsentRecord | null {
    if (typeof window === "undefined") return null;
    if (cached === undefined) cached = read();
    return cached;
}

export function saveConsent(choices: ConsentChoices) {
    const record: ConsentRecord = { ...choices, version: CONSENT_VERSION, decidedAt: new Date().toISOString() };
    const raw = JSON.stringify(record);
    try { window.localStorage.setItem(KEY, raw); } catch { /* storage blocked: the cookie still carries it */ }
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${encodeURIComponent(raw)}; Max-Age=${MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
    // Withdrawn consent: clear what that category may have stored.
    if (!choices.preferences) {
        try { Object.keys(window.localStorage).filter(key => key.startsWith("rivalium.pref.")).forEach(key => window.localStorage.removeItem(key)); } catch { /* nothing to clear */ }
    }
    cached = record;
    listeners.forEach(listener => listener());
}

export const hasConsent = (category: ConsentCategory) => category === "essential" || Boolean(getConsent()?.[category]);

/** Browsers sending Global Privacy Control get every optional category pre-set to off. */
export const prefersPrivacy = () => typeof navigator !== "undefined" && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

export function openCookieSettings() { window.dispatchEvent(new Event(OPEN_EVENT)); }
export function onOpenCookieSettings(handler: () => void) {
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
}

const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

/** Current consent; `undefined` while rendering on the server, `null` until the visitor chooses. */
export function useConsent(): ConsentRecord | null | undefined {
    return useSyncExternalStore(subscribe, getConsent, () => undefined);
}
