'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiPost } from '@/lib/api-client';

interface ToggleLikeResult { liked: boolean; like_count: number }
interface AttendResult { status: string; attendee_count: number }

export function useLike(eventId: string) {
    const { getToken } = useAuth();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return apiPost<ToggleLikeResult>(`/events/${eventId}/like`, {}, token!);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['event', eventId] });
            qc.invalidateQueries({ queryKey: ['feed'] });
        },
    });
}

export function useAttend(eventId: string) {
    const { getToken } = useAuth();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (status: 'going' | 'interested') => {
            const token = await getToken();
            return apiPost<AttendResult>(`/events/${eventId}/attend`, { status }, token!);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['event', eventId] });
        },
    });
}

export function useAddComment(eventId: string) {
    const { getToken } = useAuth();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (content: string) => {
            const token = await getToken();
            return apiPost(`/events/${eventId}/comments`, { content }, token!);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['event', eventId] });
        },
    });
}
