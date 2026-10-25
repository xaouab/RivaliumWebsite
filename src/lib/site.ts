/** Public site facts shared by metadata, the sitemap and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rivalium.online").replace(/\/$/, "");
export const SITE_NAME = "Rivalium";
export const SITE_TAGLINE = "The Realm of Rivals";
export const PUBLISHER = "Kaura Interactive";
export const SITE_DESCRIPTION = "Rivalium is a competitive 2.5D arena platformer for Windows. Pick a rival, take the gem and climb ten ranked tiers.";
/** 1456×816 splash used for link previews. */
export const SHARE_IMAGE = { path: "/images/splash.webp", width: 1456, height: 816, alt: "Rivalium rivals clashing in the arena" };

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
