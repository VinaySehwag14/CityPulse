'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import UserSyncProvider from '@/components/auth/UserSyncProvider';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                {/* F9: Syncs Clerk user to Neon DB once per session */}
                <UserSyncProvider />
                {children}
            </QueryClientProvider>
        </ClerkProvider>
    );
}
