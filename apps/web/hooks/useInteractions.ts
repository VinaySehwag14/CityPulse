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
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: ['event', eventId] });
            const previousEvent = qc.getQueryData<any>(['event', eventId]);
            if (previousEvent) {
                // Optimistically toggle
                const isLiked = previousEvent.like_count > 0;
                qc.setQueryData(['event', eventId], {
                    ...previousEvent,
                    like_count: isLiked ? 0 : 1, // Simplified since toggle
                });
            }
            return { previousEvent };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousEvent) {
                qc.setQueryData(['event', eventId], context.previousEvent);
            }
        },
        onSettled: () => {
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
        onMutate: async (status) => {
            await qc.cancelQueries({ queryKey: ['event', eventId] });
            const previousEvent = qc.getQueryData<any>(['event', eventId]);
            if (previousEvent) {
                qc.setQueryData(['event', eventId], {
                    ...previousEvent,
                    attendee_count: previousEvent.attendee_count + 1,
                });
            }
            return { previousEvent };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousEvent) {
                qc.setQueryData(['event', eventId], context.previousEvent);
            }
        },
        onSettled: () => {
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
