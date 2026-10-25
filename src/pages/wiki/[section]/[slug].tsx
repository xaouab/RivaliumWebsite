import { GetStaticPaths, GetStaticProps } from "next";
import Seo from "@/components/Seo";
import Link from "next/link";
import WikiContents from "@/components/wiki/WikiContents";
import WikiLayout from "@/components/wiki/WikiLayout";
import { articles, articlesIn, getArticle, readingPath, wikiHref, sectionLabels, WikiSection } from "@/data/wiki";

type Props = { section: WikiSection; slug: string };

export default function WikiArticlePage({ section, slug }: Props) {
    // Article bodies are JSX, so props carry only the keys and the article is looked up here.
    const article = getArticle(section, slug)!;
    const inPath = readingPath.includes(article);
    const siblings = inPath ? readingPath : articlesIn(section);
    const index = siblings.indexOf(article);
    const previous = siblings[index - 1];
    const next = siblings[index + 1];

    return <>
        <Seo title={`${article.title} - Wiki`} description={article.summary} type="article" />
        <WikiLayout
            title={article.title}
            crumbs={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: sectionLabels[section], href: `/wiki/${section}` }, { label: article.title }]}
        >
            {article.earlyLore && <p className="font-body text-sm text-lavender mb-6"><span className="chip">Early lore</span></p>}
            <p className="font-body text-lavender mb-6 max-w-prose">{article.summary}</p>
            <WikiContents>{article.body()}</WikiContents>
            <nav aria-label="Related topics" className="flex flex-col sm:flex-row justify-between gap-4 mt-10 pt-6 border-t border-ice/10 font-body">
                {previous ? <Link href={wikiHref(previous)} className="text-ice hover:text-ink">Previous: {previous.title}</Link> : <Link href="/wiki" className="text-ice hover:text-ink">Wiki home</Link>}
                {next ? <Link href={wikiHref(next)} className="text-ice hover:text-ink sm:text-right">Next: {next.title}</Link> : <Link href={inPath ? "/wiki/lore/world" : "/wiki"} className="text-ice hover:text-ink sm:text-right">Next: {inPath ? "Early lore" : "Wiki home"}</Link>}
            </nav>
        </WikiLayout>
    </>;
}

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: articles.map(article => ({ params: { section: article.section, slug: article.slug } })),
    fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const article = getArticle(String(params?.section), String(params?.slug));
    if (!article) return { notFound: true };
    return { props: { section: article.section, slug: article.slug } };
};
