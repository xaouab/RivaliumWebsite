import Head from "next/head";
import Link from "next/link";
import WikiLayout from "@/components/wiki/WikiLayout";
import RivalCard from "@/components/wiki/RivalCard";
import { rivals } from "@/data/rivals";
import { articlesIn, sectionLabels, WikiSection } from "@/data/wiki";

export default function WikiHome() {
    return <>
        <Head><title>Wiki - Rivalium</title></Head>
        <WikiLayout
            title="Rivalium Wiki"
            crumbs={[{ label: "Home", href: "/" }, { label: "Wiki" }]}
        >
            <section aria-labelledby="wiki-rivals" className="mb-10">
                <div className="flex items-baseline justify-between mb-4">
                    <h2 id="wiki-rivals" className="display text-step-3 text-ice">Rivals</h2>
                    <Link href="/wiki/rivals" className="font-body text-sm text-ice hover:text-ink">All rivals →</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {rivals.map(rival => <RivalCard key={rival.id} rival={rival} compact />)}
                </div>
            </section>

            {(["gameplay", "mechanics"] as WikiSection[]).map(section => <section key={section} aria-labelledby={`wiki-${section}`} className="mb-10 last:mb-0">
                <h2 id={`wiki-${section}`} className="display text-step-3 text-ice mb-4">{sectionLabels[section]}</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                    {articlesIn(section).map(article => <li key={article.slug}>
                        <Link href={`/wiki/${section}/${article.slug}`} className="panel-inset block h-full p-4 transition-colors hover:border-ice/40">
                            <span className="label-caps text-ink">{article.title}</span>
                            <span className="block font-body text-sm text-lavender/80 mt-1">{article.summary}</span>
                        </Link>
                    </li>)}
                </ul>
            </section>)}
        </WikiLayout>
    </>;
}
