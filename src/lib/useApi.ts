import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Loads an authenticated GET endpoint once the user is signed in. Re-runs when `path` or `query`
 * change; aborts the stale request so an old response can never overwrite a newer one.
 */
export function useApi<T>(path: string | null, query?: Record<string, string | number | undefined>) {
    const { token, signOut } = useAuth();
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [nonce, setNonce] = useState(0);
    const queryKey = JSON.stringify(query ?? {});

    useEffect(() => {
        if (!path || !token) return;
        const controller = new AbortController();
        setLoading(true); setError(null);
        api<T>(path, { token, query: JSON.parse(queryKey), signal: controller.signal })
            .then(result => { setData(result); setLoading(false); })
            .catch(failure => {
                if (controller.signal.aborted) return;
                if (failure instanceof ApiError && failure.status === 401) signOut();
                setError(failure instanceof ApiError ? failure.message : "Couldn't load this right now.");
                setLoading(false);
            });
        return () => controller.abort();
    }, [path, token, queryKey, nonce, signOut]);

    const reload = useCallback(() => setNonce(value => value + 1), []);
    return { data, error, loading, reload, setData };
}
