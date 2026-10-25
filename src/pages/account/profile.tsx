import { FormEvent, useEffect, useState } from "react";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import Button from "@/components/Button";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/api";

const playerNameRegex = /^[A-Za-z0-9_-]{3,16}$/;
const playerTagRegex = /^[A-Z0-9]{3,5}$/;

export default function ProfilePage() {
    return <AccountLayout title="Profile">
        <ProfileForm />
    </AccountLayout>;
}

function ProfileForm() {
    const { user, token, refresh } = useAuth();
    const [playerName, setPlayerName] = useState(user?.playerName ?? "");
    const [playerTag, setPlayerTag] = useState(user?.playerTag ?? "");
    const [state, setState] = useState<{ pending?: boolean; error?: string; saved?: boolean }>({});
    const [availability, setAvailability] = useState<{ pair: string; available?: boolean; error?: string } | null>(null);
    const validName = playerNameRegex.test(playerName);
    const validTag = playerTagRegex.test(playerTag);
    const pair = `${playerName}#${playerTag}`;
    const current = availability?.pair === pair ? availability : null;
    const unchanged = playerName === user?.playerName && playerTag === user?.playerTag;

    useEffect(() => {
        setPlayerName(user?.playerName ?? "");
        setPlayerTag(user?.playerTag ?? "");
    }, [user?.playerName, user?.playerTag]);

    useEffect(() => {
        if (!token || !validName || !validTag) return;
        const controller = new AbortController();
        const timer = window.setTimeout(() => {
            api<{ available: boolean }>("/account/tag-available", {
                token, query: { name: playerName, tag: playerTag }, signal: controller.signal,
            }).then(result => {
                if (!controller.signal.aborted) setAvailability({ pair, available: result.available });
            }).catch(failure => {
                if (!controller.signal.aborted) setAvailability({ pair, error: failure instanceof ApiError ? failure.message : "Couldn't check availability." });
            });
        }, 300);
        return () => { window.clearTimeout(timer); controller.abort(); };
    }, [token, playerName, playerTag, pair, validName, validTag]);

    if (!user) return null;

    const save = async (event: FormEvent) => {
        event.preventDefault();
        if (!validName || !validTag || unchanged || state.pending || current?.available === false) return;
        setState({ pending: true });
        try {
            await api("/account/profile", { method: "PATCH", token, body: { playerName, playerTag } });
            await refresh();
            setState({ saved: true });
        } catch (failure) {
            if (failure instanceof ApiError && failure.status === 409) setAvailability({ pair, available: false });
            setState({ error: failure instanceof ApiError ? failure.message : "Couldn't save your name and tag." });
        }
    };

    return <>
        <Card title="Display name" description="Friends find you with your name and tag.">
            <form onSubmit={save} className="flex flex-col gap-4 max-w-md" noValidate>
                {state.error && <Notice tone="error">{state.error}</Notice>}
                {state.saved && <Notice tone="success">Name and tag saved.</Notice>}
                <div className="grid grid-cols-[minmax(0,1fr)_auto_6rem] items-start gap-2 sm:gap-3">
                    <Field
                        label="Name"
                        value={playerName}
                        onChange={event => { setPlayerName(event.target.value); setAvailability(null); setState({}); }}
                        error={playerName.length > 0 && !validName ? "3–16 letters, numbers, _ or -." : null}
                        maxLength={16}
                        autoComplete="off"
                        disabled={state.pending}
                        className="min-w-0"
                    />
                    <span aria-hidden="true" className="font-body text-ice pt-9">#</span>
                    <Field
                        label="Tag"
                        value={playerTag}
                        onChange={event => { setPlayerTag(event.target.value.toUpperCase()); setAvailability(null); setState({}); }}
                        error={playerTag.length > 0 && !validTag ? "3–5 letters or numbers." : null}
                        maxLength={5}
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        disabled={state.pending}
                        className="min-w-0"
                    />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 min-h-10">
                    <p role="status" aria-live="polite" className={`font-body text-sm ${current?.available === false || current?.error ? "text-danger" : current?.available ? "text-success" : "text-lavender/80"}`}>
                        {current?.error ?? (validName && validTag ? (current ? current.available ? "Available" : "Taken" : "Checking…") : "Tag: 3–5 letters or numbers.")}
                    </p>
                    <Button type="no-back" small content="Random tag" disabled={state.pending} className="!mx-0"
                        onClick={() => {
                            const digits = new Uint32Array(1);
                            window.crypto.getRandomValues(digits);
                            const next = (digits[0] % 10000).toString().padStart(4, "0");
                            setPlayerTag(next === playerTag ? ((Number(next) + 1) % 10000).toString().padStart(4, "0") : next);
                            setAvailability(null); setState({});
                        }} />
                </div>
                <div>
                    <Button submit type="main" content="Save" loading={state.pending}
                        disabled={!validName || !validTag || unchanged || current?.available === false} className="!mx-0" />
                </div>
            </form>
        </Card>

        <Card title="Account name" description="Used to sign in. It can't be changed.">
            <p className="font-body text-ink">{user.username}</p>
        </Card>

        <Card title="Title, icon and cosmetics" description="Titles, icons, borders, podiums and mottos are changed in the game's lobby, under Rival.">
            <p className="font-body text-sm text-lavender/80">Current title: <strong className="text-ink">{user.title || "None"}</strong></p>
        </Card>
    </>;
}
