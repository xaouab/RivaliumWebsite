import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { IconType } from "react-icons";
import {
    FaBagShopping, FaClockRotateLeft, FaDatabase, FaGauge, FaHeadset, FaIdCard, FaRightFromBracket, FaShieldHalved, FaSliders, FaUser,
} from "react-icons/fa6";
import Notice from "@/components/ui/Notice";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { rankIcon, rankName } from "@/lib/game";

const sections: { href: string; label: string; icon: IconType }[] = [
    { href: "/account", label: "Overview", icon: FaGauge },
    { href: "/account/profile", label: "Profile", icon: FaUser },
    { href: "/account/matches", label: "Match history", icon: FaClockRotateLeft },
    { href: "/account/purchases", label: "Purchases", icon: FaBagShopping },
    { href: "/account/personal", label: "Personal info", icon: FaIdCard },
    { href: "/account/security", label: "Sign-in & security", icon: FaShieldHalved },
    { href: "/account/preferences", label: "Preferences", icon: FaSliders },
    { href: "/account/support", label: "Support", icon: FaHeadset },
    { href: "/account/data", label: "Your data", icon: FaDatabase },
];

/** Signed-in shell: redirects to sign-in when needed, structural sidebar + one content column. */
export default function AccountLayout({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
    const router = useRouter();
    const { status, user, signOut } = useAuth();

    useEffect(() => {
        if (status === "signed-out") router.replace({ pathname: "/portal/login", query: { next: router.asPath } });
    }, [status, router]);

    if (status !== "signed-in" || !user) {
        return <main className="w-full min-h-screen grid place-items-center">
            <p className="font-body text-ice flex items-center gap-3"><Spinner /> Loading your account…</p>
        </main>;
    }

    const path = router.pathname;

    return <>
        <Head><title>{`${title} - Your Rivalium account`}</title></Head>
        <main className="w-full min-h-screen pt-24 md:pt-28 pb-16 px-4">
            <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
                <aside className="w-full lg:w-64 lg:shrink-0 lg:sticky lg:top-24 glass-strong p-4 text-left">
                    <div className="flex items-center gap-3 pb-4 mb-3 border-b border-ice/10">
                        <Image src={rankIcon(user.rank?.tier)} alt={rankName(user.rank?.tier)} width={44} height={44} className="w-11 h-11 object-contain" />
                        <div className="min-w-0">
                            <p className="display text-lg text-ink truncate">{user.playerName ?? user.username}</p>
                            <p className="font-body text-sm text-lavender/80">#{user.playerTag ?? "0000"} · {rankName(user.rank?.tier)}</p>
                        </div>
                    </div>
                    <nav aria-label="Account">
                        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-1">
                            {sections.map(section => {
                                const active = path === section.href;
                                return <li key={section.href}>
                                    <Link
                                        href={section.href}
                                        aria-current={active ? "page" : undefined}
                                        className={`relative flex items-center gap-3 rounded-md px-3 min-h-[44px] font-body text-sm transition-colors ${active ? "bg-frost/15 text-ink before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-full before:bg-frost" : "text-lavender hover:bg-ice/10 hover:text-ink"}`}
                                    >
                                        <section.icon aria-hidden className={active ? "text-frost" : "text-ice/60"} />
                                        {section.label}
                                    </Link>
                                </li>;
                            })}
                            <li className="lg:mt-2 lg:pt-2 lg:border-t lg:border-ice/10">
                                <button type="button" onClick={() => { signOut(); router.push("/"); }}
                                    className="w-full flex items-center gap-3 rounded-md px-3 min-h-[44px] font-body text-sm text-lavender hover:bg-ice/10 hover:text-ink whitespace-nowrap">
                                    <FaRightFromBracket aria-hidden className="text-ice/60" /> Sign out
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <section className="flex-1 min-w-0 w-full flex flex-col gap-5 text-left" aria-labelledby="account-title">
                    <header className="flex flex-col gap-1">
                        <h1 id="account-title" className="display text-step-5 text-ink title-mark title-halo">{title}</h1>
                        {description && <p className="font-body text-ink/90 title-halo">{description}</p>}
                    </header>
                    {user.deletionRequestedAt && path !== "/account/data" && <Notice tone="warning" title="Account deletion requested"
                        action={<Link href="/account/data" className="font-body text-sm underline shrink-0">Manage</Link>}>
                        Your account is scheduled for deletion. You can cancel this from Your data.
                    </Notice>}
                    {children}
                </section>
            </div>
        </main>
    </>;
}

/** Content card inside the account column. */
export function Card({ title, description, children, actions }: { title?: string; description?: ReactNode; children?: ReactNode; actions?: ReactNode }) {
    return <div className="glass p-5 md:p-6 flex flex-col gap-4 rise-in">
        {(title || actions) && <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                {title && <h2 className="display text-step-2 text-ice">{title}</h2>}
                {description && <p className="font-body text-sm text-lavender mt-1">{description}</p>}
            </div>
            {actions}
        </div>}
        {children}
    </div>;
}
