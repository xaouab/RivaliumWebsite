import { Children, cloneElement, isValidElement, ReactNode } from "react";
import styles from "./WikiContents.module.scss";

function textOf(node: ReactNode): string {
    return Children.toArray(node).map(child => {
        if (typeof child === "string" || typeof child === "number") return String(child);
        return isValidElement<{ children?: ReactNode }>(child) ? textOf(child.props.children) : "";
    }).join("");
}

/** Assign stable heading anchors while rendering, so the contents also work without client JavaScript. */
export default function WikiContents({ children }: { children: ReactNode }) {
    const headings: { id: string; title: string }[] = [];
    const ids = new Map<string, number>();
    function annotate(nodes: ReactNode): ReactNode {
        return Children.map(nodes, child => {
            if (!isValidElement<{ children?: ReactNode; id?: string }>(child)) return child;
            if (child.type === "h2") {
                const title = textOf(child.props.children);
                const base = child.props.id ?? (title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section");
                const count = (ids.get(base) ?? 0) + 1;
                ids.set(base, count);
                const id = count === 1 ? base : `${base}-${count}`;
                headings.push({ id, title });
                return cloneElement(child, { id });
            }
            return child.props.children ? cloneElement(child, {}, annotate(child.props.children)) : child;
        });
    }
    const body = annotate(children);
    return <div className={`${styles.layout} ${headings.length < 3 ? styles.singleColumn : ""}`}>
        {headings.length >= 3 && <nav aria-label="On this page" className={styles.contents}>
            <p className="label-caps caps-sm text-ice mb-2">On this page</p>
            <ul className="font-body text-sm space-y-2">
                {headings.map(heading => <li key={heading.id}><a href={`#${heading.id}`}>{heading.title}</a></li>)}
            </ul>
        </nav>}
        <div className={`prose-rivalium [&_figure]:my-6 ${styles.body}`}>{body}</div>
    </div>;
}
