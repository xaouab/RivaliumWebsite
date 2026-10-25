import { GetStaticPaths, GetStaticProps } from "next";
import Seo from "@/components/Seo";
import Link from "next/link";
import WikiLayout from "@/components/wiki/WikiLayout";
import { articlesIn, sectionLabels, WikiSection } from "@/data/wiki";

type Props = { section: WikiSection };

export default function WikiSectionPage({ section }: Props) {
    const label = sectionLabels[section];
    return <>
        <Seo title={`${label} - Wiki`} description={`Rivalium ${label.toLowerCase()} guides: ${articlesIn(section).map(article => article.title.toLowerCase()).join(", ")}.`} />
        <WikiLayout title={label} crumbs={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label }]}>
            <ul className="flex flex-col gap-3">
                {articlesIn(section).map(article => <li key={article.slug}>
                    <Link href={`/wiki/${section}/${article.slug}`} className="panel-inset block p-4 transition-colors hover:border-ice/40">
                        <span className="display text-xl text-ink">{article.title}</span>
                        <span className="block font-body text-sm text-lavender/80 mt-1">{article.summary}</span>
                    </Link>
                </li>)}
            </ul>
        </WikiLayout>
    </>;
}

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: (Object.keys(sectionLabels) as WikiSection[]).map(section => ({ params: { section } })),
    fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ({
    props: { section: params?.section as WikiSection },
});
