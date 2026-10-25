import Seo from "@/components/Seo";
import Link from "next/link";
import WikiLayout from "@/components/wiki/WikiLayout";
import RivalCard from "@/components/wiki/RivalCard";
import { rivals } from "@/data/rivals";
import { articlesIn, readingPath, sectionLabels, WikiSection } from "@/data/wiki";

export default function WikiHome() {
    return <>
        <Seo title="Wiki" description="Rivalium reference: rivals, controls, match rules, skill tier, rank tiers, rewards and early lore." />
        <WikiLayout
            title="Rivalium Wiki"
            crumbs={[{ label: "Home", href: "/" }, { label: "Wiki" }]}
        >
            <p className="font-body text-lavender mb-8">Rivals, match rules and progression at a glance.</p>
            <section aria-labelledby="wiki-rivals" className="mb-10">
                <div className="flex items-baseline justify-between mb-4">
                    <h2 id="wiki-rivals" className="display text-step-3 text-ice">Rivals</h2>
                    <Link href="/wiki/rivals" className="font-body text-sm text-ice hover:text-ink">All rivals →</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {rivals.map(rival => <RivalCard key={rival.id} rival={rival} compact />)}
                </div>
            </section>

            {(Object.keys(sectionLabels) as WikiSection[]).map(section => <section key={section} aria-labelledby={`wiki-${section}`} className="mb-10 last:mb-0">
                <h2 id={`wiki-${section}`} className="display text-step-3 text-ice mb-4">{sectionLabels[section]}</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                    {articlesIn(section).sort((a, b) => {
                        const order = (article: typeof a) => { const index = readingPath.indexOf(article); return index < 0 ? readingPath.length : index; };
                        return order(a) - order(b);
                    }).map(article => <li key={article.slug}>
                        <Link href={`/wiki/${section}/${article.slug}`} className="block py-3 border-b border-ice/15 text-ice hover:text-ink">
                            <span className="font-body">{article.title}</span>
                        </Link>
                    </li>)}
                </ul>
            </section>)}
        </WikiLayout>
    </>;
}
