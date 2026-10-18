import Image from "next/image";
import Link from "next/link";
import { KeyboardEvent, useRef, useState } from "react";
import { abilityIcon, rivalIcon, rivals, slotLabels } from "@/data/rivals";

// Highest values across the roster, so the meters compare rivals against each other.
const maxHealth = Math.max(...rivals.map(rival => rival.stats.health));
const maxSpeed = Math.max(...rivals.map(rival => rival.stats.base_speed));

/**
 * Lobby-style rival picker. A real tablist: arrow keys move between rivals (wrapping),
 * Home/End jump to the ends, and selection follows focus, like a controller-driven menu.
 */
export default function CharacterSelect() {
    const [index, setIndex] = useState(0);
    const tabs = useRef<(HTMLButtonElement | null)[]>([]);
    const rival = rivals[index];

    const move = (next: number) => {
        const wrapped = (next + rivals.length) % rivals.length;
        setIndex(wrapped);
        tabs.current[wrapped]?.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
        const keys: Record<string, () => void> = {
            ArrowRight: () => move(index + 1), ArrowDown: () => move(index + 1),
            ArrowLeft: () => move(index - 1), ArrowUp: () => move(index - 1),
            Home: () => move(0), End: () => move(rivals.length - 1),
        };
        if (keys[event.key]) { event.preventDefault(); keys[event.key](); }
    };

    return <div className="grid lg:grid-cols-[18rem_1fr] gap-4 text-left">
        <div role="tablist" aria-label="Rivals" aria-orientation="vertical" onKeyDown={onKeyDown}
            className="glass-strong p-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5 content-start self-start">
            {rivals.map((item, itemIndex) => {
                const selected = itemIndex === index;
                return <button
                    key={item.id}
                    ref={element => { tabs.current[itemIndex] = element; }}
                    role="tab"
                    id={`rival-tab-${item.id}`}
                    aria-selected={selected}
                    aria-controls="rival-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setIndex(itemIndex)}
                    className={`group flex items-center gap-3 min-h-[64px] rounded-xl px-3 py-2 border transition-[background-color,border-color] duration-200
                        ${selected ? "bg-paper accent-ring" : "border-transparent hover:bg-paper-4"}`}
                    style={{ ["--accent" as any]: item.archetype_color }}
                >
                    <Image src={rivalIcon(item.id)} alt="" width={40} height={40} className="w-10 h-10 rounded-full shrink-0" />
                    <span className="flex flex-col items-start min-w-0">
                        <span className={`display text-lg leading-none ${selected ? "text-ink" : "text-ice"}`}>{item.name}</span>
                        <span className="label-caps text-[11px] mt-1" style={{ color: item.archetype_color }}>{item.archetype}</span>
                    </span>
                </button>;
            })}
        </div>

        <div id="rival-panel" role="tabpanel" aria-labelledby={`rival-tab-${rival.id}`} key={rival.id}
            className="glass relative overflow-hidden p-5 md:p-8 fade-in accent-ring" style={{ ["--accent" as any]: rival.archetype_color }}>
            <div className="relative grid md:grid-cols-[auto_1fr] gap-6 items-start">
                <div className="flex md:flex-col items-center gap-4">
                    <span className="grid place-items-center w-28 h-28 md:w-36 md:h-36 rounded-full border-2 accent-ring bg-night/40">
                        <Image src={rivalIcon(rival.id)} alt={`${rival.name} portrait`} width={128} height={128} className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                    </span>
                    <span className="chip" style={{ color: rival.archetype_color, borderColor: `${rival.archetype_color}66` }}>{rival.archetype}</span>
                </div>
                <div className="flex flex-col gap-4 min-w-0">
                    <div>
                        <p className="font-body text-ice">{rival.title}</p>
                        <h3 className="display text-step-5 text-ink leading-none mt-1">{rival.name}</h3>
                    </div>
                    <p className="font-body text-step-0 text-lavender max-w-prose">{rival.description_markdown.replace(/\*\*/g, "")}</p>
                    <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 max-w-md">
                        {[
                            ["Health", rival.stats.health, rival.stats.health / maxHealth],
                            ["Speed", rival.stats.base_speed, rival.stats.base_speed / maxSpeed],
                        ].map(([label, value, ratio]) => <div key={label as string}>
                            <div className="flex justify-between font-body text-sm mb-1">
                                <dt className="text-lavender/80">{label}</dt><dd className="text-ink tabular-nums">{value}</dd>
                            </div>
                            <div className="meter" aria-hidden><span style={{ width: `${Math.round((ratio as number) * 100)}%` }} /></div>
                        </div>)}
                    </dl>
                    <ul className="flex flex-wrap gap-2" aria-label={`${rival.name}'s abilities`}>
                        {rival.abilities.map(ability => <li key={ability.slot} className="flex items-center gap-2 panel-inset pr-3">
                            <Image src={abilityIcon(rival.id, ability.slot)} alt="" width={36} height={36} className="w-9 h-9 rounded-l-md" />
                            <span className="flex flex-col">
                                <span className="font-body text-sm text-ink leading-tight">{ability.name}</span>
                                <span className="font-body text-[11px] text-lavender/80">{slotLabels[ability.slot].name}</span>
                            </span>
                        </li>)}
                    </ul>
                    <Link href={`/wiki/rivals/${rival.id}`} className="font-body text-ice hover:text-ink underline underline-offset-4 w-fit">
                        Full {rival.name} guide →
                    </Link>
                </div>
            </div>
        </div>
    </div>;
}
