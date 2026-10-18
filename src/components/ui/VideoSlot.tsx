import { FaPlay } from "react-icons/fa6";

type VideoSlotProps = {
    /** Video URL once the asset exists. Until then a labelled placeholder is shown in its place. */
    src?: string;
    poster?: string;
    /** What the clip should show; doubles as the placeholder caption and the accessible label. */
    label: string;
    /** Asset id for whoever records the clip, e.g. "rivals/kenn/ultimate". */
    assetId?: string;
    aspect?: "video" | "square" | "wide";
    className?: string;
};

const aspects = { video: "aspect-video", square: "aspect-square", wide: "aspect-[21/9]" };

/**
 * Inline gameplay clip. Short, muted, looping and only playing when visible is the intended use,
 * like a GIF with controls. While `src` is missing it renders a placeholder frame so layouts are final.
 */
export default function VideoSlot({ src, poster, label, assetId, aspect = "video", className = "" }: VideoSlotProps) {
    if (src) {
        return <figure className={`${aspects[aspect]} overflow-hidden rounded-lg panel-inset ${className}`}>
            <video
                className="w-full h-full object-cover"
                src={src}
                poster={poster}
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label={label}
            />
        </figure>;
    }

    return <figure
        className={`${aspects[aspect]} relative overflow-hidden rounded-lg panel-inset flex flex-col items-center justify-center gap-3 text-center p-4 ${className}`}
        aria-label={`Video coming soon: ${label}`}
    >
        <div aria-hidden className="absolute inset-0 opacity-40 bg-gradient-to-br from-frost/15 via-transparent to-paper-4/60" />
        <span aria-hidden className="relative grid place-items-center w-12 h-12 rounded-full border border-ice/40 text-ice/80">
            <FaPlay className="ml-0.5" />
        </span>
        <figcaption className="relative font-body text-sm text-lavender/80 max-w-xs">
            {label}
            {assetId && <span className="block mt-1 text-xs text-lavender/50 font-mono">video: {assetId}</span>}
        </figcaption>
    </figure>;
}
