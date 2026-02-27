'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { SearchResult } from '@/lib/types';

export interface SearchParams {
    q?: string;
    lat?: number;
    lng?: number;
    radius_km?: number;
}

export function useSearch(params: SearchParams) {
    const hasQuery = !!(params.q || (params.lat && params.lng && params.radius_km));

    const qs = new URLSearchParams();
    if (params.q) qs.set('q', params.q);
    if (params.lat) qs.set('lat', String(params.lat));
    if (params.lng) qs.set('lng', String(params.lng));
    if (params.radius_km) qs.set('radius_km', String(params.radius_km));

    return useQuery({
        queryKey: ['search', params],
        queryFn: () => apiGet<SearchResult[]>(`/search?${qs.toString()}`),
        enabled: hasQuery,
        staleTime: 30_000,
    });
}
