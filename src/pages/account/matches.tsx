import { useState } from "react";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import { EmptyState, ListSkeleton, MatchList } from "@/components/account/Lists";
import Button from "@/components/Button";
import Notice from "@/components/ui/Notice";
import { MatchEntry } from "@/lib/api";
import { useApi } from "@/lib/useApi";

export default function MatchesPage() {
    const [limit, setLimit] = useState(20);
    const { data, error, loading, reload } = useApi<{ matches: MatchEntry[] }>("/account/matches", { limit });
    const matches = data?.matches ?? [];
    const wins = matches.filter(match => match.result === "WIN").length;

    return <AccountLayout title="Match history">
        {matches.length > 0 && <div className="grid grid-cols-3 gap-3">
            {[["Matches", matches.length], ["Wins", wins], ["Win rate", `${Math.round((wins / matches.length) * 100)}%`]].map(([label, value]) =>
                <div key={label} className="glass p-4 text-center">
                    <p className="label-caps caps-sm text-lavender/80">{label}</p>
                    <p className="display text-3xl text-ink tabular-nums">{value}</p>
                </div>)}
        </div>}
        <Card>
            {error ? <Notice tone="error" action={<Button small type="frost" content="Retry" onClick={reload} className="!mx-0" />}>{error}</Notice>
                : loading && !data ? <ListSkeleton rows={5} />
                : matches.length === 0 ? <EmptyState title="No matches yet">Play a match and it will show up here.</EmptyState>
                : <>
                    <MatchList matches={matches} />
                    {matches.length >= limit && limit < 50 && <div className="flex justify-center">
                        <Button type="frost" content="Show more" loading={loading} onClick={() => setLimit(50)} className="!mx-0" />
                    </div>}
                </>}
        </Card>
    </AccountLayout>;
}
