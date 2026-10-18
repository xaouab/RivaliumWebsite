import Image from "next/image";
import Link from "next/link";
import { MatchEntry, Transaction } from "@/lib/api";
import { currencyIcon, currencyLabel, formatDate, formatNumber, matchTypeName, timeAgo, transactionLabels } from "@/lib/game";

const resultStyles = {
    WIN: "text-success border-success/40 bg-success/10",
    LOSS: "text-danger border-danger/40 bg-danger/10",
    DRAW: "text-ice border-ice/30 bg-ice/10",
};

export function MatchList({ matches, linkPlayers = true }: { matches: MatchEntry[]; linkPlayers?: boolean }) {
    return <ul className="flex flex-col gap-2">
        {matches.map(match => <li key={match.id} className="panel-inset p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className={`label-caps text-sm w-16 text-center py-1 rounded-md border ${resultStyles[match.result]}`}>{match.result}</span>
            <div className="flex-1 min-w-0 font-body">
                <p className="text-ink">
                    {matchTypeName(match.type)} · <span className="tabular-nums">{match.yourScore} – {match.opponentScore}</span>
                </p>
                <p className="text-sm text-lavender/80 truncate">
                    vs {match.opponents.length === 0 ? "unknown" : match.opponents.map((opponent, index) => <span key={opponent.id}>
                        {index > 0 && ", "}
                        {linkPlayers && opponent.playerName && opponent.playerTag
                            ? <Link className="hover:text-ink underline-offset-2 hover:underline" href={`/players/${encodeURIComponent(opponent.playerName)}/${opponent.playerTag}`}>{opponent.playerName}#{opponent.playerTag}</Link>
                            : `${opponent.playerName ?? "Player"}${opponent.playerTag ? `#${opponent.playerTag}` : ""}`}
                    </span>)}
                </p>
            </div>
            <dl className="grid grid-cols-4 gap-3 text-center font-body text-sm">
                {[["K", match.yourStats.kills], ["D", match.yourStats.deaths], ["A", match.yourStats.assists], ["Gems", match.yourStats.gemsPlanted]].map(([label, value]) =>
                    <div key={label}><dt className="text-lavender/80 text-xs">{label}</dt><dd className="text-ink tabular-nums">{value}</dd></div>)}
            </dl>
            <time className="font-body text-xs text-lavender/80 sm:w-24 sm:text-right" dateTime={new Date(match.endedAt).toISOString()} title={formatDate(match.endedAt, true)}>{timeAgo(match.endedAt)}</time>
        </li>)}
    </ul>;
}

function Amount({ currency, amount, sign }: { currency?: string; amount?: number; sign: "+" | "−" }) {
    return <span className={`inline-flex items-center gap-1.5 tabular-nums ${sign === "+" ? "text-success" : "text-lavender"}`}>
        {sign}{formatNumber(amount)}
        <Image src={currencyIcon(currency)} alt={currencyLabel(currency)} width={16} height={16} className="w-4 h-4" />
    </span>;
}

export function TransactionList({ items }: { items: Transaction[] }) {
    return <ul className="flex flex-col gap-2">
        {items.map(item => {
            const currencyGains = item.gained.filter(gain => gain.type === "currency");
            const itemGains = item.gained.filter(gain => gain.type !== "currency");
            return <li key={item.id} className="panel-inset p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-body">
                <div className="flex-1 min-w-0">
                    <p className="text-ink">{item.description || transactionLabels[item.kind] || item.kind}</p>
                    <p className="text-sm text-lavender/80">
                        {transactionLabels[item.kind] ?? item.kind}
                        {itemGains.length > 0 && <> · {itemGains.map(gain => gain.name ?? gain.category ?? "Item").join(", ")}</>}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                    {item.spent.map((cost, index) => <Amount key={`s${index}`} sign="−" currency={cost.currency} amount={cost.amount} />)}
                    {currencyGains.map((gain, index) => <Amount key={`g${index}`} sign="+" currency={gain.currency} amount={gain.amount} />)}
                </div>
                <time className="text-xs text-lavender/80 sm:w-32 sm:text-right" dateTime={new Date(item.createdAt).toISOString()}>{formatDate(item.createdAt, true)}</time>
            </li>;
        })}
    </ul>;
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
    return <div className="flex flex-col gap-2" aria-hidden>
        {Array.from({ length: rows }, (_, index) => <div key={index} className="skeleton h-16" />)}
    </div>;
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
    return <div className="panel-inset p-6 text-center font-body">
        <p className="text-ink">{title}</p>
        {children && <div className="text-sm text-lavender/80 mt-1">{children}</div>}
    </div>;
}
