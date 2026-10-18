import Head from "next/head";
import WikiLayout from "@/components/wiki/WikiLayout";
import RivalCard from "@/components/wiki/RivalCard";
import { rivals } from "@/data/rivals";

export default function RivalsIndex() {
    return <>
        <Head><title>Rivals - Rivalium Wiki</title></Head>
        <WikiLayout
            title="Rivals"
            lead="Four rivals, each with five abilities and their own way to win a fight."
            crumbs={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Rivals" }]}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rivals.map(rival => <RivalCard key={rival.id} rival={rival} />)}
            </div>
        </WikiLayout>
    </>;
}
