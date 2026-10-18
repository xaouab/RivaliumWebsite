import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import { EmptyState, ListSkeleton, MatchList, TransactionList } from "@/components/account/Lists";
import Button from "@/components/Button";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError, MatchEntry, Transaction } from "@/lib/api";
import { currencies, formatDate, formatNumber, rankIcon, rankName } from "@/lib/game";
import { useApi } from "@/lib/useApi";

export default function AccountOverview() {
    return <AccountLayout title="Overview" description="Your player card, balances and latest activity.">
        <Overview />
    </AccountLayout>;
}

function Overview() {
    const { user, token } = useAuth();
    const matches = useApi<{ matches: MatchEntry[] }>("/account/matches", { limit: 3 });
    const purchases = useApi<{ items: Transaction[] }>("/account/transactions", { limit: 3 });
    const [resend, setResend] = useState<"idle" | "sending" | "sent" | string>("idle");
    if (!user) return null;

    const sendVerification = async () => {
        setResend("sending");
        try {
            await api("/verify-email/resend", { method: "POST", token });
            setResend("sent");
        } catch (failure) {
            setResend(failure instanceof ApiError ? failure.message : "Couldn't send the email.");
        }
    };

    const level = user.skill?.tier ?? 1;
    const xpProgress = user.skill?.maxXP ? Math.min(100, Math.round(((user.skill.XP ?? 0) / user.skill.maxXP) * 100)) : 0;

    return <>
        {!user.confirmed && <Notice tone="warning" title="Verify your email"
            action={resend === "sent" ? undefined : <Button small type="frost" content="Resend link" loading={resend === "sending"} onClick={sendVerification} className="!mx-0 shrink-0" />}>
            {resend === "sent" ? <>We sent a new link to <strong>{user.email}</strong>.</>
                : resend !== "idle" && resend !== "sending" ? resend
                : <>Confirm <strong>{user.email}</strong> so you can recover your account if you lose your password.</>}
        </Notice>}

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
            <Card>
                <div className="flex items-center gap-4">
                    <Image src={rankIcon(user.rank?.tier)} alt="" width={72} height={72} className="w-[72px] h-[72px] object-contain" />
                    <div className="min-w-0">
                        <p className="display text-3xl text-ink truncate">{user.playerName ?? user.username}<span className="text-lavender/85 text-xl">#{user.playerTag}</span></p>
                        {user.title && <p className="font-body text-ice">{user.title}</p>}
                        <p className="font-body text-sm text-lavender/80">{rankName(user.rank?.tier)}{user.rank?.tier ? ` · Division ${(user.rank?.division ?? 0) + 1}` : ""} · Member since {formatDate(user.createdAt)}</p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between font-body text-sm text-lavender/80 mb-1">
                        <span>Level {level}</span>
                        <span className="tabular-nums">{formatNumber(user.skill?.XP)} / {formatNumber(user.skill?.maxXP)} XP</span>
                    </div>
                    <div className="h-2 rounded-full bg-night/60 overflow-hidden" role="progressbar" aria-valuenow={xpProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Level progress">
                        <div className="h-full bg-frost/80 rounded-full transition-[width] duration-500 ease-brand" style={{ width: `${xpProgress}%` }} />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button small type="frost" content="Edit profile" href="/account/profile" className="!mx-0" />
                    {user.playerName && user.playerTag && <Button small content="Public profile" href={`/players/${encodeURIComponent(user.playerName)}/${user.playerTag}`} className="!mx-0" />}
                </div>
            </Card>

            <Card title="Balances">
                <ul className="flex flex-col gap-2">
                    {currencies.map(currency => <li key={currency.id} className="panel-inset flex items-center gap-3 px-3 py-2">
                        <Image src={currency.icon} alt="" width={28} height={28} className="w-7 h-7" />
                        <span className="font-body text-lavender flex-1">{currency.label}</span>
                        <span className="display text-xl text-ink tabular-nums">{formatNumber(user.currency?.[currency.id])}</span>
                    </li>)}
                </ul>
                <p className="font-body text-sm text-lavender/80">
                    Battle pass season {user.battlePass?.season ?? 1}: tier <strong className="text-ink">{user.battlePass?.tier ?? 0}</strong>{user.battlePass?.premium ? " · Premium" : ""}
                </p>
            </Card>
        </div>

        <Card title="Recent matches" actions={<Link href="/account/matches" className="font-body text-sm text-ice hover:text-ink">See all →</Link>}>
            {matches.loading ? <ListSkeleton /> : matches.error ? <Notice tone="error">{matches.error}</Notice>
                : matches.data?.matches.length ? <MatchList matches={matches.data.matches} />
                : <EmptyState title="No matches yet">Your finished matches will show up here.</EmptyState>}
        </Card>

        <Card title="Recent purchases" actions={<Link href="/account/purchases" className="font-body text-sm text-ice hover:text-ink">See all →</Link>}>
            {purchases.loading ? <ListSkeleton /> : purchases.error ? <Notice tone="error">{purchases.error}</Notice>
                : purchases.data?.items.length ? <TransactionList items={purchases.data.items} />
                : <EmptyState title="Nothing here yet">Shop purchases, loot and gift codes will be listed here.</EmptyState>}
        </Card>
    </>;
}
