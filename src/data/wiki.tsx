import Link from "next/link";
import { ReactNode } from "react";
import VideoSlot from "@/components/ui/VideoSlot";

/*
 * Wiki articles for gameplay and mechanics. Every rule and number here is taken from the game
 * client (client/gameplay/...). When the game changes, update the article and its `source` note.
 * Video slots are placeholders until clips are recorded; their `assetId` names the clip to capture.
 */

export type WikiSection = "gameplay" | "mechanics";

export type WikiArticle = {
    slug: string;
    section: WikiSection;
    title: string;
    summary: string;
    /** Where the facts come from, for whoever updates the article next. */
    source: string;
    body: () => ReactNode;
};

export const sectionLabels: Record<WikiSection, string> = {
    gameplay: "Gameplay",
    mechanics: "Mechanics",
};

const phases = [
    { name: "Preparation", seconds: "10s", text: "Teams spawn on their side. Nobody can move yet; it's time to read the map and plan." },
    { name: "First Battle", seconds: "60s", text: "The fight opens. Defenders protect their gem holder, attackers hunt them." },
    { name: "Second Battle", seconds: "60s", text: "The three orbstones appear on the map." },
    { name: "Final Battle", seconds: "120s", text: "Orbstones respawn for one last push. They're removed when the round ends." },
];

const buffs = [
    ["Heal", "Restores health."],
    ["Agility", "Shorter cooldowns and +10% speed."],
    ["Swiftness", "Increased movement speed."],
    ["Power", "Increased outgoing damage."],
    ["Shield", "An extra health bar on top of your own."],
    ["Redemption", "Ignore the next attack that hits you."],
    ["Protection", "Invulnerable for the duration."],
    ["Invisibility", "Enemies can't see you."],
    ["Overdrive", "Stats maxed out, with Power and Agility."],
    ["Nullifying", "Immune to debuffs."],
];

const debuffs = [
    ["Bleed", "Damage over time."],
    ["Vulnerability", "Increased incoming damage."],
    ["Slowness", "Reduced movement speed."],
    ["Weakened", "Reduced outgoing damage."],
    ["Shattering", "Stats drop to zero."],
    ["Impotence", "Grounded, can't cast and -50% speed."],
    ["Lethargy", "Reduced haste."],
    ["Blindness", "Your view is blurred."],
    ["Decay", "-80% healing received."],
];

const ranks = ["Unranked", "Bronze", "Silver", "Gold", "Platinum", "Amber", "Diamond", "Sentinel", "Mercenary", "Grandrival"];

export const articles: WikiArticle[] = [
    {
        slug: "match-flow",
        section: "gameplay",
        title: "How a match works",
        summary: "Eight rounds of attack and defense, four phases per round, and a sudden death to settle it.",
        source: "client/gameplay/game/modes/standard/StandardGame.cs",
        body: () => <>
            <VideoSlot label="A full round from Preparation to Final Battle, sped up" assetId="gameplay/match-flow" />
            <p>A standard match is played between two teams over <strong>8 rounds</strong>. Every round the teams switch sides: one attacks, the other defends.</p>
            <h2>The four phases of a round</h2>
            <ol>
                {phases.map(phase => <li key={phase.name}><strong>{phase.name} ({phase.seconds})</strong>: {phase.text}</li>)}
            </ol>
            <p>Everyone respawns at their side's spawn points at the start of each round, and the <Link href="/wiki/gameplay/gem">gem holder</Link> is picked again.</p>
            <h2>Sudden death</h2>
            <p>After the eighth round the match goes to <strong>Sudden Death</strong>, which lasts up to <strong>5 minutes</strong>. Then the match ends and the result is sent to the account server, which hands out rank changes and rewards.</p>
        </>,
    },
    {
        slug: "gem",
        section: "gameplay",
        title: "The gem",
        summary: "Defenders protect a gem holder; attackers score by taking them down or breaking orbstones.",
        source: "client/gameplay/game/modes/standard/StandardGame.Gem.cs, StandardGame.Events.cs",
        body: () => <>
            <VideoSlot label="Attackers focusing the defending gem holder" assetId="gameplay/gem" />
            <p>At the start of every round, one living player on the <strong>defending</strong> team is chosen at random to carry the gem. Everyone can see who it is.</p>
            <ul>
                <li><strong>Killing the gem holder</strong> earns the killer a gem, and a new holder is chosen from the defenders still alive.</li>
                <li><strong>Destroying an orbstone</strong> as an attacker also earns a gem. See <Link href="/wiki/mechanics/orbstones">Orbstones</Link>.</li>
            </ul>
            <p>Gems and gem plants are tracked per player and shown in your match stats.</p>
            <h2>Tips</h2>
            <ul>
                <li>As a defender, stay close to your gem holder; protection and healing abilities matter most here.</li>
                <li>As an attacker, break orbstones when the holder is too well protected.</li>
            </ul>
        </>,
    },
    {
        slug: "controls",
        section: "gameplay",
        title: "Controls",
        summary: "Default keyboard and mouse bindings. Every one of them can be rebound in Settings.",
        source: "client/project.godot [input]",
        body: () => <>
            <table>
                <thead><tr><th>Action</th><th>Default</th></tr></thead>
                <tbody>
                    {[
                        ["Move left / right", "A / D"],
                        ["Jump (press again in the air to double jump)", "W"],
                        ["Slide", "S"],
                        ["Dash", "Shift"],
                        ["Grappling hook", "Space"],
                        ["Basic ability", "Left mouse"],
                        ["Alternate ability", "Right mouse"],
                        ["Signature I", "Q"],
                        ["Signature II", "E"],
                        ["Ultimate", "X"],
                        ["Zoom in / out", "Mouse wheel"],
                    ].map(([action, key]) => <tr key={action}><td>{action}</td><td><code>{key}</code></td></tr>)}
                </tbody>
            </table>
            <p>Open <strong>Settings → Controls</strong> in the game to rebind any action.</p>
        </>,
    },
    {
        slug: "ranked",
        section: "gameplay",
        title: "Ranks",
        summary: "Ten tiers from Unranked to Grandrival, with divisions inside each tier.",
        source: "client/client/classes/user/rank/RankTier.cs, accounts/src/classes/RankSystem.ts",
        body: () => <>
            <p>Your rank shows how you place against other players. Win to climb through divisions and tiers; losses take you back down.</p>
            <div className="not-prose grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
                {ranks.map(rank => <figure key={rank} className="panel-inset flex flex-col items-center gap-2 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/ranks/${rank.toLowerCase()}.png`} alt="" width={48} height={48} className="w-12 h-12 object-contain" loading="lazy" />
                    <figcaption className="label-caps text-xs text-ice">{rank}</figcaption>
                </figure>)}
            </div>
            <p>Matchmaking uses a separate skill rating, so the players you meet are close to your level even early in a season.</p>
        </>,
    },
    {
        slug: "movement",
        section: "mechanics",
        title: "Movement",
        summary: "Running, double jumps, slides, dashes, wall grabs and the grappling hook.",
        source: "client/gameplay/player/movement/*.cs",
        body: () => <>
            <VideoSlot label="Movement showcase: dash, grapple and wall grab chained together" assetId="mechanics/movement" />
            <p>Every rival shares the same movement kit; what differs is their base speed (see each <Link href="/wiki/rivals">rival's page</Link>).</p>
            <h2>Jump and double jump</h2>
            <p>Jump with <code>W</code> and press it again in the air for a stronger second jump.</p>
            <h2>Dash</h2>
            <p>Dash with <code>Shift</code> for a quick burst of distance. It has a <strong>3 second</strong> cooldown, so save it for dodging or escaping. Some rivals change how dashing works; Masr, for example, can dash in any direction.</p>
            <VideoSlot label="Dash timing to dodge a projectile" assetId="mechanics/dash" aspect="wide" />
            <h2>Slide</h2>
            <p>Hold <code>S</code> to slide. Steep slopes make you slide on their own.</p>
            <h2>Grappling hook</h2>
            <p>Fire the hook with <code>Space</code> to pull yourself to a surface. Letting go gives you a small speed boost, so chain it into jumps.</p>
            <h2>Wall grab</h2>
            <p>Some walls can be grabbed. Hang on to aim from cover, then jump off.</p>
        </>,
    },
    {
        slug: "abilities",
        section: "mechanics",
        title: "Abilities and ultimates",
        summary: "Five ability slots, five cast styles, and an ultimate that charges as you fight.",
        source: "client/gameplay/ability/*.cs, client/gameplay/character/rivals/Rival.cs",
        body: () => <>
            <p>Every rival has five abilities:</p>
            <table>
                <thead><tr><th>Slot</th><th>Default key</th><th>Role</th></tr></thead>
                <tbody>
                    <tr><td>Basic</td><td><code>Left mouse</code></td><td>Main attack, always available.</td></tr>
                    <tr><td>Alternate</td><td><code>Right mouse</code></td><td>A second attack with a different shape.</td></tr>
                    <tr><td>Signature I</td><td><code>Q</code></td><td>The rival's first special ability.</td></tr>
                    <tr><td>Signature II</td><td><code>E</code></td><td>The second special ability.</td></tr>
                    <tr><td>Ultimate</td><td><code>X</code></td><td>A powerful, match-turning ability that needs charge.</td></tr>
                </tbody>
            </table>
            <h2>Cast styles</h2>
            <ul>
                <li><strong>Single cast</strong>: fires once, then goes on cooldown.</li>
                <li><strong>Active</strong>: puts you in a state for a set duration.</li>
                <li><strong>Double cast</strong>: cast once to place something, <strong>recast</strong> to trigger it early.</li>
                <li><strong>Charges</strong>: stores several uses that refill over time.</li>
                <li><strong>Passive</strong>: always on, no button needed.</li>
            </ul>
            <h2>Ultimate charge</h2>
            <p>Ultimates fill up as you fight. Depending on the rival, charge comes from dealing damage, healing, or both. When the bar is full, press the ultimate key. Using it plays a short cinematic for everyone.</p>
            <VideoSlot label="Ultimate cinematic examples" assetId="mechanics/ultimates" />
        </>,
    },
    {
        slug: "status-effects",
        section: "mechanics",
        title: "Status effects",
        summary: "Every buff and debuff in the game and what it does.",
        source: "client/gameplay/player/stats/Player.Effects.cs",
        body: () => <>
            <p>Abilities, auras and some items apply status effects. Buffs help the player who has them; debuffs hurt them. Effects show above the player and on your HUD.</p>
            <h2>Buffs</h2>
            <table><tbody>{buffs.map(([name, text]) => <tr key={name}><td><strong>{name}</strong></td><td>{text}</td></tr>)}</tbody></table>
            <h2>Debuffs</h2>
            <table><tbody>{debuffs.map(([name, text]) => <tr key={name}><td><strong>{name}</strong></td><td>{text}</td></tr>)}</tbody></table>
            <h2>Rival forms</h2>
            <p><strong>Spectre</strong> (Kenn) and <strong>Stormwrath</strong> (Masr) are special effects that represent those rivals' ultimate forms.</p>
        </>,
    },
    {
        slug: "orbstones",
        section: "mechanics",
        title: "Orbstones and elements",
        summary: "Three orbstones, three elements: Lethality, Vitality and Haste.",
        source: "client/gameplay/game/modes/standard/StandardGame.Gem.cs, client/gameplay/orb/Orb.cs, client/gameplay/player/stats/Player.Elements.cs",
        body: () => <>
            <VideoSlot label="Breaking an orbstone and collecting its orbs" assetId="mechanics/orbstones" />
            <p>From the <strong>Second Battle</strong> phase, three orbstones appear at fixed spots on the map. They respawn when the Final Battle starts and disappear at the end of the round.</p>
            <table>
                <thead><tr><th>Orbstone</th><th>Element</th></tr></thead>
                <tbody>
                    <tr><td>Red</td><td><strong>Lethality</strong></td></tr>
                    <tr><td>Blue</td><td><strong>Vitality</strong></td></tr>
                    <tr><td>White</td><td><strong>Haste</strong></td></tr>
                </tbody>
            </table>
            <p>Picking up an orb gives you a stack of its element, up to <strong>10 stacks</strong> of each. Breaking an orbstone while attacking also earns you a <Link href="/wiki/gameplay/gem">gem</Link>.</p>
        </>,
    },
    {
        slug: "economy",
        section: "mechanics",
        title: "Currencies, shop and battle pass",
        summary: "Gold, Amethyst and Rivalite; the shop, loot, gift codes and the battle pass.",
        source: "accounts/src/classes/ShopCatalog.ts, LootCatalog.ts, BattlePassCatalog.ts, networking/request/events/*",
        body: () => <>
            <table>
                <thead><tr><th>Currency</th><th>Used for</th></tr></thead>
                <tbody>
                    <tr><td><strong>Gold</strong></td><td>Earned by playing. Can be converted into Amethyst at a rate set by the team.</td></tr>
                    <tr><td><strong>Amethyst</strong></td><td>The shop's main currency: rivals, cosmetics and the premium battle pass.</td></tr>
                    <tr><td><strong>Rivalite</strong></td><td>Unlocks rivals directly.</td></tr>
                </tbody>
            </table>
            <h2>Shop</h2>
            <p>The shop sells rivals, skins, icons, borders, podiums, mottos and ropes. Some entries are on sale or available for a limited time only.</p>
            <h2>Loot</h2>
            <p>Loot boxes give one random reward from their pool when opened.</p>
            <h2>Battle pass</h2>
            <p>Each season has a battle pass with free and premium reward tiers. Earn battle pass XP by playing to unlock tiers, then claim rewards from the Battle Pass page in the game.</p>
            <h2>Gift codes</h2>
            <p>Codes from events and partners can be redeemed in the game for currency or cosmetics.</p>
            <p>Every purchase, opened loot box and redeemed code appears in your <Link href="/account/purchases">purchase history</Link>.</p>
        </>,
    },
];

export function getArticle(section: string, slug: string) {
    return articles.find(article => article.section === section && article.slug === slug) ?? null;
}

export function articlesIn(section: WikiSection) {
    return articles.filter(article => article.section === section);
}
