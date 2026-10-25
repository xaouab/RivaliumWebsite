import { GetStaticPaths, GetStaticProps } from "next";
import Seo from "@/components/Seo";
import Image from "next/image";
import Link from "next/link";
import WikiLayout from "@/components/wiki/WikiLayout";
import RichText from "@/components/ui/RichText";
import VideoSlot from "@/components/ui/VideoSlot";
import { abilityIcon, getRival, present, Rival, rivalAvatar, rivals, rivalVideoId, slotLabels } from "@/data/rivals";

type Props = { rival: Rival; previous: Pick<Rival, "id" | "name">; next: Pick<Rival, "id" | "name"> };

export default function RivalPage({ rival, previous, next }: Props) {
    const accent = rival.archetype_color;
    return <>
        <Seo title={`${rival.name}, ${rival.title} - Wiki`} description={`${rival.name} is a ${rival.archetype} rival in Rivalium. Abilities, cooldowns, stats and how to play them.`}
            image={{ path: rivalAvatar(rival.id), alt: `${rival.name}, ${rival.title}` }} type="article" />
        <WikiLayout
            title={rival.name}
            crumbs={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Rivals", href: "/wiki/rivals" }, { label: rival.name }]}
        >
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex items-center gap-4 md:flex-col md:items-center md:w-40 shrink-0">
                    <span className="grid place-items-center w-24 h-24 rounded-full border-2" style={{ borderColor: accent, ["--accent" as any]: `${accent}66` }}>
                        <Image src={rivalAvatar(rival.id)} alt={`${rival.name} portrait`} width={80} height={80} className="[image-rendering:pixelated] w-20 h-20 rounded-full" priority />
                    </span>
                    <span className="label-caps caps-md px-3 py-1 rounded-full border" style={{ color: accent, borderColor: `${accent}66` }}>{rival.archetype}</span>
                </div>
                <div className="flex-1 min-w-0 prose-rivalium">
                    <RichText text={rival.description_markdown} />
                    <dl className="grid grid-cols-3 gap-3 not-prose mt-4">
                        {[
                            { label: "Health", value: rival.stats.health, icon: "health" },
                            { label: "Base speed", value: rival.stats.base_speed, icon: "speed" },
                            { label: "Ultimate charge", value: rival.stats.ultimate_charge, icon: "ultimate-charge" },
                        ].map(({ label, value, icon }) => <div key={label} className="panel-inset p-3 text-center">
                            <dt className="label-caps caps-sm text-lavender flex items-center justify-center gap-2">
                                <Image src={`/images/rivals/stats/${icon}.png`} alt="" width={20} height={20} className="w-5 h-5 object-contain [image-rendering:pixelated]" />
                                {label}
                            </dt>
                            <dd className="display text-2xl text-ink mt-1">{value}</dd>
                        </div>)}
                    </dl>
                </div>
            </div>

            <VideoSlot className="mt-8" aspect="wide" label={`${rival.name} overview: playstyle and ability combos`} assetId={rivalVideoId(rival.id)} />

            <h2 className="display text-step-3 text-ice mt-10 mb-4">Abilities</h2>
            <ol className="flex flex-col gap-4">
                {rival.abilities.map(ability => {
                    const slot = slotLabels[ability.slot];
                    const facts = [["Type", present(ability.type)], ["Duration", present(ability.duration)], ["Charges", present(ability.charges)]]
                        .filter((fact): fact is [string, string] => !!fact[1]);
                    return <li key={ability.slot} id={`ability-${ability.slot}`} className="panel-inset p-4 md:p-5 scroll-mt-28">
                        <div className="flex flex-col lg:flex-row gap-5">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <Image src={abilityIcon(rival.id, ability.slot)} alt="" width={48} height={48} className="w-12 h-12 rounded-md bg-night/50" />
                                    <div>
                                        <p className="label-caps caps-sm text-lavender flex items-center gap-2">{slot.name} <kbd className="keycap">{slot.key}</kbd></p>
                                        <h3 className="display text-step-2 text-ink">{ability.name}</h3>
                                    </div>
                                </div>
                                {facts.length > 0 && <ul className="flex flex-wrap gap-2 mt-3">
                                    {facts.map(([label, value]) => <li key={label} className="font-body text-xs px-2 py-1 rounded-full border border-ice/20 text-ice/90">
                                        <span className="text-lavender/80">{label}:</span> {value}
                                    </li>)}
                                </ul>}
                                <RichText text={ability.description_markdown} className="prose-rivalium mt-3" />
                            </div>
                            <VideoSlot className="lg:w-72 shrink-0" label={`${ability.name} in action`} assetId={rivalVideoId(rival.id, ability.slot)} />
                        </div>
                    </li>;
                })}
            </ol>

            <nav aria-label="Other rivals" className="flex justify-between gap-3 mt-10 font-body">
                <Link href={`/wiki/rivals/${previous.id}`} className="text-ice hover:text-ink">← {previous.name}</Link>
                <Link href={`/wiki/rivals/${next.id}`} className="text-ice hover:text-ink">{next.name} →</Link>
            </nav>
        </WikiLayout>
    </>;
}

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: rivals.map(rival => ({ params: { id: rival.id } })),
    fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const rival = getRival(String(params?.id));
    if (!rival) return { notFound: true };
    const index = rivals.indexOf(rival);
    const previous = rivals[(index - 1 + rivals.length) % rivals.length];
    const next = rivals[(index + 1) % rivals.length];
    return { props: { rival, previous: { id: previous.id, name: previous.name }, next: { id: next.id, name: next.name } } };
};
