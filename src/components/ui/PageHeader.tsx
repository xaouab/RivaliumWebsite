import Link from "next/link";
import { ReactNode } from "react";
import { FaChevronRight } from "react-icons/fa6";

export type Crumb = { label: string; href?: string };

/**
 * Page title block: breadcrumbs (where am I), solid display title with the brand underline,
 * lead text and actions. Left-aligned by default; centred only for short status pages.
 */
export default function PageHeader({ title, lead, crumbs, actions, meta, kicker, compact, centered, soft = true }: {
    title: string;
    lead?: ReactNode;
    crumbs?: Crumb[];
    actions?: ReactNode;
    /** Small factual line (date, version) — not a decorative eyebrow. */
    meta?: string;
    /** @deprecated kept for older call sites; rendered as `meta`. */
    kicker?: string;
    compact?: boolean;
    centered?: boolean;
    /** Page titles use the soft light peach → light red gradient; pass false for solid ink. */
    soft?: boolean;
}) {
    return <header className={`w-full max-w-6xl mx-auto flex flex-col gap-4 px-5 ${centered ? "items-center text-center" : "items-start text-left"} ${compact ? "pt-28 pb-8" : "pt-32 md:pt-40 pb-10 md:pb-14"}`}>
        {crumbs && crumbs.length > 0 && <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 font-body text-sm text-ink-2 title-halo">
                {crumbs.map((crumb, index) => <li key={crumb.label} className="flex items-center gap-1.5 whitespace-nowrap">
                    {index > 0 && <FaChevronRight aria-hidden className="text-[10px] opacity-60" />}
                    {crumb.href
                        ? <Link href={crumb.href} className="hover:text-ink underline-offset-4 hover:underline">{crumb.label}</Link>
                        : <span aria-current="page" className="text-ink">{crumb.label}</span>}
                </li>)}
            </ol>
        </nav>}
        <h1 className={`display title-mark max-w-full ${soft ? `text-gradient-soft is-soft w-fit ${centered ? "mx-auto" : ""}` : "text-ink title-halo"} ${centered ? "is-centered" : ""} ${compact ? "text-step-5" : "text-step-6"}`}>{title}</h1>
        {lead && <p className="font-body text-step-1 text-ink max-w-2xl title-halo">{lead}</p>}
        {(meta ?? kicker) && <p className="font-body text-sm text-ink-2 title-halo">{meta ?? kicker}</p>}
        {actions && <div className="flex flex-wrap gap-3 mt-2">{actions}</div>}
    </header>;
}
