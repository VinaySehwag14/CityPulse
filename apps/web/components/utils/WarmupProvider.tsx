'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * Silent "warmup" utility to wake up Render (backend) and Neon (DB) 
 * cold starts as soon as a user lands on the website.
 */
export default function WarmupProvider() {
    useEffect(() => {
        // Trigger a background ping to health check 
        // This wakes up the server before user navigates to a data-heavy page.
        apiClient.get('/health').catch(() => {
            // Ignore results; goal is just to start the handshake
        });
    }, []);

    return null;
}
