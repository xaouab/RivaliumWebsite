// Display helpers for game data returned by the account server.
// Enum orders mirror accounts/src/enums/RankTier.ts and accounts/src/components/match/MatchTypes.ts.

export const rankTiers = ["Unranked", "Bronze", "Silver", "Gold", "Platinum", "Amber", "Diamond", "Sentinel", "Mercenary", "Grandrival"];
export const rankName = (tier?: number) => rankTiers[tier ?? 0] ?? "Unranked";
export const rankIcon = (tier?: number) => `/images/ranks/${rankName(tier).toLowerCase()}.png`;

export const matchTypes = ["Casual", "Ranked", "Training"];
export const matchTypeName = (type?: number) => matchTypes[type ?? 0] ?? "Match";

export const currencies = [
    { id: "gold", label: "Gold", icon: "/images/currency/gold.png" },
    { id: "amethyst", label: "Amethyst", icon: "/images/currency/amethyst.png" },
    { id: "rivalite", label: "Rivalite", icon: "/images/currency/rivalite.png" },
] as const;

export const currencyIcon = (id?: string) => currencies.find(currency => currency.id === id)?.icon ?? "/images/currency/gold.png";
export const currencyLabel = (id?: string) => currencies.find(currency => currency.id === id)?.label ?? id ?? "";

const numberFormat = new Intl.NumberFormat("en");
export const formatNumber = (value?: number) => numberFormat.format(Math.round(value ?? 0));

export const formatDate = (timestamp?: number | null, withTime = false) => timestamp
    ? new Date(timestamp).toLocaleString("en", withTime
        ? { dateStyle: "medium", timeStyle: "short" }
        : { dateStyle: "medium" })
    : "—";

export function timeAgo(timestamp?: number | null) {
    if (!timestamp) return "—";
    const seconds = Math.round((Date.now() - timestamp) / 1000);
    const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    for (const [unit, size] of units) if (seconds >= size) return format.format(-Math.floor(seconds / size), unit);
    return "just now";
}

export const transactionLabels: Record<string, string> = {
    "shop.purchase": "Shop purchase",
    "admin.adjust": "Adjustment by support",
    "battlepass.premium": "Battle Pass Premium",
    "giftcode.redeem": "Gift code",
    "loot.open": "Loot opened",
    "currency.convert": "Currency exchange",
};
