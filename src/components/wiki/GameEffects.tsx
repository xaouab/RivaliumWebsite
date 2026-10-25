import { CSSProperties } from "react";
import { effectGroups, effects, elements, GameEffect, GameElement } from "@/data/effects";

/** The effect as it appears on the HUD: a colour bar fading to the right, icon and caps label. */
export function EffectBadge({ effect }: { effect: GameEffect }) {
    const style = { "--fx-stops": effect.stops.join(", "), "--fx-ink": effect.ink } as CSSProperties;
    return <span className="fx-bar" style={style}>
        <effect.icon aria-hidden className="shrink-0 text-[15px]" />
        <span className="label-caps caps-md whitespace-nowrap">{effect.hud}</span>
    </span>;
}

const statusLabel = { partial: "Partly in game", planned: "In development" } as const;

/** Every effect, grouped like the game's enum: badge and one line each. */
export function EffectList() {
    return <>
        {effectGroups.map(group => <section key={group.kind} aria-labelledby={`effects-${group.kind}`}>
            <h2 id={`effects-${group.kind}`}>{group.label}</h2>
            <ul className="!p-0 !list-none flex flex-col">
                {effects.filter(effect => effect.kind === group.kind).map(effect => <li key={effect.id} id={effect.id}
                    className="!m-0 py-2.5 border-b border-ice/10 last:border-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 scroll-mt-28">
                    <span className="sm:w-48 shrink-0"><EffectBadge effect={effect} /></span>
                    <span className="text-ink">{effect.text}</span>
                    {effect.status && <span className="sm:ml-auto label-caps caps-sm text-gold whitespace-nowrap">{statusLabel[effect.status]}</span>}
                </li>)}
            </ul>
        </section>)}
    </>;
}

/** Square element swatch in the orb's colour ramp. */
export function ElementSwatch({ element, size = 48 }: { element: GameElement; size?: number }) {
    const style = { width: size, height: size, background: `radial-gradient(circle at 35% 30%, ${[...element.ramp].reverse().join(", ")})` };
    return <span aria-hidden className="fx-swatch grid place-items-center shrink-0" style={style}>
        <element.icon className="text-white/90 drop-shadow-[0_1px_2px_rgb(0_0_0/0.6)]" style={{ fontSize: size * 0.38 }} />
    </span>;
}

/** One card per element: per stack and at 10 stacks. */
export function ElementGrid() {
    return <ul className="!p-0 !list-none grid gap-3 md:grid-cols-3 !my-6">
        {elements.map(element => <li key={element.id} id={element.id} className="panel-inset p-4 flex flex-col gap-3 !m-0 scroll-mt-28" style={{ borderColor: `${element.ramp[2]}66` }}>
            <div className="flex items-center gap-3">
                <ElementSwatch element={element} />
                <div>
                    <h3 className="!m-0" style={{ color: element.ramp[element.ramp.length - 2] }}>{element.name}</h3>
                    <p className="!m-0 text-sm text-ink-2">{element.orbstone} orbstone</p>
                </div>
            </div>
            <p className="!m-0 text-sm"><span className="label-caps caps-sm text-ink-3 mr-2">Per stack</span>{element.perStack}</p>
            <p className="!m-0 text-sm"><span className="label-caps caps-sm text-ink-3 mr-2">At 10</span><strong className="text-ink">{element.atTen}</strong></p>
        </li>)}
    </ul>;
}
