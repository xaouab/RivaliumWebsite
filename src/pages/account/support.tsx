import AccountLayout, { Card } from "@/components/account/AccountLayout";
import { EmptyState, ListSkeleton } from "@/components/account/Lists";
import Button from "@/components/Button";
import Notice from "@/components/ui/Notice";
import { formatDate } from "@/lib/game";
import { useApi } from "@/lib/useApi";

type Ticket = { id: string; subject: string; state: string; createdAt: number; updatedAt?: number; resolvedAt?: number };

const states: Record<string, { label: string; classes: string }> = {
    open: { label: "Open", classes: "text-ice border-ice/40" },
    waiting_on_reply: { label: "Waiting for you", classes: "text-gold border-gold/50" },
    resolved: { label: "Resolved", classes: "text-success border-success/50" },
    closed: { label: "Closed", classes: "text-lavender border-lavender/40" },
};

export default function SupportTicketsPage() {
    const { data, error, loading, reload } = useApi<{ tickets: Ticket[] }>("/account/tickets");

    return <AccountLayout title="Support">
        <Card actions={<Button small type="frost" content="New message" href="/support" />} title="Your tickets">
            {error ? <Notice tone="error" action={<Button small type="frost" content="Retry" onClick={reload} />}>{error}</Notice>
                : loading && !data ? <ListSkeleton />
                : !data?.tickets.length ? <EmptyState title="No tickets yet">Need help? Send us a message from the Support page.</EmptyState>
                : <ul className="flex flex-col gap-2">
                    {data.tickets.map(ticket => {
                        const state = states[ticket.state] ?? states.open;
                        return <li key={ticket.id} className="panel-inset p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-body">
                            <span className={`chip !py-0.5 w-fit ${state.classes}`}>{state.label}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-ink truncate">{ticket.subject || "No subject"}</p>
                                <p className="text-xs text-lavender/80">Ticket {ticket.id}</p>
                            </div>
                            <p className="text-xs text-lavender/80 sm:text-right">Opened {formatDate(ticket.createdAt)}{ticket.updatedAt && ticket.updatedAt !== ticket.createdAt ? <><br />Updated {formatDate(ticket.updatedAt)}</> : null}</p>
                        </li>;
                    })}
                </ul>}
        </Card>
    </AccountLayout>;
}
