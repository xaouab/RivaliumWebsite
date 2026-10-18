import { FormEvent, useEffect, useState } from "react";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import Button from "@/components/Button";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/api";

const playerNameRegex = /^[A-Za-z0-9_-]{3,16}$/;

export default function ProfilePage() {
    return <AccountLayout title="Profile" description="How other players see you in the game.">
        <ProfileForm />
    </AccountLayout>;
}

function ProfileForm() {
    const { user, token, refresh } = useAuth();
    const [playerName, setPlayerName] = useState(user?.playerName ?? "");
    const [state, setState] = useState<{ pending?: boolean; error?: string; saved?: boolean }>({});
    useEffect(() => { setPlayerName(user?.playerName ?? ""); }, [user?.playerName]);
    if (!user) return null;

    const invalid = playerName.length > 0 && !playerNameRegex.test(playerName);
    const unchanged = playerName === user.playerName;

    const save = async (event: FormEvent) => {
        event.preventDefault();
        if (invalid || unchanged) return;
        setState({ pending: true });
        try {
            await api("/account/profile", { method: "PATCH", token, body: { playerName } });
            await refresh();
            setState({ saved: true });
        } catch (failure) {
            setState({ error: failure instanceof ApiError ? failure.message : "Couldn't save your display name." });
        }
    };

    return <>
        <Card title="Display name" description="Shown in matches, lobbies and friend lists. Friends add you with name#tag.">
            <form onSubmit={save} className="flex flex-col gap-4 max-w-md" noValidate>
                {state.error && <Notice tone="error">{state.error}</Notice>}
                {state.saved && <Notice tone="success">Saved. Your new name shows up the next time the game refreshes your profile.</Notice>}
                <Field
                    label="Display name"
                    value={playerName}
                    onChange={event => { setPlayerName(event.target.value); setState({}); }}
                    error={invalid ? "3 to 16 letters, numbers, underscores or hyphens." : null}
                    hint={<>Your tag is <strong className="text-ink">#{user.playerTag}</strong>. It stays the same unless another player already uses that tag with your new name.</>}
                    maxLength={16}
                />
                <div>
                    <Button submit type="main" content="Save" loading={state.pending} disabled={invalid || unchanged} className="!mx-0" />
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
