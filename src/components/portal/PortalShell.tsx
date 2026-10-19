import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/assets/images/logo/logo.webp";

/**
 * Full-screen auth layout: a structural glass column with the form, the logo and a big
 * glossy word on the right. Shared by sign-in, registration and every recovery step.
 */
export default function PortalShell({ pageTitle, heading, word, intro, children }: {
    pageTitle: string;
    heading: string;
    /** Big decorative word on the right (desktop only). */
    word: string;
    intro?: ReactNode;
    children: ReactNode;
}) {
    return <>
        <Head><title>{`${pageTitle} - Rivalium`}</title></Head>
        <main className="w-full min-h-screen relative flex">
            <div className="w-full min-h-screen flex flex-col-reverse md:flex-row items-stretch justify-between">
                <section className="relative min-h-screen w-full sm:w-[70%] md:w-[55%] xl:w-[38%] bg-paper-2/95 border-r border-ice/15 shadow-2xl px-5 sm:px-10 py-8 flex flex-col justify-between gap-8">
                    <div aria-hidden className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-frost/60 to-transparent" />
                    <Link href="/" className="self-start md:hidden" aria-label="Rivalium home">
                        <Image src={Logo} alt="Rivalium" className="w-32 h-auto" priority />
                    </Link>
                    <div className="w-full max-w-md mx-auto flex flex-col gap-6 rise-in">
                        <div className="flex flex-col gap-3 text-center">
                            <h1 className="display text-step-4 text-gradient-soft is-soft w-fit mx-auto title-mark is-centered">{heading}</h1>
                            {intro && <div className="font-body text-lavender text-step-0">{intro}</div>}
                        </div>
                        {children}
                    </div>
                    <footer>
                        <ul className="font-body text-sm text-lavender flex flex-wrap justify-center gap-x-4 gap-y-1">
                            <li><Link href="/" className="hover:text-ink">Home</Link></li>
                            <li><Link href="/wiki" className="hover:text-ink">Wiki</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-ink">Terms</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-ink">Privacy</Link></li>
                            <li><Link href="/support" className="hover:text-ink">Support</Link></li>
                        </ul>
                    </footer>
                </section>

                <div className="hidden md:flex md:flex-1 flex-col justify-between items-end p-10" aria-hidden>
                    <Link href="/" tabIndex={-1}><Image src={Logo} alt="" className="w-[260px] xl:w-[380px] h-auto drop-shadow-2xl" priority /></Link>
                    <span className="display text-right text-[5rem] xl:text-[7rem] text-ink/25 title-halo">{word}</span>
                </div>
            </div>
        </main>
    </>;
}
