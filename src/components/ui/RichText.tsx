import { Fragment, ReactNode } from "react";

/**
 * Renders the small markdown subset used in game data: **bold**, [label](ability://slot) links
 * (to an ability anchor on the same page), [label](/path) links and paragraph breaks.
 * Keeps the wiki dependency-free; anything richer belongs in a real article component.
 */
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
    const paragraphs = text.trim().split(/\n\s*\n/);
    return <div className={className}>
        {paragraphs.map((paragraph, index) => <p key={index}>{inline(paragraph.replace(/\s*\n\s*/g, " "))}</p>)}
    </div>;
}

function inline(source: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(source))) {
        if (match.index > last) nodes.push(source.slice(last, match.index));
        if (match[1] !== undefined) {
            nodes.push(<strong key={match.index}>{match[1]}</strong>);
        } else {
            const [, label, target] = match;
            const href = target.startsWith("ability://") ? `#ability-${target.slice("ability://".length)}` : target;
            nodes.push(<a key={match.index} href={href}>{label}</a>);
        }
        last = pattern.lastIndex;
    }
    if (last < source.length) nodes.push(source.slice(last));
    return nodes.map((node, index) => <Fragment key={index}>{node}</Fragment>);
}
