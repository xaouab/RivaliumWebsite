import Seo from "@/components/Seo";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import Button from '@/components/Button';
import Notice from '@/components/ui/Notice';
import PageHeader from '@/components/ui/PageHeader';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/game';

type Version = {
    version: string;
    published?: boolean;
    publishedAt?: number;
    changelog?: { title?: string; generalText?: string; imageUrl?: string };
};

// The API includes broader levels: "patch" also returns minor and season releases.
const filters = [
    { id: 'patch', label: 'All updates' },
    { id: 'minor', label: 'Major updates' },
    { id: 'season', label: 'Seasons' },
];
const itemsPerPage = 12;

export default function PatchNotes() {
    const [versions, setVersions] = useState<Version[] | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('patch');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setVersions(null); setError(null);
        api<{ versions: Version[]; total: number }>('/version/all', { query: { itemsPerPage, page, level: filter }, signal: controller.signal })
            .then(data => { setVersions(data.versions.filter(version => version.published)); setTotal(data.total); })
            .catch(failure => { if (!controller.signal.aborted) setError(failure instanceof ApiError ? failure.message : "Couldn't load patch notes."); });
        return () => controller.abort();
    }, [page, filter]);

    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

    return <>
        <Seo title="Patch Notes" description="Every Rivalium update: balance changes, new rivals and cosmetics, bug fixes and hotfixes, newest first." />
        <main className="w-full min-h-screen pb-16">
            <PageHeader title="Patch Notes" compact
                crumbs={[{ label: 'Home', href: '/' }, { label: 'Patch notes' }]} />

            <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="segmented" role="group" aria-label="Filter updates">
                        {filters.map(item => <button key={item.id} type="button" aria-pressed={filter === item.id}
                            onClick={() => { setFilter(item.id); setPage(1); }}>{item.label}</button>)}
                    </div>
                    {totalPages > 1 && <nav aria-label="Pages" className="flex items-center gap-2">
                        <Button small type="no-back" content="Newer" disabled={page === 1} onClick={() => setPage(page - 1)} />
                        <span className="font-body text-sm text-lavender tabular-nums px-1">{page} / {totalPages}</span>
                        <Button small type="no-back" content="Older" disabled={page >= totalPages} onClick={() => setPage(page + 1)} />
                    </nav>}
                </div>

                {error ? <Notice tone="error" title="Patch notes are unavailable">{error}</Notice>
                    : versions === null ? <div className="flex flex-col gap-2">{Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton h-20" />)}</div>
                    : versions.length === 0 ? <div className="glass p-8 text-center font-body text-lavender">No updates in this category yet.</div>
                    : <ul className="glass divide-y divide-ice/10 overflow-hidden text-left">
                        {versions.map((version, index) => <li key={version.version}>
                            <Link href={`/patch-notes/${version.version}`} className="group grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[9rem_minmax(0,1fr)_9rem_auto] items-center gap-x-6 gap-y-1 px-5 md:px-6 py-5 hover:bg-paper-4 transition-colors">
                                <span className="display text-step-2 text-ink tabular-nums flex items-center gap-3">
                                    {version.version}
                                    {index === 0 && page === 1 && <span className="chip !text-ice !py-0.5">Latest</span>}
                                </span>
                                <span className="col-span-2 md:col-span-1 row-start-2 md:row-start-auto flex flex-col min-w-0">
                                    <span className="font-body text-step-0 text-ink truncate">{version.changelog?.title || `Update ${version.version}`}</span>
                                    {version.changelog?.generalText && <span className="font-body text-sm text-ink-2 line-clamp-1">{version.changelog.generalText}</span>}
                                </span>
                                <span className="hidden md:block font-body text-sm text-ink-3 tabular-nums">{formatDate(version.publishedAt)}</span>
                                <FaArrowRight aria-hidden className="text-ice justify-self-end transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>
                        </li>)}
                    </ul>}
            </div>
        </main>
    </>;
}
