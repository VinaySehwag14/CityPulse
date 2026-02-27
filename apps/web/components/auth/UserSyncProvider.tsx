'use client';

import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { apiPost } from '@/lib/api-client';

// Fires POST /api/auth/sync once per session when the user signs in.
// Upserts the Clerk user into the Neon DB (FEATURES.md §1).
// Silently ignores errors — sync failure should not break the UI.
export default function UserSyncProvider() {
    const { isSignedIn, isLoaded } = useUser();
    const { getToken } = useAuth();

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        // Use sessionStorage to sync at most once per browser session
        const SYNC_KEY = 'citypulse_synced';
        if (sessionStorage.getItem(SYNC_KEY)) return;

        (async () => {
            try {
                const token = await getToken();
                if (!token) return;
                await apiPost('/auth/sync', {}, token);
                sessionStorage.setItem(SYNC_KEY, '1');
            } catch {
                // Silent fail — sync is best-effort
            }
        })();
    }, [isLoaded, isSignedIn, getToken]);

    return null; // renders nothing
}
