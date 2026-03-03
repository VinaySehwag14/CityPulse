'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useSyncUser } from '@/hooks/useUser';

export default function UserSyncProvider() {
    const { isSignedIn, isLoaded } = useAuth();
    const syncMutation = useSyncUser();

    // We only want to trigger this ONCE per page load / session
    const hasSyncedRef = useRef(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && !hasSyncedRef.current) {
            hasSyncedRef.current = true;
            syncMutation.mutate();
        }
    }, [isLoaded, isSignedIn, syncMutation]);

    return null;
}
