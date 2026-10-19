import { useRouter } from "next/router";
import { useEffect } from "react";
import { TransitionContextProvider } from "@/contexts/TransitionContext";
import { easings } from "react-spring";
import AnimatedBackground from "./background/AnimatedBackground";
import Navbar from "./navbar/Navbar";
import TransitionContainer from "./TransitionContainer";
import Footer from "./footer/Footer";
import HeadLayout from "./Head";

/** Dark gradient between the splash art and the content, so text never sits on raw art. */
function Scrim() {
    return <div aria-hidden className="page-scrim" />;
}

interface LayoutProps {
    children: React.ReactNode;
    navbar: boolean;
    footer: boolean;
}

export default function Layout({ children, navbar, footer }: LayoutProps) {
    const router = useRouter();

    // Pages scroll inside #main-scroll, which Next's own scroll reset (window) never touches: go back to the top
    // on every page change, except in-page anchors (#section links) which the browser scrolls to itself.
    useEffect(() => {
        const toTop = (url: string) => {
            if (url.includes("#")) return;
            document.getElementById("main-scroll")?.scrollTo({ top: 0, behavior: "auto" });
        };
        router.events.on("routeChangeComplete", toTop);
        return () => router.events.off("routeChangeComplete", toTop);
    }, [router.events]);

    return (<TransitionContextProvider>
        <HeadLayout />
        {navbar && <Navbar />}
        <AnimatedBackground className='ui-splash blur-md' onOpen={[{
            transform: 'scale(3)'
        }, {
            transform: 'scale(1.5)'
        }]} />
        <AnimatedBackground className='secondary-splash' namespace={["/wiki*", "/players*"]}
            onOpen={[{
                transform: 'scale(3)'
            }, {
                transform: 'scale(1)'
            }]}
            onOpenEasing={easings.easeInOutCirc}
        />
        <AnimatedBackground className='main-splash hero-depth' namespace={["/__none"]}
            onOpen={[{
                transform: 'scale(3)'
            }, {
                transform: 'scale(1)'
            }]}
            onOpenEasing={easings.easeInOutCirc}
        />
        <AnimatedBackground className='battle-splash' namespace={["/download", "/account*"]}
            onOpen={[{
                transform: 'translateX(0%) scale(1)'
            }, {
                transform: 'translateX(-2%) scale(1.1)'
            }]}
            onOpenEasing={easings.easeInOutCirc}
        />
        <AnimatedBackground className="portal-back" namespace="/portal*" />
        <Scrim />
        <div className="main-container scrollbar-thin" id="main-scroll">
            <TransitionContainer>
                {children}
                {footer && <Footer />}
            </TransitionContainer>
        </div>
    </TransitionContextProvider>
    );

}
