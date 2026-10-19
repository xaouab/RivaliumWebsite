import { ReactNode } from "react";

/** Section heading: soft accent gradient title with the underline, optional action. No eyebrow, no description (owner). */
export default function SectionTitle({ id, title, action }: {
    id?: string;
    title: string;
    action?: ReactNode;
    /** @deprecated eyebrows are off by default (Hallmark); ignored. */
    kicker?: string;
    /** @deprecated sections are left-aligned; ignored. */
    align?: "left" | "center";
}) {
    return <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
        <div className="flex flex-col gap-3 min-w-0">
            <h2 id={id} className="display text-step-4 text-gradient-soft is-soft w-fit title-mark">{title}</h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </div>;
}
