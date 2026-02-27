// Types shared between frontend and API responses
// Mirror of apps/api types — kept manual to avoid cross-app imports

export interface User {
    id: string;
    clerk_id: string;
    email: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    created_at: string;
}

export interface Event {
    id: string;
    title: string;
    description: string | null;
    location_lat: number;
    location_lng: number;
    start_time: string;
    end_time: string;
    created_by: string;
    created_at: string;
}

export interface EventDetail extends Event {
    like_count: number;
    attendee_count: number;
    attendees: Array<{ user_id: string; status: string }>;
    comments: Array<{ id: string; user_id: string; content: string; created_at: string }>;
}

export interface FeedEvent extends Event {
    like_count: number;
    attendee_count: number;
    is_live: boolean;
    score: number;
}

export interface FeedResponse {
    events: FeedEvent[];
    total: number;
    page: number;
    limit: number;
}

export interface SearchResult extends Event {
    like_count: number;
    attendee_count: number;
    distance_km: number | null;
}
