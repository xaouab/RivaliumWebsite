import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong, FaCircleCheck, FaCircleXmark, FaEnvelope, FaRightToBracket } from "react-icons/fa6";
import Button from "@/components/Button";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import ProgressBar, { ProgressState } from "@/components/ProgressBar";
import PortalShell from "@/components/portal/PortalShell";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/api";

// Mirrors accounts/src/macros.ts so problems show while typing; the server re-checks everything.
const usernameRegex = /^[A-Za-z0-9_-]{5,16}$/;
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/;
const passwordRules = [
    { test: (value: string) => value.length >= 8 && value.length <= 30, label: "8 to 30 characters" },
    { test: (value: string) => /[A-Za-z]/.test(value), label: "At least one letter" },
    { test: (value: string) => /\d/.test(value), label: "At least one number" },
    { test: (value: string) => /[^A-Za-z\d]/.test(value), label: "At least one special character" },
];

/** Only same-site paths are allowed as a post-sign-in destination. */
function safeNext(value: unknown) {
    return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export default function Portal() {
    const router = useRouter();
    const method = router.query.method;
    if (!router.isReady) return null;
    if (method === "register") return <Register />;
    return <SignIn />;
}

function SignIn() {
    const router = useRouter();
    const { signIn, status } = useAuth();
    const [access, setAccess] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const next = safeNext(router.query.next);

    useEffect(() => { if (status === "signed-in") router.replace(next); }, [status, next, router]);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (!access || !password) return setError("Enter your username or email and your password.");
        setPending(true); setError(null);
        try {
            await signIn(access.trim(), password);
            router.replace(next);
        } catch (failure) {
            setError(failure instanceof ApiError ? failure.message : "Something went wrong. Please try again.");
            setPending(false);
        }
    };

    return <PortalShell pageTitle="Sign in" heading="Sign in" word="LOGIN" intro={<>Sign in to your <span className="display text-gradient">Rivalium</span> account.</>}>
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            {error && <Notice tone="error">{error}</Notice>}
            <Field label="Username or email" name="access" autoComplete="username" value={access} onChange={event => setAccess(event.target.value)} autoFocus />
            <Field
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                aside={<Link href="/portal/forgot" className="font-body text-sm text-ice hover:text-ink">Forgot password?</Link>}
            />
            <Button submit type="main" content="Sign in" Icon={FaRightToBracket} loading={pending} className="w-full !mx-0 mt-2" />
        </form>
        <p className="font-body text-center text-lavender/80">
            New to Rivalium? <Link href={{ pathname: "/portal/register", query: router.query.next ? { next: router.query.next } : {} }} className="text-ice hover:text-ink underline underline-offset-4">Create an account</Link>
        </p>
    </PortalShell>;
}

type Step = 1 | 2 | 3 | 4 | 5;
const stepTitles: Record<Step, string> = {
    1: "Choose a name for your Rival",
    2: "What's your email address?",
    3: "Choose a secure password",
    4: "Almost there",
    5: "Check your inbox",
};

function Register() {
    const router = useRouter();
    const { register, status, user, token } = useAuth();
    const [step, setStep] = useState<Step>(1);
    const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "", acceptedTOS: false, ageConfirmed: false, emailConsent: true, marketingConsent: false });
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [resent, setResent] = useState(false);

    useEffect(() => { if (status === "signed-in" && step < 5) router.replace("/account"); }, [status, step, router]);

    const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
        setForm(current => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

    const stepError = (): string | null => {
        if (step === 1 && !usernameRegex.test(form.username)) return "Usernames are 5 to 16 letters, numbers, underscores or hyphens.";
        if (step === 2 && !emailRegex.test(form.email)) return "Enter a valid email address.";
        if (step === 3 && !passwordRules.every(rule => rule.test(form.password))) return "Your password doesn't meet every rule yet.";
        if (step === 3 && form.password !== form.confirm) return "Passwords don't match.";
        if (step === 4 && !form.ageConfirmed) return "Rivalium is for players 16 or older, or younger players with a parent's consent.";
        if (step === 4 && !form.acceptedTOS) return "Accept the Terms of Service to create your account.";
        return null;
    };

    const advance = async (event: FormEvent) => {
        event.preventDefault();
        const problem = stepError();
        if (problem) return setError(problem);
        setError(null);
        if (step < 4) return setStep((step + 1) as Step);

        setPending(true);
        try {
            await register({
                username: form.username, email: form.email, password: form.password,
                acceptedTOS: form.acceptedTOS, emailConsent: form.emailConsent, marketingConsent: form.marketingConsent,
            });
            setStep(5);
        } catch (failure) {
            const message = failure instanceof ApiError ? failure.message : "Something went wrong. Please try again.";
            setError(message);
            // Send the player back to the step the server complained about.
            if (/username/i.test(message)) setStep(1);
            else if (/email/i.test(message)) setStep(2);
            else if (/password/i.test(message)) setStep(3);
        } finally {
            setPending(false);
        }
    };

    const resend = async () => {
        try {
            await api("/verify-email/resend", { method: "POST", token });
            setResent(true);
        } catch (failure) {
            setError(failure instanceof ApiError ? failure.message : "Couldn't resend the email.");
        }
    };

    const states = ([1, 2, 3, 4, 5] as Step[]).map(index =>
        index < step ? ProgressState.OK : index === step ? (error ? ProgressState.ERROR : ProgressState.REACHED) : ProgressState.NOT_REACHED);

    return <PortalShell pageTitle="Create an account" heading="Create an account" word="REGISTER" intro={<>Welcome to <span className="display text-gradient">Rivalium</span>. Let&apos;s get you set up.</>}>
        <ProgressBar states={states} />
        <p className="font-body text-center text-ice" aria-live="polite">Step {step} of 5: {stepTitles[step]}</p>

        {step < 5 && <form key={step} onSubmit={advance} className="flex flex-col gap-4 rise-in" noValidate>
            {error && <Notice tone="error">{error}</Notice>}

            {step === 1 && <Field autoFocus label="Username" name="username" autoComplete="username" value={form.username} onChange={set("username")}
                hint="5 to 16 characters. This is also your starting display name; you can change it later." />}

            {step === 2 && <Field autoFocus label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={set("email")}
                hint="We'll send a link to confirm it." />}

            {step === 3 && <>
                <Field autoFocus label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
                <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} />
                <ul className="font-body text-sm flex flex-col gap-1" aria-label="Password rules">
                    {[...passwordRules.map(rule => ({ ok: rule.test(form.password), label: rule.label })), { ok: !!form.password && form.password === form.confirm, label: "Both passwords match" }]
                        .map(rule => <li key={rule.label} className={`flex items-center gap-2 transition-colors ${rule.ok ? "text-success" : "text-lavender/80"}`}>
                            {rule.ok ? <FaCircleCheck aria-hidden /> : <FaCircleXmark aria-hidden />} {rule.label}
                            <span className="sr-only">{rule.ok ? "(met)" : "(not met)"}</span>
                        </li>)}
                </ul>
            </>}

            {step === 4 && <div className="flex flex-col gap-3 font-body text-lavender/90">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-frost" checked={form.acceptedTOS} onChange={set("acceptedTOS")} />
                    <span>I agree to the <Link href="/legal/terms" target="_blank" className="text-ice underline underline-offset-4">Terms of Service</Link> and have read the <Link href="/legal/privacy" target="_blank" className="text-ice underline underline-offset-4">Privacy Policy</Link>.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-frost" checked={form.ageConfirmed} onChange={set("ageConfirmed")} />
                    <span>I&apos;m 16 or older, or a parent or guardian has agreed to these terms for me.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-frost" checked={form.emailConsent} onChange={set("emailConsent")} />
                    <span>Email me about my account and game updates</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-frost" checked={form.marketingConsent} onChange={set("marketingConsent")} />
                    <span>Send me news and offers</span>
                </label>
                <p className="text-sm text-lavender/80">You can change these anytime in your account preferences.</p>
            </div>}

            <div className="flex justify-between items-center mt-2">
                {step > 1
                    ? <Button type="no-back" content="Back" Icon={FaArrowLeftLong} onClick={() => { setError(null); setStep((step - 1) as Step); }} className="!mx-0" />
                    : <span />}
                <Button submit type="main" content={step === 4 ? "Create account" : "Next"} Icon={step === 4 ? undefined : FaArrowRightLong} loading={pending} className="!mx-0" />
            </div>
        </form>}

        {step === 5 && <div className="flex flex-col items-center gap-4 text-center rise-in">
            <FaEnvelope aria-hidden className="text-6xl text-ice" />
            <p className="font-body text-lavender/90">
                We sent a confirmation link to <strong className="text-ink">{user?.email ?? form.email}</strong>. Open it to verify your address.
            </p>
            {resent ? <Notice tone="success">Sent again. It can take a minute to arrive.</Notice>
                : <p className="font-body text-sm text-lavender/80">Nothing yet? Check your spam folder or <button type="button" onClick={resend} className="text-ice underline underline-offset-4 hover:text-ink">send it again</button>.</p>}
            {error && <Notice tone="error">{error}</Notice>}
            <Button type="main" content="Go to my account" href="/account" className="!mx-0" />
        </div>}

        {step < 5 && <p className="font-body text-center text-lavender/80">
            Already have an account? <Link href="/portal/login" className="text-ice hover:text-ink underline underline-offset-4">Sign in</Link>
        </p>}
    </PortalShell>;
}
