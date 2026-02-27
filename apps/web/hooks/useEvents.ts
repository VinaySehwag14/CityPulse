'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import type { Event, EventDetail } from '@/lib/types';

// ── Fetch single event detail ─────────────────────────────────────
export function useEvent(id: string) {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => apiGet<EventDetail>(`/events/${id}`),
        enabled: !!id,
    });
}

// ── Create event ──────────────────────────────────────────────────
export function useCreateEvent() {
    const { getToken } = useAuth();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (dto: {
            title: string;
            description?: string;
            lat: number;
            lng: number;
            start_time: string;
            end_time: string;
        }) => {
            const token = await getToken();
            return apiPost<Event>('/events', dto, token!);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['feed'] });
        },
    });
}

// ── Delete event ──────────────────────────────────────────────────
export function useDeleteEvent() {
    const { getToken } = useAuth();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const token = await getToken();
            return apiDelete<{ id: string }>(`/events/${id}`, token!);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['feed'] });
        },
    });
}
