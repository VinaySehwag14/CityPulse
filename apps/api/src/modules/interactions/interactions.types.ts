// interactions.types.ts
// Types for likes and attendance per DATABASE.md.

export interface Like {
    id: string;
    user_id: string;
    event_id: string;
    created_at: Date;
}

export type AttendStatus = 'going' | 'interested';

export interface Attendee {
    id: string;
    user_id: string;
    event_id: string;
    status: AttendStatus;
    created_at: Date;
}

export interface ToggleLikeResult {
    liked: boolean; // true = like added, false = like removed
    like_count: number;
}

export interface AttendResult {
    status: AttendStatus;
    attendee_count: number;
}
