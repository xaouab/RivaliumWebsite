import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import VideoSlot from "@/components/ui/VideoSlot";

// One round of the standard mode. Durations: client/gameplay/game/modes/standard/StandardGame.cs.
const phases = [
    { name: "Preparation", seconds: 10, title: "Read the map", text: "Both teams spawn on their side and can't move yet. Ten seconds to call a plan and pick your lane.", asset: "landing/round-preparation" },
    { name: "First Battle", seconds: 60, title: "Find the gem holder", text: "One defender carries the gem. Defenders keep them alive; attackers hunt them. Taking the holder down earns a gem.", asset: "landing/round-first-battle" },
    { name: "Second Battle", seconds: 60, title: "Orbstones rise", text: "Three orbstones appear: Lethality, Vitality, Haste. Break one as an attacker for a gem; grab orbs to stack their element.", asset: "landing/round-second-battle" },
    { name: "Final Battle", seconds: 120, title: "Last push", text: "Orbstones respawn for two final minutes. Whoever controls the gem and the orbstones here usually takes the round.", asset: "landing/round-final-battle" },
];
const total = phases.reduce((sum, phase) => sum + phase.seconds, 0);
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * Feature Stack set-piece: sticky left pane, scroll-synced right pane. Scroll position *is* the
 * information here (where you are in a round), which is the only reason it's scroll-driven.
 * IntersectionObserver picks the active phase — no scroll listeners, no scroll-jacking.
 * Below lg the sticky pane is dropped and each panel carries its own phase header.
 */
export default function RoundSequence() {
    const [active, setActive] = useState(0);
    const panels = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
            }
        }, { rootMargin: "-45% 0px -45% 0px" });
        panels.current.forEach(panel => panel && observer.observe(panel));
        return () => observer.disconnect();
    }, []);

    const elapsed = phases.slice(0, active + 1).reduce((sum, phase) => sum + phase.seconds, 0);

    return <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-14 text-left">
        {/* Sticky pane (desktop) */}
        <div className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-7">
                <div>
                    <h2 id="round-heading" className="display text-step-4 text-ink title-mark">One round, four phases</h2>
                    <p className="font-body text-step-1 text-ink-2 mt-4 max-w-md">Eight rounds a match. Sides swap every round. Scroll to play one.</p>
                </div>
                <div aria-hidden className="flex flex-col gap-2">
                    <div className="flex h-3 rounded-full overflow-hidden bg-paper border border-ice/15">
                        {phases.map((phase, index) => <span key={phase.name} style={{ width: `${(phase.seconds / total) * 100}%` }}
                            className="h-full border-r border-paper last:border-r-0 bg-frost origin-left transition-transform duration-500 ease-brand"
                            data-filled={index <= active} />)}
                    </div>
                    <style jsx>{`
                        span[data-filled="false"] { transform: scaleX(0); }
                        span[data-filled="true"] { transform: scaleX(1); }
                    `}</style>
                    <p className="font-body text-sm text-ink-2 tabular-nums">Round clock {clock(elapsed)} / {clock(total)}</p>
                </div>
                <ol className="flex flex-col gap-1" aria-label="Phases">
                    {phases.map((phase, index) => <li key={phase.name}
                        className={`flex items-baseline justify-between gap-4 rounded-lg px-4 py-3 border transition-colors duration-200
                            ${index === active ? "bg-paper-3 border-frost/50" : "border-transparent"}`}
                        aria-current={index === active ? "step" : undefined}>
                        <span className={`label-caps text-base ${index === active ? "text-ink" : "text-ink-3"}`}>{index + 1}. {phase.name}</span>
                        <span className={`font-body tabular-nums ${index === active ? "text-ink" : "text-ink-3"}`}>{clock(phase.seconds)}</span>
                    </li>)}
                </ol>
                <p className="font-body text-sm text-ink-2">
                    After round eight: up to 5:00 of Sudden Death. <Link href="/wiki/gameplay/match-flow" className="text-ice underline underline-offset-4 hover:text-ink">Full rules</Link>
                </p>
            </div>
        </div>

        {/* Scrolling pane */}
        <div className="flex flex-col gap-6 lg:gap-0">
            <h2 className="lg:hidden display text-step-4 text-ink title-mark">One round, four phases</h2>
            {phases.map((phase, index) => <section
                key={phase.name}
                ref={element => { panels.current[index] = element; }}
                data-index={index}
                aria-labelledby={`phase-${index}`}
                className="lg:min-h-[85vh] flex flex-col justify-center"
            >
                <div className={`glass p-5 md:p-7 flex flex-col gap-4 transition-[opacity,border-color] duration-300 ${index === active ? "lg:opacity-100 lg:border-frost/40" : "lg:opacity-55"}`}>
                    <p className="font-body text-sm text-ice tabular-nums">Phase {index + 1}: {phase.name}, {clock(phase.seconds)}</p>
                    <h3 id={`phase-${index}`} className="display text-step-3 text-ink">{phase.title}</h3>
                    <p className="font-body text-step-0 text-ink-2 max-w-prose">{phase.text}</p>
                    <VideoSlot label={`${phase.name}: ${phase.title.toLowerCase()}`} assetId={phase.asset} />
                </div>
            </section>)}
        </div>
    </div>;
}
