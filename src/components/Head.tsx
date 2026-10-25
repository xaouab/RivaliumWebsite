import Head from "next/head";
import { absoluteUrl, PUBLISHER, SITE_NAME } from "@/lib/site";

/** Site-wide head tags. Per-page title, description, canonical and share cards live in <Seo />. */
export default function HeadLayout() {
    return <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" key="viewport" />
        <meta name="theme-color" content="#030422" />
        <meta name="color-scheme" content="dark" />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="format-detection" content="telephone=no" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/favicon-180x180.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Who runs the site; describes visible facts only (Google structured-data guidelines). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": absoluteUrl("/#organization"),
                    name: PUBLISHER,
                    url: absoluteUrl("/"),
                    logo: absoluteUrl("/images/logo512.png"),
                    email: "support@rivalium.online",
                    sameAs: ["https://discord.rivalium.online", "https://instagram.com/rivaliumgame"],
                },
                { "@type": "WebSite", "@id": absoluteUrl("/#website"), name: SITE_NAME, url: absoluteUrl("/"), publisher: { "@id": absoluteUrl("/#organization") }, inLanguage: "en" },
            ],
        }) }} />
    </Head>;
}
