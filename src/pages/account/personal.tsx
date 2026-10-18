import { FormEvent, useEffect, useState } from "react";
import AccountLayout, { Card } from "@/components/account/AccountLayout";
import Button from "@/components/Button";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/contexts/AuthContext";
import { AccountSettings, api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/useApi";

type Form = AccountSettings["personalInformation"];
const empty: Form = { firstName: "", lastName: "", birthDate: "", country: "", city: "", address: "", postalCode: "" };

export default function PersonalPage() {
    const { token } = useAuth();
    const { data, error, loading, setData } = useApi<AccountSettings>("/account");
    const [form, setForm] = useState<Form>(empty);
    const [state, setState] = useState<{ pending?: boolean; error?: string; saved?: boolean }>({});

    useEffect(() => {
        if (!data) return;
        const info = data.personalInformation ?? empty;
        setForm({ ...empty, ...info, birthDate: info.birthDate ? String(info.birthDate).slice(0, 10) : "" });
    }, [data]);

    const set = (key: keyof Form) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm(current => ({ ...current, [key]: event.target.value }));
        setState({});
    };

    const save = async (event: FormEvent) => {
        event.preventDefault();
        setState({ pending: true });
        try {
            const body: Partial<Form> = { ...form };
            if (!body.birthDate) delete body.birthDate;
            setData(await api<AccountSettings>("/account/personal", { method: "PATCH", token, body }));
            setState({ saved: true });
        } catch (failure) {
            setState({ error: failure instanceof ApiError ? failure.message : "Couldn't save your information." });
        }
    };

    return <AccountLayout title="Personal info" description="Only you and the Rivalium team can see this. It's used for support and, later, for billing.">
        <Card>
            {error ? <Notice tone="error">{error}</Notice> : loading && !data ? <div className="skeleton h-64" /> :
                <form onSubmit={save} className="flex flex-col gap-5" noValidate>
                    {state.error && <Notice tone="error">{state.error}</Notice>}
                    {state.saved && <Notice tone="success">Your information was saved.</Notice>}
                    <fieldset className="grid sm:grid-cols-2 gap-4">
                        <legend className="sr-only">Name</legend>
                        <Field label="First name" autoComplete="given-name" value={form.firstName} onChange={set("firstName")} maxLength={64} />
                        <Field label="Last name" autoComplete="family-name" value={form.lastName} onChange={set("lastName")} maxLength={64} />
                        <Field label="Date of birth" type="date" autoComplete="bday" value={form.birthDate} onChange={set("birthDate")} max={new Date().toISOString().slice(0, 10)} />
                    </fieldset>
                    <fieldset className="grid sm:grid-cols-2 gap-4">
                        <legend className="label-caps text-sm text-ice mb-2 col-span-full">Address</legend>
                        <Field className="sm:col-span-2" label="Street address" autoComplete="street-address" value={form.address} onChange={set("address")} maxLength={160} />
                        <Field label="City" autoComplete="address-level2" value={form.city} onChange={set("city")} maxLength={64} />
                        <Field label="Postal code" autoComplete="postal-code" value={form.postalCode} onChange={set("postalCode")} maxLength={16} />
                        <Field label="Country" autoComplete="country-name" value={form.country} onChange={set("country")} maxLength={64} />
                    </fieldset>
                    <div><Button submit type="main" content="Save changes" loading={state.pending} className="!mx-0" /></div>
                </form>}
        </Card>
    </AccountLayout>;
}
