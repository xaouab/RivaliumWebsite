import { ReactNode } from "react";

/** Section heading: solid display title with the brand underline, optional lead and action. No eyebrow. */
export default function SectionTitle({ id, title, lead, action }: {
    id?: string;
    title: string;
    lead?: ReactNode;
    action?: ReactNode;
    /** @deprecated eyebrows are off by default (Hallmark); ignored. */
    kicker?: string;
    /** @deprecated sections are left-aligned; ignored. */
    align?: "left" | "center";
}) {
    return <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
        <div className="flex flex-col gap-3 min-w-0">
            <h2 id={id} className="display text-step-4 text-ink title-mark title-halo">{title}</h2>
            {lead && <p className="font-body text-step-1 text-ink-2 max-w-2xl">{lead}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </div>;
}
