'use client';

import { QueryClient } from '@tanstack/react-query';

// Singleton QueryClient — shared across the app via ReactQueryClientProvider
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,       // 1 min: treat data as fresh
                gcTime: 5 * 60 * 1000,   // 5 min: keep in cache when unused
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new client
        return makeQueryClient();
    }
    // Browser: reuse existing client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}
