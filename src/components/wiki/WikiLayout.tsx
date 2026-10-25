import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import PageHeader, { Crumb } from "@/components/ui/PageHeader";
import { articlesIn, sectionLabels, WikiSection } from "@/data/wiki";
import { rivals } from "@/data/rivals";

type NavGroup = { label: string; href: string; items: { label: string; href: string; accent?: string }[] };

const groups: NavGroup[] = [
    { label: "Rivals", href: "/wiki/rivals", items: rivals.map(rival => ({ label: rival.name, href: `/wiki/rivals/${rival.id}`, accent: rival.archetype_color })) },
    ...(Object.keys(sectionLabels) as WikiSection[]).map(section => ({
        label: sectionLabels[section],
        href: `/wiki/${section}`,
        items: articlesIn(section).map(article => ({ label: article.title, href: `/wiki/${section}/${article.slug}` })),
    })),
];

/** Docs-style shell: structural glass sidebar + content column. Sidebar collapses into a disclosure on small screens. */
export default function WikiLayout({ title, crumbs, children }: {
    title: string;
    crumbs: Crumb[];
    children: ReactNode;
}) {
    const { asPath } = useRouter();
    const path = asPath.split(/[?#]/)[0];

    const nav = <nav aria-label="Wiki" className="flex flex-col gap-5">
        <Link href="/wiki" className={`label-caps caps-md ${path === "/wiki" ? "text-ink" : "text-ice hover:text-ink"}`}>Wiki home</Link>
        {groups.map(group => <div key={group.label} className="flex flex-col gap-1.5">
            <Link href={group.href} className={`label-caps caps-md ${path === group.href ? "text-ink" : "text-ice/80 hover:text-ink"}`}>{group.label}</Link>
            <ul className="flex flex-col border-l border-ice/15">
                {group.items.map(item => {
                    const active = path === item.href;
                    return <li key={item.href}>
                        <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`block font-body text-sm py-1.5 pl-3 -ml-px border-l-2 transition-colors ${active ? "border-frost text-ink" : "border-transparent text-lavender hover:text-ink hover:border-ice/40"}`}
                        >
                            {item.accent && <span aria-hidden className="inline-block w-2 h-2 mr-2 align-middle" style={{ background: item.accent }} />}
                            {item.label}
                        </Link>
                    </li>;
                })}
            </ul>
        </div>)}
    </nav>;

    return <main className="w-full min-h-screen">
        <PageHeader title={title} crumbs={crumbs} compact />
        <div className="w-full max-w-6xl mx-auto px-4 pb-16 flex flex-col lg:flex-row gap-6 items-start">
            <aside className="w-full lg:w-60 lg:shrink-0 lg:sticky lg:top-28 text-left">
                <details className="glass-strong lg:hidden p-4 group">
                    <summary className="label-caps text-ice cursor-pointer list-none flex justify-between">
                        Browse the wiki <span aria-hidden className="transition-transform group-open:rotate-180">▾</span>
                    </summary>
                    <div className="mt-4">{nav}</div>
                </details>
                <div className="glass-strong hidden lg:block p-5 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">{nav}</div>
            </aside>
            <article className="glass flex-1 min-w-0 w-full p-5 md:p-10 text-left rise-in">
                {children}
            </article>
        </div>
    </main>;
}
