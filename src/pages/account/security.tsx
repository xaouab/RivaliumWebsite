import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import Button from "@/components/Button";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/contexts/AuthContext";
import { AccountSettings, api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/game";
import { useApi } from "@/lib/useApi";

type Status = { pending?: boolean; error?: string; done?: string };
const failed = (failure: unknown, fallback: string): Status => ({ error: failure instanceof ApiError ? failure.message : fallback });

export default function SecurityPage() {
    const { data } = useApi<AccountSettings>("/account");
    return <AccountLayout title="Sign-in & security" description="Your email, password and website sessions.">
        <EmailCard />
        <PasswordCard />
        <SessionsCard lastLoginAt={data?.lastLoginAt} />
    </AccountLayout>;
}

function EmailCard() {
    const { user, token } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<Status>({});
    if (!user) return null;

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setStatus({ pending: true });
        try {
            const { message } = await api<{ message: string }>("/account/email", { method: "POST", token, body: { email: email.trim(), password } });
            setStatus({ done: message }); setPassword("");
        } catch (failure) { setStatus(failed(failure, "Couldn't start the email change.")); }
    };

    return <Card title="Email address" description={<>Currently <strong className="text-ink">{user.email}</strong> · {user.confirmed ? "verified" : "not verified yet"}</>}>
        <form onSubmit={submit} className="flex flex-col gap-4 max-w-md" noValidate>
            {status.error && <Notice tone="error">{status.error}</Notice>}
            {status.done && <Notice tone="success">{status.done}</Notice>}
            <Field label="New email" type="email" autoComplete="email" value={email} onChange={event => { setEmail(event.target.value); setStatus({}); }} />
            <Field label="Current password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)}
                hint="We ask for it before changing where account emails go." />
            <div><Button submit type="frost" content="Send confirmation link" loading={status.pending} disabled={!email || !password} className="!mx-0" /></div>
        </form>
    </Card>;
}

function PasswordCard() {
    const { token, adoptToken } = useAuth();
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [status, setStatus] = useState<Status>({});
    const mismatch = form.confirm.length > 0 && form.next !== form.confirm;

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (mismatch) return;
        setStatus({ pending: true });
        try {
            const result = await api<{ token: string }>("/account/password", { method: "POST", token, body: { currentPassword: form.current, newPassword: form.next } });
            await adoptToken(result.token);
            setForm({ current: "", next: "", confirm: "" });
            setStatus({ done: "Password changed. Other website sessions have been signed out." });
        } catch (failure) { setStatus(failed(failure, "Couldn't change your password.")); }
    };

    const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => { setForm(current => ({ ...current, [key]: event.target.value })); setStatus({}); };

    return <Card title="Password" description="Changing it signs you out of the website everywhere else. The game will ask for it next time you sign in there.">
        <form onSubmit={submit} className="flex flex-col gap-4 max-w-md" noValidate>
            {status.error && <Notice tone="error">{status.error}</Notice>}
            {status.done && <Notice tone="success">{status.done}</Notice>}
            <Field label="Current password" type="password" autoComplete="current-password" value={form.current} onChange={set("current")} />
            <Field label="New password" type="password" autoComplete="new-password" value={form.next} onChange={set("next")}
                hint="8 to 30 characters with at least one letter, one number and one special character." />
            <Field label="Confirm new password" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")}
                error={mismatch ? "Passwords don't match." : null} />
            <div><Button submit type="main" content="Change password" loading={status.pending} disabled={!form.current || !form.next || mismatch} className="!mx-0" /></div>
        </form>
    </Card>;
}

function SessionsCard({ lastLoginAt }: { lastLoginAt?: number | null }) {
    const router = useRouter();
    const { token, signOut } = useAuth();
    const [confirming, setConfirming] = useState(false);
    const [status, setStatus] = useState<Status>({});

    const revoke = async () => {
        setStatus({ pending: true });
        try {
            await api("/account/sessions/revoke", { method: "POST", token });
            signOut();
            router.push("/portal/login");
        } catch (failure) { setStatus(failed(failure, "Couldn't sign out your sessions.")); }
    };

    return <Card title="Website sessions" description={`Last sign-in on the website: ${formatDate(lastLoginAt, true)}`}>
        {status.error && <Notice tone="error">{status.error}</Notice>}
        <p className="font-body text-sm text-lavender/80">Signed in on a shared or lost device? Sign out of the website everywhere, including here.</p>
        {confirming
            ? <div className="flex flex-wrap items-center gap-2">
                <Button type="secondary" content="Yes, sign out everywhere" loading={status.pending} onClick={revoke} className="!mx-0" />
                <Button type="no-back" content="Cancel" onClick={() => setConfirming(false)} className="!mx-0" />
            </div>
            : <div><Button type="frost" content="Sign out everywhere" onClick={() => setConfirming(true)} className="!mx-0" /></div>}
    </Card>;
}
