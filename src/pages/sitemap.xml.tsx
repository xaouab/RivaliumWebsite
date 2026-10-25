import { GetServerSideProps } from "next";
import { articles, sectionLabels } from "@/data/wiki";
import { rivals } from "@/data/rivals";
import { apiUrl } from "@/components/constant";
import { absoluteUrl } from "@/lib/site";

/** XML sitemap of every public, indexable page. Private pages (account, portal, players) are left out on purpose. */
const staticPaths = ["/", "/download", "/wiki", "/wiki/rivals", "/wiki/gameplay", "/wiki/mechanics", "/patch-notes", "/support", "/legal/terms", "/legal/privacy"];

type Entry = { path: string; lastmod?: string };

async function patchNotes(): Promise<Entry[]> {
    try {
        const url = `${apiUrl}/version/all?itemsPerPage=200&page=1&level=patch`;
        const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
        if (!response.ok) return [];
        const { versions = [] }: { versions?: { version: string; published?: boolean; publishedAt?: number }[] } = await response.json();
        return versions.filter(item => item.published).map(item => ({
            path: `/patch-notes/${encodeURIComponent(item.version)}`,
            lastmod: item.publishedAt ? new Date(item.publishedAt).toISOString() : undefined,
        }));
    } catch {
        return []; // The sitemap must still render when the account server is down.
    }
}

const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const entries: Entry[] = [
        ...staticPaths.map(path => ({ path })),
        ...Object.keys(sectionLabels).filter(section => !staticPaths.includes(`/wiki/${section}`)).map(section => ({ path: `/wiki/${section}` })),
        ...rivals.map(rival => ({ path: `/wiki/rivals/${rival.id}` })),
        ...articles.map(article => ({ path: `/wiki/${article.section}/${article.slug}` })),
        ...await patchNotes(),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
        .map(entry => `  <url><loc>${escape(absoluteUrl(entry.path))}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</url>`)
        .join("\n")}\n</urlset>\n`;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.write(xml);
    res.end();
    return { props: {} };
};

export default function Sitemap() { return null; }
