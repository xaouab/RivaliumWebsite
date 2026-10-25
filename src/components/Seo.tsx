import Head from "next/head";
import { useRouter } from "next/router";
import { absoluteUrl, SHARE_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

type Props = {
    /** Page name; rendered as "<title> - Rivalium". Omit on the home page. */
    title?: string;
    description?: string;
    /** Private, transactional or error pages stay out of search results. */
    noindex?: boolean;
    image?: { path: string; width?: number; height?: number; alt: string };
    type?: "website" | "article" | "profile";
    /** Structured data for this page (schema.org JSON-LD). */
    jsonLd?: object | object[];
};

/** Per-page metadata: unique title and description, self-referencing canonical, Open Graph and Twitter cards. */
export default function Seo({ title, description = SITE_DESCRIPTION, noindex, image = SHARE_IMAGE, type = "website", jsonLd }: Props) {
    const { asPath } = useRouter();
    const path = asPath.split(/[?#]/)[0] || "/";
    const fullTitle = title ? `${title} - ${SITE_NAME}` : `${SITE_NAME} - ${SITE_TAGLINE}`;
    const url = absoluteUrl(path === "/" ? "/" : path.replace(/\/$/, ""));
    const imageUrl = image.path.startsWith("http") ? image.path : absoluteUrl(image.path);

    return <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} key="description" />
        {noindex
            ? <meta name="robots" content="noindex, nofollow" key="robots" />
            : <>
                <meta name="robots" content="index, follow, max-image-preview:large" key="robots" />
                <link rel="canonical" href={url} key="canonical" />
            </>}
        <meta property="og:title" content={fullTitle} key="og:title" />
        <meta property="og:description" content={description} key="og:description" />
        <meta property="og:type" content={type} key="og:type" />
        <meta property="og:url" content={url} key="og:url" />
        <meta property="og:image" content={imageUrl} key="og:image" />
        {image.width && <meta property="og:image:width" content={String(image.width)} key="og:image:width" />}
        {image.height && <meta property="og:image:height" content={String(image.height)} key="og:image:height" />}
        <meta property="og:image:alt" content={image.alt} key="og:image:alt" />
        <meta name="twitter:title" content={fullTitle} key="twitter:title" />
        <meta name="twitter:description" content={description} key="twitter:description" />
        <meta name="twitter:image" content={imageUrl} key="twitter:image" />
        <meta name="twitter:image:alt" content={image.alt} key="twitter:image:alt" />
        {jsonLd && <script type="application/ld+json" key="page-jsonld" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </Head>;
}
