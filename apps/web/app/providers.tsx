'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ClerkProvider>
    );
}
