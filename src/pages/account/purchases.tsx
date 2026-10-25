import { useState } from "react";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import { EmptyState, ListSkeleton, TransactionList } from "@/components/account/Lists";
import Button from "@/components/Button";
import Notice from "@/components/ui/Notice";
import { Transaction } from "@/lib/api";
import { useApi } from "@/lib/useApi";

const PAGE_SIZE = 20;

export default function PurchasesPage() {
    const [page, setPage] = useState(0);
    const { data, error, loading, reload } = useApi<{ items: Transaction[]; total: number }>("/account/transactions", { page, limit: PAGE_SIZE });
    const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

    return <AccountLayout title="Purchases">
        <Card>
            {error ? <Notice tone="error" action={<Button small type="frost" content="Retry" onClick={reload} className="!mx-0" />}>{error}</Notice>
                : loading && !data ? <ListSkeleton rows={6} />
                : !data || data.items.length === 0 ? <EmptyState title="No purchases yet">Everything you buy or redeem in the game will be listed here.</EmptyState>
                : <>
                    <TransactionList items={data.items} />
                    {pages > 1 && <nav aria-label="Pages" className="flex items-center justify-center gap-3 font-body text-sm">
                        <Button small type="frost" content="Newer" disabled={page === 0 || loading} onClick={() => setPage(page - 1)} className="!mx-0" />
                        <span className="text-lavender/80 tabular-nums">Page {page + 1} of {pages}</span>
                        <Button small type="frost" content="Older" disabled={page + 1 >= pages || loading} onClick={() => setPage(page + 1)} className="!mx-0" />
                    </nav>}
                </>}
            <p className="font-body text-xs text-lavender/80">History starts from when purchase tracking was introduced. Need help with a purchase? <a className="underline" href="/support">Contact support</a>.</p>
        </Card>
    </AccountLayout>;
}
