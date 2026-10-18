/**
 * Layered hero art for vertical parallax. The splash was split into two plates offline
 * (rembg cutout of the character + OpenCV-inpainted background, see public/images/parallax/):
 * both share the source frame, so `object-cover` on the same box keeps them registered.
 * Motion comes from a CSS view timeline on the hero (see system.scss § Parallax); browsers
 * without scroll timelines and reduced-motion users get the still composition.
 */
export default function HeroParallax() {
    return <div aria-hidden className="parallax-stage absolute inset-0 overflow-hidden -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/parallax/hero-far.webp" alt="" fetchPriority="high" decoding="async"
            className="parallax-far absolute inset-0 w-full h-full object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/parallax/hero-near.webp" alt="" fetchPriority="high" decoding="async"
            className="parallax-near absolute inset-0 w-full h-full object-cover" />
        {/* Legibility: darken toward the text and fade into the page below. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(13.6%_0.064_272/.55),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-paper" />
    </div>;
}
