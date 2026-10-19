// One round, to scale. Durations from client/gameplay/game/modes/standard/StandardGame.cs.
const phases = [
    { name: "Preparation", seconds: 10, text: "Spawn, read the map, plan." },
    { name: "First Battle", seconds: 60, text: "Defenders guard the gem holder; only they know who it is." },
    { name: "Second Battle", seconds: 60, text: "Orbstones appear." },
    { name: "Final Battle", seconds: 120, text: "Orbstones respawn for the last push." },
];
const total = phases.reduce((sum, phase) => sum + phase.seconds, 0);

/** Round timeline drawn like an in-game phase bar: segment width = phase length. */
export default function MatchFlow() {
    return <div className="flex flex-col gap-6 text-left">
        <ol className="flex w-full h-3 rounded-full overflow-hidden border border-ice/20 bg-night/50" aria-hidden>
            {phases.map((phase, index) => <li key={phase.name} style={{ width: `${(phase.seconds / total) * 100}%`, opacity: 0.45 + index * 0.18 }}
                className="h-full bg-frost border-r border-night last:border-r-0" />)}
        </ol>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {phases.map((phase, index) => <li key={phase.name} className="panel-inset p-4 flex flex-col gap-1">
                <span className="flex items-baseline justify-between">
                    <span className="label-caps caps-md text-ice">{index + 1}. {phase.name}</span>
                    <span className="font-body text-sm text-ink tabular-nums">{phase.seconds}s</span>
                </span>
                <span className="font-body text-sm text-lavender/85">{phase.text}</span>
            </li>)}
        </ol>
        <p className="font-body text-sm text-lavender/85">
            Eight rounds, sides swap every round, then up to five minutes of <strong className="text-ink">Sudden Death</strong>.
        </p>
    </div>;
}
