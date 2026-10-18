import { ReactNode } from "react";
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaTriangleExclamation } from "react-icons/fa6";

const styles = {
    info: { icon: FaCircleInfo, classes: "border-ice/40 text-ice" },
    success: { icon: FaCircleCheck, classes: "border-success/50 text-success" },
    warning: { icon: FaTriangleExclamation, classes: "border-gold/50 text-gold" },
    error: { icon: FaCircleExclamation, classes: "border-danger/50 text-danger" },
};

/** Status / completion / warning / error message. Always pairs color with an icon and text. */
export default function Notice({ tone = "info", title, children, action }: {
    tone?: keyof typeof styles;
    title?: string;
    children?: ReactNode;
    action?: ReactNode;
}) {
    const { icon: Icon, classes } = styles[tone];
    return <div role={tone === "error" ? "alert" : "status"} className={`flex gap-3 items-start rounded-lg border border-l-4 bg-night/85 backdrop-blur-md px-4 py-3 font-body ${classes}`}>
        <Icon className="mt-1 shrink-0" aria-hidden />
        <div className="flex-1 min-w-0">
            {title && <p className="font-bold">{title}</p>}
            {children && <div className="text-sm text-lavender">{children}</div>}
        </div>
        {action}
    </div>;
}
