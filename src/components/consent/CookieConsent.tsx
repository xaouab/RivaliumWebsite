import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaCookieBite, FaXmark } from "react-icons/fa6";
import Button from "@/components/Button";
import Toggle from "@/components/ui/Toggle";
import { ConsentChoices, consentCategories, getConsent, onOpenCookieSettings, prefersPrivacy, saveConsent, useConsent } from "@/lib/consent";

const none: ConsentChoices = { preferences: false, analytics: false, marketing: false };
const all: ConsentChoices = { preferences: true, analytics: true, marketing: true };

/**
 * First-visit cookie notice (bottom sheet, doesn't block the page) and the "Cookie settings" dialog.
 * Accept all and Essential only carry equal weight, like the GOV.UK and CNIL-reviewed patterns; nothing is pre-ticked.
 */
export default function CookieConsent() {
    const consent = useConsent();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [draft, setDraft] = useState<ConsentChoices>(none);
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => onOpenCookieSettings(() => {
        const current = getConsent();
        setDraft(current ? { preferences: current.preferences, analytics: current.analytics, marketing: current.marketing } : none);
        setSettingsOpen(true);
    }), []);

    useEffect(() => {
        const element = dialog.current;
        if (!element) return;
        if (settingsOpen && !element.open) element.showModal();
        if (!settingsOpen && element.open) element.close();
    }, [settingsOpen]);

    const decide = (choices: ConsentChoices) => { saveConsent(choices); setSettingsOpen(false); };
    const openSettings = () => { setDraft(prefersPrivacy() ? none : getConsent() ?? none); setSettingsOpen(true); };

    return <>
        {consent === null && !settingsOpen && <section role="region" aria-label="Cookie choices"
            className="fixed z-modal bottom-3 inset-x-3 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[min(30rem,calc(100vw-2rem))] glass-overlay !bg-paper-3/95 p-5 flex flex-col gap-4 text-left rise-in">
            <h2 className="flex items-center gap-2.5 display text-step-1 text-ink"><FaCookieBite aria-hidden className="text-gold text-base" /> Cookies</h2>
            <p className="font-body text-sm text-ink-2 leading-relaxed">
                We use essential storage to keep you signed in. With your permission we&apos;d also remember your preferences
                and measure what helps players. You can change this any time from <strong className="text-ink">Cookie settings</strong> in the footer.{" "}
                <Link href="/legal/privacy#7-cookies-and-tracking-technologies" className="text-ice underline underline-offset-4 hover:text-ink">Privacy notice</Link>
            </p>
            <div className="grid grid-cols-2 gap-2">
                <Button small type="frost" content="Accept all" onClick={() => decide(all)} className="justify-center" />
                <Button small type="frost" content="Essential only" onClick={() => decide(none)} className="justify-center" />
                <Button small type="no-back" content="Customize" onClick={openSettings} className="col-span-2 justify-center" />
            </div>
        </section>}

        <dialog ref={dialog} aria-labelledby="cookie-settings-title" onClose={() => setSettingsOpen(false)}
            className="z-modal w-[min(36rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] p-0 m-auto bg-transparent text-left backdrop:bg-night/60 backdrop:backdrop-blur-sm">
            <div className="glass-overlay !bg-paper-3/[.97] flex flex-col max-h-[calc(100dvh-2rem)]">
                <header className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
                    <h2 id="cookie-settings-title" className="display text-step-2 text-ink">Cookie settings</h2>
                    <button type="button" aria-label="Close" onClick={() => setSettingsOpen(false)}
                        className="grid place-items-center w-11 h-11 text-ice hover:text-ink hover:bg-ice/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ice">
                        <FaXmark aria-hidden />
                    </button>
                </header>
                <ul className="px-5 overflow-y-auto scrollbar-thin divide-y divide-ice/10">
                    {consentCategories.map(category => <li key={category.id} className="py-1">
                        <Toggle
                            label={category.locked ? `${category.label} · always on` : category.label}
                            description={`${category.text} ${category.examples}.`.replace("..", ".")}
                            checked={category.locked ? true : draft[category.id as keyof ConsentChoices]}
                            disabled={category.locked}
                            onChange={checked => setDraft(current => ({ ...current, [category.id]: checked }))}
                        />
                    </li>)}
                </ul>
                <footer className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-5 border-t border-ice/10">
                    <Button small type="no-back" content="Essential only" onClick={() => decide(none)} className="justify-center" />
                    <Button small type="frost" content="Save choices" onClick={() => decide(draft)} className="justify-center" />
                    <Button small type="frost" content="Accept all" onClick={() => decide(all)} className="justify-center" />
                </footer>
            </div>
        </dialog>
    </>;
}
