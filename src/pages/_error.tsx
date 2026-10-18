import { NextPageContext } from "next";
import Head from "next/head";
import Button from "@/components/Button";
import PageHeader from "@/components/ui/PageHeader";

function ErrorPage({ statusCode }: { statusCode?: number }) {
    return <>
        <Head><title>Something went wrong - Rivalium</title></Head>
        <main className="w-full min-h-screen flex flex-col justify-center pb-16">
            <PageHeader centered title="Something broke" meta={statusCode ? `Error ${statusCode}` : "Error"}
                lead="We hit a snag loading this page. Try again in a moment."
                actions={<>
                    <Button type="main" content="Back home" href="/" />
                    <Button type="no-back" content="Contact support" href="/support" />
                </>} />
        </main>
    </>;
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => ({ statusCode: res?.statusCode ?? err?.statusCode });

export default ErrorPage;
