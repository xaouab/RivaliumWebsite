import { NextPageContext } from "next";
import Seo from "@/components/Seo";
import Button from "@/components/Button";
import PageHeader from "@/components/ui/PageHeader";

function ErrorPage({ statusCode }: { statusCode?: number }) {
    return <>
        <Seo title="Something went wrong" noindex />
        <main className="w-full min-h-screen flex flex-col justify-center pb-16">
            <PageHeader centered title="Something broke" meta={statusCode ? `Error ${statusCode}` : "Error"} 
                actions={<>
                    <Button type="main" content="Back home" href="/" />
                    <Button type="no-back" content="Contact support" href="/support" />
                </>} />
        </main>
    </>;
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => ({ statusCode: res?.statusCode ?? err?.statusCode });

export default ErrorPage;
