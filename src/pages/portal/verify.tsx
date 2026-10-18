import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import Notice from "@/components/ui/Notice";
import Spinner from "@/components/ui/Spinner";
import PortalShell from "@/components/portal/PortalShell";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/api";

export default function VerifyEmail() {
    const router = useRouter();
    const { refresh, status } = useAuth();
    const [state, setState] = useState<{ phase: "working" | "done" | "failed"; message?: string; email?: string }>({ phase: "working" });
    const started = useRef(false);

    useEffect(() => {
        if (!router.isReady || started.current) return;
        started.current = true;
        const token = typeof router.query.token === "string" ? router.query.token : "";
        if (!token) {
            setState({ phase: "failed", message: "This link is incomplete. Open it again from your email." });
            return;
        }
        api<{ email: string }>("/verify-email", { method: "POST", body: { token } })
            .then(({ email }) => { setState({ phase: "done", email }); refresh(); })
            .catch(failure => setState({ phase: "failed", message: failure instanceof ApiError ? failure.message : "Something went wrong. Please try again." }));
    }, [router.isReady, router.query.token, refresh]);

    return <PortalShell pageTitle="Verify email" heading="Verify email" word="VERIFY">
        <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
            {state.phase === "working" && <p className="font-body text-ice flex items-center gap-3"><Spinner /> Confirming your address…</p>}
            {state.phase === "done" && <>
                <Notice tone="success" title="Email confirmed">
                    <strong>{state.email}</strong> is now verified.
                </Notice>
                <Button type="main" content={status === "signed-in" ? "Go to my account" : "Sign in"} href={status === "signed-in" ? "/account" : "/portal/login"} className="!mx-0" />
            </>}
            {state.phase === "failed" && <>
                <Notice tone="error" title="We couldn't verify this link">{state.message}</Notice>
                <Button type="frost" content={status === "signed-in" ? "Back to my account" : "Sign in"} href={status === "signed-in" ? "/account" : "/portal/login"} className="!mx-0" />
            </>}
        </div>
    </PortalShell>;
}
