'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import UserSyncProvider from '@/components/auth/UserSyncProvider';
import WarmupProvider from '@/components/utils/WarmupProvider';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: '#0caee8',
                },
                elements: {
                    footer: 'hidden',
                },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WarmupProvider />
                {/* F9: Syncs Clerk user to Neon DB once per session */}
                <UserSyncProvider />
                {children}
            </QueryClientProvider>
        </ClerkProvider>
    );
}

