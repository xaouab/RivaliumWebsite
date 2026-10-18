import Head from "next/head";
import Button from "@/components/Button";
import PageHeader from "@/components/ui/PageHeader";

/** Lost players get a way back, not a dead end. */
export default function NotFound() {
    return <>
        <Head><title>Page not found - Rivalium</title></Head>
        <main className="w-full min-h-screen flex flex-col justify-center pb-16">
            <PageHeader centered title="Off the map" meta="Error 404" lead="This page doesn't exist, or it moved. Here's where you can go instead."
                actions={<>
                    <Button type="main" content="Back home" href="/" />
                    <Button type="no-back" content="Wiki" href="/wiki" />
                    <Button type="no-back" content="Support" href="/support" />
                </>} />
        </main>
    </>;
}
