import Link from "next/link";
import { expandedArticles } from "./wikiExpansion";
import { ReactNode } from "react";
import { EffectList, ElementGrid } from "@/components/wiki/GameEffects";

/*
 * Wiki articles for gameplay and mechanics. Every rule and number here is taken from the game
 * client (client/gameplay/...). When the game changes, update the article and its `source` note.
 * Video slots are placeholders until clips are recorded; their `assetId` names the clip to capture.
 */

export type WikiSection = "getting-started" | "gameplay" | "mechanics" | "progression" | "lore";

export type WikiArticle = {
    slug: string;
    section: WikiSection;
    title: string;
    summary: string;
    /** Where the facts come from, for whoever updates the article next. */
    source: string;
    earlyLore?: boolean;
    body: () => ReactNode;
};

export const sectionLabels: Record<WikiSection, string> = {
    "getting-started": "Getting started",
    gameplay: "Gameplay",
    mechanics: "Mechanics",
    progression: "Progression",
    lore: "Lore",
};

const phases = [
    { name: "Preparation", seconds: "10s", text: "Teams spawn; movement is locked." },
    { name: "First Battle", seconds: "60s", text: "Defenders protect the gem holder; attackers hunt them." },
    { name: "Second Battle", seconds: "60s", text: "Three orbstones appear." },
    { name: "Final Battle", seconds: "120s", text: "Broken orbstones respawn; all disappear at round end." },
];

const ranks = ["Unranked", "Bronze", "Silver", "Gold", "Platinum", "Amber", "Diamond", "Sentinel", "Mercenary", "Grand Rival"];

export const articles: WikiArticle[] = [
    ...expandedArticles,
    {
        slug: "match-flow",
        section: "gameplay",
        title: "How a match works",
        summary: "Standard mode’s rounds, objectives and result.",
        source: "client/gameplay/game/modes/standard/StandardGame.cs",
        body: () => <>
            <p>Two teams play <strong>8 rounds</strong>, switching attack and defense each round. Players respawn and a <Link href="/wiki/gameplay/gem">gem holder</Link> is picked again.</p>
            <h2>Round phases</h2>
            <table><thead><tr><th scope="col">Phase</th><th scope="col">Time</th><th scope="col">What happens</th></tr></thead><tbody>{phases.map(phase => <tr key={phase.name}><td>{phase.name}</td><td>{phase.seconds}</td><td>{phase.text}</td></tr>)}</tbody></table>
            <h2>Score and result</h2>
            <p>Team score counts <Link href="/wiki/gameplay/gem">gems</Link> from holders and <Link href="/wiki/mechanics/orbstones">orbstones</Link>. After round 8, Sudden Death lasts up to <strong>5 minutes</strong>, then results are reported.</p>
            <p>Casual and Ranked award <Link href="/wiki/progression/skill-tier">XP</Link>; Ranked also changes <Link href="/wiki/gameplay/ranked">RR</Link>.</p>
        </>,
    },
    {
        slug: "gem",
        section: "gameplay",
        title: "The gem",
        summary: "Protect the holder or hunt them for gems.",
        source: "client/gameplay/game/modes/standard/StandardGame.Gem.cs, StandardGame.Events.cs; client/client/pages/results/MatchReport.cs:ScoreOf, Finish",
        body: () => <>
            <h2>Holder and gems</h2>
            <p>Each round, a random living defender carries the gem and is told privately. Attackers must identify them.</p>
            <ul><li>Killing the holder earns the killer a gem; another living defender becomes holder.</li><li>Attackers also earn gems by breaking <Link href="/wiki/mechanics/orbstones">orbstones</Link>.</li></ul>
            <p>Defend the holder with cover and healing; attackers can watch those clues or contest orbstones. Gems and plants appear in personal stats.</p>
            <h2>Personal score and MVP</h2>
            <p>Results score: <strong>300/gem + 100/orbstone + 150/kill + 75/assist + floor((damage + healing) / 10)</strong>. Team score counts gems only.</p>
            <p>MVP needs the highest positive score on the winning team (either team on a draw). Leavers are excluded.</p>
        </>,
    },
    {
        slug: "controls",
        section: "gameplay",
        title: "Controls",
        summary: "Default keyboard and mouse bindings; rebind in Settings.",
        source: "client/project.godot [input]",
        body: () => <>
            <h2>Default bindings</h2>
            <table>
                <thead><tr><th>Action</th><th>Default</th></tr></thead>
                <tbody>
                    {[
                        ["Move left / right", "A / D"],
                        ["Jump / double jump", "W"],
                        ["Slide", "S"],
                        ["Dash", "Shift"],
                        ["Grappling hook", "Space"],
                        ["Basic ability", "Left mouse"],
                        ["Alternate ability", "Right mouse"],
                        ["Signature I", "Q"],
                        ["Signature II", "E"],
                        ["Ultimate", "X"],
                        ["Zoom in / out", "Mouse wheel up or 8 / 2"],
                    ].map(([action, key]) => <tr key={action}><td>{action}</td><td><code>{key}</code></td></tr>)}
                </tbody>
            </table>
            <p>Open <strong>Settings → Controls</strong> in the game to rebind any action.</p>
        </>,
    },
    {
        slug: "ranked",
        section: "gameplay",
        title: "Rank Tiers",
        summary: "Ranked RR, divisions and promotion.",
        source: "client/client/classes/user/rank/RankTier.cs, accounts/src/classes/RankSystem.ts",
        body: () => <>
            <p>Ranked results change your rating points (RR), based on the result and expected win chance. Leaving adds a penalty. RR is separate from <Link href="/wiki/progression/skill-tier">skill tier</Link> and matchmaking skill.</p>
            <h2>Rank tier ladder</h2>
            <table><caption>Default divisions, from lowest rank tier to highest</caption><thead><tr><th scope="col">Rank tier</th><th scope="col">Divisions</th></tr></thead><tbody>
                {ranks.map((rank, index) => <tr key={rank}><th scope="row"><span className="inline-flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/ranks/${rank.toLowerCase().replace(/ /g, "")}.png`} alt="" width={24} height={24} loading="lazy" />{rank}
                </span></th><td>{index === 0 || index === 9 ? "—" : index >= 7 ? "2" : "3"}</td></tr>)}
            </tbody></table>
            <h2>Promotion and demotion</h2>
            <p>RR thresholds set divisions. Reach the next rank tier’s entry threshold to promote; a lower demotion threshold provides a buffer. Large changes can cross several rank tiers. Bronze has no demotion threshold.</p>
            <p>Thresholds, divisions, starting RR and <Link href="/wiki/gameplay/queues">entry rules</Link> are configurable and may change by season.</p>
        </>,
    },
    {
        slug: "movement",
        section: "mechanics",
        title: "Movement",
        summary: "The movement kit shared by every rival.",
        source: "client/gameplay/player/movement/*.cs",
        body: () => <>
            <p>Rivals share these moves; <Link href="/wiki/rivals">base speed</Link> varies. See <Link href="/wiki/gameplay/controls">Controls</Link> for bindings.</p>
            <h2>Movement kit</h2>
            <table><thead><tr><th scope="col">Move</th><th scope="col">Rule</th></tr></thead><tbody>
                <tr><td>Double jump</td><td>Jump again while airborne.</td></tr>
                <tr><td>Dash</td><td>Burst forward; 3-second cooldown. Masr can aim in any direction.</td></tr>
                <tr><td>Slide</td><td>Hold Slide; steep slopes trigger it automatically.</td></tr>
                <tr><td>Grappling hook</td><td>Pull toward a surface. Releasing adds a small speed boost.</td></tr>
                <tr><td>Wall grab</td><td>Hang on suitable walls to aim, then jump off.</td></tr>
            </tbody></table>
        </>,
    },
    {
        slug: "abilities",
        section: "mechanics",
        title: "Abilities and ultimates",
        summary: "Five ability slots and their cast styles.",
        source: "client/gameplay/ability/*.cs, client/gameplay/character/rivals/Rival.cs",
        body: () => <>
            <h2>Five slots</h2>
            <p>Each rival has Basic, Alternate, Signature I, Signature II and Ultimate. See <Link href="/wiki/rivals">rival kits</Link> for attacks and <Link href="/wiki/gameplay/controls">Controls</Link> for bindings.</p>
            <h2>Cast styles</h2>
            <table><thead><tr><th scope="col">Style</th><th scope="col">Behavior</th></tr></thead><tbody>
                <tr><td>Single cast</td><td>One use, then cooldown.</td></tr>
                <tr><td>Active</td><td>A state lasting a set duration.</td></tr>
                <tr><td>Double cast</td><td>First cast opens a recast window for a second action.</td></tr>
                <tr><td>Charges</td><td>Stored uses refill over time.</td></tr>
                <tr><td>Passive</td><td>Always on; no button.</td></tr>
            </tbody></table>
            <h2>Ultimate charge</h2>
            <p>Damage, healing or both fill the bar, depending on the rival. Cast when full; everyone sees a short cinematic. Availability depends on your state and kit.</p>
        </>,
    },
    {
        slug: "status-effects",
        section: "mechanics",
        title: "Status effects",
        summary: "Buffs, debuffs and rival forms shown on your HUD.",
        source: "client/gameplay/player/stats/Player.Effects.cs, Player.Life.cs, Player.Stats.cs, client/gameplay/ui/hud/effect/UIEffect.tscn",
        body: () => <>
            <p>Abilities and auras apply status effects. They show above the player and on your HUD. Dying clears them all.</p>
            <EffectList />
        </>,
    },
    {
        slug: "elements",
        section: "mechanics",
        title: "Elements",
        summary: "Temporary elemental buffs from orbs.",
        source: "client/gameplay/player/stats/Player.Elements.cs, Player.Life.cs, Player.Stats.cs, client/gameplay/orb/Orb.cs, Orb.tscn",
        body: () => <>
            <p>Collect <strong>Lethality, Vitality or Haste</strong> orbs for one stack each, up to <strong>10 per element</strong>. All elemental stacks are lost on death.</p>
            <ElementGrid />
            <h2>Collecting orbs</h2>
            <ul><li><strong>Kills:</strong> one random-element orb drops at the fallen player. Touch to collect; unclaimed orbs vanish after <strong>15 seconds</strong>.</li><li><strong>Orbstones:</strong> see <Link href="/wiki/mechanics/orbstones">team rewards</Link>.</li></ul>
            <p>Excess stacks are lost; leave maxed-out elements for teammates. The planned <Link href="/wiki/mechanics/permanent-orbs">permanent orb</Link> system trades 10 stacks for a lasting passive.</p>
        </>,
    },
    {
        slug: "orbstones",
        section: "mechanics",
        title: "Orbstones",
        summary: "Break structures for team orbs and attacking gems.",
        source: "client/gameplay/game/modes/standard/StandardGame.Gem.cs, StandardGame.cs",
        body: () => <>
            <p>Three structures occupy fixed map spots: <strong>red = Lethality, blue = Vitality, white = Haste</strong>.</p>
            <h2>Timing</h2>
            <ul><li>Appear at Second Battle.</li><li>Broken ones respawn at Final Battle.</li><li>All disappear at round end.</li></ul>
            <h2>Rewards</h2>
            <ul><li>Every teammate receives one <Link href="/wiki/mechanics/elements">elemental orb</Link> of its element, wherever they are.</li><li>An attacking breaker also earns one <Link href="/wiki/gameplay/gem">gem</Link>; a defender earns none.</li></ul>
        </>,
    },
    {
        slug: "permanent-orbs",
        section: "mechanics",
        title: "Permanent orbs",
        summary: "A planned upgrade from elemental stacks to lasting passives.",
        source: "Game design (owner). Not in the client yet: see client/gameplay/player/stats/Player.Elements.cs",
        body: () => <>
            <p><strong>Planned; not live yet.</strong> Trade 10 <Link href="/wiki/mechanics/elements">elemental orbs</Link> of one element for a passive lasting the game, including after death.</p>
            <h2>The trade</h2>
            <p>The 10 stacks are spent, resetting that element to 0. Players and orbstones do not drop permanent orbs.</p>
            <p>Example passive: invisibility for 1 second after a kill. The full list will be added at release.</p>
        </>,
    },
    {
        slug: "economy",
        section: "mechanics",
        title: "Currencies, shop and battle pass",
        summary: "Rewards, spending and gift codes.",
        source: "accounts/src/classes/ShopCatalog.ts, LootCatalog.ts, BattlePassCatalog.ts, networking/request/events/*",
        body: () => <>
            <h2>Rewards and spending</h2>
            <ul><li><Link href="/wiki/progression/currencies">Currencies</Link> — Gold, Amethyst and Rivalite.</li><li><Link href="/wiki/progression/shop">Shop</Link> — prices and current offers.</li><li><Link href="/wiki/progression/battle-pass">Battle Pass</Link> — seasonal free and premium rewards.</li><li><Link href="/wiki/progression/loot">Loot</Link> — boxes and reward pools.</li><li><Link href="/wiki/progression/cosmetics">Cosmetics</Link> — your collection.</li></ul>
            <h2>Gift codes and history</h2>
            <p>Redeem event and partner codes in-game for currency or cosmetics. Purchases, opened boxes and redeemed codes appear in <Link href="/account/purchases">purchase history</Link>.</p>
        </>,
    },
];

export function getArticle(section: string, slug: string) {
    return articles.find(article => article.section === section && article.slug === slug) ?? null;
}

export function articlesIn(section: WikiSection) {
    return articles.filter(article => article.section === section);
}

/** Topic order for quiet cross-section navigation. */
export const readingPath = [
    ["getting-started", "install"], ["getting-started", "lobby"], ["getting-started", "your-rival"],
    ["getting-started", "training"], ["gameplay", "controls"], ["mechanics", "movement"],
    ["mechanics", "abilities"], ["gameplay", "match-flow"], ["gameplay", "gem"],
    ["mechanics", "orbstones"], ["gameplay", "parties"], ["gameplay", "queues"],
    ["progression", "skill-tier"], ["gameplay", "ranked"], ["progression", "battle-pass"],
    ["progression", "shop"], ["progression", "loot"], ["progression", "currencies"], ["progression", "cosmetics"],
].map(([section, slug]) => getArticle(section, slug)!);

export const wikiHref = (article: WikiArticle) => `/wiki/${article.section}/${article.slug}`;
