import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return <Html lang="en" dir="ltr">
        <Head />
        <body>
            <noscript>
                <p style={{ padding: "1rem", textAlign: "center", color: "#B4BAF2", background: "#030422" }}>
                    Rivalium&apos;s website needs JavaScript for menus, sign-in and your account.
                </p>
            </noscript>
            <Main />
            <NextScript />
        </body>
    </Html>;
}
