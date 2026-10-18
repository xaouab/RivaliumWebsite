import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FaBook, FaDiscord, FaEnvelope, FaListCheck, FaPaperPlane } from "react-icons/fa6";
import Button from "@/components/Button";
import Field, { TextAreaField } from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/api";

const shortcuts = [
    { icon: FaBook, title: "Wiki", text: "Rules, rivals, controls and mechanics.", href: "/wiki" },
    { icon: FaListCheck, title: "Patch notes", text: "Known changes and what's new.", href: "/patch-notes" },
    { icon: FaDiscord, title: "Discord", text: "Ask the community and the team.", href: "https://discord.rivalium.online", external: true },
];

export default function SupportPage() {
    const { user, token, status } = useAuth();
    const [form, setForm] = useState({ email: "", subject: "", message: "", website: "" });
    const [state, setState] = useState<{ pending?: boolean; error?: string; sentId?: string }>({});

    useEffect(() => { if (user?.email) setForm(current => current.email ? current : { ...current, email: user.email }); }, [user?.email]);

    const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(current => ({ ...current, [key]: event.target.value }));
        setState({});
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setState({ pending: true });
        try {
            const { id } = await api<{ id: string }>("/support", { method: "POST", token, body: form });
            setState({ sentId: id });
            setForm(current => ({ ...current, subject: "", message: "" }));
        } catch (failure) {
            setState({ error: failure instanceof ApiError ? failure.message : "Couldn't send your message." });
        }
    };

    return <>
        <Head><title>Support - Rivalium</title></Head>
        <main className="w-full min-h-screen pb-16">
            <PageHeader title="Support" lead="Most answers are one click away. If not, write to us and we'll reply by email."
                crumbs={[{ label: "Home", href: "/" }, { label: "Support" }]} />

            <div className="max-w-5xl mx-auto px-4 flex flex-col gap-6 text-left">
                <ul className="glass divide-y md:divide-y-0 md:divide-x divide-ice/10 grid md:grid-cols-3 overflow-hidden">
                    {shortcuts.map(item => <li key={item.title}>
                        <Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}
                            className="group h-full p-5 flex flex-col gap-1 hover:bg-paper-4 transition-colors">
                            <span className="flex items-center gap-2 display text-step-1 text-ink"><item.icon aria-hidden className="text-frost text-base" />{item.title}</span>
                            <span className="font-body text-ink-2">{item.text}</span>
                        </Link>
                    </li>)}
                </ul>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
                    <section className="glass-strong p-5 md:p-8 flex flex-col gap-5" aria-labelledby="contact-title">
                        <div>
                            <h2 id="contact-title" className="display text-step-3 text-ice">Contact us</h2>
                            <p className="font-body text-lavender mt-1">We reply by email. You&apos;ll get a confirmation with your ticket number right away.</p>
                        </div>
                        {state.sentId
                            ? <div className="flex flex-col gap-4">
                                <Notice tone="success" title="Message sent">
                                    Your ticket number is <strong className="text-ink">{state.sentId}</strong>. We&apos;ll reply to {form.email}.
                                </Notice>
                                <div className="flex flex-wrap gap-3">
                                    {status === "signed-in" && <Button type="frost" content="See my tickets" href="/account/support" />}
                                    <Button type="no-back" content="Send another message" onClick={() => setState({})} />
                                </div>
                            </div>
                            : <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                                {state.error && <Notice tone="error">{state.error}</Notice>}
                                <Field label="Your email" type="email" autoComplete="email" value={form.email} onChange={set("email")} required />
                                <Field label="Subject" value={form.subject} onChange={set("subject")} maxLength={120} required placeholder="e.g. Can't sign in to the game" />
                                <TextAreaField label="Message" value={form.message} onChange={set("message")} maxLength={5000} required rows={6}
                                    hint="Include your player name#tag and what you were doing when it happened." />
                                {/* Honeypot for bots; hidden from people and assistive tech. */}
                                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={set("website")} />
                                <div><Button submit type="main" content="Send message" Icon={FaPaperPlane} loading={state.pending}
                                    disabled={!form.email || !form.subject || form.message.length < 10} /></div>
                            </form>}
                    </section>

                    <aside className="glass p-5 md:p-6 flex flex-col gap-4">
                        <h2 className="display text-step-2 text-ice">Account help</h2>
                        {status === "signed-in"
                            ? <>
                                <p className="font-body text-lavender">Messages you send while signed in are linked to your account, so you can follow them.</p>
                                <Button type="frost" content="My support tickets" href="/account/support" />
                            </>
                            : <>
                                <p className="font-body text-lavender">Sign in to link messages to your account and follow your tickets.</p>
                                <Button type="frost" content="Sign in" href="/portal/login?next=/support" />
                            </>}
                        <hr className="divider" />
                        <p className="font-body text-sm text-lavender">Forgot your password? <Link href="/portal/forgot" className="text-ice underline underline-offset-4">Reset it</Link>.</p>
                        <a href="mailto:support@rivalium.online" className="font-body text-sm text-ice hover:text-ink inline-flex items-center gap-2"><FaEnvelope aria-hidden /> support@rivalium.online</a>
                    </aside>
                </div>
            </div>
        </main>
    </>;
}
