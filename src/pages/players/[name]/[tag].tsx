import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EmptyState, ListSkeleton, MatchList } from "@/components/account/Lists";
import Button from "@/components/Button";
import Notice from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import { api, ApiError, MatchEntry } from "@/lib/api";
import { rankIcon, rankName } from "@/lib/game";

type PublicProfile = {
    id: string;
    playerName: string;
    playerTag: string;
    title?: string;
    rank?: { tier?: number; division?: number };
    skill?: { tier?: number };
    matchHistory?: { totalWins?: number; totalLosses?: number };
    recentMatches: MatchEntry[];
};

export default function PlayerPage() {
    const router = useRouter();
    const name = typeof router.query.name === "string" ? router.query.name : "";
    const tag = typeof router.query.tag === "string" ? router.query.tag : "";
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [error, setError] = useState<{ status: number; message: string } | null>(null);

    useEffect(() => {
        if (!router.isReady) return;
        const controller = new AbortController();
        setProfile(null); setError(null);
        api<PublicProfile>(`/user/lookup/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, { signal: controller.signal })
            .then(setProfile)
            .catch(failure => {
                if (controller.signal.aborted) return;
                setError(failure instanceof ApiError ? { status: failure.status, message: failure.message } : { status: 0, message: "Couldn't load this player." });
            });
        return () => controller.abort();
    }, [router.isReady, name, tag]);

    const wins = profile?.matchHistory?.totalWins ?? 0;
    const losses = profile?.matchHistory?.totalLosses ?? 0;

    return <>
        <Head><title>{`${name}#${tag} - Rivalium`}</title></Head>
        <main className="w-full min-h-screen pb-16">
            <PageHeader title={name || "Player"} lead={profile?.title} crumbs={[{ label: "Home", href: "/" }, { label: "Players" }, { label: `${name}#${tag}` }]} compact />
            <div className="w-full max-w-4xl mx-auto px-4 flex flex-col gap-5 text-left">
                {error ? <Notice tone="error" title={error.status === 404 ? "Player not found" : "Something went wrong"}
                    action={<Button small type="frost" content="Back home" href="/" className="!mx-0" />}>
                    {error.status === 404 ? <>Nobody goes by <strong>{name}#{tag}</strong>. Check the name and tag.</> : error.message}
                </Notice>
                : <>
                    <div className="glass p-5 md:p-6 grid sm:grid-cols-[auto_1fr] gap-5 items-center">
                        {profile
                            ? <Image src={rankIcon(profile.rank?.tier)} alt={rankName(profile.rank?.tier)} width={96} height={96} className="w-24 h-24 object-contain mx-auto" />
                            : <div className="skeleton w-24 h-24 mx-auto" />}
                        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                ["Rank", profile ? rankName(profile.rank?.tier) : "…"],
                                ["Level", profile?.skill?.tier ?? "…"],
                                ["Wins", profile ? wins : "…"],
                                ["Win rate", profile ? (wins + losses ? `${Math.round((wins / (wins + losses)) * 100)}%` : "—") : "…"],
                            ].map(([label, value]) => <div key={String(label)} className="panel-inset p-3 text-center">
                                <dt className="label-caps text-[11px] text-lavender/80">{label}</dt>
                                <dd className="display text-2xl text-ink">{value}</dd>
                            </div>)}
                        </dl>
                    </div>
                    <section className="glass p-5 md:p-6 flex flex-col gap-4" aria-labelledby="recent-matches">
                        <h2 id="recent-matches" className="display text-xl text-ice">Recent matches</h2>
                        {!profile ? <ListSkeleton /> : profile.recentMatches.length
                            ? <MatchList matches={profile.recentMatches} />
                            : <EmptyState title="No matches yet" />}
                    </section>
                </>}
            </div>
        </main>
    </>;
}
