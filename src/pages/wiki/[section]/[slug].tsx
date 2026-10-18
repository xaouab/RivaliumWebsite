import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import WikiLayout from "@/components/wiki/WikiLayout";
import { articles, articlesIn, getArticle, sectionLabels, WikiSection } from "@/data/wiki";

type Props = { section: WikiSection; slug: string };

export default function WikiArticlePage({ section, slug }: Props) {
    // Article bodies are JSX, so props carry only the keys and the article is looked up here.
    const article = getArticle(section, slug)!;
    const siblings = articlesIn(section);
    const index = siblings.indexOf(article);
    const previous = siblings[index - 1];
    const next = siblings[index + 1];

    return <>
        <Head>
            <title>{`${article.title} - Rivalium Wiki`}</title>
            <meta name="description" content={article.summary} />
        </Head>
        <WikiLayout
            title={article.title}
            lead={article.summary}
            crumbs={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: sectionLabels[section], href: `/wiki/${section}` }, { label: article.title }]}
        >
            <div className="prose-rivalium [&_figure]:my-6">
                {article.body()}
            </div>
            <nav aria-label="More articles" className="flex justify-between gap-3 mt-10 pt-6 border-t border-ice/10 font-body">
                {previous ? <Link href={`/wiki/${section}/${previous.slug}`} className="text-ice hover:text-ink">← {previous.title}</Link> : <span />}
                {next ? <Link href={`/wiki/${section}/${next.slug}`} className="text-ice hover:text-ink text-right">{next.title} →</Link> : <span />}
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
