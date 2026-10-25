import Link from "next/link";
import type { WikiArticle } from "./wiki";
import { rivals } from "./rivals";

/** Editorial copy verified against the sources on each article. No live prices or season thresholds are frozen here. */
export const expandedArticles: WikiArticle[] = [
    {
        section: "getting-started", slug: "install", title: "Install and sign in",
        summary: "Download the client and sign in.",
        source: "website/src/pages/download.tsx; client/client/pages/login/; website/src/pages/portal/",
        body: () => <>
            <h2>Get the client</h2>
            <p><Link href="/download">Download</Link> the current release for your system.</p>
            <h2>Sign in</h2>
            <p><Link href="/portal/register">Create an account</Link>, then sign in through the client to reach the <Link href="/wiki/getting-started/lobby">lobby</Link>.</p>
            <p>Need help? Use <Link href="/portal/forgot">password recovery</Link> or <Link href="/support">Support</Link>.</p>
        </>,
    },
    {
        section: "getting-started", slug: "lobby", title: "The lobby",
        summary: "Choose a rival, gather friends and select a queue.",
        source: "client/client/pages/lobby/LobbyPage.cs; client/client/pages/lobby/rival/data/rivals.yaml",
        body: () => <>
            <h2>Play</h2>
            <p><Link href="/wiki/getting-started/your-rival">Choose a rival</Link>, open <Link href="/wiki/getting-started/training">Training</Link> or select a <Link href="/wiki/gameplay/queues">queue</Link>. Playing with friends? Gather your <Link href="/wiki/gameplay/parties">party</Link>.</p>
            <h2>Between matches</h2>
            <p>Open your profile, <Link href="/wiki/progression/battle-pass">Battle Pass</Link>, <Link href="/wiki/progression/shop">Shop</Link> or <Link href="/wiki/progression/loot">Loot</Link> from the lobby.</p>
        </>,
    },
    {
        section: "getting-started", slug: "your-rival", title: "Choose your rival",
        summary: "Find a rival whose kit you want to try.",
        source: "client/client/pages/lobby/rival/data/rivals.yaml; client/gameplay/character/rivals/",
        body: () => <>
            <h2>Find a kit</h2>
            <p>Compare the <Link href="/wiki/rivals">rivals and archetypes</Link>, then try a kit in <Link href="/wiki/getting-started/training">Training</Link>.</p>
            <h2>Read the abilities</h2>
            <p>Each rival’s page lists their attacks and stats. <Link href="/wiki/mechanics/abilities">Abilities and ultimates</Link> explains the shared slots and cast styles.</p>
        </>,
    },
    {
        section: "getting-started", slug: "training", title: "Training",
        summary: "Solo practice for movement, aim and abilities.",
        source: "accounts/src/networking/request/events/training/ReqTrainingEnter.ts; client/gameplay/game/modes/standard/StandardGame.cs",
        body: () => <>
            <h2>Enter from the lobby</h2>
            <p>Training runs locally and alone, even while you are in a party. Leave your queue before entering; leave Training before your party queues.</p>
            <h2>Practice</h2>
            <p>Try <Link href="/wiki/mechanics/movement">movement</Link>, aim and <Link href="/wiki/mechanics/abilities">abilities</Link>. Check <Link href="/wiki/gameplay/controls">Controls</Link> for bindings.</p>
            <p>Training gives no match rewards or ranked results.</p>
        </>,
    },
    {
        section: "gameplay", slug: "parties", title: "Parties",
        summary: "Play with friends in a shared party.",
        source: "accounts/src/components/party/Party.ts; accounts/src/networking/request/events/party/ReqPartyJoinQueue.ts",
        body: () => <>
            <h2>Queue together</h2>
            <p>Gather friends through the lobby’s social controls. Only the party owner can start the queue.</p>
            <h2>Before joining</h2>
            <ul><li>Everyone must leave their match or Training.</li><li>Choose a <Link href="/wiki/gameplay/queues">queue</Link> that fits your party and meets ranked entry rules.</li></ul>
        </>,
    },
    {
        section: "gameplay", slug: "queues", title: "Queues",
        summary: "Choose Casual, Ranked 4v4 or solo Training.",
        source: "accounts/src/classes/Matchmaker.ts; accounts/src/networking/request/events/party/ReqPartyJoinQueue.ts; accounts/src/networking/request/events/training/ReqTrainingEnter.ts",
        body: () => <>
            <h2>Match formats</h2>
            <table><thead><tr><th scope="col">Queue</th><th scope="col">Teams</th><th scope="col">Ranked RR</th></tr></thead>
                <tbody>{[["Casual Solo", "1v1", "Unchanged"], ["Casual Duo", "2v2", "Unchanged"], ["Casual Classic", "4v4", "Unchanged"], ["Ranked", "4v4", "Changes"]].map(([name, size, rr]) => <tr key={name}><td>{name}</td><td>{size}</td><td>{rr}</td></tr>)}</tbody>
            </table>
            <p>Casual and Ranked award XP. Ranked results also change your <Link href="/wiki/gameplay/ranked">rank tier</Link>.</p>
            <h2>Party requirements</h2>
            <p>A party can join any queue whose team fits it; other players fill the seats. Three friends can play Classic or Ranked, but not Solo or Duo.</p>
            <p>Ranked also has a configurable party cap (default 4) and minimum <Link href="/wiki/progression/skill-tier">skill tier</Link>. Check current entry requirements in the client.</p>
            <p>The <Link href="/wiki/gameplay/parties">party owner</Link> queues when everyone is available. For solo practice, use <Link href="/wiki/getting-started/training">Training</Link>.</p>
        </>,
    },
    {
        section: "progression", slug: "skill-tier", title: "Skill Tier",
        summary: "XP progression from Casual and Ranked.",
        source: "accounts/src/components/user/UserSkill.ts:getMaxXP; accounts/src/classes/settings/definitions/progression.ts:levelXpBase; accounts/src/components/match/Match.ts",
        body: () => <>
            <h2>Earn XP</h2>
            <p>Start at skill tier 1. Casual and Ranked award XP from performance and results; reaching the requirement spends XP and advances your skill tier. Training gives none.</p>
            <h2>XP requirements</h2>
            <table><caption>Examples at the default base of 2000</caption><thead><tr><th scope="col">Skill tier</th><th scope="col">XP to advance</th></tr></thead>
                <tbody>{[1, 2, 3, 5, 10].map(tier => <tr key={tier}><td>{tier}</td><td>{Math.round(2000 * Math.sqrt(tier) * Math.log10(tier + 1)).toLocaleString("en-US")}</td></tr>)}</tbody>
            </table>
            <p>The curve is <code>round(base × √tier × log10(tier + 1))</code>. The base is configurable; check your current progress in the client.</p>
            <h2>Separate progression</h2>
            <p>Skill tier measures XP, <Link href="/wiki/gameplay/ranked">rank tier</Link> uses RR, and matchmaking uses a separate skill rating. Ranked entry may require a minimum skill tier.</p>
        </>,
    },
    {
        section: "progression", slug: "battle-pass", title: "Battle Pass",
        summary: "Seasonal rewards on free and premium tracks.",
        source: "accounts/src/classes/BattlePassCatalog.ts; accounts/src/components/match/Match.ts; client/client/pages/battlepass/BattlePassModal.cs",
        body: () => <>
            <h2>Earn and claim</h2>
            <p>Casual and Ranked grant battle pass XP toward seasonal tiers, separate from <Link href="/wiki/progression/skill-tier">skill tier</Link> and <Link href="/wiki/gameplay/ranked">rank tier</Link>.</p>
            <p>Claim earned free rewards from the Battle Pass in the lobby. Premium rewards also require premium access for that season.</p>
            <h2>Current season</h2>
            <p>Check dates, XP requirements, rewards and the premium <Link href="/wiki/progression/currencies">price</Link> in the active pass.</p>
        </>,
    },
    {
        section: "progression", slug: "shop", title: "Shop",
        summary: "Current offers, prices and currencies.",
        source: "accounts/src/classes/ShopCatalog.ts; client/client/pages/lobby/shop/ShopPanel.cs",
        body: () => <>
            <h2>Check the offer</h2>
            <p>Review contents, price and <Link href="/wiki/progression/currencies">currency</Link> before buying. Eligible rivals offer a Rivalite unlock option.</p>
            <h2>Availability</h2>
            <p>Catalogs, sales, bundles and timed offers can change. <Link href="/wiki/progression/cosmetics">Cosmetics</Link> may also come from rewards; use the current catalog for availability.</p>
        </>,
    },
    {
        section: "progression", slug: "loot", title: "Loot",
        summary: "Boxes with weighted rewards.",
        source: "accounts/src/classes/LootCatalog.ts; accounts/src/networking/request/events/loot/ReqLootOpen.ts",
        body: () => <>
            <h2>Open a box</h2>
            <p>Open Loot from the lobby. Opening an owned box consumes it and rolls <strong>one weighted reward</strong>: currency or an item.</p>
            <h2>Check the pool</h2>
            <p>Contents and odds vary by box; rewards are not equally likely. Review them before opening, then <Link href="/wiki/progression/cosmetics">equip cosmetics</Link> from your collection.</p>
        </>,
    },
    {
        section: "progression", slug: "currencies", title: "Currencies",
        summary: "Your Gold, Amethyst and Rivalite balances.",
        source: "accounts/src/classes/ShopCatalog.ts:ShopCurrency, ShopPrice, unlockableWithRivalite; client/client/components/ui/UiCurrency.cs",
        body: () => <>
            <h2>Three balances</h2>
            <table><thead><tr><th scope="col">Currency</th><th scope="col">Use</th></tr></thead><tbody>
                <tr><td>Gold</td><td>Offers priced in Gold.</td></tr><tr><td>Amethyst</td><td>Offers priced in Amethyst.</td></tr><tr><td>Rivalite</td><td>Eligible rival unlocks.</td></tr>
            </tbody></table>
            <h2>Before spending</h2>
            <p>Check the <Link href="/wiki/progression/shop">offer’s</Link> currency, amount and contents. Prices, conversions and reward amounts vary; there is no fixed exchange rate to assume.</p>
        </>,
    },
    {
        section: "progression", slug: "cosmetics", title: "Cosmetics",
        summary: "Icons, borders, podiums and mottos for your identity.",
        source: "accounts/src/classes/ShopCatalog.ts:ShopItemCategory; client/client/pages/lobby/LobbyPage.cs",
        body: () => <>
            <h2>Your identity</h2>
            <ul><li><strong>Icons:</strong> profile images.</li><li><strong>Borders:</strong> frames for your identity.</li><li><strong>Podiums:</strong> stages for your rival.</li><li><strong>Mottos:</strong> short phrases.</li></ul>
            <h2>Collect and equip</h2>
            <p>Check the <Link href="/wiki/progression/shop">Shop</Link>, <Link href="/wiki/progression/battle-pass">Battle Pass</Link> and <Link href="/wiki/progression/loot">Loot</Link> for availability. After collecting an item, select it to display it.</p>
        </>,
    },
    {
        section: "lore", slug: "world", title: "Hoshinami and the rivals",
        summary: "A placeholder sketch of Hoshinami’s East Concourse.",
        source: "Placeholder fiction; setting anchor: client/gameplay/maps/trainstation/; archetypes: client/client/pages/lobby/rival/data/rivals.yaml",
        earlyLore: true,
        body: () => <>
            <h2>East Concourse</h2>
            <p>Departure boards glow above Hoshinami’s platforms, ticket gates and stopped train. Why the rivals meet here is still taking shape.</p>
            <h2>The rivals</h2>
            <ul>{rivals.map(rival => <li key={rival.id}><Link href={`/wiki/lore/${rival.id}`}>{rival.name}</Link> — {rival.title}</li>)}</ul>
        </>,
    },
    ...([
        ["kenn", "Kenn", "A blade between platforms", "Kenn moves through the concourse in short, decisive bursts. A blade’s flash catches the light of the departure board; by the time it fades, Kenn has already changed position."],
        ["gramin", "Gramin", "Holding the concourse", "Gramin studies the long sightlines before moving. From the platform edge, the concourse becomes a set of approaches to watch and angles to hold."],
        ["lenya", "Lenya", "Crystal in the station light", "Lenya’s crystal catches the cold light above the ticket gates. Where the others see a firing line, she sees a place to shelter an ally and reshape the next exchange."],
        ["masr", "Masr", "A storm across the tracks", "A flicker of lightning runs ahead of Masr along the platform. The Stormblade is already crossing the open ground while the last flash still hangs in the station air."],
    ] as const).map(([slug, title, heading, first]): WikiArticle => ({
        section: "lore", slug, title: `${title}: early lore`, earlyLore: true,
        summary: `A placeholder sketch of ${title} in Hoshinami.`,
        source: "Placeholder fiction; archetype and title: client/client/pages/lobby/rival/data/rivals.yaml; setting: client/gameplay/maps/trainstation/",
        body: () => <><h2>{heading}</h2><p>{first}</p><p><Link href={`/wiki/rivals/${slug}`}>{title}’s abilities</Link> / <Link href="/wiki/lore/world">Hoshinami</Link></p></>,
    })),
];
