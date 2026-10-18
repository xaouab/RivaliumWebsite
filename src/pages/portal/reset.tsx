import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Button from "@/components/Button";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import PortalShell from "@/components/portal/PortalShell";
import { api, ApiError } from "@/lib/api";

export default function ResetPassword() {
    const router = useRouter();
    const token = typeof router.query.token === "string" ? router.query.token : "";
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [pending, setPending] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (password !== confirm) return setError("Passwords don't match.");
        setPending(true); setError(null);
        try {
            await api("/password/reset", { method: "POST", body: { token, password } });
            setDone(true);
        } catch (failure) {
            setError(failure instanceof ApiError ? failure.message : "Something went wrong. Please try again.");
        } finally {
            setPending(false);
        }
    };

    return <PortalShell pageTitle="Choose a new password" heading="New password" word="RESET"
        intro="Choose a new password. Every website session will be signed out afterwards.">
        {router.isReady && !token && <Notice tone="error" title="This link is incomplete">
            Open the link from your email again, or <Link href="/portal/forgot" className="underline">request a new one</Link>.
        </Notice>}

        {done
            ? <div className="flex flex-col items-center gap-4 rise-in">
                <Notice tone="success" title="Password updated">You can sign in with your new password now.</Notice>
                <Button type="main" content="Sign in" href="/portal/login" className="!mx-0" />
            </div>
            : token && <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                {error && <Notice tone="error">{error}</Notice>}
                <Field autoFocus label="New password" type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)}
                    hint="8 to 30 characters with at least one letter, one number and one special character." />
                <Field label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onChange={event => setConfirm(event.target.value)} />
                <Button submit type="main" content="Save password" loading={pending} className="w-full !mx-0" />
            </form>}
    </PortalShell>;
}
