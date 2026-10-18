import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDiscord, FaWindows } from "react-icons/fa6";
import Button from "@/components/Button";
import Notice from "@/components/ui/Notice";
import { apiUrl } from "@/components/constant";
import { useAuth } from "@/contexts/AuthContext";

type Platform = "windows" | "mac" | "linux" | "other";

const specs = {
    minimum: [
        ["OS", "Windows 7/8/8.1/10 (64-bit)"],
        ["Processor", "Intel Core i3 (6th gen or newer) or AMD equivalent"],
        ["Graphics", "Nvidia GTX 750 Ti or AMD equivalent (2 GB VRAM)"],
        ["Memory", "4 GB RAM"],
        ["Storage", "1 to 2 GB"],
        ["Network", "Stable broadband (1 Mbps up/down)"],
    ],
    recommended: [
        ["OS", "Windows 10/11 (64-bit)"],
        ["Processor", "Intel Core i5 (9th gen or newer) or AMD Ryzen 5"],
        ["Graphics", "Nvidia GTX 1650 or AMD RX 570 (4 GB VRAM)"],
        ["Memory", "8 GB RAM"],
        ["Storage", "3 GB"],
        ["Network", "Low-latency broadband (5 to 10 Mbps up/down)"],
    ],
};

const steps = [
    { title: "Create your account", text: "One account for the game and the website." },
    { title: "Download and install", text: "Run the installer and follow the steps. Windows may ask you to confirm the publisher." },
    { title: "Sign in and play", text: "Launch Rivalium and sign in with your username or email." },
];

const faq = [
    { q: "When are Mac and Linux coming?", a: "They're planned, but Windows is the only supported platform during pre-alpha. Join the Discord to hear about it first." },
    { q: "The game won't start or connect.", a: "Make sure you have the latest version from this page, then check the patch notes for server status. Still stuck? Contact support." },
];

function detectPlatform(): Platform {
    if (typeof navigator === "undefined") return "other";
    const agent = navigator.userAgent.toLowerCase();
    if (agent.includes("win")) return "windows";
    if (agent.includes("mac")) return "mac";
    if (agent.includes("linux") && !agent.includes("android")) return "linux";
    return "other";
}

export default function DownloadPage() {
    const { status } = useAuth();
    const [platform, setPlatform] = useState<Platform>("windows");
    useEffect(() => setPlatform(detectPlatform()), []);

    return <>
        <Head>
            <title>Download Rivalium - The Realm of Rivals</title>
            <meta name="description" content="Download Rivalium for Windows. System requirements, install steps and FAQ." />
        </Head>
        <main className="w-full min-h-screen pb-16">
            {/* Split Studio: text half / proof half, alternating direction. */}
            <section aria-labelledby="download-title" className="max-w-6xl mx-auto px-5 pt-32 md:pt-40 pb-14 grid lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] gap-10 items-center text-left">
                <div className="flex flex-col items-start gap-5">
                    <nav aria-label="Breadcrumb" className="font-body text-sm text-ink-2 title-halo"><Link href="/" className="hover:text-ink">Home</Link> <span aria-hidden>›</span> <span className="text-ink">Download</span></nav>
                    <h1 id="download-title" className="display text-step-6 text-ink title-mark title-halo">Download</h1>
                    <p className="font-body text-step-1 text-ink max-w-xl title-halo">Rivalium is in pre-alpha. Expect rough edges, frequent updates and plenty of fights.</p>
                    {platform !== "windows" && <Notice tone="info">
                        {platform === "other" ? "Rivalium runs on Windows PCs." : `Rivalium isn't available on ${platform === "mac" ? "macOS" : "Linux"} yet.`} You can still download the Windows build for another computer.
                    </Notice>}
                    <div id="hero-cta" className="flex flex-col items-start gap-3">
                        <Button type="main" big content="Download for Windows" Icon={FaWindows} href={`${apiUrl}/cdn/download/windows`} external />
                        <p className="font-body text-sm text-ink-2">64-bit Windows, pre-alpha build. macOS and Linux will come later.</p>
                    </div>
                </div>
                <div className="glass p-6 md:p-7">
                    <h2 id="requirements" className="display text-step-2 text-ink mb-5">System requirements</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {(["minimum", "recommended"] as const).map(kind => <div key={kind}>
                            <h3 className="label-caps text-sm text-ice mb-2">{kind}</h3>
                            <dl className="font-body text-sm divide-y divide-ice/10">
                                {specs[kind].map(([label, value]) => <div key={label} className="flex flex-col py-2">
                                    <dt className="text-ink-3">{label}</dt>
                                    <dd className="text-ink">{value}</dd>
                                </div>)}
                            </dl>
                        </div>)}
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-5 flex flex-col gap-20 text-left">
                {/* Reversed split: proof left, text right. */}
                <section aria-labelledby="install" className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 items-center">
                    <ol className="glass divide-y divide-ice/10 overflow-hidden order-2 lg:order-1">
                        {steps.map((step, index) => <li key={step.title} className="p-5 flex gap-4">
                            <span className="display text-step-3 text-frost leading-none w-8 shrink-0 tabular-nums">{index + 1}</span>
                            <div>
                                <p className="label-caps text-ink">{step.title}</p>
                                <p className="font-body text-ink-2 mt-1">{step.text}</p>
                                {index === 0 && status !== "signed-in" && <Link href="/portal/register" className="inline-block font-body text-ice underline underline-offset-4 mt-2 hover:text-ink">Create an account</Link>}
                            </div>
                        </li>)}
                    </ol>
                    <div className="order-1 lg:order-2 flex flex-col gap-4">
                        <h2 id="install" className="display text-step-4 text-ink title-mark">Three steps to your first match</h2>
                        <p className="font-body text-step-1 text-ink-2">One account works in the game and on this site. Install, sign in, and you&apos;re in the lobby.</p>
                    </div>
                </section>

                <section aria-labelledby="faq" className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 items-start">
                    <div className="flex flex-col gap-4">
                        <h2 id="faq" className="display text-step-4 text-ink title-mark">Questions</h2>
                        <p className="font-body text-ink-2">Still stuck? The team answers on Discord and by email.</p>
                        <div className="flex flex-wrap gap-3">
                            <Button type="no-back" content="Support" href="/support" />
                            <Button type="no-back" content="Discord" Icon={FaDiscord} href="https://discord.rivalium.online" external />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {faq.map(item => <details key={item.q} className="glass p-5 group">
                            <summary className="font-body text-step-0 text-ink cursor-pointer list-none flex justify-between gap-3 min-h-[28px]">
                                {item.q}<span aria-hidden className="text-ice text-xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                            </summary>
                            <p className="font-body text-ink-2 mt-3">{item.a}</p>
                        </details>)}
                    </div>
                </section>
            </div>
        </main>
    </>;
}
