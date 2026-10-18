import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaDiscord, FaDownload } from "react-icons/fa6";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import CharacterSelect from "@/components/landing/CharacterSelect";
import HeroParallax from "@/components/landing/HeroParallax";
import RoundSequence from "@/components/landing/RoundSequence";
import SectionTitle from "@/components/ui/SectionTitle";
import VideoSlot from "@/components/ui/VideoSlot";
import { rivals } from "@/data/rivals";
import { api } from "@/lib/api";
import { formatDate, rankIcon, rankTiers } from "@/lib/game";

type VersionSummary = { version: string; publishedAt?: number; changelog?: { title?: string; generalText?: string } };

export default function Home() {
    const [versions, setVersions] = useState<VersionSummary[] | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        api<{ versions: (VersionSummary & { published?: boolean })[] }>("/version/all", { query: { itemsPerPage: 4, page: 1, level: "patch" }, signal: controller.signal })
            .then(data => setVersions(data.versions.filter(version => version.published).slice(0, 4)))
            .catch(() => setVersions([]));
        return () => controller.abort();
    }, []);

    const latest = versions?.[0];

    return <>
        <Head>
            <title>Rivalium - The Realm of Rivals</title>
            <meta name="description" content="Rivalium is a competitive 2.5D arena platformer. Pick a rival, take the gem, climb the ranks." />
        </Head>
        <main className="w-full">
            {/* Hero — full-screen, centred poster over the splash (owner's choice). */}
            <section aria-labelledby="hero-title" className="hero-stage isolate w-full min-h-[100svh] px-5 pt-28 pb-24 flex flex-col items-center justify-center gap-6 text-center relative">
                <HeroParallax />
                <div className="w-full max-w-xl"><Logo /></div>
                <h1 id="hero-title" className="display text-step-4 text-ink title-halo">Pick your rival. Take the gem.</h1>
                <p className="font-body text-step-1 text-ink max-w-2xl title-halo">
                    A competitive 2.5D arena platformer: four rivals, eight-round attack and defense, and movement that rewards the brave.
                </p>
                <div id="hero-cta" className="flex flex-wrap justify-center items-center gap-4">
                    <Button type="main" big framed content="Play now" Icon={FaDownload} href="/download" />
                    <a href="#rivals-heading" className="label-caps text-base text-ink hover:text-ice underline-offset-8 hover:underline title-halo px-2 py-3">Meet the rivals</a>
                </div>
                <ul className="flex flex-wrap justify-center gap-2" aria-label="At a glance">
                    <li className="chip">Pre-alpha on Windows</li>
                    <li className="chip">{rivals.length} rivals</li>
                    <li className="chip">{rankTiers.length} rank tiers</li>
                </ul>
                {latest && <Link href={`/patch-notes/${latest.version}`} className="group inline-flex items-center gap-3 font-body text-sm text-ink-2 hover:text-ink">
                    <span className="chip !text-ice">v{latest.version}</span>
                    <span className="title-halo">{latest.changelog?.title ?? "Latest update"}</span>
                    <FaArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>}
                <a href="#trailer" className="absolute bottom-6 label-caps text-sm text-ice hover:text-ink title-halo">See the game ↓</a>
            </section>

            <div className="max-w-6xl mx-auto px-5 flex flex-col gap-24 md:gap-36 pb-10">
                {/* Trailer — offset, not centred. */}
                <section aria-labelledby="trailer" className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 items-end text-left">
                    <div className="flex flex-col gap-4 lg:pb-6">
                        <h2 id="trailer" className="display text-step-4 text-ink title-mark">See it move</h2>
                        <p className="font-body text-step-1 text-ink-2">Dashes, grapples, ultimates: what a match feels like.</p>
                    </div>
                    <VideoSlot className="w-full shadow-2xl" label="Rivalium gameplay trailer" assetId="landing/trailer" />
                </section>

                {/* Pinned round sequence (Feature Stack) */}
                <section aria-labelledby="round-heading"><RoundSequence /></section>

                {/* Roster */}
                <section aria-labelledby="rivals-heading" className="flex flex-col gap-8 scroll-mt-28">
                    <SectionTitle id="rivals-heading" title="Choose your rival"
                        lead="Arrow keys or click. Each one plays differently."
                        action={<Button type="no-back" content="All rivals" href="/wiki/rivals" />} />
                    <CharacterSelect />
                </section>

                {/* Systems — irregular bento, real content per tile */}
                <section aria-labelledby="systems-heading" className="flex flex-col gap-8">
                    <SectionTitle id="systems-heading" title="What you'll master" />
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-left">
                        <Link href="/wiki/mechanics/movement" className="glass card-link md:col-span-4 md:row-span-2 p-6 flex flex-col gap-4">
                            <h3 className="display text-step-3 text-ink">Movement</h3>
                            <p className="font-body text-ink-2 max-w-lg">Double jump, slide, a dash on a three-second cooldown, a grappling hook and wall grabs. Every rival shares the kit.</p>
                            <VideoSlot className="mt-auto" aspect="wide" label="Dash into grapple into wall grab" assetId="landing/movement" />
                        </Link>
                        <Link href="/wiki/gameplay/gem" className="glass card-link md:col-span-2 p-6 flex flex-col gap-3">
                            <h3 className="display text-step-2 text-ink">The gem</h3>
                            <p className="font-body text-ink-2">One defender carries it. Take them down to score.</p>
                        </Link>
                        <Link href="/wiki/gameplay/ranked" className="glass card-link md:col-span-2 p-6 flex flex-col gap-4">
                            <h3 className="display text-step-2 text-ink">Ranks</h3>
                            <div className="flex -space-x-2" aria-label="Bronze to Grandrival">
                                {[1, 3, 5, 6, 7, 9].map(tier => <Image key={tier} src={rankIcon(tier)} alt="" width={40} height={40} className="w-10 h-10 object-contain" />)}
                            </div>
                            <p className="font-body text-ink-2">Bronze to Grandrival.</p>
                        </Link>
                        <Link href="/wiki/mechanics/orbstones" className="glass card-link md:col-span-3 p-6 flex flex-col gap-3">
                            <h3 className="display text-step-2 text-ink">Orbstones</h3>
                            <p className="font-body text-ink-2">Lethality, Vitality, Haste. Up to ten stacks of each.</p>
                        </Link>
                        <Link href="/wiki/mechanics/status-effects" className="glass card-link md:col-span-3 p-6 flex flex-col gap-3">
                            <h3 className="display text-step-2 text-ink">19 status effects</h3>
                            <p className="font-body text-ink-2">From Swiftness and Shield to Bleed and Shattering.</p>
                        </Link>
                    </div>
                </section>

                {/* Updates — an index, not cards */}
                <section aria-labelledby="news-heading" className="flex flex-col gap-6">
                    <SectionTitle id="news-heading" title="Latest updates" action={<Button type="no-back" content="All patch notes" href="/patch-notes" />} />
                    {versions === null
                        ? <div className="flex flex-col gap-2">{[0, 1, 2].map(index => <div key={index} className="skeleton h-16" />)}</div>
                        : versions.length === 0
                            ? <p className="glass p-6 font-body text-ink-2 text-left">Patch notes will appear here with the next update.</p>
                            : <ul className="glass divide-y divide-ice/10 text-left overflow-hidden">
                                {versions.map(version => <li key={version.version}>
                                    <Link href={`/patch-notes/${version.version}`} className="group grid grid-cols-[6rem_minmax(0,1fr)_auto] md:grid-cols-[8rem_minmax(0,1fr)_10rem_auto] items-center gap-4 px-5 py-4 hover:bg-paper-4 transition-colors">
                                        <span className="display text-step-1 text-ink tabular-nums">{version.version}</span>
                                        <span className="font-body text-ink-2 truncate">{version.changelog?.title || "Update"}</span>
                                        <span className="hidden md:block font-body text-sm text-ink-3 tabular-nums">{formatDate(version.publishedAt)}</span>
                                        <FaArrowRight aria-hidden className="text-ice transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </Link>
                                </li>)}
                            </ul>}
                </section>

                {/* Repeat the action, plainly. */}
                <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-ice/10 pt-12 text-left">
                    <p className="display text-step-3 text-ink max-w-[20ch]">Ready when you are.</p>
                    <div className="flex flex-wrap gap-4">
                        <Button type="main" big content="Download" Icon={FaDownload} href="/download" />
                        <Button type="no-back" big content="Join Discord" Icon={FaDiscord} href="https://discord.rivalium.online" external />
                    </div>
                </section>
            </div>
        </main>
    </>;
}
