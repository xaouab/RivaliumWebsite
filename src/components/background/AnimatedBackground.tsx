import {animated, easings, useSpring} from "react-spring";
import {useTransitionContext} from "@/contexts/TransitionContext";

export interface AnimatedBackgroundProps {
    /** Route patterns (router.pathname) that show this background. "/wiki*" also matches "/wiki/...". */
    namespace?: string | string[];
    animation?: object, // Change type to `object` if not using SpringValues
    onOpen?: [Record<any, any>, Record<any, any>],
    onOpenEasing?: (t: number) => number,
    duration?: number,
    className: string
}

export default function AnimatedBackground({
    namespace,
    animation = {},
    className,
    onOpen = [{}, {}],
    duration = 500,
    onOpenEasing = easings.linear
}: AnimatedBackgroundProps) {

    const { location } = useTransitionContext();

    // A namespace ending in "*" matches that path and everything under it.
    const matches = (pattern: string) => pattern.endsWith("*")
        ? location === pattern.slice(0, -1) || location.startsWith(pattern.slice(0, -1) + "/")
        : location === pattern;
    const inNamespace = namespace === undefined
        || (namespace instanceof Array ? namespace.some(matches) : matches(namespace));

    const style: Record<any, any> = { opacity: inNamespace ? 1 : 0 };
    for(const key in onOpen[0]) {
        style[key] = inNamespace ? (onOpen[1][key]) : (onOpen[0][key]);
    }

    const opacity = useSpring({
        to: style,
        config: { duration, easing: onOpenEasing },
    });

    return (
        <animated.div
            style={{
                ...opacity,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden'
            }}
        >
            <animated.div className={className + " " + (inNamespace ? "" : "hidden")}
                style={{
                    ...animation,
                    position: 'absolute',
                    zIndex: 1,
                    width: '100%',
                    height: '100vh',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        </animated.div>
    );
}
