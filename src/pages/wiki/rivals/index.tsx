import Link from "next/link";
import Seo from "@/components/Seo";
import WikiLayout from "@/components/wiki/WikiLayout";
import RivalCard from "@/components/wiki/RivalCard";
import { rivals } from "@/data/rivals";

export default function RivalsIndex() {
    return <>
        <Seo title="Rivals - Wiki" description="All Rivalium rivals: Kenn, Gramin, Lenya and Masr. Archetypes, abilities and stats for each." />
        <WikiLayout
            title="Rivals"
            crumbs={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Rivals" }]}
        >
            <div className="prose-rivalium mb-6">
                <p>Archetypes describe how a rival approaches a fight. <strong>Skirmishers</strong> Kenn and Masr bring mobility and burst pressure. <strong>Marksman</strong> Gramin controls space with ranged fire. <strong>Catalyst</strong> Lenya combines damage, healing and utility.</p>
                <p>Open a rival for stats and abilities, or read <Link href="/wiki/getting-started/your-rival">Choose your rival</Link> for help choosing.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rivals.map(rival => <RivalCard key={rival.id} rival={rival} />)}
            </div>
        </WikiLayout>
    </>;
}
