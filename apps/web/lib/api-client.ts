// lib/api-client.ts
// Centralized API client per AI_RULES.md §Frontend.
// All API calls go through here — attaches Clerk session token automatically.
// Components must NOT call fetch/axios directly.

import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Clerk token injector — called before each request from client components
// Usage: apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// The withAuth() wrapper below handles this cleanly.
export function createAuthClient(token: string) {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
}

// ── Typed API Response wrapper ────────────────────────────────────────────────

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
    const client = token ? createAuthClient(token) : apiClient;
    const res = await client.get<ApiResponse<T>>(path);
    if (!res.data.success || res.data.data === undefined) {
        throw new Error(res.data.error ?? 'Unknown error');
    }
    return res.data.data;
}

export async function apiPost<T>(path: string, body: unknown, token: string): Promise<T> {
    const client = createAuthClient(token);
    const res = await client.post<ApiResponse<T>>(path, body);
    if (!res.data.success || res.data.data === undefined) {
        throw new Error(res.data.error ?? 'Unknown error');
    }
    return res.data.data;
}

export async function apiPut<T>(path: string, body: unknown, token: string): Promise<T> {
    const client = createAuthClient(token);
    const res = await client.put<ApiResponse<T>>(path, body);
    if (!res.data.success || res.data.data === undefined) {
        throw new Error(res.data.error ?? 'Unknown error');
    }
    return res.data.data;
}

export async function apiDelete<T>(path: string, token: string): Promise<T> {
    const client = createAuthClient(token);
    const res = await client.delete<ApiResponse<T>>(path);
    if (!res.data.success || res.data.data === undefined) {
        throw new Error(res.data.error ?? 'Unknown error');
    }
    return res.data.data;
}
