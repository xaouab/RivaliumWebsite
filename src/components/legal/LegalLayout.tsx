import Seo from "@/components/Seo";
import { ReactNode } from "react";
import PageHeader from "@/components/ui/PageHeader";

/** Long legal documents: sticky table of contents + one readable column (≈70ch). */
export default function LegalLayout({ title, revised, sections, children }: {
    title: string;
    revised: string;
    sections: { id: string; title: string }[];
    children: ReactNode;
}) {
    return <>
        <Seo title={title} description={`Rivalium ${title}, last revised ${revised}. How Kaura Interactive runs the game, the website and your account.`} type="article" />
        <main className="w-full min-h-screen pb-16">
            <PageHeader title={title} meta={`Last revised ${revised}`} crumbs={[{ label: "Home", href: "/" }, { label: title }]} compact />
            <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[16rem_1fr] gap-6 items-start text-left">
                <nav aria-label="On this page" className="glass-strong p-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
                    <p className="label-caps caps-md text-ice mb-2">On this page</p>
                    <ol className="flex flex-col gap-0.5 font-body text-sm">
                        {sections.map(section => <li key={section.id}>
                            <a href={`#${section.id}`} className="block rounded px-2 py-1.5 text-lavender hover:text-ink hover:bg-ice/10">{section.title}</a>
                        </li>)}
                    </ol>
                </nav>
                <article className="glass p-5 md:p-10">
                    <div className="prose-rivalium mx-auto">{children}</div>
                </article>
            </div>
        </main>
    </>;
}
