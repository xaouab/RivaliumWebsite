import Seo from "@/components/Seo";
import { FaDownload, FaPaperPlane } from "react-icons/fa6";
import Button from "@/components/Button";

/** Internal reference sheet: every website button style. Not linked, not indexed. Client twin: ShellPreview `buttons`. */
export default function ButtonSheet() {
    const rows: { role: string; node: (disabled?: boolean) => JSX.Element }[] = [
        { role: "Primary · ember, one per view", node: d => <Button type="main" content="Send message" Icon={FaPaperPlane} disabled={d} /> },
        { role: "Primary · small (nav)", node: d => <Button type="main" small content="Play" Icon={FaDownload} disabled={d} /> },
        { role: "Secondary · frost (default)", node: d => <Button content="Sign in" disabled={d} /> },
        { role: "Secondary · small", node: d => <Button small content="My tickets" disabled={d} /> },
        { role: "Premium · gold gradient + shine", node: d => <Button type="premium" content="Unlock premium" disabled={d} /> },
        { role: "Tertiary · ghost", node: d => <Button type="no-back" content="Send another" disabled={d} /> },
        { role: "Loading", node: () => <Button content="Saving" loading /> },
    ];
    return <main className="w-full min-h-screen pt-32 pb-16 px-6">
        <Seo title="Buttons" noindex />
        <div className="max-w-5xl mx-auto glass p-8 flex flex-col gap-6 text-left">
            <h1 className="display text-step-5 text-gradient-soft is-soft w-fit title-mark">Website buttons</h1>
            <div className="grid grid-cols-[16rem_1fr_1fr] gap-x-6 gap-y-5 items-center">
                <span /><span className="label-caps caps-sm text-ink-3">Default (hover / focus live)</span><span className="label-caps caps-sm text-ink-3">Disabled</span>
                {rows.map(row => <div key={row.role} className="contents">
                    <span className="label-caps caps-md text-ink-2">{row.role}</span>
                    <div>{row.node()}</div>
                    <div>{row.node(true)}</div>
                </div>)}
            </div>
        </div>
    </main>;
}
