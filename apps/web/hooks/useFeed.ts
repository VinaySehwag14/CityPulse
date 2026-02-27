'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiGet } from '@/lib/api-client';
import type { FeedResponse } from '@/lib/types';

const LIMIT = 20;

export function useFeed() {
    const { getToken } = useAuth();

    return useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: async ({ pageParam = 1 }) => {
            const token = await getToken();
            return apiGet<FeedResponse>(
                `/feed?page=${pageParam}&limit=${LIMIT}`,
                token ?? undefined
            );
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const totalPages = Math.ceil(lastPage.total / LIMIT);
            return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
        },
    });
}
