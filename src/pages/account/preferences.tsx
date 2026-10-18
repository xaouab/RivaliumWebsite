import { useState } from "react";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import Notice from "@/components/ui/Notice";
import Toggle from "@/components/ui/Toggle";
import { useAuth } from "@/contexts/AuthContext";
import { AccountSettings, api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/useApi";

export default function PreferencesPage() {
    const { token } = useAuth();
    const { data, error, loading, setData } = useApi<AccountSettings>("/account");
    const [saving, setSaving] = useState<string | null>(null);
    const [status, setStatus] = useState<{ error?: string; saved?: boolean }>({});

    // Toggles save immediately and roll back if the server refuses, so the switch always tells the truth.
    const update = async (key: "email" | "marketing", value: boolean) => {
        if (!data) return;
        const previous = data;
        setData({ ...data, consent: { ...data.consent, [key]: value } });
        setSaving(key); setStatus({});
        try {
            setData(await api<AccountSettings>("/account/consent", { method: "PATCH", token, body: { [key]: value } }));
            setStatus({ saved: true });
        } catch (failure) {
            setData(previous);
            setStatus({ error: failure instanceof ApiError ? failure.message : "Couldn't save that preference." });
        } finally {
            setSaving(null);
        }
    };

    return <AccountLayout title="Preferences" description="Choose which emails you get from us.">
        <Card title="Email">
            {error ? <Notice tone="error">{error}</Notice> : loading && !data ? <div className="skeleton h-28" /> : data && <>
                <div className="divide-y divide-ice/10">
                    <Toggle label="Account and game updates" description="Patch notes, events and important changes to your account."
                        checked={data.consent.email} disabled={saving === "email"} onChange={value => update("email", value)} />
                    <Toggle label="News and offers" description="Promotions, shop sales and partner offers."
                        checked={data.consent.marketing} disabled={saving === "marketing"} onChange={value => update("marketing", value)} />
                </div>
                <p className="font-body text-xs text-lavender/80" aria-live="polite">
                    {status.error ? <span className="text-danger">{status.error}</span> : saving ? "Saving…" : status.saved ? "Saved." : "Changes save automatically."}
                </p>
                <p className="font-body text-sm text-lavender/80">Security emails, like password resets and email confirmations, are always sent.</p>
            </>}
        </Card>
        <Card title="In-game settings" description="Graphics, audio and key bindings are stored on your computer and changed from the game's Settings menu." />
    </AccountLayout>;
}
