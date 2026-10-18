import Link from "next/link";
import { FormEvent, useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import Button from "@/components/Button";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import PortalShell from "@/components/portal/PortalShell";
import { api, ApiError } from "@/lib/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setPending(true); setError(null);
        try {
            await api("/password/forgot", { method: "POST", body: { email: email.trim() } });
            setSent(true);
        } catch (failure) {
            setError(failure instanceof ApiError ? failure.message : "Something went wrong. Please try again.");
        } finally {
            setPending(false);
        }
    };

    return <PortalShell pageTitle="Reset your password" heading="Forgot password" word="RECOVER"
        intro="Enter the email on your account and we'll send you a link to choose a new password.">
        {sent
            ? <div className="flex flex-col items-center gap-4 text-center rise-in">
                <FaEnvelope aria-hidden className="text-6xl text-ice" />
                <Notice tone="success" title="Check your inbox">
                    If an account uses <strong>{email}</strong>, a reset link is on its way. It works once and expires in an hour.
                </Notice>
                <Button type="frost" content="Back to sign in" href="/portal/login" className="!mx-0" />
            </div>
            : <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                {error && <Notice tone="error">{error}</Notice>}
                <Field autoFocus label="Email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} />
                <Button submit type="main" content="Send reset link" loading={pending} className="w-full !mx-0" />
            </form>}
        <p className="font-body text-center text-lavender/80">
            Remembered it? <Link href="/portal/login" className="text-ice hover:text-ink underline underline-offset-4">Sign in</Link>
        </p>
    </PortalShell>;
}
