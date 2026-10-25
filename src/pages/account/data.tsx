import { FormEvent, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import Button from "@/components/Button";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/contexts/AuthContext";
import { AccountSettings, api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/game";

export default function DataPage() {
    return <AccountLayout title="Your data">
        <ExportCard />
        <DeletionCard />
    </AccountLayout>;
}

function ExportCard() {
    const { token, user } = useAuth();
    const [status, setStatus] = useState<{ pending?: boolean; error?: string }>({});

    const download = async () => {
        setStatus({ pending: true });
        try {
            const data = await api("/account/export", { token });
            const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
            const link = Object.assign(document.createElement("a"), { href: url, download: `rivalium-account-${user?.username ?? "export"}.json` });
            link.click();
            URL.revokeObjectURL(url);
            setStatus({});
        } catch (failure) {
            setStatus({ error: failure instanceof ApiError ? failure.message : "Couldn't prepare your export." });
        }
    };

    return <Card title="Download your data" description="A JSON file with your account details, game progress, purchases and recent matches.">
        {status.error && <Notice tone="error">{status.error}</Notice>}
        <div><Button type="frost" content="Download" Icon={FaDownload} loading={status.pending} onClick={download} className="!mx-0" /></div>
    </Card>;
}

function DeletionCard() {
    const { token, user, refresh } = useAuth();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [status, setStatus] = useState<{ pending?: boolean; error?: string }>({});
    if (!user) return null;

    const request = async (event: FormEvent) => {
        event.preventDefault();
        setStatus({ pending: true });
        try {
            await api<AccountSettings>("/account/deletion", { method: "POST", token, body: { password } });
            await refresh();
            setPassword(""); setConfirm(""); setStatus({});
        } catch (failure) {
            setStatus({ error: failure instanceof ApiError ? failure.message : "Couldn't send your request." });
        }
    };

    const cancel = async () => {
        setStatus({ pending: true });
        try {
            await api("/account/deletion", { method: "DELETE", token });
            await refresh();
            setStatus({});
        } catch (failure) {
            setStatus({ error: failure instanceof ApiError ? failure.message : "Couldn't cancel the request." });
        }
    };

    if (user.deletionRequestedAt) {
        return <Card title="Deletion requested">
            {status.error && <Notice tone="error">{status.error}</Notice>}
            <Notice tone="warning" title={`Requested on ${formatDate(user.deletionRequestedAt)}`}>
                Our team will delete your account and its data within 30 days. Until then you can still play and cancel the request.
            </Notice>
            <div><Button type="frost" content="Keep my account" loading={status.pending} onClick={cancel} className="!mx-0" /></div>
        </Card>;
    }

    const typed = confirm.trim().toUpperCase() === "DELETE";
    return <Card title="Delete your account" description="Your rivals, cosmetics, currencies, rank and match history will be permanently removed. This can't be undone once processed.">
        <form onSubmit={request} className="flex flex-col gap-4 max-w-md" noValidate>
            {status.error && <Notice tone="error">{status.error}</Notice>}
            <Field label="Current password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} />
            <Field label='Type "DELETE" to confirm' value={confirm} onChange={event => setConfirm(event.target.value)} autoComplete="off" />
            <div><Button submit type="secondary" content="Request deletion" loading={status.pending} disabled={!password || !typed} className="!mx-0" /></div>
        </form>
    </Card>;
}
