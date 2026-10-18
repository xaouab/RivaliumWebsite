import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiError, tokenStore, WebUser } from "@/lib/api";

type AuthState = {
    /** "loading" until the stored token has been checked once. */
    status: "loading" | "signed-out" | "signed-in";
    user: WebUser | null;
    token: string | null;
    signIn: (access: string, password: string) => Promise<WebUser>;
    register: (form: RegisterForm) => Promise<void>;
    signOut: () => void;
    /** Replace the token (after a password change) and reload the profile. */
    adoptToken: (token: string) => Promise<void>;
    refresh: () => Promise<void>;
};

export type RegisterForm = {
    username: string;
    email: string;
    password: string;
    acceptedTOS: boolean;
    emailConsent: boolean;
    marketingConsent: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<WebUser | null>(null);
    const [status, setStatus] = useState<AuthState["status"]>("loading");

    const load = useCallback(async (candidate: string | null) => {
        if (!candidate) {
            setToken(null); setUser(null); setStatus("signed-out");
            return null;
        }
        try {
            const profile = await api<WebUser>("/profile", { token: candidate });
            setToken(candidate); setUser(profile); setStatus("signed-in");
            return profile;
        } catch (error) {
            // Only an auth failure signs you out; a network blip keeps the stored token for the next try.
            if (error instanceof ApiError && error.status === 401) tokenStore.clear();
            setToken(null); setUser(null); setStatus("signed-out");
            throw error;
        }
    }, []);

    useEffect(() => { load(tokenStore.get()).catch(() => undefined); }, [load]);

    const signIn = useCallback(async (access: string, password: string) => {
        const { token: issued } = await api<{ token: string }>("/login", { method: "POST", body: { access, password } });
        tokenStore.set(issued);
        return (await load(issued))!;
    }, [load]);

    const register = useCallback(async (form: RegisterForm) => {
        const { token: issued } = await api<{ token: string }>("/register", { method: "POST", body: form });
        tokenStore.set(issued);
        await load(issued);
    }, [load]);

    const signOut = useCallback(() => {
        tokenStore.clear();
        setToken(null); setUser(null); setStatus("signed-out");
    }, []);

    const adoptToken = useCallback(async (next: string) => {
        tokenStore.set(next);
        await load(next);
    }, [load]);

    const refresh = useCallback(async () => { await load(token).catch(() => undefined); }, [load, token]);

    const value = useMemo(() => ({ status, user, token, signIn, register, signOut, adoptToken, refresh }),
        [status, user, token, signIn, register, signOut, adoptToken, refresh]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}
