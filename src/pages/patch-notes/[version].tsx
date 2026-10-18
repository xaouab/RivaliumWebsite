import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { FaArrowRight, FaChevronRight, FaMinus, FaPen, FaPlus, FaRightLeft, FaWrench } from 'react-icons/fa6';
import DefaultSplash from '@/assets/images/splash/patch-notes-splash.webp';
import Notice from '@/components/ui/Notice';
import PageHeader from '@/components/ui/PageHeader';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/game';

type Change = {
    title?: string;
    type: string;
    description: string;
    changes?: Change[];
    oldValue?: string | number;
    newValue?: string | number;
};

type VersionDetails = {
    version: string;
    changelog?: { title?: string; generalText: string; level: string; imageUrl?: string; changes: Change[] };
    published: boolean;
    publishedAt: number;
    publishedBy?: { username: string };
};

// Order and look of each change type. Every type has its own icon AND label, never color alone.
const changeTypes: Record<string, { score: number; label: string; icon: IconType; tone: string }> = {
    category: { score: 6, label: "", icon: FaChevronRight, tone: "text-ice" },
    add: { score: 5, label: "New", icon: FaPlus, tone: "text-success border-success/40" },
    adjust: { score: 4, label: "Tuned", icon: FaRightLeft, tone: "text-ice border-ice/40" },
    remove: { score: 3, label: "Removed", icon: FaMinus, tone: "text-danger border-danger/40" },
    fix: { score: 2, label: "Fixed", icon: FaWrench, tone: "text-gold border-gold/40" },
    change: { score: 1, label: "Changed", icon: FaPen, tone: "text-lavender border-lavender/40" },
};

function sortChanges(changes: Change[]): Change[] {
    return [...changes]
        .sort((a, b) => (changeTypes[b.type]?.score ?? 0) - (changeTypes[a.type]?.score ?? 0))
        .map(change => ({ ...change, changes: change.changes ? sortChanges(change.changes) : change.changes }));
}

function Changes({ changes, depth = 0 }: { changes: Change[]; depth?: number }) {
    return <ul className={`flex flex-col gap-3 ${depth > 0 ? "pl-4 md:pl-6 border-l border-ice/15" : ""}`}>
        {changes.map((change, index) => {
            const style = changeTypes[change.type] ?? changeTypes.change;
            if (change.type === "category") {
                return <li key={index} className="flex flex-col gap-3 mt-2">
                    <h3 className="display text-step-2 text-ice flex items-center gap-2"><style.icon aria-hidden className="text-base" />{change.title || "General"}</h3>
                    {change.description && <p className="font-body text-lavender">{change.description}</p>}
                    {change.changes && <Changes changes={change.changes} depth={depth + 1} />}
                </li>;
            }
            return <li key={index} className="panel-inset p-3 md:p-4 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`chip !py-0.5 ${style.tone}`}><style.icon aria-hidden className="text-[10px]" />{style.label}</span>
                    {change.title && <span className="font-body font-bold text-ink">{change.title}</span>}
                </div>
                {change.description && <p className="font-body text-lavender">{change.description}</p>}
                {change.type === 'adjust' && change.oldValue != null && change.newValue != null && <p className="font-body text-sm flex items-center gap-2 tabular-nums">
                    <span className="text-lavender/80 line-through decoration-danger/70">{change.oldValue}</span>
                    <FaArrowRight aria-label="becomes" className="text-ice" />
                    <span className="text-ink font-bold">{change.newValue}</span>
                </p>}
                {change.changes && <Changes changes={change.changes} depth={depth + 1} />}
            </li>;
        })}
    </ul>;
}

export default function VersionDetailsPage() {
    const router = useRouter();
    const version = typeof router.query.version === "string" ? router.query.version : "";
    const [details, setDetails] = useState<VersionDetails | null>(null);
    const [error, setError] = useState<{ status: number; message: string } | null>(null);

    useEffect(() => {
        if (!version) return;
        const controller = new AbortController();
        setDetails(null); setError(null);
        api<VersionDetails>(`/version/${encodeURIComponent(version)}`, { signal: controller.signal })
            .then(data => setDetails({ ...data, changelog: data.changelog ? { ...data.changelog, changes: sortChanges(data.changelog.changes ?? []) } : undefined }))
            .catch(failure => { if (!controller.signal.aborted) setError(failure instanceof ApiError ? { status: failure.status, message: failure.message } : { status: 0, message: "Couldn't load this update." }); });
        return () => controller.abort();
    }, [version]);

    const image = details?.changelog?.imageUrl || DefaultSplash.src;

    return <>
        <Head><title>{`Patch ${version} - Rivalium`}</title></Head>
        <main className="w-full min-h-screen pb-16">
            <div className="relative">
                <div aria-hidden className="absolute inset-x-0 top-0 h-[60vh] bg-cover bg-center opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" style={{ backgroundImage: `url(${image})` }} />
                <div className="relative">
                    <PageHeader title={`Patch ${version}`} meta={details ? formatDate(details.publishedAt) : undefined}
                        lead={details?.changelog?.title}
                        crumbs={[{ label: 'Home', href: '/' }, { label: 'Patch notes', href: '/patch-notes' }, { label: version || "…" }]} />
                </div>
            </div>
            <article className="relative max-w-3xl mx-auto px-4">
                {error ? <Notice tone="error" title={error.status === 404 ? "This update doesn't exist" : "Something went wrong"}
                    action={<Link href="/patch-notes" className="font-body text-sm underline shrink-0">All patch notes</Link>}>{error.message}</Notice>
                    : !details ? <div className="glass p-6 flex flex-col gap-3">{[0, 1, 2, 3].map(index => <div key={index} className="skeleton h-16" />)}</div>
                    : <div className="glass p-5 md:p-8 flex flex-col gap-6 text-left">
                        {details.changelog?.generalText && <p className="font-body text-step-1 text-ink/90 leading-relaxed">{details.changelog.generalText}</p>}
                        <hr className="divider" />
                        {details.changelog?.changes?.length
                            ? <Changes changes={details.changelog.changes} />
                            : <p className="font-body text-lavender">No detailed changes were listed for this version.</p>}
                        {details.publishedBy && <p className="font-body text-xs text-lavender/80">Published {formatDate(details.publishedAt)} by {details.publishedBy.username}</p>}
                    </div>}
                <Link href="/patch-notes" className="inline-block mt-6 font-body text-ice hover:text-ink">← All patch notes</Link>
            </article>
        </main>
    </>;
}
