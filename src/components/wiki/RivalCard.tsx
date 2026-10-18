import Image from "next/image";
import Link from "next/link";
import { Rival, rivalIcon } from "@/data/rivals";

/** Rival tile used on the landing page and the wiki. The accent tints border and glow only, never the fill. */
export default function RivalCard({ rival, compact }: { rival: Rival; compact?: boolean }) {
    return <Link
        href={`/wiki/rivals/${rival.id}`}
        className="group panel-inset card-link flex flex-col items-center text-center gap-3 p-4"
        style={{ ["--accent" as any]: rival.archetype_color }}
    >
        <span className="relative grid place-items-center w-20 h-20 rounded-full border-2" style={{ borderColor: rival.archetype_color }}>
            <Image src={rivalIcon(rival.id)} alt="" width={64} height={64} className="w-16 h-16 rounded-full" />
        </span>
        <span className="flex flex-col gap-0.5">
            <span className="display text-2xl text-ink">{rival.name}</span>
            <span className="label-caps text-xs" style={{ color: rival.archetype_color }}>{rival.archetype}</span>
        </span>
        {!compact && <span className="font-body text-sm text-lavender/80">{rival.title}</span>}
    </Link>;
}
