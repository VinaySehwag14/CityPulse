'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiGet, apiPost } from '@/lib/api-client';
import type { User } from '@/lib/types';

export function useUserProfile(userId: string) {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => apiGet<User>(`/users/${userId}`),
        enabled: !!userId,
    });
}

export function useFollowers(userId: string) {
    return useQuery({
        queryKey: ['followers', userId],
        queryFn: () => apiGet<User[]>(`/users/${userId}/followers`),
        enabled: !!userId,
    });
}

export function useFollowing(userId: string) {
    return useQuery({
        queryKey: ['following', userId],
        queryFn: () => apiGet<User[]>(`/users/${userId}/following`),
        enabled: !!userId,
    });
}

export function useToggleFollow(targetUserId: string) {
    const { getToken } = useAuth();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return apiPost<{ following: boolean }>(`/users/${targetUserId}/follow`, {}, token!);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['followers', targetUserId] });
            qc.invalidateQueries({ queryKey: ['user', targetUserId] });
        },
    });
}
